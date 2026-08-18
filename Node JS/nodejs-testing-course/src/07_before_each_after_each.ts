let savedLessons: string[] = [];

export function addLesson(title: string): void {
  if (title === "") {
    return;
  }

  savedLessons.push(title);
}

export function getLessons(): string[] {
  return [...savedLessons];
}

export function getLessonCount(): number {
  return savedLessons.length;
}

export function clearLessons(): void {
  savedLessons = [];
}
