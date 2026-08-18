// matcher
// expect(res).toBe()
// matcher -> language of comparison in jest

import {
  buildCourseMeta,
  getCoursePriceLabel,
} from "../src/02_matchers_and_edge_cases";

// toBe
// toEqual
// toContain
// toHaveLength
// toBeNull and toBeUndefined

describe("getCoursePriceLabel", () => {
  test("returns 'free' when the price is 0", () => {
    const result = getCoursePriceLabel(0);

    expect(result).toBe("Free");
  });

  // write one test case when the price will be greater than 0

  test("returns invalid when the price is in negative", () => {
    const result = getCoursePriceLabel(-30);
    expect(result).toBe("Invalid Price");
  });

  test("returns null if the price input is null", () => {
    const result = getCoursePriceLabel(null);

    expect(result).toBeNull();
  });
});

describe("buildCourseMeta", () => {
  test("returns the full object for valid inputs", () => {
    const res = buildCourseMeta("Node Testing", ["Intro", "Mocks"]);

    expect(res).toEqual({
      title: "Node Testing",
      lessons: ["Intro", "Mocks"],
      totalLessons: 2,
      firstLesson: "Intro",
      hasLessons: true,
      errors: [],
    });
  });

  test("stores all lessons and let us check array contains with toContain", () => {
    const res = buildCourseMeta("Sangam", ["React", "Next js"]);

    // vv useful
    expect(res.lessons).toContain("Next js");
  });

  test("check array size", () => {
    const res = buildCourseMeta("Sangam", ["React", "Next js"]);

    expect(res.lessons).toHaveLength(2);

    expect(res.errors).toHaveLength(0);
  });

  test("returns hasLessons as true when lessons exists", () => {
    const res = buildCourseMeta("Sangam", []);

    expect(res.hasLessons).toBe(false);
  });

  test("sets firstlesson as undefined when the lessons array is empty", () => {
    const res = buildCourseMeta("Sangam", []);

    expect(res.firstLesson).toBeUndefined();
  });

  test("adds an error and empty lessons array when lessons are null", () => {
    const result = buildCourseMeta("Testing", null);

    expect(result.lessons).toEqual([]);

    expect(result.totalLessons).toBe(0);

    expect(result.firstLesson).toBeUndefined();

    expect(result.errors).toContain("lessons are required");
  });

  test("does not include a lesson that was never provided", () => {
    const res = buildCourseMeta("Unit Testing", ["JEST", "RTL"]);

    expect(res.lessons).not.toContain("VITEST");
  });
});
