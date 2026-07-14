export type Track = 'concept' | 'interview';

export interface QuizOption { id: string; text: string; correct: boolean; explanation?: string; }
export interface QuizQuestion {
  id: string;
  kind: 'mcq' | 'multi' | 'boolean';
  prompt: string;
  options: QuizOption[];
}
export interface LessonFrontmatter {
  title: string;
  module: string;
  moduleOrder: number;
  order: number;
  track: Track;
  summary: string;
  cheatsheet: string[];
  tags: string[];
  estMinutes: number;
}
