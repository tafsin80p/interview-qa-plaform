import { Question } from '@/data/questions';
import { QuizType, DifficultyLevel } from '@/components/LandingPage';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, XCircle, RotateCcw, Trophy, Target, BookOpen, Puzzle, Palette, GraduationCap, Zap, Flame, Shield } from 'lucide-react';

interface ResultsPageProps {
  questions: Question[];
  answers: (number | null)[];
  onRestart: () => void;
  quizType: QuizType;
  difficulty: DifficultyLevel;
}

export const ResultsPage = ({ questions, answers, onRestart, quizType, difficulty }: ResultsPageProps) => {
  const { isAdmin } = useAuth();
  const correctAnswers = questions.filter(
    (q, i) => answers[i] === q.correctAnswer
  ).length;
  const percentage = Math.round((correctAnswers / questions.length) * 100);

  // Hide results from non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Quiz Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for completing the quiz. Your results have been recorded and will be reviewed by the administrator.
            </p>
            <Button onClick={onRestart} size="lg" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getGrade = () => {
    if (percentage >= 90) return { grade: 'A+', message: 'Outstanding! You\'re a WordPress expert!', color: 'text-success' };
    if (percentage >= 80) return { grade: 'A', message: 'Excellent work! Great understanding of WordPress.', color: 'text-success' };
    if (percentage >= 70) return { grade: 'B', message: 'Good job! Solid WordPress knowledge.', color: 'text-primary' };
    if (percentage >= 60) return { grade: 'C', message: 'Fair performance. Keep learning!', color: 'text-warning' };
    return { grade: 'D', message: 'Needs improvement. Review the concepts.', color: 'text-destructive' };
  };

  const getDifficultyIcon = () => {
    switch (difficulty) {
      case 'beginner': return GraduationCap;
      case 'intermediate': return Zap;
      case 'advanced': return Flame;
    }
  };

  const { grade, message, color } = getGrade();
  const QuizIcon = quizType === 'plugin' ? Puzzle : Palette;
  const DifficultyIcon = getDifficultyIcon();
  const quizTitle = quizType === 'plugin' ? 'Plugin Developer' : 'Theme Developer';

  return (
    <div className="min-h-screen bg-background py-8 px-4 no-select">
      <div className="max-w-3xl mx-auto">
        {/* Header Results */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-8 text-center no-select">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <QuizIcon className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{quizTitle} Quiz</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <DifficultyIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium px-2 py-0.5 bg-secondary rounded capitalize">
              {difficulty}
            </span>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className={`w-32 h-32 rounded-full border-4 ${percentage >= 60 ? 'border-success' : 'border-destructive'} flex items-center justify-center`}>
                <Trophy className={`w-16 h-16 ${percentage >= 60 ? 'text-success' : 'text-destructive'}`} />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Completed!</h1>
          <p className="text-muted-foreground mb-6">{message}</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-secondary/50 rounded-xl p-4">
              <Target className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold font-mono text-foreground">{percentage}%</p>
              <p className="text-xs text-muted-foreground">Score</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <CheckCircle2 className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold font-mono text-foreground">{correctAnswers}/{questions.length}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <BookOpen className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className={`text-2xl font-bold font-mono ${color}`}>{grade}</p>
              <p className="text-xs text-muted-foreground">Grade</p>
            </div>
          </div>

          <Button onClick={onRestart} size="lg" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Detailed Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Detailed Review
          </h2>

          {questions.map((question, index) => {
            const isCorrect = answers[index] === question.correctAnswer;
            const userAnswer = answers[index];

            return (
              <div
                key={question.id}
                className={`bg-card border rounded-xl p-6 no-select ${
                  isCorrect ? 'border-success/30' : 'border-destructive/30'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
                  )}
                  <div>
                    <span className="text-sm font-mono text-muted-foreground no-select">Q{index + 1}.</span>
                    <h3 className="font-medium text-foreground no-select">{question.question}</h3>
                  </div>
                </div>

                {question.code && (
                  <div className="code-block mb-4 text-xs overflow-x-auto no-select">
                    <pre className="no-select"><code className="no-select">{question.code}</code></pre>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-3 rounded-lg text-sm flex items-center gap-2 no-select ${
                        optIndex === question.correctAnswer
                          ? 'bg-success/20 border border-success/40 text-foreground'
                          : optIndex === userAnswer && !isCorrect
                          ? 'bg-destructive/20 border border-destructive/40 text-foreground'
                          : 'bg-secondary/30 text-muted-foreground'
                      }`}
                    >
                      <span className="font-mono font-medium no-select">
                        {String.fromCharCode(65 + optIndex)}.
                      </span>
                      <span className="no-select">{option}</span>
                      {optIndex === question.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-success ml-auto" />
                      )}
                      {optIndex === userAnswer && !isCorrect && (
                        <XCircle className="w-4 h-4 text-destructive ml-auto" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 no-select">
                  <p className="text-sm text-foreground/80 no-select">
                    <span className="font-medium text-primary no-select">Explanation: </span>
                    <span className="no-select">{question.explanation}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
