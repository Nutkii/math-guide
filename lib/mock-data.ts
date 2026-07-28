export type Book = {
  slug: string;
  titleKa: string;
  titleEn: string;
  grade: number;
  publisher: string;
  cover: string;
  chapters: Chapter[];
};

export type Chapter = {
  id: string;
  number: number;
  titleKa: string;
  titleEn: string;
  problemCount: number;
};

export type Problem = {
  id: string;
  bookSlug: string;
  chapterId: string;
  number: string;
  statementKa: string;
  statementEn: string;
  difficulty: "easy" | "medium" | "hard";
  solutionCount: number;
  authorName: string;
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

const coolCovers = [
  "linear-gradient(135deg, hsl(180 70% 45%), hsl(160 65% 50%))",
  "linear-gradient(135deg, hsl(200 75% 55%), hsl(180 60% 45%))",
  "linear-gradient(135deg, hsl(160 60% 45%), hsl(190 70% 55%))",
  "linear-gradient(135deg, hsl(210 70% 50%), hsl(170 65% 50%))",
];

export const books: Book[] = [
  {
    slug: "algebra-9",
    titleKa: "ალგებრა 9",
    titleEn: "Algebra 9",
    grade: 9,
    publisher: "Klett",
    cover: coolCovers[0],
    chapters: [
      {
        id: "alg9-c1",
        number: 1,
        titleKa: "ხარისხები და ფესვები",
        titleEn: "Powers and Roots",
        problemCount: 42,
      },
      {
        id: "alg9-c2",
        number: 2,
        titleKa: "კვადრატული განტოლებები",
        titleEn: "Quadratic Equations",
        problemCount: 58,
      },
      {
        id: "alg9-c3",
        number: 3,
        titleKa: "ფუნქციები",
        titleEn: "Functions",
        problemCount: 36,
      },
    ],
  },
  {
    slug: "geometry-10",
    titleKa: "გეომეტრია 10",
    titleEn: "Geometry 10",
    grade: 10,
    publisher: "Intelekti",
    cover: coolCovers[1],
    chapters: [
      {
        id: "geo10-c1",
        number: 1,
        titleKa: "მსგავსი სამკუთხედები",
        titleEn: "Similar Triangles",
        problemCount: 28,
      },
      {
        id: "geo10-c2",
        number: 2,
        titleKa: "წრე და მხები",
        titleEn: "Circles and Tangents",
        problemCount: 34,
      },
    ],
  },
  {
    slug: "algebra-11",
    titleKa: "ალგებრა 11",
    titleEn: "Algebra 11",
    grade: 11,
    publisher: "Bakur Sulakauri",
    cover: coolCovers[2],
    chapters: [
      {
        id: "alg11-c1",
        number: 1,
        titleKa: "ლოგარითმები",
        titleEn: "Logarithms",
        problemCount: 45,
      },
      {
        id: "alg11-c2",
        number: 2,
        titleKa: "ტრიგონომეტრია",
        titleEn: "Trigonometry",
        problemCount: 62,
      },
    ],
  },
  {
    slug: "calculus-12",
    titleKa: "მათემატიკის ანალიზი 12",
    titleEn: "Calculus 12",
    grade: 12,
    publisher: "Klett",
    cover: coolCovers[3],
    chapters: [
      {
        id: "cal12-c1",
        number: 1,
        titleKa: "ზღვრები",
        titleEn: "Limits",
        problemCount: 30,
      },
      {
        id: "cal12-c2",
        number: 2,
        titleKa: "წარმოებული",
        titleEn: "Derivatives",
        problemCount: 48,
      },
    ],
  },
];

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
    authorName: "ნინო ჯავახიშვილი",
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
    authorName: "გიორგი მაჭარაშვილი",
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
    authorName: "თამარ ბერიძე",
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
    authorName: "ლუკა კვირიკაშვილი",
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
    authorName: "ანა გელაშვილი",
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
    authorName: "დათო ლომიძე",
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

export function getBookBySlug(slug: string) {
  return books.find((b) => b.slug === slug);
}

export function getProblemById(id: string) {
  return problems.find((p) => p.id === id);
}

export function getSolutionsForProblem(problemId: string) {
  return solutions.filter((s) => s.problemId === problemId);
}

export function getTutorById(id: string) {
  return tutors.find((t) => t.id === id);
}
