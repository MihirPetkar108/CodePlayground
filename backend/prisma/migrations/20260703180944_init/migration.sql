-- CreateEnum
CREATE TYPE "Languages" AS ENUM ('java', 'cpp', 'rust', 'js', 'py');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('processing', 'success', 'failure');

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "language" "Languages" NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'processing',
    "output" TEXT,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);
