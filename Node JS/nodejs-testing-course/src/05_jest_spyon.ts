export const priceUtils = {
  formatCurrency(amount: number): string {
    return `₹${amount}`;
  },
};

export function buildPriceSummary(
  courseTitle: string,
  originalPrice: number,
  discountAmount: number,
): {
  courseTitle: string;
  originalPriceLabel: string;
  finalPriceLabel: string;
  savedAmountLabel: string;
  message: string;
} {
  if (discountAmount < 0) {
    throw new Error("Discount amount cannot be negative");
  }

  const finalPrice = originalPrice - discountAmount;

  if (finalPrice < 0) {
    throw new Error("Final price cannot be negative");
  }

  const originalPriceLabel = priceUtils.formatCurrency(originalPrice);
  const finalPriceLabel = priceUtils.formatCurrency(finalPrice);
  const savedAmountLabel = priceUtils.formatCurrency(discountAmount);

  return {
    courseTitle,
    originalPriceLabel,
    finalPriceLabel,
    savedAmountLabel,
    message: `Buy ${courseTitle} for ${finalPriceLabel} and save ${savedAmountLabel}`,
  };
}
