type Product = {
  name: string;
  price: number;
  inStock: boolean;
};

const laptopProduct: Product = {
  name: "name",
  price: 567,
  inStock: true,
};

function getProductValue(product: Product, key: "name"): string;
function getProductValue(product: Product, key: "price"): number;
function getProductValue(product: Product, key: "inStock"): boolean;

function getProductValue(
  product: Product,
  key: "name" | "price" | "inStock",
): string | number | boolean {
  return product[key];
}

const productName = getProductValue(laptopProduct, "name");
console.log(productName.toUpperCase());

const productPrice = getProductValue(laptopProduct, "price");
console.log(productPrice.toFixed(2));
