import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-checkout/store";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@clerk/react";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const wrapClass = "flex h-full min-h-0 flex-col";
const headClass = "border-b border-border bg-primary/5 px-5 py-4";
const headingTextClass =
  "flex items-center gap-2 text-left text-sm font-semibold text-foreground";
const headingIconClass = "h-4 w-4 text-primary";

const scrollClass = "min-h-0 flex-1";
const listClass = "space-y-4 p-5";

const itemClass =
  "group flex gap-4 border border-border/60 bg-card p-3 shadow-sm transition-colors hover:border-primary/40 hover:bg-secondary/30";
const imageClass = "h-24 w-20 shrink-0 border border-border object-cover";

const textWrapClass = "min-w-0 flex-1 space-y-1.5";
const brandClass =
  "text-[11px] font-medium uppercase tracking-[0.22em] text-primary";
const titleClass =
  "block line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary";
const metaClass = "text-xs text-muted-foreground";
const priceClass = "text-sm font-semibold text-foreground";

const footerRowClass = "flex flex-wrap items-center justify-between gap-3 pt-2";
const qtyWrapClass =
  "flex items-center overflow-hidden border border-border bg-background";
const qtyButtonClass = "h-9 w-9 rounded-none px-0";
const qtyIconClass = "h-3.5 w-3.5";
const qtyValueClass =
  "flex h-9 min-w-10 items-center justify-center border-x border-border px-2 text-sm font-medium";

const removeButtonClass = "h-9 border-border px-3 text-xs text-white ";
const removeIconClass = "mr-2 h-3.5 w-3.5";

const emptyWrapClass =
  "flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 text-center";

const emptyTitleClass = "text-base font-semibold text-foreground";

function CustomerCartItems() {
  const { isSignedIn } = useAuth();

  const { cart, setOpen, increase, decrease, remove } =
    useCustomerCartAndCheckoutStore((state) => state);

  return (
    <div className={wrapClass}>
      <div className={headClass}>
        <p className={headingTextClass}>
          <ShoppingCart className={headingIconClass} />
          Your Cart
        </p>
      </div>

      <ScrollArea className={scrollClass}>
        <div className={listClass}>
          {!cart.items.length ? (
            <div className={emptyWrapClass}>
              <p className={emptyTitleClass}>Your cart is empty</p>
            </div>
          ) : (
            cart.items.map((item, index) => (
              <div key={`${item.productId}-${index + 1}`} className={itemClass}>
                <img src={item.image} alt={item.title} className={imageClass} />

                <div className={textWrapClass}>
                  <p className={brandClass}>{item.brand}</p>

                  <Link
                    to={`/collection/${item.productId}`}
                    className={titleClass}
                    onClick={() => setOpen(false)}
                  >
                    {item.title}
                  </Link>
                  <p className={metaClass}>
                    {[item.color, item.size].filter(Boolean).join(" . ") ||
                      "Standard"}
                  </p>
                  <p className={priceClass}>{formatPrice(item.finalPrice)}</p>

                  <div className={footerRowClass}>
                    <div className={qtyWrapClass}>
                      <Button
                        type="button"
                        variant={"default"}
                        className={qtyButtonClass}
                        onClick={() => void decrease(item, Boolean(isSignedIn))}
                      >
                        <Minus className={qtyValueClass} />
                      </Button>
                      <span className={qtyValueClass}>{item.quantity}</span>
                      <Button
                        type="button"
                        variant={"default"}
                        className={qtyButtonClass}
                        onClick={() => void increase(item, Boolean(isSignedIn))}
                      >
                        <Plus className={qtyValueClass} />
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant={"default"}
                      className={removeButtonClass}
                      onClick={() => void remove(item, Boolean(isSignedIn))}
                    >
                      <Trash2 className={qtyValueClass} />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default CustomerCartItems;
