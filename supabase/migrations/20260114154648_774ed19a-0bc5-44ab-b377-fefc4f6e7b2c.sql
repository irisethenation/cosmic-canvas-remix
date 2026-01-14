-- Add admin CRUD policies for courses, modules, lessons

-- Courses: Admin can manage
CREATE POLICY "Admins can insert courses"
ON public.courses FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update courses"
ON public.courses FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete courses"
ON public.courses FOR DELETE
USING (is_admin(auth.uid()));

-- Modules: Admin can manage
CREATE POLICY "Admins can insert modules"
ON public.modules FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update modules"
ON public.modules FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete modules"
ON public.modules FOR DELETE
USING (is_admin(auth.uid()));

-- Lessons: Admin can manage
CREATE POLICY "Admins can insert lessons"
ON public.lessons FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update lessons"
ON public.lessons FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete lessons"
ON public.lessons FOR DELETE
USING (is_admin(auth.uid()));

-- Allow admins to view all courses/modules/lessons (including unpublished)
CREATE POLICY "Admins can view all courses"
ON public.courses FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all modules"
ON public.modules FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all lessons"
ON public.lessons FOR SELECT
USING (is_admin(auth.uid()));

-- Allow admins to view all user profiles
CREATE POLICY "Admins can view all profiles"
ON public.user_profiles FOR SELECT
USING (is_admin(auth.uid()));

-- Allow admins to update user profiles (for tier management)
CREATE POLICY "Admins can update user profiles"
ON public.user_profiles FOR UPDATE
USING (is_admin(auth.uid()));