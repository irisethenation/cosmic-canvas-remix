-- Public curriculum metadata (titles, types, durations only — no lesson content).
-- Lets the course page show locked lessons to prospective buyers while the
-- lessons table's RLS keeps actual content gated.
create or replace view public.course_lesson_curriculum as
select
  l.id,
  m.course_id,
  l.module_id,
  l.title,
  l.content_type,
  l.duration_seconds,
  l.is_free,
  l.order_index,
  l.is_published
from public.lessons l
join public.modules m on m.id = l.module_id;

grant select on public.course_lesson_curriculum to anon, authenticated;
grant all on public.course_lesson_curriculum to service_role;