import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomerOrdersStore } from "@/features/customer/orders/store";
import type {
  CustomerOrder,
  CustomerOrderStatus,
  CustomerPaymentStatus,
} from "@/features/customer/orders/types";
import { formatPrice } from "@/lib/utils";
import { ShoppingBasket } from "lucide-react";

const dialogClass =
  "max-h-[92vh] overflow-y-auto border-border bg-background sm:max-w-3xl";
const wrapClass = "space-y-4";
const topRowClass = "flex items-center justify-between gap-3";

const metaClass = "text-sm text-muted-foreground";

const buttonClass = "rounded-none";
const emptyClass = "text-sm text-muted-foreground";
const successBadgeClass =
  "border-primary/30 bg-primary/10 text-primary hover:bg-primary/10";

const dangerBadgeClass =
  "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/10";

const neutralBadgeClass =
  "border-border bg-secondary/60 text-foreground hover:bg-secondary/60";

function CustomerPaymentStatusBadge(props: { status: CustomerPaymentStatus }) {
  const { status } = props;
  const className =
    status === "paid"
      ? successBadgeClass
      : status === "failed"
        ? dangerBadgeClass
        : neutralBadgeClass;

  return <Badge className={className}>{status}</Badge>;
}

function CustomerOrderStatusBadge(props: { status: CustomerOrderStatus }) {
  const { status } = props;
  const className =
    status === "delivered"
      ? successBadgeClass
      : status === "returned"
        ? dangerBadgeClass
        : neutralBadgeClass;

  return <Badge className={className}>{status}</Badge>;
}

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleDateString() : "-";
}

function canReturnOrder(order: CustomerOrder) {
  if (order.orderStatus !== "delivered" || !order.deliveredAt) return false;

  const diff = Date.now() - new Date(order.deliveredAt).getTime();

  return diff <= 7 * 24 * 60 * 60 * 1000;
}

function CustomerOrdersDialog() {
  const { isOpen, closeOrders, loading, items, returnOrder, loadOrders } =
    useCustomerOrdersStore((state) => state);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeOrders()}>
      <DialogContent className={dialogClass}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBasket className="h-4 w-4" />
            My Orders
          </DialogTitle>
        </DialogHeader>
        <div className={wrapClass}>
          <div className={topRowClass}>
            <p className={metaClass}>Track your recent orders</p>
            <Button
              type="button"
              className={buttonClass}
              onClick={() => void loadOrders()}
            >
              Refresh
            </Button>
          </div>

          {loading ? <p>Loading...</p> : null}
          {!loading && !items.length ? (
            <p className={emptyClass}>No orders found</p>
          ) : null}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableHead>Order</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid at</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableHeader>

              <TableBody>
                {items.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order._id}</TableCell>
                    <TableCell>{order.totalItems}</TableCell>
                    <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell>
                      <CustomerPaymentStatusBadge
                        status={order.paymentStatus}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomerOrderStatusBadge status={order.orderStatus} />
                    </TableCell>
                    <TableCell>
                      {formatDate(order.paidAt || order.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {canReturnOrder(order) ? (
                        <Button
                          size="sm"
                          className="rounded-none"
                          onClick={() => returnOrder(order._id)}
                        >
                          Return
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {order.orderStatus === "returned" ? "Returned" : ""}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomerOrdersDialog;
