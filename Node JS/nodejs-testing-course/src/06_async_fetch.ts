type CourseApiResponse = {
  id: number;
  title?: string;
};

export async function fetchCourseTitle(courseId: number): Promise<string> {
  if (courseId <= 0) {
    throw new Error("courseId must be greater than 0");
  }

  const response = await fetch(`https://api.example.com/courses/${courseId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }

  const data = (await response.json()) as CourseApiResponse;

  if (!data.title) {
    throw new Error("Course title is missing");
  }

  return data.title;
}
