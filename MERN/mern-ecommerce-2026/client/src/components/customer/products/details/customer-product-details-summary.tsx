import { Badge } from "@/components/ui/badge";
import { extractSalePrice } from "@/features/customer/products/product-list.shared";
import type {
  CustomerProduct,
  ProductSize,
} from "@/features/customer/products/types";
import { formatPrice } from "@/lib/utils";
import CustomerProductOptionsGroup from "./customer-product-options-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";

const summaryWrapClass = "space-y-6";

const badgesWrapClass = "flex flex-wrap items-center gap-2";

const categoryBadgeClass =
  "border-border bg-secondary text-secondary-foreground hover:bg-secondary";

const stockBadgeClass =
  "border-primary/30 bg-primary/15 text-primary hover:bg-primary/15";

const metaGridClass = "grid gap-3 text-sm sm:grid-cols-2";

const metaItemClass = "space-y-1";

const metaLabelClass = "block text-muted-foreground";

const metaValueClass = "block font-medium text-foreground";

const priceBlockClass = "space-y-3";

const priceRowClass = "flex flex-wrap items-center gap-3";

const salePriceClass = "text-3xl font-semibold text-foreground";

const originalPriceClass = "text-lg text-muted-foreground line-through";

const descriptionClass =
  "whitespace-pre-line text-sm leading-7 text-muted-foreground";

const actionButtonsClass = "flex flex-col gap-3 sm:flex-row";

const primaryButtonClass = "rounded-none sm:flex-1";

const secondaryButtonClass = "rounded-none sm:flex-1";

const iconClass = "mr-2 h-4 w-4";

type CustomerProductDetailsSummaryProps = {
  product: CustomerProduct;
  selectedColor: string;
  selectedSize: string;
  setSelectedColor: (value: string) => void;
  setSelectedSize: (value: ProductSize) => void;
  toggleWishlist: () => Promise<void>;
  isWishlistActive: boolean;
  onAddToCart: () => Promise<void>;
};

function CustomerProductDetailsSummary({
  product,
  selectedColor,
  selectedSize,
  setSelectedColor,
  setSelectedSize,
  toggleWishlist,
  isWishlistActive,
  onAddToCart,
}: CustomerProductDetailsSummaryProps) {
  const salePrice = extractSalePrice(product);
  const hasSale = product.salePercentage > 0;

  return (
    <section className={summaryWrapClass}>
      <div className={badgesWrapClass}>
        <Badge className={categoryBadgeClass}>{product?.category?.name}</Badge>

        {product?.stock > 0 ? (
          <Badge className={stockBadgeClass}>
            {product.stock <= 5 ? `Only ${product.stock} left` : "In stock"}
          </Badge>
        ) : (
          <Badge variant={"destructive"}>Out of stock</Badge>
        )}

        {hasSale ? (
          <Badge className={stockBadgeClass}>
            {product.salePercentage}% OFF
          </Badge>
        ) : null}
      </div>

      <div className={metaGridClass}>
        <p className={metaItemClass}>
          <span className={metaLabelClass}>Brand</span>
          <span className={metaValueClass}>{product?.brand}</span>
        </p>

        <p className={metaItemClass}>
          <span className={metaLabelClass}>Category</span>
          <span className={metaValueClass}>{product?.category.name}</span>
        </p>
      </div>

      <div className={priceBlockClass}>
        <div className={priceRowClass}>
          <span className={salePriceClass}>{formatPrice(salePrice)}</span>
          {hasSale ? (
            <span className={originalPriceClass}>
              {formatPrice(product.price)}
            </span>
          ) : null}
        </div>

        {product.description ? <p>{product.description}</p> : null}
      </div>

      {product.colors.length ? (
        <CustomerProductOptionsGroup
          values={product.colors}
          selectedValue={selectedColor}
          onSelect={setSelectedColor}
          variant="color"
        />
      ) : null}

      {product.colors.length ? (
        <CustomerProductOptionsGroup
          values={product.sizes}
          selectedValue={selectedSize}
          onSelect={setSelectedSize}
          variant="size"
        />
      ) : null}

      <Separator />

      <div className={actionButtonsClass}>
        <Button
          type="button"
          className={primaryButtonClass}
          disabled={product.stock < 1}
          onClick={() => void onAddToCart()}
        >
          <ShoppingBag className={iconClass} />
          Add to Cart
        </Button>

        <Button
          type="button"
          variant="outline"
          className={secondaryButtonClass}
          onClick={() => void toggleWishlist()}
        >
          <Heart
            className={`${iconClass} ${isWishlistActive ? "fill-current" : ""}`}
          />
          {isWishlistActive ? "Remove from Wishlist" : "Save to Wishlist"}
        </Button>
      </div>
    </section>
  );
}

export default CustomerProductDetailsSummary;
