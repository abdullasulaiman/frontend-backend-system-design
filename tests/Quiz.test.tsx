import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Quiz from '../src/components/Quiz';

const questions = [{ id: 'q1', kind: 'mcq', prompt: 'Pick A', options: [
  { id: 'a', text: 'A', correct: true, explanation: 'A is right' },
  { id: 'b', text: 'B', correct: false }] }] as const;

beforeEach(() => localStorage.clear());

describe('Quiz', () => {
  it('reveals correctness after checking', () => {
    render(<Quiz lessonId="l1" questions={questions as any} />);
    fireEvent.click(screen.getByLabelText('A'));
    fireEvent.click(screen.getByRole('button', { name: /check/i }));
    expect(screen.getByText(/A is right/)).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 1/)).toBeInTheDocument();
  });
});
