import { getSwatchColor } from "@/features/customer/products/product-list.shared";
import type { ProductSize } from "@/features/customer/products/types";

const wrapClass = "flex flex-wrap gap-2";

const baseButtonClass =
  "inline-flex items-center justify-center gap-2 border px-4 py-2 text-sm font-medium transition";

const activeButtonClass =
  "border-primary bg-primary/15 text-primary ring-2 ring-primary/20";

const inactiveButtonClass =
  "border-border bg-secondary text-secondary-foreground hover:border-primary/40";

const sizeButtonClass = "min-w-12 rounded-none";

const colorButtonClass = "rounded-none";

const swatchClass = "h-4 w-4 border border-border";

type CustomerProductOptionsGroupProps = {
  values: string[];
  selectedValue: string;
  onSelect: (value: ProductSize) => void;
  variant: "color" | "size";
};

function CustomerProductOptionsGroup({
  values,
  variant,
  selectedValue,
  onSelect,
}: CustomerProductOptionsGroupProps) {
  return (
    <div role="group" className={wrapClass}>
      {values.map((value) => {
        const isActive = selectedValue === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value as ProductSize)}
            className={`${baseButtonClass} ${
              variant === "color" ? colorButtonClass : sizeButtonClass
            } ${isActive ? activeButtonClass : inactiveButtonClass}`}
          >
            {variant === "color" ? (
              <>
                <span
                  className={swatchClass}
                  style={{ backgroundColor: getSwatchColor(value) }}
                />
              </>
            ) : (
              value
            )}
          </button>
        );
      })}
    </div>
  );
}

export default CustomerProductOptionsGroup;
