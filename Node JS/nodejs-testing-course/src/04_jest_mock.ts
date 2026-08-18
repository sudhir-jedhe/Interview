import { getLevelLabel } from "./04_level_label";

export function buildStudentSummary(
  studentName: string,
  score: number,
): {
  studentName: string;
  score: number;
  level: string;
  message: string;
} {
  const level = getLevelLabel(score);

  return {
    studentName,
    score,
    level,
    message: `${studentName} is currently at ${level} level`,
  };
}
