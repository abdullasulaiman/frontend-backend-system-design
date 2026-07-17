// Course/track registry.
//
// The site hosts multiple independent courses; each course is split into
// two tracks, and each track maps 1:1 to a content collection (defined in
// `src/content.config.ts`). Components that need to render navigation
// (Sidebar, TopBar, the landing page, cheatsheets) read this registry
// instead of hard-coding collection names, so adding a new course/track is
// a matter of adding an entry here (plus the collection + routes).

export type CollectionName = 'concepts' | 'interview' | 'sd-concepts' | 'sd-interview';

export interface CourseTrack {
  /** Unique key within the course, e.g. 'concepts' or 'sd-interview'. */
  key: string;
  /** Human-readable label shown in nav, e.g. "Concepts". */
  label: string;
  /** The content collection this track's lessons live in. */
  collection: CollectionName;
  /** URL prefix under which this track's lessons are served, e.g. '/concepts'. */
  basePath: string;
}

export interface Course {
  key: 'frontend' | 'system-design';
  label: string;
  blurb: string;
  tracks: CourseTrack[];
}

export const COURSES: Course[] = [
  {
    key: 'frontend',
    label: 'Frontend System Design',
    blurb:
      'Design scalable client applications — rendering, state, performance, and the interview.',
    tracks: [
      { key: 'concepts', label: 'Concepts', collection: 'concepts', basePath: '/concepts' },
      { key: 'interview', label: 'Interview Prep', collection: 'interview', basePath: '/interview' },
    ],
  },
  {
    key: 'system-design',
    label: 'System Design Interview',
    blurb: 'Design large-scale distributed systems — building blocks and classic design problems.',
    tracks: [
      {
        key: 'sd-concepts',
        label: 'Foundations & Building Blocks',
        collection: 'sd-concepts',
        basePath: '/system-design',
      },
      {
        key: 'sd-interview',
        label: 'Design Problems',
        collection: 'sd-interview',
        basePath: '/system-design/design',
      },
    ],
  },
];

/** Find the course that owns a given content collection. */
export function courseForCollection(collection: CollectionName): Course {
  const course = COURSES.find(c => c.tracks.some(t => t.collection === collection));
  if (!course) throw new Error(`No course registered for collection "${collection}"`);
  return course;
}

/** Find the track (within any course) that owns a given content collection. */
export function trackForCollection(collection: CollectionName): CourseTrack {
  for (const course of COURSES) {
    const track = course.tracks.find(t => t.collection === collection);
    if (track) return track;
  }
  throw new Error(`No track registered for collection "${collection}"`);
}
