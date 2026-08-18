import { create } from "zustand";
import type {
  AddCustomerCartItemBody,
  AppliedPromo,
  CheckoutAddressOption,
  CustomerCartItemIdentifier,
  CustomerCartResponse,
  GuestCartItem,
  SyncCustomerCartBody,
} from "./types";
import {
  addCustomerCartItem,
  applyCustomerPromo,
  confirmCheckout,
  createCheckoutSession,
  decreaseCustomerCartItem,
  getCheckoutData,
  increaseCustomerCartItem,
  payWithPointsCheckout,
  removeCustomerCartItem,
  syncCustomerCart,
} from "./api";
import { toast } from "sonner";

type AddCartItemInput = AddCustomerCartItemBody & {
  title: string;
  brand: string;
  image: string;
  finalPrice: number;
};

type RazorpayArgs = {
  isSignedIn: boolean;
  name: string;
  email: string;
  onSuccess: () => void;
};

type PointsArgs = {
  isSignedIn: boolean;
  onSuccess: () => void;
};

type CustomerCartAndCheckoutStore = {
  cart: CustomerCartResponse;
  isOpen: boolean;
  loading: boolean;
  addresses: CheckoutAddressOption[];
  selectedAddressId: string;
  promoInput: string;
  appliedPromo: AppliedPromo | null;
  points: number;
  promoLoading: boolean;
  checkoutLoading: boolean;
  pointsCheckoutLoading: boolean;
  setOpen: (value: boolean) => void;
  setCart: (cart: CustomerCartResponse) => void;
  loadCart: (isSignedIn: boolean) => Promise<void>;
  addItem: (item: AddCartItemInput, isSignedIn: boolean) => Promise<void>;
  increase: (
    item: CustomerCartItemIdentifier,
    isSignedIn: boolean,
  ) => Promise<void>;
  decrease: (
    item: CustomerCartItemIdentifier,
    isSignedIn: boolean,
  ) => Promise<void>;
  remove: (
    item: CustomerCartItemIdentifier,
    isSignedIn: boolean,
  ) => Promise<void>;
  setPromoInput: (value: string) => void;
  clearPromo: () => void;
  applyPromo: () => Promise<void>;
  startRazorpayCheckout: (args: RazorpayArgs) => Promise<void>;
  startPointsCheckout: (args: PointsArgs) => Promise<void>;
  clear: () => void;
};

const emptyCart: CustomerCartResponse = {
  items: [],
  totalQuantity: 0,
};

const defaultUiState = {
  loading: false,
  addresses: [] as CheckoutAddressOption[],
  selectedAddressId: "",
  promoInput: "",
  appliedPromo: null as AppliedPromo | null,
  points: 0,
  promoLoading: false,
  checkoutLoading: false,
  pointsCheckoutLoading: false,
};

function waitForRazorpay(timeOut = 4000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const start = Date.now();

    const interval = window.setInterval(() => {
      if (window.Razorpay) {
        window.clearInterval(interval);
        resolve();
        return;
      }

      if (Date.now() - start > timeOut) {
        window.clearInterval(interval);
        reject(new Error("Razorpay not loaded"));
      }
    }, 30);
  });
}

// helpers

const GUEST_CART_KEY = "guest_cart_items";

function readGuestItems(): GuestCartItem[] {
  if (typeof window === undefined) return [];

  try {
    const items = JSON.parse(
      window.localStorage.getItem(GUEST_CART_KEY) || "[]",
    );

    return Array.isArray(items)
      ? items.filter(
          (currentItem) =>
            currentItem?.productId && Number(currentItem?.quantity) > 0,
        )
      : [];
  } catch {
    return [];
  }
}

function writeGuestItems(items: GuestCartItem[]) {
  if (typeof window === undefined) return;

  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

function clearGuestItems() {
  if (typeof window === undefined) return;
  window.localStorage.removeItem(GUEST_CART_KEY);
}

function getGuestResponse(): CustomerCartResponse {
  const items = readGuestItems();

  return {
    items,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

function getGuestSyncPayload(): SyncCustomerCartBody {
  return {
    items: readGuestItems().map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
    })),
  };
}

function isSameItem(
  item: CustomerCartItemIdentifier,
  target: CustomerCartItemIdentifier,
) {
  return (
    item.productId === target.productId &&
    (item.color || "") === (target.color || "") &&
    (item.size || "") === (target.size || "")
  );
}

