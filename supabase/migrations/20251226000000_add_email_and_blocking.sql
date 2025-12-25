-- Add email verification and blocking fields to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS blocked_reason TEXT,
ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS violation_count INTEGER DEFAULT 0;

-- Create blocked_users table for tracking violations
CREATE TABLE IF NOT EXISTS public.blocked_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  blocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  blocked_by UUID REFERENCES auth.users(id),
  reason TEXT,
  violation_type TEXT,
  unblocked_at TIMESTAMP WITH TIME ZONE,
  unblocked_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on blocked_users
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

-- Admins can view and manage blocked users
CREATE POLICY "Admins can view blocked users" ON public.blocked_users
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage blocked users" ON public.blocked_users
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Users can view their own blocking status
CREATE POLICY "Users can view own blocking status" ON public.blocked_users
  FOR SELECT USING (auth.uid() = user_id);

