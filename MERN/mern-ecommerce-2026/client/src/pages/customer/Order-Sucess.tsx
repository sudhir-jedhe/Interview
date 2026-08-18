import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "../../components/ui/button";

const pageWrapClass =
  "flex min-h-screen items-center justify-center bg-background px-4";
const cardClass =
  "w-full max-w-xl space-y-5 border border-border bg-card p-8 text-center";
const iconWrapClass =
  "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary";
const titleClass = "text-2xl font-semibold text-foreground";
const textClass = "text-sm text-muted-foreground";
const buttonRowClass = "flex flex-col gap-3 sm:flex-row sm:justify-center";
const buttonClass = "rounded-none";

export default function CustomerOrderSuccessPage() {
  return (
    <div className={pageWrapClass}>
      <div className={cardClass}>
        <div className={iconWrapClass}>
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className={titleClass}>Order placed successfully</h1>
          <p className={textClass}>
            Your payment is complete and your order is confirmed.
          </p>
        </div>

        <div className={buttonRowClass}>
          <Button asChild className={buttonClass}>
            <Link to="/collection">Continue shopping</Link>
          </Button>

          <Button asChild variant="outline" className={buttonClass}>
            <Link to="/">Go to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
