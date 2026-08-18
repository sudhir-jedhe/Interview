type ProductStatus = "available" | "outofstock" | "refund";

type StatusInfo = {
  label: string;
  canBuy: boolean;
};

const productStatusInfo = {
  available: {
    label: "label1",
    canBuy: true,
  },
  outofstock: {
    label: "out of stock",
    canBuy: false,
  },
  refund: {
    label: "dsffs",
    canBuy: true,
  },
} satisfies Record<ProductStatus, StatusInfo>;
