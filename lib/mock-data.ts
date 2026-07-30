export type Problem = {
  id: string;
  bookSlug: string;
  chapterId: string;
  number: string;
  statementKa: string;
  statementEn: string;
  difficulty: "easy" | "medium" | "hard";
  solutionCount: number;
  authorName?: string;
  grade?: number;
};

export type Solution = {
  id: string;
  problemId: string;
  authorName: string;
  contentKa: string;
  contentEn: string;
  upvotes: number;
  createdAt: string;
};

export type Tutor = {
  id: string;
  name: string;
  bio: string;
  subjects: string[];
  hourlyRateGEL: number;
  rating: number;
  reviewCount: number;
  avatarSeed: string;
  approved?: boolean;
};

export const problems: Problem[] = [
  {
    id: "p1",
    bookSlug: "algebra-9",
    chapterId: "alg9-c2",
    number: "2.14",
    statementKa: "ამოხსენით განტოლება: $x^2 - 5x + 6 = 0$",
    statementEn: "Solve the equation: $x^2 - 5x + 6 = 0$",
    difficulty: "easy",
    solutionCount: 3,
  },
  {
    id: "p2",
    bookSlug: "algebra-9",
    chapterId: "alg9-c2",
    number: "2.31",
    statementKa:
      "იპოვეთ $k$-ს მნიშვნელობა, რომლისთვისაც განტოლებას $x^2 + kx + 9 = 0$ აქვს ერთადერთი ფესვი.",
    statementEn:
      "Find the value of $k$ for which the equation $x^2 + kx + 9 = 0$ has exactly one root.",
    difficulty: "medium",
    solutionCount: 2,
  },
  {
    id: "p3",
    bookSlug: "geometry-10",
    chapterId: "geo10-c1",
    number: "1.07",
    statementKa:
      "სამკუთხედი $ABC$-ში გვაქვს $AB = 6$, $BC = 8$, $AC = 10$. იპოვეთ მისი ფართობი.",
    statementEn:
      "In triangle $ABC$, $AB = 6$, $BC = 8$, $AC = 10$. Find its area.",
    difficulty: "easy",
    solutionCount: 4,
  },
  {
    id: "p4",
    bookSlug: "algebra-11",
    chapterId: "alg11-c1",
    number: "1.22",
    statementKa: "ამოხსენით: $\\log_2(x^2 - 1) = 3$",
    statementEn: "Solve: $\\log_2(x^2 - 1) = 3$",
    difficulty: "medium",
    solutionCount: 1,
  },
  {
    id: "p5",
    bookSlug: "calculus-12",
    chapterId: "cal12-c2",
    number: "2.05",
    statementKa: "იპოვეთ წარმოებული: $f(x) = x^3 \\sin(x)$",
    statementEn: "Find the derivative: $f(x) = x^3 \\sin(x)$",
    difficulty: "medium",
    solutionCount: 2,
  },
  {
    id: "p6",
    bookSlug: "calculus-12",
    chapterId: "cal12-c1",
    number: "1.18",
    statementKa: "გამოთვალეთ ზღვარი: $\\lim_{x \\to 0} \\frac{\\sin(3x)}{x}$",
    statementEn: "Evaluate the limit: $\\lim_{x \\to 0} \\frac{\\sin(3x)}{x}$",
    difficulty: "hard",
    solutionCount: 1,
  },
];

