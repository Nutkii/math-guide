import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set");

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const Book = (await import("../models/Book")).default;
  const Chapter = (await import("../models/Chapter")).default;

  const alg9 = await Book.findOne({ slug: "algebra-9" });
  const geo10 = await Book.findOne({ slug: "geometry-10" });
  if (!alg9 || !geo10) throw new Error("algebra-9 or geometry-10 book not found — run npm run seed first");

  const newChapters = [
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
  ];

  let inserted = 0;
  let skipped = 0;
  for (const ch of newChapters) {
    const exists = await Chapter.findOne({ bookId: ch.bookId, number: ch.number });
    if (exists) {
      skipped++;
      continue;
    }
    await Chapter.create(ch);
    inserted++;
  }

  console.log(`Inserted ${inserted} new chapters, skipped ${skipped} already present.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
