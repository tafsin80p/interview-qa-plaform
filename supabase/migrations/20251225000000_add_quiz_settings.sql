-- Create quiz_settings table
CREATE TABLE IF NOT EXISTS public.quiz_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default quiz duration (20 minutes)
INSERT INTO public.quiz_settings (setting_key, setting_value) 
VALUES ('quiz_duration_minutes', '20')
ON CONFLICT (setting_key) DO NOTHING;

-- Enable RLS
ALTER TABLE public.quiz_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can view and manage settings
CREATE POLICY "Admins can view settings" ON public.quiz_settings
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage settings" ON public.quiz_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updating timestamp
CREATE TRIGGER update_quiz_settings_updated_at
  BEFORE UPDATE ON public.quiz_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

