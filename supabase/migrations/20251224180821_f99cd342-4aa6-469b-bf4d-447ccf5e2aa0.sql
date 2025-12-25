-- Add foreign key from quiz_results to profiles
ALTER TABLE public.quiz_results 
ADD CONSTRAINT quiz_results_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;