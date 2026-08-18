export const CART_ADD_EVENT = "microshop:cart:add";

export const CART_STORAGE_KEY = "microshop-cart";

export type CartAddDetail = {
  id: string;
  name: string;
  price: number;
};

export type CartItem = CartAddDetail & {
  quantity: number;
};

export function readCartItems(): CartItem[] {
  const raw = sessionStorage.getItem(CART_STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as CartItem[];
}

export function writeCartItems(items: CartItem[]) {
  sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function addProductToCart(product: CartAddDetail) {
  const items = readCartItems();
  const existing = items.find((item) => item.id === product.id);

  const next = existing
    ? items.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    : [...items, { ...product, quantity: 1 }];

  writeCartItems(next);

  window.dispatchEvent(new CustomEvent(CART_ADD_EVENT, { detail: product }));
}
