import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarkComplete from '../src/components/MarkComplete';
import { isComplete } from '../src/lib/progressStore';

beforeEach(() => localStorage.clear());
describe('MarkComplete', () => {
  it('toggles completion', () => {
    render(<MarkComplete lessonId="l9" />);
    fireEvent.click(screen.getByRole('button'));
    expect(isComplete('l9')).toBe(true);
  });
});
