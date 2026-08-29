import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, AlertCircle, Clock } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  stage: string;
  title: string;
  description: string;
  status: 'complete' | 'active' | 'pending' | 'critical';
  deadline?: string;
  module?: string;           // e.g. "Module 13, Part 2"
  legalNote?: string;        // Key legal issue
}

interface LitigationTimelineProps {
  events: TimelineEvent[];
  title?: string;
  className?: string;
}

const STATUS_CONFIG = {
  complete:  { icon: CheckCircle,  colour: 'text-emerald-400', line: 'bg-emerald-700', badge: 'bg-emerald-900 text-emerald-300' },
  active:    { icon: Circle,       colour: 'text-violet-400',  line: 'bg-violet-700',  badge: 'bg-violet-900 text-violet-300' },
  pending:   { icon: Circle,       colour: 'text-white/30',    line: 'bg-white/10',    badge: 'bg-white/10 text-white/40' },
  critical:  { icon: AlertCircle,  colour: 'text-red-400',     line: 'bg-red-700',     badge: 'bg-red-900 text-red-300' },
};

const LitigationTimeline = ({
  events,
  title = 'Case Timeline',
  className = '',
}: LitigationTimelineProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className={`rounded-xl border border-white/10 bg-white/5 p-5 ${className}`}>
      <h3 className="text-white font-semibold mb-5">{title}</h3>

      <div className="relative">
        {/* Vertical spine */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />

        <div className="flex flex-col gap-1">
          {events.map((event, idx) => {
            const cfg = STATUS_CONFIG[event.status];
            const Icon = cfg.icon;
            const isExpanded = expanded === event.id;
            const isLast = idx === events.length - 1;

            return (
              <div key={event.id} className="relative pl-10">
                {/* Icon on the spine */}
                <div className={`absolute left-0 top-1 w-8 h-8 flex items-center justify-center z-10`}>
                  <Icon className={`w-5 h-5 ${cfg.colour}`} />
                </div>

                {/* Connector line to next item */}
                {!isLast && (
                  <div className={`absolute left-[15px] top-8 w-0.5 h-6 ${
                    events[idx + 1]?.status === 'complete' ? 'bg-emerald-700' : 'bg-white/10'
                  }`} />
                )}

                {/* Card */}
                <button
                  className={`w-full text-left p-3 rounded-lg transition-all mb-3 border ${
                    isExpanded
                      ? 'bg-white/10 border-white/20'
                      : 'bg-white/3 border-transparent hover:bg-white/7 hover:border-white/10'
                  }`}
                  onClick={() => setExpanded(isExpanded ? null : event.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-xs text-white/40 font-mono">{event.stage}</span>
                        {event.deadline && (
                          <span className="flex items-center gap-1 text-[10px] text-amber-400">
                            <Clock className="w-3 h-3" /> {event.deadline}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm font-medium ${
                        event.status === 'pending' ? 'text-white/50' : 'text-white'
                      }`}>
                        {event.title}
                      </p>
                    </div>
                    <Badge className={`text-[10px] flex-shrink-0 ${cfg.badge}`}>
                      {event.status}
                    </Badge>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                      <p className="text-sm text-white/70 leading-relaxed">{event.description}</p>
                      {event.legalNote && (
                        <div className="bg-violet-900/30 border border-violet-700/40 rounded-lg p-2.5">
                          <p className="text-xs text-violet-300 font-medium mb-0.5">⚖️ Legal Issue</p>
                          <p className="text-xs text-white/70">{event.legalNote}</p>
                        </div>
                      )}
                      {event.module && (
                        <p className="text-xs text-white/30">
                          📚 See: {event.module}
                        </p>
                      )}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LitigationTimeline;

// ─── Default Case Study 001 Timeline ───────────────────────

export const CASE_STUDY_001_TIMELINE: TimelineEvent[] = [
  {
    id: 'citation',
    stage: '00',
    title: 'Citation Received',
    description: 'Officer Martinez issues citation for alleged 78 mph in a 65 mph zone using Kustom Signals Pro Laser III LIDAR. You have a response deadline.',
    status: 'complete',
    deadline: 'Respond within 20 days',
    module: 'Module 13, Part 3',
    legalNote: 'Notice requirement: Does the citation identify the statute, date, time, and location with sufficient specificity?',
  },
  {
    id: 'evidence-preservation',
    stage: '01',
    title: 'Evidence Preserved',
    description: 'Dashcam footage downloaded and backed up. Scene photographs taken. Litigation hold notice sent by certified mail to City Police Department.',
    status: 'complete',
    module: 'Module 14, Part 5',
    legalNote: 'Spoliation doctrine: A party who destroys evidence after receiving a preservation notice may face adverse inference sanctions.',
  },
  {
    id: 'not-guilty-plea',
    stage: '02',
    title: 'Not-Guilty Plea Entered',
    description: 'Written not-guilty plea submitted. Trial date assigned: 18 December 2024.',
    status: 'complete',
    module: 'Module 13, Part 3',
  },
  {
    id: 'discovery',
    stage: '03',
    title: 'Discovery Requested',
    description: 'Comprehensive discovery request sent covering officer records, LIDAR calibration, BWC footage, dashcam, and CAD records.',
    status: 'complete',
    deadline: 'Production due: within 15 days',
    module: 'Module 14, Part 5',
    legalNote: 'Brady v. Maryland (1963): Prosecution must disclose exculpatory evidence. Giglio v. United States (1972): Officer credibility information must also be disclosed.',
  },
  {
    id: 'discovery-analysis',
    stage: '04',
    title: 'Discovery Analysis',
    description: 'BWC footage received and reviewed. Calibration records show device calibrated 33 days before citation — within the 60-day window. Dashcam footage shows 67-68 mph.',
    status: 'complete',
    module: 'Module 14, Part 5',
    legalNote: 'Evidence evaluation: LIDAR calibration within specification. Primary challenge shifts to technique and dashcam credibility contest.',
  },
  {
    id: 'motions',
    stage: '05',
    title: 'Pre-Trial Motions',
    description: 'Motion to Compel Discovery filed (CAD records and officer certification not yet produced). Motion ruled on by court.',
    status: 'active',
    deadline: 'File 14 days before trial',
    module: 'Module 14, Part 4',
    legalNote: 'Motion to Compel: Court may order production or exclude evidence if not timely produced.',
  },
  {
    id: 'negotiation',
    stage: '06',
    title: 'Negotiation Window',
    description: 'Prosecution may offer reduced charge. Evaluate against trial prospects.',
    status: 'pending',
    module: 'Module 13, Part 3',
    legalNote: 'Strategic decision: A non-moving violation offer eliminates points and insurance impact. Weigh against probability of trial success.',
  },
  {
    id: 'trial',
    stage: '07',
    title: 'Trial',
    description: 'Traffic court hearing. Cross-examination of Officer Martinez. Presentation of dashcam evidence. Closing argument.',
    status: 'pending',
    deadline: '18 December 2024',
    module: 'Module 15, Part 10',
    legalNote: 'Burden of proof: Prosecution must prove violation by preponderance of evidence. Cross-examination focuses on LIDAR technique and lack of independent corroboration.',
  },
  {
    id: 'verdict',
    stage: '08',
    title: 'Verdict',
    description: 'Court issues verdict: Guilty or Not Guilty.',
    status: 'pending',
    module: 'Module 15, Part 10',
  },
  {
    id: 'appeal',
    stage: '09',
    title: 'Appeal (if Guilty)',
    description: 'Notice of appeal filed. Superior court de novo review. Brief submitted on preserved issues.',
    status: 'pending',
    deadline: '30 days from judgment',
    module: 'Module 15, Part 9',
    legalNote: 'Issue preservation: Only issues raised at trial are available on appeal. Plain error review applies to forfeited issues.',
  },
];
