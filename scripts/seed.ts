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

    // algebra-9 — remaining chapters from the textbook table of contents
    { bookId: alg9._id, bookSlug: "algebra-9", number: 4, titleKa: "ნატურალური და მთელი რიცხვები", titleEn: "Natural and Integer Numbers" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 5, titleKa: "რაციონალური რიცხვები", titleEn: "Rational Numbers" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 6, titleKa: "რიცხვითი წრფე. რიცხვითი შუალედები, რიცხვის მოდული", titleEn: "Number Line. Numerical Intervals, Absolute Value" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 7, titleKa: "რაციონალური გამოსახულებები", titleEn: "Rational Expressions" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 8, titleKa: "ირაციონალური გამოსახულებები", titleEn: "Irrational Expressions" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 9, titleKa: "პროპორცია. პროცენტი. საშუალო არითმეტიკული", titleEn: "Proportion. Percentage. Arithmetic Mean" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 10, titleKa: "მართკუთხა კოორდინატთა სისტემა სიბრტყეზე და სივრცეში. ფუნქცია, ფუნქციის გრაფიკი", titleEn: "Rectangular Coordinate System in the Plane and Space. Function and Its Graph" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 11, titleKa: "განტოლებათა და უტოლობათა სისტემები", titleEn: "Systems of Equations and Inequalities" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 12, titleKa: "წრფივი ფუნქცია. წრფივი განტოლება და უტოლობა. წრფივ განტოლებათა და უტოლობათა სისტემები", titleEn: "Linear Function. Linear Equations and Inequalities and Their Systems" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 13, titleKa: "კვადრატული ფუნქცია. კვადრატული განტოლება და უტოლობა", titleEn: "Quadratic Function. Quadratic Equations and Inequalities" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 14, titleKa: "რაციონალური, მოდულის შემცველი, ირაციონალური განტოლებები და უტოლობები", titleEn: "Rational, Absolute-Value, and Irrational Equations and Inequalities" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 15, titleKa: "y=k/x, y=√x და y=x³ ფუნქციები", titleEn: "The Functions y=k/x, y=√x and y=x³" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 16, titleKa: "ტექსტური ამოცანები", titleEn: "Word Problems" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 17, titleKa: "რიცხვთა მიმდევრობა. არითმეტიკული და გეომეტრიული პროგრესიები", titleEn: "Number Sequences. Arithmetic and Geometric Progressions" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 18, titleKa: "ტრიგონომეტრია", titleEn: "Trigonometry" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 19, titleKa: "მაჩვენებლიანი და ლოგარითმული ფუნქციები, განტოლებები და უტოლობები", titleEn: "Exponential and Logarithmic Functions, Equations and Inequalities" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 20, titleKa: "კომბინატორიკა", titleEn: "Combinatorics" },
    { bookId: alg9._id, bookSlug: "algebra-9", number: 21, titleKa: "მონაცემთა ანალიზი, ალბათობის ელემენტები", titleEn: "Data Analysis, Elements of Probability" },

    // geometry-10 — remaining chapters from the textbook table of contents
    { bookId: geo10._id, bookSlug: "geometry-10", number: 3, titleKa: "წრფე, სხივი, მონაკვეთი, კუთხე, ტეხილი", titleEn: "Line, Ray, Segment, Angle, Broken Line" },
    { bookId: geo10._id, bookSlug: "geometry-10", number: 4, titleKa: "კუთხეები. წრფეთა მართობულობა და პარალელურობა", titleEn: "Angles. Perpendicularity and Parallelism of Lines" },
    { bookId: geo10._id, bookSlug: "geometry-10", number: 5, titleKa: "სამკუთხედი და მისი ელემენტები", titleEn: "Triangle and Its Elements" },
    { bookId: geo10._id, bookSlug: "geometry-10", number: 6, titleKa: "სამკუთხედთა ტოლობა. მედიანა, ბისექტრისა, სიმაღლე", titleEn: "Congruence of Triangles. Median, Bisector, Altitude" },
    { bookId: geo10._id, bookSlug: "geometry-10", number: 7, titleKa: "მრავალკუთხედები: პარალელოგრამი, მართკუთხედი, რომბი, კვადრატი, ტრაპეცია", titleEn: "Polygons: Parallelogram, Rectangle, Rhombus, Square, Trapezoid" },
    { bookId: geo10._id, bookSlug: "geometry-10", number: 8, titleKa: "სამკუთხედთა მსგავსება", titleEn: "Similarity of Triangles" },
    { bookId: geo10._id, bookSlug: "geometry-10", number: 9, titleKa: "პითაგორას თეორემა", titleEn: "Pythagorean Theorem" },
    { bookId: geo10._id, bookSlug: "geometry-10", number: 10, titleKa: "მართკუთხა სამკუთხედში კუთხეებისა და გვერდების ტრიგონომეტრიული თანაფარდობები. სინუსების და კოსინუსების თეორემები", titleEn: "Trigonometric Ratios of Angles and Sides in a Right Triangle. Law of Sines and Law of Cosines" },
    { bookId: geo10._id, bookSlug: "geometry-10", number: 11, titleKa: "ფიგურათა გარდაქმნები", titleEn: "Transformations of Figures" },
    { bookId: geo10._id, bookSlug: "geometry-10", number: 12, titleKa: "წესიერი მრავალკუთხედები. წრეწირის სიგრძე. წრის ფართობი", titleEn: "Regular Polygons. Circumference of a Circle. Area of a Circle" },
    { bookId: geo10._id, bookSlug: "geometry-10", number: 13, titleKa: "ვექტორები სიბრტყეზე და სივრცეში", titleEn: "Vectors in the Plane and in Space" },
    { bookId: geo10._id, bookSlug: "geometry-10", number: 14, titleKa: "ფიგურათა გარდაქმნები სიბრტყეზე. გარდაქმნათა კომპოზიცია", titleEn: "Plane Transformations. Composition of Transformations" },
    { bookId: geo10._id, bookSlug: "geometry-10", number: 15, titleKa: "სტერეომეტრიის საწყისები", titleEn: "Foundations of Stereometry" },
    { bookId: geo10._id, bookSlug: "geometry-10", number: 16, titleKa: "მრავალწახნაგი და მისი ელემენტები. მართი პრიზმა, მართი და მართკუთხა პარალელეპიპედი", titleEn: "Polyhedra and Their Elements. Right Prism, Right and Rectangular Parallelepiped" },
    { bookId: geo10._id, bookSlug: "geometry-10", number: 17, titleKa: "პირამიდა და მისი ელემენტები. წესიერი პირამიდა", titleEn: "Pyramid and Its Elements. Regular Pyramid" },
    { bookId: geo10._id, bookSlug: "geometry-10", number: 18, titleKa: "ცილინდრი, კონუსი და ბირთვი", titleEn: "Cylinder, Cone and Sphere" },
  ]);
  console.log(`Seeded ${chapters.length} chapters`);

  const [, alg9c2, , geo10c1, , alg11c1, , cal12c1, cal12c2] = chapters;

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
      status: "approved",
    },
    {
      bookId: cal12._id,
      bookSlug: "calculus-12",
      chapterId: cal12c1._id,
      number: "1.18",
      statementKa: "გამოთვალეთ ზღვარი: $\\lim_{x \\to 0} \\frac{\\sin(3x)}{x}$",
      statementEn: "Evaluate the limit: $\\lim_{x \\to 0} \\frac{\\sin(3x)}{x}$",
      difficulty: "hard",
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
    {
      problemId: problems[1]._id,
      authorName: "ნინო ჯავახიშვილი",
      contentKa: "ერთადერთი ფესვისთვის დისკრიმინანტი ნულის ტოლი უნდა იყოს: $D = k^2 - 36 = 0$, აქედან $k = \\pm 6$.",
      contentEn: "For a unique root the discriminant must vanish: $D = k^2 - 36 = 0$, so $k = \\pm 6$.",
      upvotes: 15,
    },
    {
      problemId: problems[3]._id,
      authorName: "ანა გელაშვილი",
      contentKa: "პირობით $x^2 - 1 = 2^3 = 8$, ანუ $x^2 = 9$, $x = \\pm 3$. ორივე ფესვი აკმაყოფილებს განსაზღვრის არეს $x^2 > 1$.",
      contentEn: "By definition $x^2 - 1 = 2^3 = 8$, so $x^2 = 9$, $x = \\pm 3$. Both roots satisfy the domain condition $x^2 > 1$.",
      upvotes: 9,
    },
    {
      problemId: problems[4]._id,
      authorName: "დათო ლომიძე",
      contentKa: "ნამრავლის წარმოებულის წესით: $f'(x) = 3x^2 \\sin(x) + x^3 \\cos(x)$.",
      contentEn: "By the product rule: $f'(x) = 3x^2 \\sin(x) + x^3 \\cos(x)$.",
      upvotes: 12,
    },
    {
      problemId: problems[5]._id,
      authorName: "გიორგი მაჭარაშვილი",
      contentKa: "ვსარგებლობთ ცნობილი ზღვარით $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$: $\\lim_{x \\to 0} \\frac{\\sin(3x)}{x} = 3 \\cdot \\lim_{x \\to 0} \\frac{\\sin(3x)}{3x} = 3$.",
      contentEn: "Using the standard limit $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$: $\\lim_{x \\to 0} \\frac{\\sin(3x)}{x} = 3 \\cdot \\lim_{x \\to 0} \\frac{\\sin(3x)}{3x} = 3$.",
      upvotes: 7,
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
    { name: "ნინო ხარაზიშვილი", email: "nino@math-guide.ge", passwordHash: tutorHash, role: "tutor" },
    { name: "გიორგი სამხარაძე", email: "giorgi@math-guide.ge", passwordHash: tutorHash, role: "tutor" },
  ]);

  await TutorProfile.insertMany([
    {
      userId: tutorUsers[0]._id,
      name: "მარიამ კაპანაძე",
      bio: "10 წლის გამოცდილების მათემატიკის მასწავლებელი.",
      subjects: ["Algebra", "Geometry", "Calculus"],
      hourlyRateGEL: 60,
      yearsExperience: 10,
      experience: "საჯარო სკოლაში მათემატიკის მასწავლებელი 10 წელია, TSU-ს მათემატიკის ფაკულტეტის მაგისტრი.",
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
      yearsExperience: 6,
      experience: "ეროვნული მათემატიკის ოლიმპიადის ორგზის ლაურეატი, 6 წელია ამზადებს მოსწავლეებს ოლიმპიადებისთვის.",
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
      yearsExperience: 5,
      experience: "5 წელია ვმუშაობ კერძო რეპეტიტორად მე-7-დან მე-11 კლასის მოსწავლეებთან, ეროვნული გამოცდებისთვის მომზადება.",
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
      yearsExperience: 3,
      experience: "ETH Zurich-ის ფიზიკა-მათემატიკის ბაკალავრი, უნივერსიტეტში teaching assistant-ის გამოცდილებით.",
      rating: 4.7,
      reviewCount: 42,
      avatarSeed: "beka",
      approved: true,
    },
    {
      // Dummy: newly registered tutor awaiting admin review
      userId: tutorUsers[4]._id,
      name: "ნინო ხარაზიშვილი",
      bio: "მათემატიკის მასწავლებელი, ვამზადებ მოსწავლეებს ეროვნული გამოცდებისთვის.",
      subjects: ["Algebra", "Geometry"],
      hourlyRateGEL: 45,
      yearsExperience: 2,
      experience: "2 წელია ვასწავლი კერძო სკოლაში, მე-9-დან მე-12 კლასამდე. ჯერ არ მაქვს ოფიციალური სერტიფიკატი.",
      rating: 0,
      reviewCount: 0,
      avatarSeed: "nino-pending",
      approved: false,
    },
    {
      // Dummy: reviewed and rejected by admin (insufficient verification)
      userId: tutorUsers[5]._id,
      name: "გიორგი სამხარაძე",
      bio: "მათემატიკის მოყვარული, ონლაინ კურსების გავლილი.",
      subjects: ["Algebra"],
      hourlyRateGEL: 30,
      yearsExperience: 1,
      experience: "ონლაინ კურსები გავლილი მაქვს (Coursera, Khan Academy), ფორმალური სწავლების გამოცდილება არ მაქვს.",
      rating: 0,
      reviewCount: 0,
      avatarSeed: "giorgi-rejected",
      approved: false,
      rejectionReason: "No verifiable teaching credentials or references provided.",
    },
  ]);
  console.log("Seeded tutors (4 verified, 1 pending, 1 rejected)");

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
