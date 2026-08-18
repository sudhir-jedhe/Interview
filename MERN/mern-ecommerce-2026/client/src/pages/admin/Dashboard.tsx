import { Commonloader } from "@/components/common/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboardLiteStore } from "@/features/admin/dashboard/store";
import { formatPrice } from "@/lib/utils";
import {
  Boxes,
  IndianRupee,
  Layers3,
  PackageCheck,
  RotateCcw,
} from "lucide-react";
import { useEffect } from "react";

const statsItems = [
  {
    key: "totalProducts",
    label: "Total products",
    icon: Boxes,
  },
  {
    key: "totalCategories",
    label: "Total categories",
    icon: Layers3,
  },
  {
    key: "totalSales",
    label: "Total sales",
    icon: IndianRupee,
  },
  {
    key: "totalOrders",
    label: "Total orders",
    icon: PackageCheck,
  },
  {
    key: "totalReturnedOrders",
    label: "Returned orders",
    icon: RotateCcw,
  },
] as const;

const pageWrapClass = "min-h-screen bg-background";
const contentWrapClass = "mx-auto max-w-6xl px-4 py-8";
const headerCardClass = "border-border bg-card";
const wrapClass = "space-y-4";
const titleClass = "flex items-center gap-2 text-2xl font-semibold";

const headerRowClass =
  "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between";
const subtitleClass = "text-sm text-muted-foreground";
const gridClass = "mt-6 grid gap-4 sm:grid-cols-2";
const statCardClass = "border-border bg-card";
const statContentClass = "flex items-start gap-4 p-6";
const iconWrapClass =
  "flex h-11 w-11 items-center justify-center rounded-lg bg-secondary";
const iconClass = "h-5 w-5 text-primary";
const statLabelClass = "text-sm text-muted-foreground";
const statValueClass = "mt-1 text-2xl font-semibold text-foreground";

function AdminDashboard() {
  const { loading, fetchDashboard, stats, hasLoaded } =
    useAdminDashboardLiteStore((state) => state);

  useEffect(() => {
    if (!hasLoaded) {
      void fetchDashboard();
    }
  }, [fetchDashboard, hasLoaded]);

  return (
    <div className={pageWrapClass}>
      <div className={contentWrapClass}>
        <Card className={headerCardClass}>
          <CardHeader className={wrapClass}>
            <CardTitle className={titleClass}>Dashboard</CardTitle>
          </CardHeader>
        </Card>

        {loading ? (
          <Commonloader />
        ) : (
          <div className={gridClass}>
            {statsItems.map((item) => {
              const Icon = item.icon;
              const value = stats[item.key];
              return (
                <Card key={item.key} className={statCardClass}>
                  <CardContent className={statContentClass}>
                    <div className={iconWrapClass}>
                      <Icon className={iconClass} />
                    </div>
                    <div>
                      <p className={statLabelClass}>{item.label}</p>
                      <p className={statValueClass}>
                        {item.key === "totalSales" ? formatPrice(value) : value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
