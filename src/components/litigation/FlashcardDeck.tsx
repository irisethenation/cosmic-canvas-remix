import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

export interface Flashcard {
  id: string;
  front: string;        // Term / question
  back: string;         // Definition / answer
  category?: string;
}

interface FlashcardDeckProps {
  cards: Flashcard[];
  title?: string;
  className?: string;
}

const FlashcardDeck = ({ cards, title = 'Key Terms', className = '' }: FlashcardDeckProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [unknownIds, setUnknownIds] = useState<Set<string>>(new Set());
  const [reviewMode, setReviewMode] = useState<'all' | 'unknown'>('all');

  const deckToUse = reviewMode === 'unknown'
    ? cards.filter(c => unknownIds.has(c.id))
    : cards;

  const currentCard = deckToUse[currentIndex];
  const progress = ((knownIds.size) / cards.length) * 100;

  const goNext = () => {
    setIsFlipped(false);
    setCurrentIndex(i => Math.min(i + 1, deckToUse.length - 1));
  };

  const goPrev = () => {
    setIsFlipped(false);
    setCurrentIndex(i => Math.max(i - 1, 0));
  };

  const markKnown = () => {
    if (!currentCard) return;
    setKnownIds(prev => new Set([...prev, currentCard.id]));
    setUnknownIds(prev => { const s = new Set(prev); s.delete(currentCard.id); return s; });
    goNext();
  };

  const markUnknown = () => {
    if (!currentCard) return;
    setUnknownIds(prev => new Set([...prev, currentCard.id]));
    setKnownIds(prev => { const s = new Set(prev); s.delete(currentCard.id); return s; });
    goNext();
  };

  const reset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownIds(new Set());
    setUnknownIds(new Set());
    setReviewMode('all');
  };

  if (!currentCard) {
    return (
      <div className={`rounded-xl border border-white/10 bg-white/5 p-8 text-center ${className}`}>
        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-white font-semibold text-lg mb-2">Deck Complete!</h3>
        <p className="text-white/60 text-sm mb-4">
          {knownIds.size} of {cards.length} terms mastered.
        </p>
        <div className="flex gap-2 justify-center">
          {unknownIds.size > 0 && (
            <Button
              onClick={() => { setCurrentIndex(0); setIsFlipped(false); setReviewMode('unknown'); }}
              variant="outline"
              className="border-amber-600 text-amber-400 hover:bg-amber-900/20"
            >
              Review {unknownIds.size} Missed
            </Button>
          )}
          <Button onClick={reset} variant="outline" className="border-white/20 text-white/70">
            <RotateCcw className="w-4 h-4 mr-2" /> Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-white/50">
          <span>{currentIndex + 1} / {deckToUse.length}</span>
          {reviewMode === 'unknown' && (
            <Badge className="bg-amber-800 text-amber-100 text-xs">Review Mode</Badge>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <Progress value={progress} className="flex-1 h-1.5" />
        <span className="text-xs text-white/40">{Math.round(progress)}%</span>
      </div>

      {/* Card */}
      <div
        className="relative cursor-pointer select-none"
        style={{ perspective: '1000px' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '180px',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-xl border border-white/15 bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex flex-col justify-between"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {currentCard.category && (
              <Badge className="self-start bg-violet-800 text-violet-100 text-xs mb-2">
                {currentCard.category}
              </Badge>
            )}
            <div className="flex-1 flex items-center justify-center">
              <p className="text-white font-semibold text-lg text-center leading-snug">
                {currentCard.front}
              </p>
            </div>
            <p className="text-white/30 text-xs text-center mt-2">Tap to reveal</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-xl border border-violet-700/40 bg-gradient-to-br from-violet-900/80 to-slate-900 p-6 flex flex-col justify-between"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="flex-1 flex items-center justify-center">
              <p className="text-white/90 text-sm text-center leading-relaxed">
                {currentCard.back}
              </p>
            </div>
            <p className="text-white/30 text-xs text-center mt-2">Tap to flip back</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <Button
          onClick={goPrev}
          disabled={currentIndex === 0}
          variant="ghost"
          size="sm"
          className="text-white/50 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {isFlipped && (
          <div className="flex gap-2 flex-1 justify-center">
            <Button
              onClick={markUnknown}
              size="sm"
              className="bg-red-900/40 hover:bg-red-900/70 text-red-300 border border-red-700/40 gap-1.5"
            >
              <XCircle className="w-4 h-4" /> Still Learning
            </Button>
            <Button
              onClick={markKnown}
              size="sm"
              className="bg-emerald-900/40 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-700/40 gap-1.5"
            >
              <CheckCircle className="w-4 h-4" /> Got It
            </Button>
          </div>
        )}

        {!isFlipped && (
          <Button
            onClick={() => setIsFlipped(true)}
            size="sm"
            className="flex-1 mx-4 bg-white/10 hover:bg-white/20 text-white"
          >
            Reveal Answer
          </Button>
        )}

        <Button
          onClick={goNext}
          disabled={currentIndex >= deckToUse.length - 1}
          variant="ghost"
          size="sm"
          className="text-white/50 hover:text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats bar */}
      <div className="flex gap-4 justify-center text-xs">
        <span className="text-emerald-400">✓ {knownIds.size} known</span>
        <span className="text-red-400">✗ {unknownIds.size} learning</span>
        <span className="text-white/30">{cards.length - knownIds.size - unknownIds.size} unseen</span>
      </div>
    </div>
  );
};

export default FlashcardDeck;
