import { Commonloader } from "@/components/common/Loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCustomerHomeStore } from "@/features/customer/home/store";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, Grid2X2, TicketPercent } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const pageWrapClass =
  "min-h-screen bg-background antialiased selection:bg-primary/20";
const contentContainerClass = "mx-auto max-w-7xl px-4 py-0 sm:px-6 lg:px-8";
const sectionStackClass = "space-y-18";

const sectionHeadClass = "mb-10 space-y-3";
const sectionEyebrowClass =
  "text-xs font-bold uppercase tracking-[0.3em] text-primary/80";
const sectionTitleClass =
  "text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl";

const bannerGridClass = "grid gap-6 lg:grid-cols-[1.6fr_1fr]";
const bannerMainCardClass =
  "group relative overflow-hidden rounded-[2rem] border border-border/30 bg-card shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5";
const bannerMainImageClass =
  "h-[540px] w-full object-cover transition-all duration-700 group-hover:scale-105";

const bannerSideGridClass = "grid gap-6 sm:grid-cols-2 lg:grid-cols-1";
const bannerSideCardClass =
  "group overflow-hidden rounded-[2rem] border border-border/40 bg-card shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5";
const bannerSideImageClass =
  "h-[258px] w-full object-cover transition-all duration-700 group-hover:scale-105";

const categoryGridClass = "grid gap-6 sm:grid-cols-2 xl:grid-cols-4";
const categoryCardClass =
  "group relative overflow-hidden rounded-[2rem] border border-border/40 bg-card p-1.5 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5";
const categoryContentClass =
  "h-full space-y-5 rounded-[1.6rem] bg-gradient-to-br from-background/50 to-muted/30 p-8 backdrop-blur-sm transition-colors duration-500 group-hover:bg-background/80";
const categoryIconWrapClass =
  "flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary ring-1 ring-primary/10 transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary/10";
const categoryIconClass = "h-6 w-6";
const categoryTextWrapClass = "space-y-2";
const categoryTitleClass = "text-xl font-medium tracking-tight text-foreground";
const categoryLinkClass =
  "inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors group-hover:text-primary/80";
const categoryArrowIconClass =
  "h-4 w-4 transition-transform group-hover:translate-x-1";

const couponGridClass = "grid gap-6 md:grid-cols-2 xl:grid-cols-4";
const couponCardClass =
  "group relative overflow-hidden rounded-[2rem] border border-dashed border-primary/20 bg-primary/[0.02] transition-all duration-300 hover:border-primary/40 hover:bg-primary/[0.04]";
const couponContentClass = "space-y-6 p-8";
const couponHeadClass = "flex items-start justify-between gap-4";
const couponIconWrapClass =
  "flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-500 group-hover:rotate-12";
const couponIconClass = "h-6 w-6";
const couponCodeClass = "text-2xl font-bold tracking-widest text-primary";

const couponBadgeClass =
  "border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/20";
const couponCodeWrapClass = "space-y-1 pt-2";
const couponCodeLabelClass =
  "text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground";

const productGridClass = "grid gap-6 sm:grid-cols-2 xl:grid-cols-4";
const productCardClass =
  "group flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/40 bg-card p-2 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5";
const productContentClass =
  "flex flex-1 flex-col justify-between space-y-5 p-4";
const productImageWrapClass =
  "relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted/30";
const productImageClass =
  "h-full w-full object-cover transition-all duration-700 group-hover:scale-105";
const productInfoWrapClass = "space-y-3";
const productBrandRowClass = "flex items-center justify-between gap-3";
const productBrandClass =
  "text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const productTitleClass =
  "line-clamp-2 text-base font-medium leading-relaxed text-foreground transition-colors group-hover:text-primary";
const productPriceRowClass = "flex items-end justify-between gap-3 pt-2";
const productPriceClass =
  "text-xl font-semibold tracking-tight text-foreground";
const productOriginalPriceClass =
  "text-sm font-medium text-muted-foreground line-through decoration-muted-foreground/50";
