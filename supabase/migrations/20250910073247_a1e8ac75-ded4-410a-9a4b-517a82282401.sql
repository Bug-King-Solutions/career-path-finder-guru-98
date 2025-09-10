-- Create table for school custom evaluation questions
CREATE TABLE public.school_evaluation_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  options JSONB NULL, -- For multiple choice options
  section TEXT NOT NULL DEFAULT 'custom', -- Which section this belongs to
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for student answers to school custom questions
CREATE TABLE public.student_custom_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  question_id UUID NOT NULL REFERENCES public.school_evaluation_questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.school_evaluation_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_custom_answers ENABLE ROW LEVEL SECURITY;

-- Create policies for school_evaluation_questions
CREATE POLICY "Schools can manage their own questions" 
ON public.school_evaluation_questions 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.schools 
  WHERE schools.id = school_evaluation_questions.school_id 
  AND schools.user_id = auth.uid()
));

CREATE POLICY "Students can view questions from their school" 
ON public.school_evaluation_questions 
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.students 
  WHERE students.school_id = school_evaluation_questions.school_id 
  AND students.user_id = auth.uid()
));

CREATE POLICY "Admins can view all questions" 
ON public.school_evaluation_questions 
FOR SELECT
USING (current_user_has_role('admin'::app_role));

-- Create policies for student_custom_answers
CREATE POLICY "Students can insert their own answers" 
ON public.student_custom_answers 
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.students 
  WHERE students.id = student_custom_answers.student_id 
  AND students.user_id = auth.uid()
));

CREATE POLICY "Students can view their own answers" 
ON public.student_custom_answers 
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.students 
  WHERE students.id = student_custom_answers.student_id 
  AND students.user_id = auth.uid()
));

CREATE POLICY "Schools can view answers to their questions" 
ON public.student_custom_answers 
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.school_evaluation_questions seq
  JOIN public.schools s ON s.id = seq.school_id
  WHERE seq.id = student_custom_answers.question_id 
  AND s.user_id = auth.uid()
));

CREATE POLICY "Admins can view all answers" 
ON public.student_custom_answers 
FOR SELECT
USING (current_user_has_role('admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_school_evaluation_questions_updated_at
BEFORE UPDATE ON public.school_evaluation_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();