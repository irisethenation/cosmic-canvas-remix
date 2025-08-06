-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tier_required INTEGER NOT NULL DEFAULT 0,
  description_md TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  prerequisite UUID REFERENCES public.courses(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create modules table
CREATE TABLE public.modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  content_md TEXT,
  is_free BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (courses are publicly viewable)
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Anyone can view modules of published courses" ON public.modules FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.courses WHERE courses.id = modules.course_id AND courses.is_published = true)
);
CREATE POLICY "Anyone can view lessons of published courses" ON public.lessons FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.modules 
    JOIN public.courses ON courses.id = modules.course_id 
    WHERE modules.id = lessons.module_id AND courses.is_published = true
  )
);

-- Add triggers for timestamp updates
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_courses_slug ON public.courses(slug);
CREATE INDEX idx_courses_tier ON public.courses(tier_required);
CREATE INDEX idx_modules_course_id ON public.modules(course_id);
CREATE INDEX idx_modules_position ON public.modules(course_id, position);
CREATE INDEX idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX idx_lessons_position ON public.lessons(module_id, position);

-- Now populate with the course data
WITH c AS (
  INSERT INTO courses (title, slug, tier_required, description_md, is_published) VALUES
  ('Module 0: Foundations','module-0',0,'**Free preview** — Agnotology, sovereignty, and mind reprogramming.',true),
  ('Module 1: Introductory','module-1',1,'Orientation, roadmap, and PERSONHOOD deconstruction.',true),
  ('Module 2: Steps & Documents','module-2',1,'Affidavits, notices, trust pathways.',true),
  ('Module 3: Language','module-3',1,'Legalese, 4-corner rule, word power.',true),
  ('Module 4: Finance','module-4',2,'Debt fraud, trusts, currency control.',true),
  ('Module 5: Religion & Law','module-5',2,'Canon Law, Papal Bulls, spiritual sovereignty.',true),
  ('Module 6: Consumer Law','module-6',2,'Rights, rebuttals, FDCPA, CRA.',true),
  ('Module 7: Family Law','module-7',2,'Courts, birth certs, child welfare.',true),
  ('Module 8: Councils','module-8',3,'Council-tax rebuttal, jurisdiction limits.',true),
  ('Module 9: Utilities','module-9',3,'Contracts, smart meters, billing fraud.',true),
  ('Module 10: Mortgages','module-10',3,'Securitisation, foreclosure challenge.',true),
  ('Module 11: UCC','module-11',3,'Secured party, liens, enforcement.',true),
  ('Module 12: Contract Law','module-12',3,'Offer, acceptance, termination.',true),
  ('Credit Correction','credit-correction',4,'UK/US credit-file repair tactics.',true),
  ('Mortgage Challenge','mortgage-challenge',4,'Step-by-step foreclosure defence.',true),
  ('DSAR & Fines','dsar-fines',4,'Data requests, PNC, statutory fines.',true),
  ('Status Correction','status-correction',4,'Full identity realignment — requires Modules 3,11,12.',true)
  RETURNING id, slug
),
-- Update prerequisite for status-correction
prereq_update AS (
  UPDATE courses SET prerequisite = (
    SELECT id FROM c WHERE slug='module-3'
  ) WHERE slug='status-correction'
  RETURNING id
),
-- Insert modules & lessons for Module 0
m0 AS (
  INSERT INTO modules (course_id, title, position) 
  SELECT id, 'Reprogramming Foundations', 1 FROM c WHERE slug='module-0'
  RETURNING id, course_id
)
INSERT INTO lessons (module_id, title, position, content_md, is_free) VALUES
  ((SELECT id FROM m0), 'What is Agnotology?', 1, 'Content TBD', true),
  ((SELECT id FROM m0), 'Reprogramming the Mind', 2, 'Content TBD', true),
  ((SELECT id FROM m0), 'Sovereignty of Self', 3, 'Content TBD', true);