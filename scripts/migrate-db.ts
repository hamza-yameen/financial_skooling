import { Pool } from "pg";
import "dotenv/config";

const cleanConnectionString = process.env.DATABASE_URL!.replace(/[?&]sslmode=[^&]+/, "");

const pool = new Pool({
  connectionString: cleanConnectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log("Connecting to PostgreSQL...");
  const client = await pool.connect();

  try {
    console.log("Creating enums...");
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE "Level" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'REVOKED');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    console.log("Dropping existing conflicting/outdated tables...");
    await client.query(`
      DROP TABLE IF EXISTS "Review" CASCADE;
      DROP TABLE IF EXISTS "Activity" CASCADE;
      DROP TABLE IF EXISTS "LessonProgress" CASCADE;
      DROP TABLE IF EXISTS "Enrollment" CASCADE;
      DROP TABLE IF EXISTS "CreditTransaction" CASCADE;
      DROP TABLE IF EXISTS "CreditPackage" CASCADE;
      DROP TABLE IF EXISTS "Lesson" CASCADE;
      DROP TABLE IF EXISTS "Course" CASCADE;
      DROP TABLE IF EXISTS "Category" CASCADE;
      DROP TABLE IF EXISTS "User" CASCADE;
    `);

    console.log("Creating User table...");
    await client.query(`
      CREATE TABLE "User" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "role" "Role" NOT NULL DEFAULT 'STUDENT',
        "credits" INTEGER NOT NULL DEFAULT 100,
        "avatar" TEXT,
        "bio" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );
      CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
    `);

    console.log("Creating Category table...");
    await client.query(`
      CREATE TABLE "Category" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "description" TEXT,
        "icon" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
      );
      CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
      CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
    `);

    console.log("Creating Course table...");
    await client.query(`
      CREATE TABLE "Course" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "tagline" TEXT NOT NULL,
        "summary" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        "creditsCost" INTEGER NOT NULL DEFAULT 25,
        "originalPrice" DOUBLE PRECISION,
        "currency" TEXT NOT NULL DEFAULT 'EUR',
        "level" "Level" NOT NULL DEFAULT 'BEGINNER',
        "duration" TEXT NOT NULL,
        "format" TEXT NOT NULL DEFAULT 'PDF-First + Interactive Lab',
        "published" BOOLEAN NOT NULL DEFAULT true,
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "order" INTEGER NOT NULL DEFAULT 0,
        "coverImage" TEXT,
        "badge" TEXT,
        "highlights" TEXT[] NOT NULL DEFAULT '{}',
        "whatYouWillLearn" TEXT[] NOT NULL DEFAULT '{}',
        "requirements" TEXT[] NOT NULL DEFAULT '{}',
        "categoryId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Course_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");
    `);

    console.log("Creating Lesson table...");
    await client.query(`
      CREATE TABLE "Lesson" (
        "id" TEXT NOT NULL,
        "courseId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "moduleTitle" TEXT NOT NULL DEFAULT 'Module 1',
        "order" INTEGER NOT NULL DEFAULT 0,
        "duration" TEXT NOT NULL,
        "summary" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "pdfUrl" TEXT,
        "isFreePreview" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE UNIQUE INDEX "Lesson_courseId_slug_key" ON "Lesson"("courseId", "slug");
    `);

    console.log("Creating Enrollment table...");
    await client.query(`
      CREATE TABLE "Enrollment" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "courseId" TEXT NOT NULL,
        "pricePaid" DOUBLE PRECISION NOT NULL,
        "creditsSpent" INTEGER,
        "currency" TEXT NOT NULL DEFAULT 'EUR',
        "paymentMethod" TEXT NOT NULL DEFAULT 'MOCK_CARD',
        "billingDetails" TEXT,
        "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
        "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "completedAt" TIMESTAMP(3),
        CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON "Enrollment"("userId", "courseId");
    `);

    console.log("Creating LessonProgress table...");
    await client.query(`
      CREATE TABLE "LessonProgress" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "lessonId" TEXT NOT NULL,
        "completed" BOOLEAN NOT NULL DEFAULT false,
        "completedAt" TIMESTAMP(3),
        "lastViewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE UNIQUE INDEX "LessonProgress_userId_lessonId_key" ON "LessonProgress"("userId", "lessonId");
    `);

    console.log("Creating Activity table...");
    await client.query(`
      CREATE TABLE "Activity" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "metadata" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Activity_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    console.log("Creating Review table...");
    await client.query(`
      CREATE TABLE "Review" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "courseId" TEXT NOT NULL,
        "rating" INTEGER NOT NULL DEFAULT 5,
        "comment" TEXT NOT NULL,
        "studentName" TEXT NOT NULL,
        "studentRole" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Review_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Review_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    console.log("Creating CreditTransaction table...");
    await client.query(`
      CREATE TABLE "CreditTransaction" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "amount" INTEGER NOT NULL,
        "type" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "metadata" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "CreditTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    console.log("Creating CreditPackage table...");
    await client.query(`
      CREATE TABLE "CreditPackage" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "tagline" TEXT,
        "description" TEXT,
        "credits" INTEGER NOT NULL,
        "bonusCredits" INTEGER NOT NULL DEFAULT 0,
        "price" DOUBLE PRECISION NOT NULL,
        "priceGbp" DOUBLE PRECISION,
        "currency" TEXT NOT NULL DEFAULT 'EUR',
        "badge" TEXT,
        "popular" BOOLEAN NOT NULL DEFAULT false,
        "features" TEXT[] NOT NULL DEFAULT '{}',
        "order" INTEGER NOT NULL DEFAULT 0,
        "published" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "CreditPackage_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log("🎉 All tables and constraints created successfully!");
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