const productViewClass =
  "inline-flex h-8 items-center justify-center rounded-full bg-primary/5 px-4 text-xs font-semibold text-primary opacity-0 transition-all duration-300 group-hover:bg-primary/10 group-hover:opacity-100";

export function StoreHome() {
  const { data, loading, loadHome } = useCustomerHomeStore((state) => state);

  useEffect(() => {
    void loadHome();
  }, [loadHome]);

  if (loading) {
    return <Commonloader />;
  }

  const mainBanner = data.banners[0] || null;
  const sideBanners = data.banners.slice(1, 3);

  return (
    <div className={pageWrapClass}>
      <div className={contentContainerClass}>
        <div className={sectionStackClass}>
          <section>
            <div className={bannerGridClass}>
              <Card className={bannerMainCardClass}>
                <img
                  src={mainBanner.imageUrl}
                  alt="Feature Image"
                  className={bannerMainImageClass}
                />
              </Card>

              <div className={bannerSideGridClass}>
                {sideBanners.map((item) => (
                  <Card key={item._id} className={bannerSideCardClass}>
                    <img
                      src={item.imageUrl}
                      alt="Feature Image"
                      className={bannerSideImageClass}
                    />
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {!!data.categories.length ? (
            <section>
              <div className={sectionHeadClass}>
                <p className={sectionEyebrowClass}>Categories</p>
                <h2 className={sectionTitleClass}>Browse by collection</h2>
              </div>

              <div className={categoryGridClass}>
                {data.categories.slice(0, 4).map((categoryItem) => (
                  <Link to={`/collections?category=${categoryItem._id}`}>
                    <Card className={categoryCardClass}>
                      <CardContent className={categoryContentClass}>
                        <div className={categoryIconWrapClass}>
                          <Grid2X2 className={categoryIconClass} />
                        </div>
                        <div className={categoryTextWrapClass}>
                          <p className={categoryTitleClass}>
                            {categoryItem.name}
                          </p>
                        </div>

                        <span className={categoryLinkClass}>
                          View Collection
                          <ArrowRight className={categoryArrowIconClass} />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {!!data.coupons.length ? (
            <section>
              <div className={sectionHeadClass}>
                <p className={sectionEyebrowClass}>Offers</p>
                <h2 className={sectionTitleClass}>Live Coupon Cards</h2>
              </div>

              <div className={couponGridClass}>
                {data.coupons.slice(0, 4).map((coupon) => (
                  <Card className={couponCardClass}>
                    <CardContent className={couponContentClass}>
                      <div className={couponIconWrapClass}>
                        <TicketPercent className={couponIconClass} />
                      </div>
                      <Badge className={couponBadgeClass}>
                        {coupon.percentage}% OFF
                      </Badge>

                      <div className={couponCodeWrapClass}>
                        <p className={couponCodeLabelClass}>Coupon Code</p>
                        <p className={couponCodeClass}>{coupon.code}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ) : null}

          {!!data.recentProducts.length ? (
            <section>
              <div className={sectionHeadClass}>
                <p className={sectionEyebrowClass}>Latest</p>
                <h2 className={sectionTitleClass}>Recent Products</h2>
              </div>
              <div className={productGridClass}>
                {data.recentProducts.slice(0, 4).map((product) => (
                  <Link to={`/collection/${product._id}`} key={product._id}>
                    <Card className={productCardClass}>
                      <CardContent className={productContentClass}>
                        <div className={productImageWrapClass}>
                          <img
                            src={product.image}
                            alt={product.title}
                            className={productImageClass}
                          />
                        </div>
                        <div className={productInfoWrapClass}>
                          <div className={productBrandRowClass}>
                            <p className={productBrandClass}>{product.brand}</p>
                          </div>
                          <p className={productTitleClass}>{product.title}</p>
                        </div>

                        <div className={productPriceRowClass}>
                          <div>
                            <p className={productPriceClass}>
                              {formatPrice(product.finalPrice)}
                            </p>
                            {product.salePercentage > 0 ? (
                              <p className={productOriginalPriceClass}>
                                {formatPrice(product.price)}
                              </p>
                            ) : null}
                          </div>

                          <span className={productViewClass}>View</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
