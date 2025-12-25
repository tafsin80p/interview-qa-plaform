import { useState, useCallback, useRef, useEffect } from 'react';
import { LandingPage, QuizType, DifficultyLevel } from '@/components/LandingPage';
import { QuestionCard } from '@/components/QuestionCard';
import { QuizTimer } from '@/components/QuizTimer';
import { ProgressBar } from '@/components/ProgressBar';
import { ViolationModal } from '@/components/ViolationModal';
import { WarningModal } from '@/components/WarningModal';
import { ResultsPage } from '@/components/ResultsPage';
import { useAntiCheat } from '@/hooks/useAntiCheat';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { wordpressQuestions } from '@/data/questions';
import { themeQuestions } from '@/data/themeQuestions';
import { Question } from '@/data/questions';
import { Puzzle, Palette, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type QuizState = 'landing' | 'quiz' | 'violation' | 'warning' | 'results';

interface DbQuestion {
  id: string;
  quiz_type: QuizType;
  difficulty: DifficultyLevel;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string | null;
}

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const [quizState, setQuizState] = useState<QuizState>('landing');
  const [quizType, setQuizType] = useState<QuizType>('plugin');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('advanced');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [violationType, setViolationType] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [quizDurationMinutes, setQuizDurationMinutes] = useState(20);
  const [warningCount, setWarningCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const startTimeRef = useRef<number>(0);

  const handleViolation = useCallback(async (type: string) => {
    setViolationType(type);
    
    if (user && isSupabaseConfigured) {
      try {
        // Get current violation/warning count
        const { data: profile } = await supabase
          .from('profiles')
          .select('violation_count')
          .eq('user_id', user.id)
          .single() as { data: { violation_count?: number } | null; error: unknown };

        const currentViolationCount = (profile as { violation_count?: number } | null)?.violation_count || 0;
        const newViolationCount = currentViolationCount + 1;

        // Update violation count
        await supabase
          .from('profiles')
          .update({
            violation_count: newViolationCount,
          } as never)
          .eq('user_id', user.id);

        // If this is the 4th violation (after 3 warnings), block the user
        if (newViolationCount >= 4) {
          const reason = `Cheating detected: ${type} (Multiple violations)`;
          
          // Block user
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              is_blocked: true,
              blocked_reason: reason,
              blocked_at: new Date().toISOString(),
            } as never)
            .eq('user_id', user.id);

          if (!updateError) {
            // Record in blocked_users table
            await supabase
              .from('blocked_users' as never)
              .insert({
                user_id: user.id,
                reason,
                violation_type: type,
              } as never);

            // Send notification email if configured
            if (user.email) {
              try {
                const { sendBlockedNotificationEmail } = await import('@/lib/email');
                await sendBlockedNotificationEmail(user.email, reason);
              } catch (emailError) {
                console.error('Error sending block notification email:', emailError);
              }
            }
          }

          // Show blocking modal
          setQuizState('violation');
        } else {
          // Show warning (1st, 2nd, or 3rd violation)
          setWarningCount(newViolationCount);
          setShowWarning(true);
          setQuizState('warning');
        }
      } catch (err) {
        console.error('Error handling violation:', err);
        // Fallback: show warning if database error
        setWarningCount(1);
        setShowWarning(true);
        setQuizState('warning');
      }
    } else {
      // If not logged in or Supabase not configured, just show warning
      setWarningCount(1);
      setShowWarning(true);
      setQuizState('warning');
    }
  }, [user]);

  const { resetViolation } = useAntiCheat({
    onViolation: handleViolation,
    enabled: quizState === 'quiz',
  });

  const fetchDbQuestions = useCallback(async (type: QuizType, diff: DifficultyLevel): Promise<Question[]> => {
    if (!isSupabaseConfigured) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_type', type)
        .eq('difficulty', diff);

      if (error || !data || data.length === 0) {
        return [];
      }

      return (data as DbQuestion[]).map((q) => ({
        id: parseInt(q.id.replace(/-/g, '').substring(0, 8), 16) || Math.random(), // Convert UUID to number for compatibility
        question: q.question,
        options: q.options,
        correctAnswer: q.correct_answer,
        explanation: q.explanation || '',
      }));
    } catch (err) {
      console.error('Error fetching questions from database:', err);
      return [];
    }
  }, []);

  const getFallbackQuestions = useCallback((type: QuizType): Question[] => {
    return type === 'plugin' ? wordpressQuestions : themeQuestions;
  }, []);

  const handleStart = useCallback(async (type: QuizType, diff: DifficultyLevel) => {
    // Require login to start quiz
    if (!user) {
      toast.error('Please login to start the quiz');
      const pendingQuiz = JSON.stringify({ type, difficulty: diff });
      sessionStorage.setItem('pendingQuiz', pendingQuiz);
      return;
    }

    setQuizType(type);
    setDifficulty(diff);
    setLoadingQuestions(true);

    // Try to fetch questions from database first
    const dbQuestions = await fetchDbQuestions(type, diff);
    
    let quizQuestions: Question[];
    if (dbQuestions.length >= 5) {
      quizQuestions = dbQuestions;
    } else {
      // Fall back to static questions
      quizQuestions = getFallbackQuestions(type);
      if (!isSupabaseConfigured) {
        // Supabase not configured - use static questions only
        console.log(`Using static questions: ${quizQuestions.length} questions for ${type} quiz`);
      } else if (dbQuestions.length > 0) {
        toast.info(`Using ${dbQuestions.length} custom questions + ${quizQuestions.length} default questions`);
      }
    }

    setQuestions(quizQuestions);
    setAnswers(new Array(quizQuestions.length).fill(null));
    setCurrentQuestion(0);
    startTimeRef.current = Date.now();
    setLoadingQuestions(false);
    setQuizState('quiz');
  }, [user, fetchDbQuestions, getFallbackQuestions]);

  // Removed auto-start feature - users should always see landing page after login
  // They can then manually start the quiz from the landing page

  useEffect(() => {
    // Fetch quiz duration from settings
    const fetchQuizDuration = async () => {
      if (!isSupabaseConfigured) {
        setQuizDurationMinutes(20); // Default duration
        return;
      }

      try {
        const { data, error } = await supabase
          .from('quiz_settings' as never)
          .select('setting_value')
          .eq('setting_key', 'quiz_duration_minutes')
          .single() as { data: { setting_value: string } | null; error: unknown };

        if (!error && data) {
          setQuizDurationMinutes(parseInt(data.setting_value) || 20);
        } else {
          setQuizDurationMinutes(20); // Default if not found
        }
      } catch (err) {
        console.error('Error fetching quiz duration:', err);
        setQuizDurationMinutes(20); // Default on error
      }
    };

    fetchQuizDuration();
  }, []);

  // Prevent text selection and copying during quiz
  useEffect(() => {
    if (quizState !== 'quiz') {
      return;
    }

    // Prevent copy, cut, and context menu
    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('Copying is disabled during the quiz');
      return false;
    };

    const preventCut = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const preventSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const preventDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCut);
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('selectstart', preventSelectStart);
    document.addEventListener('dragstart', preventDragStart);

    // Disable keyboard shortcuts (Ctrl+C, Ctrl+A, Ctrl+X, etc.)
    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'a' || e.key === 'A')
      ) {
        e.preventDefault();
        if (e.key === 'c' || e.key === 'C') {
          toast.error('Copying is disabled during the quiz');
        }
        return false;
      }
    };

    document.addEventListener('keydown', preventKeyboardShortcuts);

    // Cleanup
    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCut);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('selectstart', preventSelectStart);
      document.removeEventListener('dragstart', preventDragStart);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
    };
  }, [quizState]);

  const handleRestart = () => {
    resetViolation();
    setQuizState('landing');
    setCurrentQuestion(0);
    setAnswers([]);
    setViolationType('');
    setWarningCount(0);
    setShowWarning(false);
    setQuestions([]);
  };

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const handleTimeUp = () => {
    finishQuiz();
  };

  const finishQuiz = async () => {
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const score = questions.filter((q, i) => answers[i] === q.correctAnswer).length;

    // Save results if user is logged in and Supabase is configured
    if (user && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('quiz_results').insert({
          user_id: user.id,
          quiz_type: quizType,
          difficulty: difficulty,
          score: score,
          total_questions: questions.length,
          time_taken_seconds: timeTaken,
        });

        if (error) {
          console.error('Failed to save results:', error);
        } else {
          toast.success('Score saved to leaderboard!');
        }
      } catch (err) {
        console.error('Error saving results:', err);
      }
    } else if (user && !isSupabaseConfigured) {
      console.warn('Supabase not configured - results not saved');
    }

    setQuizState('results');
  };

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (loadingQuestions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (quizState === 'landing') {
    return (
      <LandingPage
        onStart={handleStart}
        pluginQuestionCount={wordpressQuestions.length}
        themeQuestionCount={themeQuestions.length}
        timeLimit={quizDurationMinutes}
      />
    );
  }

  if (quizState === 'warning') {
    return (
      <WarningModal
        violationType={violationType}
        warningCount={warningCount}
        onContinue={() => {
          setShowWarning(false);
          handleRestart();
        }}
      />
    );
  }

  if (quizState === 'violation') {
    return (
      <ViolationModal
        violationType={violationType}
        onRestart={handleRestart}
      />
    );
  }

  if (quizState === 'results') {
    return (
      <ResultsPage
        questions={questions}
        answers={answers}
        onRestart={handleRestart}
        quizType={quizType}
        difficulty={difficulty}
      />
    );
  }

  const QuizIcon = quizType === 'plugin' ? Puzzle : Palette;
  const quizTitle = quizType === 'plugin' ? 'Plugin Developer' : 'Theme Developer';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <QuizIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-foreground text-sm">WordPress Quiz</h1>
              <p className="text-xs text-muted-foreground">{quizTitle} • {difficulty}</p>
            </div>
          </div>

          <QuizTimer
            duration={quizDurationMinutes * 60}
            onTimeUp={handleTimeUp}
            isRunning={quizState === 'quiz'}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 no-select">
        <div className="mb-8">
          <ProgressBar
            current={currentQuestion + 1}
            total={questions.length}
          />
        </div>

        <QuestionCard
          question={questions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          selectedAnswer={answers[currentQuestion]}
          onSelectAnswer={handleSelectAnswer}
          onNext={handleNext}
          isLast={currentQuestion === questions.length - 1}
        />
      </main>
    </div>
  );
};

export default Index;
