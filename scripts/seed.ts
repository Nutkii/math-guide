import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set");

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Dynamic imports to avoid model registration issues
  const Book = (await import("../models/Book")).default;
  const Chapter = (await import("../models/Chapter")).default;
  const Problem = (await import("../models/Problem")).default;
  const Solution = (await import("../models/Solution")).default;
  const TutorProfile = (await import("../models/TutorProfile")).default;
  const User = (await import("../models/User")).default;

  // Clear existing seed data
  await Promise.all([
    Book.deleteMany({}),
    Chapter.deleteMany({}),
    Problem.deleteMany({}),
    Solution.deleteMany({}),
    TutorProfile.deleteMany({}),
    User.deleteMany({}),
  ]);
  console.log("Cleared existing data");

  // Seed books
  const books = await Book.insertMany([
    {
      slug: "algebra-9",
      titleKa: "ალგებრა 9",
      titleEn: "Algebra 9",
      grade: 9,
      publisher: "Klett",
      coverGradient: "linear-gradient(135deg, hsl(180 70% 45%), hsl(160 65% 50%))",
    },
    {
      slug: "geometry-10",
      titleKa: "გეომეტრია 10",
      titleEn: "Geometry 10",
      grade: 10,
      publisher: "Intelekti",
      coverGradient: "linear-gradient(135deg, hsl(200 75% 55%), hsl(180 60% 45%))",
    },
    {
      slug: "algebra-11",
      titleKa: "ალგებრა 11",
      titleEn: "Algebra 11",
      grade: 11,
      publisher: "Bakur Sulakauri",
      coverGradient: "linear-gradient(135deg, hsl(160 60% 45%), hsl(190 70% 55%))",
    },
    {
      slug: "calculus-12",
      titleKa: "მათემატიკის ანალიზი 12",
      titleEn: "Calculus 12",
      grade: 12,
      publisher: "Klett",
      coverGradient: "linear-gradient(135deg, hsl(210 70% 50%), hsl(170 65% 50%))",
    },
  ]);
  console.log(`Seeded ${books.length} books`);

  const [alg9, geo10, alg11, cal12] = books;

  // Seed chapters
  const chapters = await Chapter.insertMany([
    { bookId: alg9._id, bookSlug: "algebra-9", number: 1, titleKa: "ხარისხები და ფესვები", titleEn: "Powers and Roots" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 2, titleKa: "კვადრატული განტოლებები", titleEn: "Quadratic Equations" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 3, titleKa: "ფუნქციები", titleEn: "Functions" },
    { bookId: geo10._id, bookSlug: "geometry-10", number: 1, titleKa: "მსგავსი სამკუთხედები", titleEn: "Similar Triangles" },
    { bookId: geo10._id, bookSlug: "geometry-10", number: 2, titleKa: "წრე და მხები", titleEn: "Circles and Tangents" },
    { bookId: alg11._id, bookSlug: "algebra-11", number: 1, titleKa: "ლოგარითმები", titleEn: "Logarithms" },
    { bookId: alg11._id, bookSlug: "algebra-11", number: 2, titleKa: "ტრიგონომეტრია", titleEn: "Trigonometry" },
    { bookId: cal12._id, bookSlug: "calculus-12", number: 1, titleKa: "ზღვრები", titleEn: "Limits" },
    { bookId: cal12._id, bookSlug: "calculus-12", number: 2, titleKa: "წარმოებული", titleEn: "Derivatives" },
  ]);
  console.log(`Seeded ${chapters.length} chapters`);

  const [, alg9c2, , geo10c1, , alg11c1, , , cal12c2] = chapters;

  // Seed problems
  const problems = await Problem.insertMany([
    {
      bookId: alg9._id,
      bookSlug: "algebra-9",
      chapterId: alg9c2._id,
      number: "2.14",
      statementKa: "ამოხსენით განტოლება: $x^2 - 5x + 6 = 0$",
      statementEn: "Solve the equation: $x^2 - 5x + 6 = 0$",
      difficulty: "easy",
      authorName: "ნინო ჯავახიშვილი",
      status: "approved",
    },
    {
      bookId: alg9._id,
      bookSlug: "algebra-9",
      chapterId: alg9c2._id,
      number: "2.31",
      statementKa: "იპოვეთ $k$-ს მნიშვნელობა, რომლისთვისაც განტოლებას $x^2 + kx + 9 = 0$ აქვს ერთადერთი ფესვი.",
      statementEn: "Find the value of $k$ for which the equation $x^2 + kx + 9 = 0$ has exactly one root.",
      difficulty: "medium",
      authorName: "გიორგი მაჭარაშვილი",
      status: "approved",
    },
    {
      bookId: geo10._id,
      bookSlug: "geometry-10",
      chapterId: geo10c1._id,
      number: "1.07",
      statementKa: "სამკუთხედი $ABC$-ში გვაქვს $AB = 6$, $BC = 8$, $AC = 10$. იპოვეთ მისი ფართობი.",
      statementEn: "In triangle $ABC$, $AB = 6$, $BC = 8$, $AC = 10$. Find its area.",
      difficulty: "easy",
      authorName: "თამარ ბერიძე",
      status: "approved",
    },
    {
      bookId: alg11._id,
      bookSlug: "algebra-11",
      chapterId: alg11c1._id,
      number: "1.22",
      statementKa: "ამოხსენით: $\\log_2(x^2 - 1) = 3$",
      statementEn: "Solve: $\\log_2(x^2 - 1) = 3$",
      difficulty: "medium",
      authorName: "ლუკა კვირიკაშვილი",
      status: "approved",
    },
    {
      bookId: cal12._id,
      bookSlug: "calculus-12",
      chapterId: cal12c2._id,
      number: "2.05",
      statementKa: "იპოვეთ წარმოებული: $f(x) = x^3 \\sin(x)$",
      statementEn: "Find the derivative: $f(x) = x^3 \\sin(x)$",
      difficulty: "medium",
      authorName: "ანა გელაშვილი",
      status: "approved",
    },
  ]);
  console.log(`Seeded ${problems.length} problems`);

  // Seed solutions
  await Solution.insertMany([
    {
      problemId: problems[0]._id,
      authorName: "გიორგი მაჭარაშვილი",
      contentKa: "ფაქტორიზაცია: $x^2 - 5x + 6 = (x-2)(x-3) = 0$. ფესვები: $x_1 = 2$, $x_2 = 3$.",
      contentEn: "Factor: $x^2 - 5x + 6 = (x-2)(x-3) = 0$. Roots: $x_1 = 2$, $x_2 = 3$.",
      upvotes: 24,
    },
    {
      problemId: problems[0]._id,
      authorName: "თამარ ბერიძე",
      contentKa: "დისკრიმინანტი: $D = 25 - 24 = 1$. ფესვები: $x = \\frac{5 \\pm 1}{2}$, ანუ $2$ და $3$.",
      contentEn: "Discriminant: $D = 25 - 24 = 1$. Roots: $x = \\frac{5 \\pm 1}{2}$, i.e. $2$ and $3$.",
      upvotes: 18,
    },
    {
      problemId: problems[2]._id,
      authorName: "ლუკა კვირიკაშვილი",
      contentKa: "$6^2 + 8^2 = 100 = 10^2$, ე.ი. სამკუთხედი მართკუთხაა. ფართობი: $S = \\frac{1}{2} \\cdot 6 \\cdot 8 = 24$.",
      contentEn: "$6^2 + 8^2 = 100 = 10^2$, so the triangle is right-angled. Area: $S = \\frac{1}{2} \\cdot 6 \\cdot 8 = 24$.",
      upvotes: 31,
    },
  ]);
  console.log("Seeded solutions");

  // Seed tutor profiles (create users first)
  const tutorHash = await bcrypt.hash("tutor123", 12);
  const tutorUsers = await User.insertMany([
    { name: "მარიამ კაპანაძე", email: "mariam@math-guide.ge", passwordHash: tutorHash, role: "tutor" },
    { name: "ვახტანგ ბუჩუკური", email: "vakhtang@math-guide.ge", passwordHash: tutorHash, role: "tutor" },
    { name: "სოფიო თხელიძე", email: "sofo@math-guide.ge", passwordHash: tutorHash, role: "tutor" },
    { name: "ბექა გაბუნია", email: "beka@math-guide.ge", passwordHash: tutorHash, role: "tutor" },
  ]);

  await TutorProfile.insertMany([
    {
      userId: tutorUsers[0]._id,
      name: "მარიამ კაპანაძე",
      bio: "10 წლის გამოცდილების მათემატიკის მასწავლებელი.",
      subjects: ["Algebra", "Geometry", "Calculus"],
      hourlyRateGEL: 60,
      rating: 4.9,
      reviewCount: 124,
      avatarSeed: "mariam",
      approved: true,
    },
    {
      userId: tutorUsers[1]._id,
      name: "ვახტანგ ბუჩუკური",
      bio: "TSU-ს მათემატიკის ფაკულტეტის კურსდამთავრებული.",
      subjects: ["Olympiad", "Algebra", "Number Theory"],
      hourlyRateGEL: 80,
      rating: 4.8,
      reviewCount: 87,
      avatarSeed: "vakhtang",
      approved: true,
    },
    {
      userId: tutorUsers[2]._id,
      name: "სოფიო თხელიძე",
      bio: "კერძო რეპეტიტორი 5 წელია.",
      subjects: ["Algebra", "Geometry"],
      hourlyRateGEL: 50,
      rating: 4.95,
      reviewCount: 156,
      avatarSeed: "sofo",
      approved: true,
    },
    {
      userId: tutorUsers[3]._id,
      name: "ბექა გაბუნია",
      bio: "ფიზიკა-მათემატიკის ბაკალავრი, ETH Zurich.",
      subjects: ["Calculus", "Linear Algebra"],
      hourlyRateGEL: 90,
      rating: 4.7,
      reviewCount: 42,
      avatarSeed: "beka",
      approved: true,
    },
  ]);
  console.log("Seeded tutors");

  // Seed test student (login: student@test.ge / student123)
  const studentHash = await bcrypt.hash("student123", 12);
  await User.create({
    name: "Test Student",
    email: "student@test.ge",
    passwordHash: studentHash,
    role: "student",
  });
  console.log("Seeded test student: student@test.ge / student123");

  console.log("Seed complete!");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
