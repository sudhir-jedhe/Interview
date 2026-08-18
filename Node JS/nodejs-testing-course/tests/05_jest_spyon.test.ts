// jest.spyOn()

import { buildPriceSummary, priceUtils } from "../src/05_jest_spyon";

// jest.mock -> replace the dependency entirely
// jest.spyon -> will start by observing a real method

// starting a spy -> watch this method

describe("buildPriceSummary", () => {
  test("calls the real helper and still lets us inspect the calls", () => {
    const formatCurrencySpy = jest.spyOn(priceUtils, "formatCurrency");

    const result = buildPriceSummary("Node JS", 999, 50);

    expect(formatCurrencySpy).toHaveBeenCalledTimes(3);

    expect(formatCurrencySpy).toHaveBeenNthCalledWith(1, 999);
    expect(formatCurrencySpy).toHaveBeenNthCalledWith(2, 949);
    expect(formatCurrencySpy).toHaveBeenNthCalledWith(3, 50);

    expect(result).toEqual({
      courseTitle: "Node JS",
      originalPriceLabel: "₹999",
      finalPriceLabel: "₹949",
      savedAmountLabel: "₹50",
      message: `Buy Node JS for ₹949 and save ₹50`,
    });

    formatCurrencySpy.mockRestore();
  });

  test("does not call the helper when the function throws early for a negative discount", () => {
    const formatCurrencySpy = jest.spyOn(priceUtils, "formatCurrency");

    expect(() => buildPriceSummary("React", 1000, -50)).toThrow(
      "Discount amount cannot be negative",
    );

    expect(formatCurrencySpy).not.toHaveBeenCalled();

    formatCurrencySpy.mockRestore();
  });

  test("does not call the helper when the function throws early for a negative final price", () => {
    const formatCurrencySpy = jest.spyOn(priceUtils, "formatCurrency");

    expect(() => buildPriceSummary("React", 200, 500)).toThrow(
      "Final price cannot be negative",
    );

    expect(formatCurrencySpy).not.toHaveBeenCalled();

    formatCurrencySpy.mockRestore();
  });
});
