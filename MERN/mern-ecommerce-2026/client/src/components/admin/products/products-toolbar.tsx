import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

const wrapperClass =
  "flex flex-col gap-3 md:flex-row md:items-center md:justify-between";

const searchWrapClass = "relative w-full md:w-80";

const searchIconClass =
  "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground";

const searchInputClass = "pl-9";

const actionsWrapClass = "flex flex-col gap-3 sm:flex-row";

const addIconClass = "mr-2 h-4 w-4";

type ProductsToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onManageCategories: () => void;
  onAddProduct: () => void;
};

export function ProductToolbar({
  search,
  onSearchChange,
  onManageCategories,
  onAddProduct,
}: ProductsToolbarProps) {
  return (
    <div className={wrapperClass}>
      <div className={searchWrapClass}>
        <Search className={searchIconClass} />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products"
          className={searchInputClass}
        />
      </div>

      <div className={actionsWrapClass}>
        <Button onClick={onManageCategories} variant="outline">
          Manage Category
        </Button>
        <Button onClick={onAddProduct}>
          <Plus className={addIconClass} />
          Add Product
        </Button>
      </div>
    </div>
  );
}
