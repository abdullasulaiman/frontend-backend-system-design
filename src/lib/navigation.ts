import type { LessonFrontmatter } from './types';

export interface NavLesson { id: string; title: string; order: number; }
export interface NavModule { module: string; moduleOrder: number; lessons: NavLesson[]; }
type Entry = { id: string; data: Pick<LessonFrontmatter, 'module' | 'moduleOrder' | 'order' | 'title'> };

export function buildNav(entries: Entry[]): NavModule[] {
  const byModule = new Map<string, NavModule>();
  for (const { id, data } of entries) {
    let m = byModule.get(data.module);
    if (!m) { m = { module: data.module, moduleOrder: data.moduleOrder, lessons: [] }; byModule.set(data.module, m); }
    m.lessons.push({ id, title: data.title, order: data.order });
  }
  const mods = [...byModule.values()].sort((a, b) => a.moduleOrder - b.moduleOrder);
  for (const m of mods) m.lessons.sort((a, b) => a.order - b.order);
  return mods;
}

export function flattenNav(nav: NavModule[]): NavLesson[] {
  return nav.flatMap(m => m.lessons);
}

export function getPrevNext(flat: NavLesson[], currentId: string) {
  const i = flat.findIndex(l => l.id === currentId);
  return { prev: i > 0 ? flat[i - 1] : undefined, next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : undefined };
}
