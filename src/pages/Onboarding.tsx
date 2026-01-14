import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgreements } from '@/hooks/useAgreements';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import LavaLampBackground from '@/components/LavaLampBackground';
import { Shield, FileText, Users, ChevronRight, Check } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { pendingAgreements, loading, acceptAllAgreements } = useAgreements();
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getIcon = (key: string) => {
    switch (key) {
      case 'terms_of_service':
        return <FileText className="h-6 w-6" />;
      case 'privacy_policy':
        return <Shield className="h-6 w-6" />;
      case 'code_of_conduct':
        return <Users className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const handleToggle = (id: string) => {
    setAcceptedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    if (currentIndex < pendingAgreements.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (acceptedIds.size !== pendingAgreements.length) {
      toast({
        title: "Please accept all agreements",
        description: "You must accept all agreements to continue.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    const { error } = await acceptAllAgreements();
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to save your agreements. Please try again.",
        variant: "destructive"
      });
      setSubmitting(false);
      return;
    }

    toast({
      title: "Welcome to iRise Academy!",
      description: "Your agreements have been saved. Enjoy your learning journey!"
    });
    
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LavaLampBackground />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (pendingAgreements.length === 0) {
    navigate('/dashboard');
    return null;
  }

  const currentAgreement = pendingAgreements[currentIndex];
  const allAccepted = acceptedIds.size === pendingAgreements.length;

  return (
    <div className="min-h-screen bg-background relative">
      <LavaLampBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/5b04634a-8b34-4b3f-b5d4-9ca573b411f1.png" 
            alt="iRise Academy" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to iRise Academy
          </h1>
          <p className="text-muted-foreground">
            Before you begin your journey, please review and accept our agreements
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {pendingAgreements.map((agreement, index) => (
            <button
              key={agreement.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary text-primary-foreground'
                  : acceptedIds.has(agreement.id)
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {acceptedIds.has(agreement.id) ? (
                <Check className="h-4 w-4" />
              ) : (
                getIcon(agreement.key)
              )}
              <span className="hidden sm:inline text-sm">{agreement.title}</span>
              <span className="sm:hidden text-sm">{index + 1}</span>
            </button>
          ))}
        </div>

        {/* Agreement Card */}
        <Card className="bg-card/80 backdrop-blur-md border-border mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                {getIcon(currentAgreement.key)}
              </div>
              <div>
                <CardTitle className="text-xl">{currentAgreement.title}</CardTitle>
                <CardDescription>Version {currentAgreement.version}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] rounded-md border border-border p-4 bg-background/50">
              <div className="prose prose-sm prose-invert max-w-none">
                {currentAgreement.content_markdown.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={i} className="text-xl font-bold text-foreground mt-4 first:mt-0">{line.slice(2)}</h1>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-lg font-semibold text-foreground mt-4">{line.slice(3)}</h2>;
                  } else if (line.trim()) {
                    return <p key={i} className="text-muted-foreground mt-2">{line}</p>;
                  }
                  return null;
                })}
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            <div className="flex items-center space-x-3">
              <Checkbox
                id={`accept-${currentAgreement.id}`}
                checked={acceptedIds.has(currentAgreement.id)}
                onCheckedChange={() => handleToggle(currentAgreement.id)}
              />
              <label
                htmlFor={`accept-${currentAgreement.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                I have read and agree to the {currentAgreement.title}
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="border-border"
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} of {pendingAgreements.length}
          </span>

          {currentIndex < pendingAgreements.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!acceptedIds.has(currentAgreement.id)}
              className="bg-primary hover:bg-primary/90"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allAccepted || submitting}
              className="bg-primary hover:bg-primary/90"
            >
              {submitting ? 'Saving...' : 'Continue to Dashboard'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
