export type QuizType = 'plugin' | 'theme';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  code?: string;
}

export interface DbQuestion {
  id: string;
  quiz_type: QuizType;
  difficulty: DifficultyLevel;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string | null;
}
