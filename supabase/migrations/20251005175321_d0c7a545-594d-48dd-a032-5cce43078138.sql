-- Create website_content table for admin content management
CREATE TABLE IF NOT EXISTS public.website_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read website content
CREATE POLICY "Website content is viewable by everyone"
  ON public.website_content
  FOR SELECT
  USING (true);

-- Only admins can manage website content
CREATE POLICY "Admins can manage website content"
  ON public.website_content
  FOR ALL
  USING (current_user_has_role('admin'::app_role));

-- Insert default content sections
INSERT INTO public.website_content (section_name, title, description) VALUES
  ('hero', 'Transform Your Career Journey', 'Expert career guidance and psychology assessments to help you discover your true potential'),
  ('about', 'Meet Mr. Paul Olayiwola', 'Career guidance expert with years of experience helping students find their path'),
  ('services', 'Our Services', 'Comprehensive career guidance and assessment services'),
  ('products', 'Our Products', 'Digital tools and platforms for career exploration')
ON CONFLICT (section_name) DO NOTHING;

-- Add trigger for updated_at
CREATE TRIGGER update_website_content_updated_at
  BEFORE UPDATE ON public.website_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();