import { Card, CardContent } from "@/components/ui/card";
import {
  extractSalePrice,
  getCoverImage,
} from "@/features/customer/products/product-list.shared";
import type { CustomerProduct } from "@/features/customer/products/types";
import { formatPrice } from "@/lib/utils";
import { Link } from "react-router-dom";

const cardClass =
  "overflow-hidden border-border/60 bg-card/80 transition hover:border-primary/50";

const linkClass = "block";

const imageWrapClass = "aspect-[4/5] bg-muted";

const imageClass = "h-full w-full object-cover";

const noImageClass =
  "flex h-full items-center justify-center text-sm text-muted-foreground";

const contentClass = "space-y-2 p-4";

const brandClass = "text-xs uppercase tracking-[0.18em] text-muted-foreground";

const titleClass = "line-clamp-1 text-base font-semibold text-foreground";

const priceRowClass = "flex items-center gap-2";

const salePriceClass = "font-semibold text-foreground";

const originalPriceClass = "text-sm text-muted-foreground line-through";

type CustomerProductRelatedCardProps = {
  product: CustomerProduct;
};

function CustomerProductRelatedCard({
  product,
}: CustomerProductRelatedCardProps) {
  const coverImage = getCoverImage(product);
  const salePrice = extractSalePrice(product);
  const hasSale = product.salePercentage > 0;

  return (
    <Card className={cardClass}>
      <Link to={`/collection/${product._id}`} className={linkClass}>
        <div className={imageWrapClass}>
          {coverImage ? (
            <img src={coverImage} alt={product.title} className={imageClass} />
          ) : (
            <div className={noImageClass}>No Image</div>
          )}
        </div>

        <CardContent className={contentClass}>
          <p className={brandClass}>{product.brand}</p>
          <h3 className={titleClass}>{product.title}</h3>

          <div className={priceRowClass}>
            <span className={salePriceClass}>{formatPrice(salePrice)}</span>
            {hasSale ? (
              <span className={originalPriceClass}>
                {formatPrice(product.price)}
              </span>
            ) : null}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export default CustomerProductRelatedCard;
