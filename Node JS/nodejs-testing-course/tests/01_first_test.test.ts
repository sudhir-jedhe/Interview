// describe -> to use to group related tests
// it -> define one test case
// test -> does same job as it

import {
  getCourseAccessMessage,
  getEnrollmentMessage,
} from "../src/01_first_test";

describe("getEnrollmentMessage", () => {
  test("returns 'Sold Out' when seat count is 0", () => {
    const result = getEnrollmentMessage(0);

    expect(result).toBe("Sold Out");
  });

  test("returns 'Only 1 seat left' when seat count is 1", () => {
    const result = getEnrollmentMessage(1);

    expect(result).toBe("Only 1 seat left");
  });

  test("returns more than 1 seats left when seat count is greater than 1", () => {
    const result = getEnrollmentMessage(11);

    expect(result).toBe("11 seats left");
  });
});

describe("getCourseAccessMessage", () => {
  test("returns 'Access Granted' when the user is paid", () => {
    const res = getCourseAccessMessage(true);

    expect(res).toBe("Access Granted");
  });

  test("returns 'Payment Required' when the user is not paid", () => {
    const res = getCourseAccessMessage(false);

    expect(res).toBe("Payment Required");
  });
});
