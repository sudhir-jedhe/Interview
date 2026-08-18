import type { CustomerProduct } from "./types";

export const BRAND_OPTIONS = [
  "Nike",
  "Adidas",
  "Puma",
  "Zara",
  "H&M",
  "Levi's",
  "Uniqlo",
  "Mango",
  "Calvin Klein",
  "Tommy Hilfiger",
];

export const SIZE_OPTIONS = ["S", "M", "L", "XL"] as const;

const COLOR_MAP: Record<string, string> = {
  black: "#111111",
  white: "#f5f5f5",
  grey: "#6b7280",
  gray: "#6b7280",
  blue: "#2563eb",
  navy: "#1e3a8a",
  red: "#dc2626",
  green: "#16a34a",
  olive: "#4d5b2b",
  yellow: "#eab308",
  beige: "#d6c2a1",
  cream: "#ede8d8",
  brown: "#7c4a2d",
  tan: "#b9936c",
  pink: "#ec4899",
  purple: "#9333ea",
  orange: "#f97316",
  maroon: "#7f1d1d",
};

export type FacetKey = "category" | "brand" | "color" | "size";

export type CustomerProductFilters = {
  category: string;
  brand: string;
  color: string;
  size: string;
};

export type ActiveFilterBadge = {
  key: FacetKey;
  label: string;
  value: string;
};

export function getCoverImage(product: CustomerProduct) {
  return (
    product.images.find((item) => item.isCover)?.url ||
    product.images[0].url ||
    ""
  );
}

export function extractSalePrice(product: CustomerProduct) {
  if (!product.salePercentage) return product.price;

  return Math.round(
    product.price - (product.price * product.salePercentage) / 100,
  );
}

export function getSwatchColor(color: string) {
  const normalized = color.trim().toLowerCase();

  return COLOR_MAP[normalized] || color;
}
