import { describe, it, expect } from 'vitest';
import { buildNav, flattenNav, getPrevNext } from '../src/lib/navigation';

const e = (id: string, module: string, moduleOrder: number, order: number, title: string) => ({ id, data: { module, moduleOrder, order, title } });
const entries = [
  e('b', 'Perf', 2, 1, 'B'),
  e('a2', 'Intro', 1, 2, 'A2'),
  e('a1', 'Intro', 1, 1, 'A1'),
];

describe('navigation', () => {
  it('groups and sorts modules then lessons', () => {
    const nav = buildNav(entries as any);
    expect(nav.map(m => m.module)).toEqual(['Intro', 'Perf']);
    expect(nav[0].lessons.map(l => l.id)).toEqual(['a1', 'a2']);
  });
  it('flattens in order', () => {
    expect(flattenNav(buildNav(entries as any)).map(l => l.id)).toEqual(['a1', 'a2', 'b']);
  });
  it('computes prev/next', () => {
    const flat = flattenNav(buildNav(entries as any));
    expect(getPrevNext(flat, 'a2')).toEqual({ prev: flat[0], next: flat[2] });
    expect(getPrevNext(flat, 'a1').prev).toBeUndefined();
    expect(getPrevNext(flat, 'b').next).toBeUndefined();
  });
});
