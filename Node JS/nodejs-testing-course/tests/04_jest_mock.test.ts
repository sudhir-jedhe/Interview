// jest.mock()

import { buildStudentSummary } from "../src/04_jest_mock";
import { getLevelLabel } from "../src/04_level_label";

// jest.fn() -> you pass a function directly as an argument

// jest.mock() -> your file imports dependency from another file

jest.mock("../src/04_level_label.ts");

// vv imp -> this imported function becomes a jest mock at runtime

// cast it
const mockGetLevelLabel = getLevelLabel as jest.MockedFunction<
  typeof getLevelLabel
>;

// mockReturnedValue
//mockreset

describe("buildStudentSummary", () => {
  beforeEach(() => {
    // reset it before every test so each test starts clean
    mockGetLevelLabel.mockReset();
  });

  test("uses the mocked imported function and returns the mocked value", () => {
    // here we can decide what ur mocked function should return
    // even if ur actual functions is not returning that value
    // this test is not receiving expert as value from this mockGetLevelLabel

    mockGetLevelLabel.mockReturnValue("Expert");

    const result = buildStudentSummary("Sangam", 65);

    expect(mockGetLevelLabel).toHaveBeenCalledTimes(1);

    expect(mockGetLevelLabel).toHaveBeenCalledWith(65);

    expect(result).toEqual({
      studentName: "Sangam",
      score: 65,
      level: "Expert",
      message: `Sangam is currently at Expert level`,
    });
  });
});
