import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MockInterview from '../src/components/MockInterview';
import { getMockScore } from '../src/lib/progressStore';

beforeEach(() => localStorage.clear());

describe('MockInterview', () => {
  it('reveals rubric and saves self-score', () => {
    render(<MockInterview lessonId="m1" prompt="Design X" rubric={[{ point: 'Scope', detail: 'Clarify requirements' }]} />);
    fireEvent.click(screen.getByRole('button', { name: /reveal/i }));
    expect(screen.getByText(/Clarify requirements/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '4' }));
    expect(getMockScore('m1')).toBe(4);
    expect(screen.getByText(/saved/i)).toBeInTheDocument();
  });
});
