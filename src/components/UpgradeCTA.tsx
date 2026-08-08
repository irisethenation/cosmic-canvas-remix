import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Lock, ArrowRight, CheckCircle } from 'lucide-react';

interface UpgradeCTAProps {
  courseTitle?: string;
  courseSlug?: string;
  isAuthenticated?: boolean;
}

const benefits = [
  'Every module unlocked, start to finish',
  'Downloadable materials and templates',
  'Guided support from the mentorship team',
];

const UpgradeCTA = ({ courseTitle, courseSlug, isAuthenticated }: UpgradeCTAProps) => {
  return (
    <Card className="border-primary/40 bg-primary/5 shadow-soft">
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-center gap-2 text-primary mb-3">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wide">
            Free preview complete
          </span>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          Ready to continue{courseTitle ? `: ${courseTitle}` : ''}?
        </h2>
        <p className="text-muted-foreground mb-5 max-w-xl">
          You have reached the end of this free preview. Purchase the full course to
          unlock the remaining lessons and keep building momentum.
        </p>

        <ul className="space-y-2 mb-6">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-sm text-foreground">
              <Sparkles className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="bg-gradient-primary hover:opacity-90">
            <Link to="/programs">
              <Lock className="h-4 w-4 mr-2" />
              Purchase the full course
            </Link>
          </Button>
          {courseSlug && (
            <Button asChild variant="outline" className="border-border">
              <Link to={`/courses/${courseSlug}`}>
                See what's included
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>

        {!isAuthenticated && (
          <p className="text-xs text-muted-foreground mt-4">
            Already enrolled? Sign in to pick up where you left off.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UpgradeCTA;
