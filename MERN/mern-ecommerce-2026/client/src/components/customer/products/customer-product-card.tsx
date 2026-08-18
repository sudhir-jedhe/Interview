import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  extractSalePrice,
  getCoverImage,
  getSwatchColor,
} from "@/features/customer/products/product-list.shared";
import type { CustomerProduct } from "@/features/customer/products/types";
import { formatPrice } from "@/lib/utils";
import { Link } from "react-router-dom";

const cardClass =
  "overflow-hidden border-border/60 bg-card/80 transition hover:border-primary/50";

const linkClass = "block";

const imageWrapClass = "relative aspect-[4/5] bg-muted";

const imageClass =
  "h-full w-full object-cover transition duration-300 hover:scale-[1.02]";

const noImageClass =
  "flex h-full items-center justify-center text-sm text-muted-foreground";

const saleBadgeClass =
  "absolute left-3 top-3 border-primary/30 bg-secondary text-primary hover:bg-secondary";

const contentClass = "space-y-4 p-4";

const detailsWrapClass = "space-y-1";

const brandClass = "text-xs uppercase tracking-[0.18em] text-muted-foreground";

const titleClass = "line-clamp-1 text-base font-semibold text-foreground";

const categoryClass = "text-sm text-muted-foreground";

const priceRowClass = "flex items-center gap-2";

const salePriceClass = "text-base font-semibold text-foreground";

const originalPriceClass = "text-sm text-muted-foreground line-through";

const colorsWrapClass = "flex items-center gap-2";

const colorSwatchClass = "h-4 w-4 border border-border";

const extraColorsClass = "text-xs text-muted-foreground";

const footerClass = "flex items-center justify-between gap-3";

const buttonClass = "rounded-none px-4";

type CustomerProductCardProps = {
  product: CustomerProduct;
};

function CustomerProductCard({ product }: CustomerProductCardProps) {
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

          {hasSale ? (
            <Badge className={saleBadgeClass}>
              {product.salePercentage}% OFF
            </Badge>
          ) : null}
        </div>

        <CardContent className={contentClass}>
          <div className={detailsWrapClass}>
            <p className={brandClass}>{product.brand}</p>
            <p className={titleClass}>{product.title}</p>
            <p className={categoryClass}>{product.category?.name}</p>
          </div>

          <div className={priceRowClass}>
            <span>{formatPrice(salePrice)}</span>
            {hasSale ? (
              <span className={originalPriceClass}>
                {formatPrice(product.price)}
              </span>
            ) : null}
          </div>
          {product.colors.length ? (
            <div className={colorsWrapClass}>
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color}
                  className={colorSwatchClass}
                  style={{ backgroundColor: getSwatchColor(color) }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 ? (
                <span className={extraColorsClass}>
                  +{product.colors.length - 4}
                </span>
              ) : null}
            </div>
          ) : null}

          <div className={footerClass}>
            <Button className={buttonClass}>View Details</Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export default CustomerProductCard;