function addGuestItem(item: Omit<GuestCartItem, "quantity">) {
  const items = readGuestItems();
  const index = items.findIndex((cartItem) => isSameItem(cartItem, item));

  if (index >= 0) {
    items[index] = {
      ...items[index],
      quantity: items[index].quantity + 1,
    };
  } else {
    items.push({
      ...item,
      quantity: 1,
    });
  }

  writeGuestItems(items);

  return getGuestResponse();
}

function increaseGuestItem(item: CustomerCartItemIdentifier) {
  const items = readGuestItems().map((cartItem) =>
    isSameItem(cartItem, item)
      ? { ...cartItem, quantity: cartItem.quantity + 1 }
      : cartItem,
  );

  writeGuestItems(items);

  return getGuestResponse();
}

function decreaseGuestItem(item: CustomerCartItemIdentifier) {
  const items = readGuestItems()
    .map((cartItem) =>
      isSameItem(cartItem, item)
        ? { ...cartItem, quantity: cartItem.quantity - 1 }
        : cartItem,
    )
    .filter((cartItem) => cartItem.quantity > 0);

  writeGuestItems(items);

  return getGuestResponse();
}

function removeGuestItem(item: CustomerCartItemIdentifier) {
  const items = readGuestItems().filter(
    (cartItem) => !isSameItem(cartItem, item),
  );

  writeGuestItems(items);
  return getGuestResponse();
}

