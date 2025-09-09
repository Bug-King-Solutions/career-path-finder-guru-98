-- First, drop the old enum and create a new one with all values
-- We need to handle existing data first
CREATE TYPE app_role_new AS ENUM ('admin', 'moderator', 'user', 'student', 'school');

-- Update the user_roles table to use the new enum
ALTER TABLE public.user_roles ALTER COLUMN role TYPE app_role_new USING role::text::app_role_new;

-- Drop the old enum and rename the new one
DROP TYPE app_role;
ALTER TYPE app_role_new RENAME TO app_role;

-- Create students table for tracking student data
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  personality_type TEXT,
  interests TEXT[],
  skills TEXT[],
  education_level TEXT,
  test_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create schools table
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_test_results table
CREATE TABLE public.student_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL,
  personality_type TEXT,
  scores JSONB,
  recommendations TEXT[],
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_progress table
CREATE TABLE public.student_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  course_field TEXT NOT NULL,
  universities_explored TEXT[],
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table for admin management
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  booking_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  booking_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students table
CREATE POLICY "Students can view their own data" 
ON public.students 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Students can update their own data" 
ON public.students 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own data" 
ON public.students 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Schools can view their students" 
ON public.students 
FOR SELECT 
USING (current_user_has_role('school'::app_role));

CREATE POLICY "Admins can view all students" 
ON public.students 
FOR SELECT 
USING (current_user_has_role('admin'::app_role));

-- RLS Policies for schools table
CREATE POLICY "Schools can view their own data" 
ON public.schools 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Schools can update their own data" 
ON public.schools 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Schools can insert their own data" 
ON public.schools 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all schools" 
ON public.schools 
FOR SELECT 
USING (current_user_has_role('admin'::app_role));

-- RLS Policies for student_test_results
CREATE POLICY "Students can view their own test results" 
ON public.student_test_results 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.students WHERE students.id = student_test_results.student_id AND students.user_id = auth.uid()));

CREATE POLICY "Students can insert their own test results" 
ON public.student_test_results 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.students WHERE students.id = student_test_results.student_id AND students.user_id = auth.uid()));

CREATE POLICY "Schools can view student test results" 
ON public.student_test_results 
FOR SELECT 
USING (current_user_has_role('school'::app_role));

CREATE POLICY "Admins can view all test results" 
ON public.student_test_results 
FOR SELECT 
USING (current_user_has_role('admin'::app_role));

-- RLS Policies for student_progress
CREATE POLICY "Students can view their own progress" 
ON public.student_progress 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.students WHERE students.id = student_progress.student_id AND students.user_id = auth.uid()));

CREATE POLICY "Students can update their own progress" 
ON public.student_progress 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.students WHERE students.id = student_progress.student_id AND students.user_id = auth.uid()));

CREATE POLICY "Schools can view student progress" 
ON public.student_progress 
FOR SELECT 
USING (current_user_has_role('school'::app_role));

CREATE POLICY "Admins can view all progress" 
ON public.student_progress 
FOR SELECT 
USING (current_user_has_role('admin'::app_role));

-- RLS Policies for bookings
CREATE POLICY "Students can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.students WHERE students.id = bookings.student_id AND students.user_id = auth.uid()));

CREATE POLICY "Schools can view their bookings" 
ON public.bookings 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.schools WHERE schools.id = bookings.school_id AND schools.user_id = auth.uid()));

CREATE POLICY "Admins can manage all bookings" 
ON public.bookings 
FOR ALL 
USING (current_user_has_role('admin'::app_role));

-- Add triggers for updated_at columns
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schools_updated_at
BEFORE UPDATE ON public.schools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at
BEFORE UPDATE ON public.student_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();