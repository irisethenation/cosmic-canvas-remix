import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import GeometricBackground from '@/components/GeometricBackground';
import MorpheusAI from '@/components/morpheus/MorpheusAI';
import FlashcardDeck, { type Flashcard } from '@/components/litigation/FlashcardDeck';
import LitigationTimeline, { CASE_STUDY_001_TIMELINE } from '@/components/litigation/LitigationTimeline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Scale,
  BookOpen,
  Layers,
  Clock,
  ChevronRight,
  ArrowLeft,
  Gavel,
  Shield,
  FileText,
  Search,
  GraduationCap,
  Trophy,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Flashcard Data for Module 13
// ─────────────────────────────────────────────────────────────

const MODULE_13_FLASHCARDS: Flashcard[] = [
  { id: 'f1', category: 'Due Process', front: 'Procedural Due Process', back: 'The right to notice and a meaningful opportunity to be heard before a neutral decision-maker before the government deprives you of life, liberty, or property.' },
  { id: 'f2', category: 'Due Process', front: 'Substantive Due Process', back: 'The principle that the government may not deprive you of certain fundamental rights regardless of what procedures it uses.' },
  { id: 'f3', category: 'Due Process', front: 'Mathews v. Eldridge (1976)', back: 'Three-part balancing test for how much process is required: (1) private interest, (2) risk of erroneous deprivation, (3) government interest.' },
  { id: 'f4', category: 'Fourth Amendment', front: 'Reasonable Suspicion', back: 'More than a hunch but less than probable cause. Specific, articulable facts creating reasonable belief that criminal activity is afoot. Standard for traffic stops (Terry v. Ohio).' },
  { id: 'f5', category: 'Fourth Amendment', front: 'Probable Cause', back: 'Facts and circumstances sufficient to warrant a person of reasonable caution to believe an offence has been or is being committed. Required for arrest and most searches.' },
  { id: 'f6', category: 'Fourth Amendment', front: 'Exclusionary Rule', back: 'Evidence obtained in violation of the Fourth Amendment must be excluded from trial. Established for federal courts in Weeks v. US (1914); extended to states in Mapp v. Ohio (1961).' },
  { id: 'f7', category: 'Fourth Amendment', front: 'Fruit of the Poisonous Tree', back: 'Evidence derived from an illegal search or seizure is also inadmissible — it is "tainted" by the original violation. Wong Sun v. United States (1963).' },
  { id: 'f8', category: 'Fourth Amendment', front: 'Automobile Exception', back: 'Vehicles may be searched without a warrant when there is probable cause to believe they contain contraband or evidence of a crime (Carroll v. United States, 1925).' },
  { id: 'f9', category: 'Traffic Stop', front: 'When Does a Traffic Stop Begin?', back: 'A stop begins when a reasonable person would not feel free to leave — typically when the officer activates emergency lights. California v. Hodari D. (1991).' },
  { id: 'f10', category: 'Traffic Stop', front: 'Rodriguez v. United States (2015)', back: 'A traffic stop may not be extended beyond the time reasonably necessary to address the traffic violation without independent reasonable suspicion.' },
  { id: 'f11', category: 'Traffic Stop', front: 'Whren v. United States (1996)', back: 'A traffic stop is valid under the Fourth Amendment if there is an objective basis (a traffic violation actually occurred), regardless of the officer\'s subjective motivation.' },
  { id: 'f12', category: 'Evidence', front: 'Hearsay', back: 'An out-of-court statement offered to prove the truth of the matter asserted. Generally inadmissible under FRE 801, subject to numerous exceptions.' },
  { id: 'f13', category: 'Evidence', front: 'Best Evidence Rule', back: 'To prove the content of a writing, recording, or photograph, the original is required (FRE 1002), unless an exception applies.' },
  { id: 'f14', category: 'Evidence', front: 'Authentication (FRE 901)', back: 'Before evidence can be admitted, the proponent must produce evidence sufficient to support a finding that the item is what the proponent claims it is.' },
  { id: 'f15', category: 'Evidence', front: 'Judicial Notice (FRE 201)', back: 'The court may accept a fact as established without formal proof if it is generally known or accurately determined from reliable sources.' },
  { id: 'f16', category: 'Procedure', front: 'Burden of Proof (Infraction)', back: 'In most traffic infraction cases, the government must prove the violation by a preponderance of the evidence — more likely than not (51%).' },
  { id: 'f17', category: 'Procedure', front: 'Issue Preservation', back: 'An argument not raised at the trial court level cannot generally be raised for the first time on appeal. Preserved issues are raised, ruled on, and objected to on the record.' },
  { id: 'f18', category: 'Miranda', front: 'Miranda v. Arizona (1966)', back: 'Before custodial interrogation, officers must warn: (1) right to remain silent, (2) statements can be used against you, (3) right to attorney, (4) appointed counsel if you cannot afford one.' },
  { id: 'f19', category: 'Miranda', front: 'Is a Traffic Stop Custodial?', back: 'Generally no. Berkemer v. McCarty (1984): A routine traffic stop is not custody for Miranda purposes because it is brief and non-coercive. Miranda warnings are not typically required.' },
  { id: 'f20', category: 'Strategy', front: 'Brady Material', back: 'Evidence that is favourable to the accused and material to guilt or punishment. Prosecution must disclose it even without a specific request. Brady v. Maryland (1963).' },
];

