type PaymentStatus = "pending" | "paid" | "failed" | "refuneded";

function getPaymentMessage(status: PaymentStatus): string {
  switch (status) {
    case "pending":
      return "pending";

    case "paid":
      return "paid";

    case "failed":
      return "failed";

    case "refuneded":
      return "refund";

    default: {
      const unreachableStatus: never = status;
      return unreachableStatus;
    }
  }
}
