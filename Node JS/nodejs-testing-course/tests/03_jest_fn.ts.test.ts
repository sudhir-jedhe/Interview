// create mock function
// jest.fn()

import { processRefundRequest } from "../src/03_jest_fn";

// stripe ->

describe("processRefundRequest", () => {
  test("call payment gateway dependency with the correct payment id, amount and reason", () => {
    const createGatewayRefundMock = jest.fn().mockReturnValue({
      ok: true,
      refundId: "rfd_001",
    });

    const result = processRefundRequest(
      "order_001",
      "pay_001",
      999,
      3,
      createGatewayRefundMock,
    );

    expect(createGatewayRefundMock).toHaveBeenCalledTimes(1);

    //mock assertions
    expect(createGatewayRefundMock).toHaveBeenCalledWith(
      "pay_001",
      999,
      "Customer refund for order order_001",
    );

    expect(result).toEqual({
      status: "approved",
      message: "Refund processed successfully",
      refundId: "rfd_001",
      refundedAmount: 999,
    });
  });

  test("does not call the payment when the refund window is already closed", () => {
    const createGatewayRefundMock = jest.fn().mockReturnValue({
      ok: true,
      refundId: "rfd_002",
    });

    const result = processRefundRequest(
      "order_002",
      "pay_002",
      9999,
      11,
      createGatewayRefundMock,
    );

    expect(createGatewayRefundMock).not.toHaveBeenCalled();

    expect(result).toEqual({
      status: "rejected",
      message: "Refund window closed",
      refundId: null,
      refundedAmount: 0,
    });
  });

  //  does not call payment gateway when the refund amount is invalid

  test("returns failure when the gateway dependency reports that refund creation failed", () => {
    const createGatewayRefundMock = jest.fn().mockReturnValue({
      ok: false,
      refundId: null,
    });

    const result = processRefundRequest(
      "order_004",
      "pay_fail_004",
      9999,
      1,
      createGatewayRefundMock,
    );

    expect(createGatewayRefundMock).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      status: "failed",
      message: "Gateway refund failed",
      refundId: null,
      refundedAmount: 0,
    });
  });
});