export const useCustomerCartAndCheckoutStore =
  create<CustomerCartAndCheckoutStore>((set, get) => ({
    cart: emptyCart,
    isOpen: false,
    ...defaultUiState,
    setOpen: (value) => set({ isOpen: value }),
    setCart: (cart) => set({ cart }),
    loadCart: async (isSignedIn) => {
      try {
        set({ loading: true });
        if (isSignedIn) {
          const guestPayload = getGuestSyncPayload();

          if (guestPayload.items.length) {
            const syncedCart = await syncCustomerCart(guestPayload);

            clearGuestItems();
            set({ cart: syncedCart ?? emptyCart });
          }

          const response = await getCheckoutData();
          const cart = response?.cart ?? emptyCart;
          const addresses = response?.addresses?.items ?? [];
          const defaultAddress =
            addresses.find((item) => item.isDefault) || addresses[0] || null;

          set({
            loading: false,
            cart,
            addresses,
            selectedAddressId: defaultAddress?._id ?? "",
            points: response?.points ?? 0,
          });

          return;
        }

        set({
          loading: false,
          cart: getGuestResponse(),
          addresses: [],
          selectedAddressId: "",
          points: 0,
        });
      } catch {
        set({
          loading: false,
          cart: isSignedIn ? emptyCart : getGuestResponse(),
        });
      }
    },
    addItem: async (item, isSignedIn) => {
      try {
        if (isSignedIn) {
          const response = await addCustomerCartItem({
            productId: item.productId,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
          });

          set({ cart: response ?? emptyCart });
        } else {
          set({
            cart: addGuestItem({
              productId: item.productId,
              title: item.title,
              brand: item.brand,
              color: item.color,
              image: item.image,
              finalPrice: item.finalPrice,
              size: item.size,
            }),
          });
        }

        toast.success("Added to cart");
      } catch {
        toast.error("Failed to add in cart");
      }
    },
    increase: async (item, isSignedIn) => {
      try {
        const response = isSignedIn
          ? await increaseCustomerCartItem(item)
          : increaseGuestItem(item);

        set({ cart: response ?? emptyCart });
        toast.success("Cart updated");
      } catch {
        toast.error("Failed to update cart");
      }
    },
    decrease: async (item, isSignedIn) => {
      try {
        const response = isSignedIn
          ? await decreaseCustomerCartItem(item)
          : decreaseGuestItem(item);

        set({ cart: response ?? emptyCart });
        toast.success("Cart updated");
      } catch {
        toast.error("Failed to update cart");
      }
    },
    remove: async (item, isSignedIn) => {
      try {
        const response = isSignedIn
          ? await removeCustomerCartItem(item)
          : removeGuestItem(item);

        set({ cart: response ?? emptyCart });
        toast.success("Cart item removed");
      } catch {
        toast.error("Failed to remove from cart");
      }
    },
    setPromoInput: (value) => set({ promoInput: value }),
    clearPromo: () => set({ promoInput: "", appliedPromo: null }),
    applyPromo: async () => {
      const { promoInput, cart } = get();

      const subtotal = cart.items.reduce(
        (sum, item) => sum + item.finalPrice * item.quantity,
        0,
      );

      if (!promoInput.trim()) {
        set({ appliedPromo: null });
        return;
      }

      try {
        set({ promoLoading: true });
        const response = await applyCustomerPromo({
          code: promoInput.trim(),
          orderValue: subtotal,
        });

        if (!response?.code) {
          set({ appliedPromo: null, promoLoading: false });
          return;
        }

        set({
          appliedPromo: response,
          promoInput: response.code,
          promoLoading: false,
        });

        toast.success("Promo successfully applied");
      } catch {
        set({ appliedPromo: null, promoLoading: false });
        toast.success("Unable to apply promo");
      }
    },
    clear: () =>
      set({
        cart: emptyCart,
        isOpen: false,
        ...defaultUiState,
      }),

    startRazorpayCheckout: async ({ isSignedIn, name, email, onSuccess }) => {
      const { selectedAddressId, appliedPromo, cart } = get();

      if (!isSignedIn) {
        toast.error("sign in to checkout");
        return;
      }

      if (!selectedAddressId) {
        toast.error("Add a default address from profile section");
        return;
      }

      if (!cart.items.length) {
        toast.error("Your cart is empty");
        return;
      }

      try {
        set({ checkoutLoading: true });

        const session = await createCheckoutSession({
          addressId: selectedAddressId,
          promoCode: appliedPromo?.code || undefined,
        });

        if (
          !session.razorpay?.keyId ||
          !session.razorpay.orderId ||
          !session.order._id
        ) {
          throw new Error("Invalid checkout session");
        }

        //load the razorpay instance

        await waitForRazorpay();

        if (!window.Razorpay) {
          throw new Error("Razorpay not loaded");
        }
        const razorpay = new window.Razorpay({
          key: session.razorpay.keyId,
          amount: session.razorpay.amount,
          currency: session.razorpay.currency,
          order_id: session.razorpay.orderId,
          name: "Monster E-commerce",
          description: "Order payment",
          prefill: { name, email },
          handler: async (response) => {
            try {
              const confirmed = await confirmCheckout({
                orderId: session.order._id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });
              if (!confirmed._id) {
                throw new Error("Order confirmation failed");
              }

              set({
                cart: emptyCart,
                isOpen: false,
                ...defaultUiState,
              });

              toast.success("Payment successfull");
              onSuccess();
            } catch {
              set({ checkoutLoading: false });
              toast.error("Payment confirmation failed");
            }
          },

          modal: {
            ondismiss: () => set({ checkoutLoading: false }),
          },
        });

        razorpay.open();
      } catch {
        set({ checkoutLoading: false });
        toast.error("Unable to start checkout");
      }
    },

    startPointsCheckout: async ({ isSignedIn, onSuccess }) => {
      const { selectedAddressId, appliedPromo, points, cart } = get();

      const subTotal = cart.items.reduce(
        (sum, item) => sum + item.finalPrice * item.quantity,
        0,
      );

      const discountAmount = appliedPromo
        ? Math.round((subTotal * appliedPromo.percentage) / 100)
        : 0;

      const totalAmount = Math.max(subTotal - discountAmount, 0);

      if (!isSignedIn) {
        toast.error("sign in to checkout");
        return;
      }

      if (!selectedAddressId) {
        toast.error("Add a default address from profile section");
        return;
      }

      if (!cart.items.length) {
        toast.error("Your cart is empty");
        return;
      }

      if (points < totalAmount) {
        toast.error("Not enough points");
        return;
      }

      try {
        set({ pointsCheckoutLoading: true });

        const response = await payWithPointsCheckout({
          addressId: selectedAddressId,
          promoCode: appliedPromo?.code || undefined,
        });

        if (!response._id) {
          throw new Error("Unable to place order");
        }

        set({
          cart: emptyCart,
          isOpen: false,
          ...defaultUiState,
          points: response.totalPoints ?? Math.max(points - totalAmount, 0),
        });

        toast.success("Order places");
        onSuccess();
      } catch {
        set({ pointsCheckoutLoading: false });
        toast.success("failed to place order with points");
      }
    },
  }));
