declare module "products/ProductList" {
  import type { ComponentType } from "react";

  const productList: ComponentType;

  export default productList;
}

declare module "cart/Cart" {
  import type { ComponentType } from "react";

  const cart: ComponentType;

  export default cart;
}
