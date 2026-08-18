export type ProductSort = "recent" | "price-low" | "price-high";

export type ProductSize = "S" | "M" | "L" | "XL";

export type ProductCategory = {
  _id: string;
  name: string;
};

export type ProductImage = {
  url: string;
  publicId: string;
  isCover: boolean;
};

export type CustomerProduct = {
  _id: string;
  title: string;
  description: string;
  category: ProductCategory;
  brand: string;
  stock: number;
  images: ProductImage[];
  colors: string[];
  sizes: ProductSize[];
  price: number;
  salePercentage: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export type GetCustomerProductsParams = {
  category?: string;
  brand?: string;
  color?: string;
  size?: string;
  sort?: ProductSort;
};

export type CustomerProductDetailsResponse = {
  product: CustomerProduct;
  relatedProducts: CustomerProduct[];
};
