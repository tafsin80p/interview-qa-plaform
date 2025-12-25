import { useState } from 'react';
import { Question } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  onNext: () => void;
  isLast: boolean;
}

export const QuestionCard = ({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  isLast,
}: QuestionCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onNext();
      setIsAnimating(false);
    }, 200);
  };

  return (
    <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 no-select">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-mono font-bold text-sm">
            {questionNumber}
          </span>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground no-select">
            {question.question}
          </h2>
        </div>

        {question.code && (
          <div className="code-block mb-6 overflow-x-auto no-select">
            <pre className="text-sm text-foreground/90 no-select">
              <code className="no-select">{question.code}</code>
            </pre>
          </div>
        )}

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelectAnswer(index)}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center gap-3 group no-select ${
                selectedAnswer === index
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-secondary/30 text-foreground/80 hover:border-primary/50 hover:bg-secondary/50'
              }`}
            >
              <span className="flex-shrink-0">
                {selectedAnswer === index ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary/50" />
                )}
              </span>
              <span className="font-mono text-sm font-medium mr-2 text-muted-foreground no-select">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="flex-1 no-select">{option}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            size="lg"
            className="gap-2 glow-primary"
          >
            {isLast ? 'Submit Quiz' : 'Next Question'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
