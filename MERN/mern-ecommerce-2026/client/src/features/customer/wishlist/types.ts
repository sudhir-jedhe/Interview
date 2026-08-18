export type CustomerWishlistItem = {
  productId: string;
  title: string;
  brand: string;
  image: string;
  finalPrice: number;
};

export type CustomerWishlistResponse = {
  items: CustomerWishlistItem[];
};

export type AddCustomerWishlistItemBody = {
  productId: string;
};