// ─────────────────────────────────────────────────────────────
// Module Structure (used for navigation)
// ─────────────────────────────────────────────────────────────

const ACADEMY_MODULES = [
  {
    number: '13',
    title: 'Litigation Academy I',
    subtitle: 'Foundations of Litigation',
    slug: 'litigation-academy-1',
    parts: [
      { number: '1', title: 'Litigation Foundations', lessons: 6 },
      { number: '2', title: 'The Traffic Stop', lessons: 5 },
      { number: '3', title: 'Citation Strategy', lessons: 4 },
    ],
    colour: 'from-violet-900/40 to-slate-900 border-violet-700/50',
    icon: Scale,
  },
  {
    number: '14',
    title: 'Litigation Academy II',
    subtitle: 'Motion Practice, Discovery & Evidence',
    slug: 'litigation-academy-2',
    parts: [
      { number: '4', title: 'Motion Practice', lessons: 5 },
      { number: '5', title: 'Discovery', lessons: 3 },
      { number: '6', title: 'Evidence', lessons: 2 },
    ],
    colour: 'from-emerald-900/40 to-slate-900 border-emerald-700/50',
    icon: FileText,
  },
  {
    number: '15',
    title: 'Litigation Academy III',
    subtitle: 'Case Law, Appeals & Master Simulation',
    slug: 'litigation-academy-3',
    parts: [
      { number: '7', title: 'Case Law Laboratory', lessons: 3 },
      { number: '8', title: 'Role Play', lessons: 2 },
      { number: '9', title: 'Appeals', lessons: 2 },
      { number: '10', title: 'Master Simulation', lessons: 3 },
    ],
    colour: 'from-amber-900/40 to-slate-900 border-amber-700/50',
    icon: Gavel,
  },
];

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

