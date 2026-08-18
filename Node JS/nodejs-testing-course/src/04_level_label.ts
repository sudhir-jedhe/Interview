export function getLevelLabel(score: number): string {
  if (score >= 80) {
    return "Advanced";
  }

  if (score >= 50) {
    return "Intermediate";
  }

  return "Beginner";
}
