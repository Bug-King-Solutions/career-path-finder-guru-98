-- Drop existing website_content if needed and recreate with better structure
DROP TABLE IF EXISTS website_content CASCADE;

-- Create services table
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text,
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  image_url text,
  features jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'active',
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create site_settings table for hero, about, contact, footer
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL UNIQUE,
  title text,
  subtitle text,
  description text,
  image_url text,
  content jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services
CREATE POLICY "Services viewable by everyone"
  ON public.services FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  USING (current_user_has_role('admin'::app_role));

-- RLS Policies for products
CREATE POLICY "Products viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (current_user_has_role('admin'::app_role));

-- RLS Policies for site_settings
CREATE POLICY "Site settings viewable by everyone"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  USING (current_user_has_role('admin'::app_role));

-- Insert default data
INSERT INTO site_settings (section, title, subtitle, description, content) VALUES
  ('hero', 'Transform Your Career Journey', 'Expert Career Guidance', 'Discover your path with personalized assessments and professional guidance', '{"buttonText": "Get Started", "buttonLink": "/career-guru"}'),
  ('about', 'Meet Mr. Paul Olayiwola', 'Career Development Expert', 'With over 15 years of experience in career counseling and psychology, I help individuals discover their true potential.', '{"expertise": ["Career Counseling", "Psychology Assessments", "Leadership Development"]}'),
  ('contact', 'Get In Touch', 'Contact Us', 'We are here to help you on your career journey', '{"email": "info@careerguidance.com", "phone": "+234 XXX XXX XXXX", "address": "Plateau State, Nigeria"}'),
  ('footer', 'Career Guidance Platform', null, 'Empowering careers through expert guidance', '{"socialLinks": {}}');

INSERT INTO services (title, description, icon, order_position) VALUES
  ('Career Assessment', 'Comprehensive personality and skills evaluation to identify your strengths', 'Target', 1),
  ('Psychology Testing', 'Professional psychological assessments for career planning', 'Brain', 2),
  ('University Matching', 'Find the perfect university based on your profile and goals', 'GraduationCap', 3),
  ('One-on-One Consultation', 'Personalized career guidance sessions', 'Users', 4);

INSERT INTO products (title, subtitle, description, status, features, order_position) VALUES
  ('CareerGuru Web Platform', 'Comprehensive Career Guidance System', 'Access our full suite of career assessment tools, personality tests, and university recommendations right from your browser.', 'active', '["Interactive Assessments", "AI-Powered Recommendations", "Progress Tracking", "Expert Reports"]', 1),
  ('CareerGuru Mobile App', 'Career Guidance On The Go', 'Take your career journey anywhere with our upcoming mobile app. Complete assessments, track progress, and receive guidance anytime.', 'coming_soon', '["Mobile Assessments", "Push Notifications", "Offline Mode", "Instant Results"]', 2);

-- Triggers for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();