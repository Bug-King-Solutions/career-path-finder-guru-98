-- Add student_id field to students table for school students
ALTER TABLE public.students 
ADD COLUMN student_number text;