const LitigationAcademy = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative">
      <GeometricBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">

        {/* ── Back link ─────────────────────────────────── */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* ── Hero ──────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-800/50 flex items-center justify-center border border-violet-700/50">
              <Scale className="w-5 h-5 text-violet-300" />
            </div>
            <div>
              <Badge className="bg-violet-900 text-violet-300 text-xs mb-1">Modules 13 – 15</Badge>
              <h1 className="text-2xl font-bold text-white">Litigation Academy</h1>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-white/80 mb-2">
            Case Study 001: Defending a Traffic Citation from First Notice to Final Appeal
          </h2>

          <p className="text-white/50 max-w-2xl leading-relaxed">
            This is not a document library. This is an advocacy school. You learn to think like an
            elite litigator — using a traffic citation as your first complete laboratory. Every
            principle here transfers directly to consumer law, administrative proceedings, family
            court, and commercial litigation.
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            {[
              { icon: BookOpen, text: '10 Parts' },
              { icon: Layers, text: '35+ Lessons' },
              { icon: Clock, text: '60+ Hours' },
              { icon: GraduationCap, text: '150,000+ Words' },
              { icon: Trophy, text: 'Badge: Elite Advocate' },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white/60"
              >
                <Icon className="w-3 h-3" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white/5 border border-white/10 mb-6 w-full grid grid-cols-4">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/15 text-white/70">
              Overview
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-white/15 text-white/70">
              Case Timeline
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="data-[state=active]:bg-white/15 text-white/70">
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="morpheus" className="data-[state=active]:bg-white/15 text-white/70">
              Morpheus AI
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="space-y-4">
              {ACADEMY_MODULES.map(mod => {
                const Icon = mod.icon;
                return (
                  <Card
                    key={mod.number}
                    className={`bg-gradient-to-br border ${mod.colour} overflow-hidden`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-white/70" />
                          <div>
                            <Badge className="bg-white/10 text-white/60 text-xs mb-1">
                              Module {mod.number}
                            </Badge>
                            <CardTitle className="text-white text-base">{mod.title}</CardTitle>
                            <p className="text-white/50 text-sm">{mod.subtitle}</p>
                          </div>
                        </div>
                        <Link to={`/courses/${mod.slug}`}>
                          <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                            Start <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {mod.parts.map(part => (
                          <div
                            key={part.number}
                            className="bg-black/20 rounded-lg p-3 border border-white/5"
                          >
                            <p className="text-xs text-white/40 mb-0.5">Part {part.number}</p>
                            <p className="text-sm text-white font-medium">{part.title}</p>
                            <p className="text-xs text-white/30 mt-0.5">{part.lessons} lessons</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Disclaimer */}
              <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-4 mt-6">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-300 mb-1">Educational Purposes Only</p>
                    <p className="text-xs text-amber-200/60 leading-relaxed">
                      iRise Litigation Academy teaches critical thinking, legal analysis, and advocacy skills.
                      It does not provide legal advice. Nothing in these materials constitutes legal advice for
                      any specific situation. Always consult a qualified solicitor or attorney before taking
                      legal action. Verify every case citation against the original opinion before relying on it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline">
            <LitigationTimeline
              events={CASE_STUDY_001_TIMELINE}
              title="Case Study 001 — People v. [Your Name]: Complete Timeline"
            />
          </TabsContent>

          {/* Flashcards */}
          <TabsContent value="flashcards">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="mb-4">
                <h3 className="text-white font-semibold mb-1">Key Terms — Modules 13–15</h3>
                <p className="text-white/40 text-sm">
                  20 essential terms from the Litigation Academy. Test yourself on each, then use spaced
                  repetition by reviewing terms you missed.
                </p>
              </div>
              <FlashcardDeck
                cards={MODULE_13_FLASHCARDS}
                title="Litigation Academy Key Terms"
              />
            </div>
          </TabsContent>

          {/* Morpheus AI */}
          <TabsContent value="morpheus">
            <div className="space-y-4">
              <div className="bg-violet-900/20 border border-violet-700/40 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <Search className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-violet-300 mb-1">About Morpheus</p>
                    <p className="text-xs text-violet-200/60 leading-relaxed">
                      Morpheus is your AI litigation tutor. Choose your mode: Socratic Tutor asks questions
                      instead of giving answers. Litigation Coach critiques your arguments. Judge Mode puts
                      you before the bench. Prosecutor Mode cross-examines you. Jury Mode explains what
                      convinced the fact-finder.
                    </p>
                  </div>
                </div>
              </div>

              <MorpheusAI
                defaultMode="socratic"
                lessonContext={`
You are assisting a student of iRise Litigation Academy who is studying:
- Case Study 001: Defending a Traffic Citation from First Notice to Final Appeal
- Modules 13, 14, and 15 covering litigation foundations, motion practice, discovery, evidence, case law, appeals, and simulation
- Key cases: Terry v. Ohio, Mapp v. Ohio, Miranda v. Arizona, Whren v. United States, Rodriguez v. United States
- Key concepts: Fourth Amendment, reasonable suspicion, probable cause, exclusionary rule, LIDAR calibration, discovery obligations, issue preservation
`}
                className="min-h-[500px]"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LitigationAcademy;
