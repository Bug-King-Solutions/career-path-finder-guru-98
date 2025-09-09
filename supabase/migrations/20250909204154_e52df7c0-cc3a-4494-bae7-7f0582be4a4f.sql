-- Create a reference table for available schools that students can select from
-- This won't require user_id since it's just reference data
CREATE TABLE public.school_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name text NOT NULL,
  school_type text NOT NULL, -- 'secondary' or 'university'
  location text NOT NULL DEFAULT 'Plateau State',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.school_options ENABLE ROW LEVEL SECURITY;

-- Policy to allow everyone to read school options
CREATE POLICY "School options are viewable by everyone" 
ON public.school_options 
FOR SELECT 
USING (true);

-- Add school_id reference to students table
ALTER TABLE public.students 
ADD COLUMN school_id uuid REFERENCES public.school_options(id);

-- Insert the school options
INSERT INTO public.school_options (school_name, school_type) VALUES
-- Popular secondary schools in Plateau state
('Government Secondary School Bukuru', 'secondary'),
('Hillcrest School Jos', 'secondary'),
('Command Secondary School Jos', 'secondary'),
('Government Girls Secondary School Jos', 'secondary'),
('Federal Government College Jos', 'secondary'),
-- Universities in Plateau state
('University of Jos', 'university'),
('Plateau State University Bokkos', 'university');