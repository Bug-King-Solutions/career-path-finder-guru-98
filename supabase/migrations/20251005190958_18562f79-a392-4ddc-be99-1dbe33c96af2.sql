-- Make school_id nullable to support global admin questions
ALTER TABLE public.school_evaluation_questions 
ALTER COLUMN school_id DROP NOT NULL;

-- Update RLS policies to allow viewing global questions (where school_id is NULL)
DROP POLICY IF EXISTS "Students can view questions from their school" ON public.school_evaluation_questions;
DROP POLICY IF EXISTS "Admins can view all questions" ON public.school_evaluation_questions;
DROP POLICY IF EXISTS "Schools can manage their own questions" ON public.school_evaluation_questions;

CREATE POLICY "Students can view questions from their school or global questions"
  ON public.school_evaluation_questions FOR SELECT
  USING (
    school_id IS NULL OR
    EXISTS (
      SELECT 1 FROM students
      WHERE students.school_id = school_evaluation_questions.school_id
        AND students.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all questions"
  ON public.school_evaluation_questions FOR ALL
  USING (current_user_has_role('admin'::app_role));

CREATE POLICY "Schools can manage their own questions"
  ON public.school_evaluation_questions FOR ALL
  USING (
    school_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM schools
      WHERE schools.id = school_evaluation_questions.school_id
        AND schools.user_id = auth.uid()
    )
  );

-- Insert default psychology test questions (global questions with school_id = NULL)
INSERT INTO public.school_evaluation_questions (school_id, question_text, question_type, section, options) VALUES
  (NULL, 'I enjoy working with numbers and data analysis', 'multiple_choice', 'psychology', '["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]'::jsonb),
  (NULL, 'I prefer working alone rather than in groups', 'multiple_choice', 'psychology', '["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]'::jsonb),
  (NULL, 'I find creative problem-solving exciting', 'multiple_choice', 'psychology', '["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]'::jsonb),
  (NULL, 'I am comfortable with public speaking', 'multiple_choice', 'psychology', '["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]'::jsonb),
  (NULL, 'I enjoy helping others solve their problems', 'multiple_choice', 'psychology', '["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]'::jsonb),
  (NULL, 'I prefer structured tasks over open-ended projects', 'multiple_choice', 'psychology', '["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]'::jsonb),
  (NULL, 'I am detail-oriented in my work', 'multiple_choice', 'psychology', '["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]'::jsonb),
  (NULL, 'I enjoy learning about new technologies', 'multiple_choice', 'psychology', '["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]'::jsonb),
  (NULL, 'I am good at persuading others', 'multiple_choice', 'psychology', '["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]'::jsonb),
  (NULL, 'I prefer practical applications over theoretical concepts', 'multiple_choice', 'psychology', '["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]'::jsonb);