export const solutions: Solution[] = [
  {
    id: "s1",
    problemId: "p1",
    authorName: "გიორგი მაჭარაშვილი",
    contentKa:
      "ფაქტორიზაცია: $x^2 - 5x + 6 = (x-2)(x-3) = 0$. ფესვები: $x_1 = 2$, $x_2 = 3$.",
    contentEn:
      "Factor: $x^2 - 5x + 6 = (x-2)(x-3) = 0$. Roots: $x_1 = 2$, $x_2 = 3$.",
    upvotes: 24,
    createdAt: "2026-04-12",
  },
  {
    id: "s2",
    problemId: "p1",
    authorName: "თამარ ბერიძე",
    contentKa:
      "დისკრიმინანტი: $D = 25 - 24 = 1$. ფესვები: $x = \\frac{5 \\pm 1}{2}$, ანუ $2$ და $3$.",
    contentEn:
      "Discriminant: $D = 25 - 24 = 1$. Roots: $x = \\frac{5 \\pm 1}{2}$, i.e. $2$ and $3$.",
    upvotes: 18,
    createdAt: "2026-04-14",
  },
  {
    id: "s3",
    problemId: "p3",
    authorName: "ლუკა კვირიკაშვილი",
    contentKa:
      "$6^2 + 8^2 = 100 = 10^2$, ე.ი. სამკუთხედი მართკუთხაა. ფართობი: $S = \\frac{1}{2} \\cdot 6 \\cdot 8 = 24$.",
    contentEn:
      "$6^2 + 8^2 = 100 = 10^2$, so the triangle is right-angled. Area: $S = \\frac{1}{2} \\cdot 6 \\cdot 8 = 24$.",
    upvotes: 31,
    createdAt: "2026-04-08",
  },
  {
    id: "s4",
    problemId: "p2",
    authorName: "ნინო ჯავახიშვილი",
    contentKa:
      "ერთადერთი ფესვისთვის დისკრიმინანტი ნულის ტოლი უნდა იყოს: $D = k^2 - 36 = 0$, აქედან $k = \\pm 6$.",
    contentEn:
      "For a unique root the discriminant must vanish: $D = k^2 - 36 = 0$, so $k = \\pm 6$.",
    upvotes: 15,
    createdAt: "2026-04-16",
  },
  {
    id: "s5",
    problemId: "p4",
    authorName: "ანა გელაშვილი",
    contentKa:
      "პირობით $x^2 - 1 = 2^3 = 8$, ანუ $x^2 = 9$, $x = \\pm 3$. ორივე ფესვი აკმაყოფილებს განსაზღვრის არეს $x^2 > 1$.",
    contentEn:
      "By definition $x^2 - 1 = 2^3 = 8$, so $x^2 = 9$, $x = \\pm 3$. Both roots satisfy the domain condition $x^2 > 1$.",
    upvotes: 9,
    createdAt: "2026-04-17",
  },
  {
    id: "s6",
    problemId: "p5",
    authorName: "დათო ლომიძე",
    contentKa:
      "ნამრავლის წარმოებულის წესით: $f'(x) = 3x^2 \\sin(x) + x^3 \\cos(x)$.",
    contentEn:
      "By the product rule: $f'(x) = 3x^2 \\sin(x) + x^3 \\cos(x)$.",
    upvotes: 12,
    createdAt: "2026-04-18",
  },
  {
    id: "s7",
    problemId: "p6",
    authorName: "გიორგი მაჭარაშვილი",
    contentKa:
      "ვსარგებლობთ ცნობილი ზღვარით $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$: $\\lim_{x \\to 0} \\frac{\\sin(3x)}{x} = 3 \\cdot \\lim_{x \\to 0} \\frac{\\sin(3x)}{3x} = 3$.",
    contentEn:
      "Using the standard limit $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$: $\\lim_{x \\to 0} \\frac{\\sin(3x)}{x} = 3 \\cdot \\lim_{x \\to 0} \\frac{\\sin(3x)}{3x} = 3$.",
    upvotes: 7,
    createdAt: "2026-04-19",
  },
];

export const tutors: Tutor[] = [
  {
    id: "t1",
    name: "მარიამ კაპანაძე",
    bio: "10 წლის გამოცდილების მათემატიკის მასწავლებელი. სპეციალიზაცია — საატესტატო და ერთიანი ეროვნული გამოცდები.",
    subjects: ["Algebra", "Geometry", "Calculus"],
    hourlyRateGEL: 60,
    rating: 4.9,
    reviewCount: 124,
    avatarSeed: "mariam",
  },
  {
    id: "t2",
    name: "ვახტანგ ბუჩუკური",
    bio: "TSU-ს მათემატიკის ფაკულტეტის კურსდამთავრებული. ვამზადებ მოსწავლეებს ოლიმპიადებისთვის.",
    subjects: ["Olympiad", "Algebra", "Number Theory"],
    hourlyRateGEL: 80,
    rating: 4.8,
    reviewCount: 87,
    avatarSeed: "vakhtang",
  },
  {
    id: "t3",
    name: "სოფიო თხელიძე",
    bio: "კერძო რეპეტიტორი 5 წელია. მუშაობს 7-12 კლასებთან, კონცენტრაცია ფუნდამენტურ ცოდნაზე.",
    subjects: ["Algebra", "Geometry"],
    hourlyRateGEL: 50,
    rating: 4.95,
    reviewCount: 156,
    avatarSeed: "sofo",
  },
  {
    id: "t4",
    name: "ბექა გაბუნია",
    bio: "ფიზიკა-მათემატიკის ბაკალავრი, ETH Zurich. ვაკეთებ ცოცხალ ონლაინ გაკვეთილებს.",
    subjects: ["Calculus", "Linear Algebra"],
    hourlyRateGEL: 90,
    rating: 4.7,
    reviewCount: 42,
    avatarSeed: "beka",
  },
];

export function getProblemById(id: string) {
  return problems.find((p) => p.id === id);
}

export function getSolutionsForProblem(problemId: string) {
  return solutions.filter((s) => s.problemId === problemId);
}

export function getTutorById(id: string) {
  return tutors.find((t) => t.id === id);
}
