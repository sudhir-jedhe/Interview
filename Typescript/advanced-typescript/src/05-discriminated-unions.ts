type ProductState =
  | {
      status: "available";
      name: string;
      price: number;
    }
  | {
      status: "outofstock";
      name: string;
      restoreDate: string;
    }
  | {
      status: "discontinued";
      name: string;
      reason: string;
    };

function printProductInfo(product: ProductState): void {
  if (product.status === "available") {
    return;
  }
  if (product.status === "outofstock") {
    return;
  }
}

const product1: ProductState = {
  status: "available",
  name: "name",
  price: 67,
};

const product2: ProductState = {
  status: "outofstock",
  name: "name",
  restoreDate: "67",
};

type abc = {
  status: "available" | "outofstock" | "discontiuned";
  name: string;
  price?: number;
  restoredate?: string;
  reason: string;
};
