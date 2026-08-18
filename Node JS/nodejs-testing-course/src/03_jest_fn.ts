type CreateGatewayRefund = (
  paymentId: string,
  amount: number,
  reason: string,
) => {
  ok: boolean;
  refundId: string | null;
};

export function processRefundRequest(
  orderId: string,
  paymentId: string,
  amount: number,
  daysSincePurchase: number,
  createGatewayRefund: CreateGatewayRefund,
): {
  status: "approved" | "rejected" | "failed";
  message: string;
  refundId: string | null;
  refundedAmount: number;
} {
  if (daysSincePurchase > 7) {
    return {
      status: "rejected",
      message: "Refund window closed",
      refundId: null,
      refundedAmount: 0,
    };
  }

  if (amount <= 0) {
    return {
      status: "failed",
      message: "Invalid refund amount",
      refundId: null,
      refundedAmount: 0,
    };
  }

  const reason = `Customer refund for order ${orderId}`;
  const gatewayResult = createGatewayRefund(paymentId, amount, reason);

  if (!gatewayResult.ok) {
    return {
      status: "failed",
      message: "Gateway refund failed",
      refundId: null,
      refundedAmount: 0,
    };
  }

  return {
    status: "approved",
    message: "Refund processed successfully",
    refundId: gatewayResult.refundId,
    refundedAmount: amount,
  };
}
