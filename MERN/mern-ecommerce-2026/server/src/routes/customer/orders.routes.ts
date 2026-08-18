import { Router, type Response, type Request } from "express";
import { Types } from "mongoose";
import { Order, OrderStatus, PaymentStatus } from "../../models/Order";
import { getDbUserFromReq, requireAuth } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/envelope";
import { requireFound, requireText } from "../../utils/helpers";
import { AppError } from "../../utils/AppError";
import { Product } from "../../models/Product";
import { User } from "../../models/User";

type CustomerOrderRow = {
  _id: Types.ObjectId;
  totalItems: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paidAt?: Date | null;
  deliveredAt?: Date | null;
  returnedAt?: Date | null;
  createdAt: Date;
};

export const customerOrderRouter = Router();

customerOrderRouter.use(requireAuth);

customerOrderRouter.get(
  "/orders",
  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const orders = await Order.find({ user: dbUser._id })
      .select(
        "totalItems totalAmount paymentStatus orderStatus  paidAt deliveredAt returnedAt createdAt",
      )
      .sort({ createdAt: -1 })
      .lean<CustomerOrderRow[]>();

    res.json(
      ok({
        items: orders.map((orderItem) => ({
          _id: String(orderItem._id),
          code: String(orderItem._id).slice(-8).toUpperCase(),
          totalItems: orderItem.totalItems,
          totalAmount: orderItem.totalAmount,
          paymentStatus: orderItem.paymentStatus,
          orderStatus: orderItem.orderStatus,
          paidAt: orderItem.paidAt,
          deliveredAt: orderItem.deliveredAt,
          returnedAt: orderItem.returnedAt,
          createdAt: orderItem.createdAt,
        })),
      }),
    );
  }),
);

customerOrderRouter.patch(
  "/orders/:orderId/return",
  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const orderId = String(req.params.orderId || "").trim();

    requireText(orderId, "Order Id is required");

    const order = await Order.findOne({ _id: orderId, user: dbUser._id });

    const foundOrder = requireFound(order, "Order not found", 404);

    if (foundOrder.orderStatus !== "delivered" || !foundOrder.deliveredAt) {
      throw new AppError(400, "Only delivered orders can be returned");
    }

    const sevenDaysReturnWindowTime = 7 * 24 * 60 * 60 * 1000;

    if (
      Date.now() - new Date(foundOrder.deliveredAt).getTime() >
      sevenDaysReturnWindowTime
    ) {
      throw new AppError(400, "Return window expired");
    }

    for (const item of foundOrder.items) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } },
      );
    }

    await User.updateOne(
      { _id: dbUser._id },
      {
        $inc: { points: foundOrder.totalAmount },
      },
    );

    foundOrder.orderStatus = "returned";
    foundOrder.returnedAt = new Date();
    await foundOrder.save();

    res.json(
      ok({
        _id: String(foundOrder._id),
        orderStatus: foundOrder.orderStatus,
        returnedAt: foundOrder.returnedAt,
      }),
    );
  }),
);
