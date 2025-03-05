/*
  Warnings:

  - Added the required column `slug` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Objective` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Create temporary table for Course
CREATE TABLE "new_Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Insert existing courses with generated slugs
INSERT INTO "new_Course" ("id", "title", "slug", "description", "createdAt", "updatedAt")
SELECT 
    "id",
    "title",
    LOWER(REPLACE(REPLACE(REPLACE("title", ' ', '-'), '&', 'and'), ',', '')) || '-' || SUBSTR("id", 1, 8),
    "description",
    "createdAt",
    "updatedAt"
FROM "Course";

DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- Create temporary table for Objective
CREATE TABLE "new_Objective" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Objective_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert existing objectives with generated slugs
INSERT INTO "new_Objective" ("id", "title", "slug", "description", "order", "courseId", "createdAt", "updatedAt")
SELECT 
    "id",
    "title",
    LOWER(REPLACE(REPLACE(REPLACE("title", ' ', '-'), '&', 'and'), ',', '')) || '-' || SUBSTR("id", 1, 8),
    "description",
    "order",
    "courseId",
    "createdAt",
    "updatedAt"
FROM "Objective";

DROP TABLE "Objective";
ALTER TABLE "new_Objective" RENAME TO "Objective";
CREATE UNIQUE INDEX "Objective_slug_key" ON "Objective"("slug");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
