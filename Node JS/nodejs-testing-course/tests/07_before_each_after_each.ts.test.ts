// test 1 adds data
// test 2 runs later
// test 2 still see the old data from test 1

import {
  addLesson,
  clearLessons,
  getLessonCount,
  getLessons,
} from "../src/07_before_each_after_each";

// test pollution

// ensure every test start clean
// one test should not change another test result

// beforeEach -> before every test
// 1 -> T1 -> 2 -> T2 -> 3 -> T3 -> 4 -> T4 -> 5 -> T5

// afterEach -> after every test
// T1 -> 1 -> T2 -> 2 -> T3 -> 3 -> T4 -> 4 -> T5 -> 5

describe("before each and after each concept", () => {
  beforeEach(() => {
    clearLessons();
  });

  afterEach(() => {
    clearLessons();
  });

  test("starts with an wmpty lesson list in array in every fresh start", () => {
    expect(getLessons()).toEqual([]);

    expect(getLessonCount()).toBe(0);
  });

  test("add one lesson and increase the count", () => {
    addLesson("react js");

    expect(getLessons()).toEqual(["react js"]);

    expect(getLessonCount()).toBe(1);
  });

  test("adds multiple lessons", () => {
    addLesson("HTML");
    addLesson("CSS");
    addLesson("JS");

    expect(getLessons()).toEqual(["HTML", "CSS", "JS"]);

    expect(getLessonCount()).toBe(3);
  });
});
