export interface RecommendedNoteItem {
  title: string;
  note: string;
}

export interface Recommendations {
  recommendationVersion?: 2;
  post_quiz_recommendations?: {
    weak_area_level: string;
    weak_area_name: string;
    why_this_is_commonly_missed: string;
    what_to_review: string;
    how_to_practice: string;
    suggested_references: string;
    mcqs: any[];
  } | null;
  /** Legacy single case from older recommendations. */
  clinical_case?: any | null;
  /** v2: up to five cases from wrong-answer recommendations. */
  clinical_cases?: any[] | null;
  flashcards?: {
    flashcards: any[];
  } | null;
  /** v2 uses `items`; legacy used `title` + `note` only. */
  notes?: {
    title?: string;
    note?: string;
    items?: RecommendedNoteItem[];
  } | null;
  articles?: string[];
  clinicalCases?: string[];
}

export interface SessionDetails {
  completed: number;
  total: number;
  correct: number;
  incorrect: number;
  recommendations: Recommendations;
  rawTimeSpent?: number;
}

export interface Session {
  id: number;
  name: string;
  source: string;
  result: string;
  progress: number;
  details?: SessionDetails;
}

export interface Stats {
  completed: string;
  correct: string;
  timePerQuestion?: string;
  totalTime: string;
  incorrect?: string;
  wrong?: string;
}
