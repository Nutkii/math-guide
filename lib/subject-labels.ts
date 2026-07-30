const SUBJECT_KEYS: Record<string, string> = {
  Algebra: "algebra",
  Geometry: "geometry",
  Calculus: "calculus",
  "Linear Algebra": "linearAlgebra",
  "Number Theory": "numberTheory",
  Olympiad: "olympiad",
};

export function subjectKey(subject: string): string {
  return SUBJECT_KEYS[subject] ?? subject;
}
