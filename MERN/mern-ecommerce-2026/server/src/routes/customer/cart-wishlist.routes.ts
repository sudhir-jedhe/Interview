import { Router, type Request, type Response } from "express";
import { getDbUserFromReq, requireAuth } from "../../middleware/auth";
import { Product, ProductSize } from "../../models/Product";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/envelope";
import { Cart, CartItem } from "../../models/Cart";
import { requireFound, requireText } from "../../utils/helpers";
import { AppError } from "../../utils/AppError";
import { Wishlist } from "../../models/Wishlist";
import { Types } from "mongoose";

export const customerCartWishlistRouter = Router();

type ProductPreview = {
  _id: string;
  title: string;
  brand: string;
  price: number;
  salePercentage: number;
  images: Array<{
    url: string;
    isCover?: boolean;
  }>;
};

type CartPreviewItem = {
  product: ProductPreview | null;
  quantity: number;
  color?: string;
  size?: ProductSize;
};

type SyncCartItemInput = {
  productId?: string;
  quantity?: number;
  color?: string;
  size?: ProductSize;
};

function formatProduct(product: ProductPreview) {
  const image =
    product.images.find((item) => item.isCover)?.url ||
    product.images[0]?.url ||
    "";

  const finalPrice = product.salePercentage
    ? Math.round(product.price - (product.price * product.salePercentage) / 100)
    : product.price;

  return {
    productId: String(product._id),
    title: product.title,
    brand: product.brand,
    image,
    finalPrice,
  };
}

async function getCartResponse(userId: string) {
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "title brand price salePercentage images",
  );

  const cartItems = (cart?.items || []) as CartPreviewItem[];

  const items = cartItems.flatMap((cartItem) => {
    if (!cartItem.product) return [];

    return [
      {
        ...formatProduct(cartItem.product),
        quantity: cartItem.quantity,
        color: cartItem.color,
        size: cartItem.size,
      },
    ];
  });

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    totalQuantity,
  };
}

async function getWishlistResponse(userId: string) {
  const wishlist = await Wishlist.findOne({ user: userId }).populate(
    "products",
    "title brand price salepercentage images",
  );

  const products = (wishlist?.products || []) as Array<ProductPreview | null>;

  const items = products.flatMap((productItem) => {
    if (!productItem) return [];

    return [formatProduct(productItem)];
  });

  return { items };
}

function getSelectedvariant(
  product: { colors: string[]; sizes: ProductSize[] },
  colorValue: string,
  sizeValue: string,
) {
  let color: string | undefined;
  let size: ProductSize | undefined;

  if (product.colors.length > 0) {
    if (!colorValue) {
      throw new AppError(400, "Color is required");
    }

    if (!product.colors.includes(colorValue)) {
      throw new AppError(400, "Selected color is invalid");
    }

    color = colorValue;
  }

  if (product.sizes.length > 0) {
    if (!sizeValue) {
      throw new AppError(400, "Size is required");
    }

    if (!product.sizes.includes(sizeValue as ProductSize)) {
      throw new AppError(400, "Selected size is invalid");
    }

    size = sizeValue as ProductSize;
  }

  return { color, size };
}

function isSameCartItem(
  item: CartItem,
  productId: string,
  color?: string,
  size?: string,
) {
  return (
    String(item.product) === productId &&
    (item.color || "") === (color || "") &&
    (item.size || "") === (size || "")
  );
}

customerCartWishlistRouter.use(requireAuth);

customerCartWishlistRouter.get(
  "/cart",
  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    res.json(ok(await getCartResponse(String(dbUser._id))));
  }),
);

customerCartWishlistRouter.post(
  "/cart/items",
  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const productId = String(req.body.productId || "").trim();
    const quantity = Number(req.body.quantity || 1);
    const colorValue = String(req.body.color || "").trim();
    const sizeValue = String(req.body.size || "").trim();

    requireText(productId, "Product id is required");

    if (Number.isNaN(quantity) || quantity < 1) {
      throw new AppError(400, "Quantity must be at least 1");
    }

    const product = await Product.findOne({
      _id: productId,
      status: "active",
    });

    const foundProduct = requireFound(product, "Product not found", 404);

    const { color, size } = getSelectedvariant(
      foundProduct,
      colorValue,
      sizeValue,
    );

    if (quantity > foundProduct.stock) {
      throw new AppError(
        400,
        "Quantity is more than the stock of this product",
      );
    }

    let cart = await Cart.findOne({ user: dbUser._id });

    if (!cart) {
      cart = await Cart.create({
        user: dbUser._id,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex((item: CartItem) =>
      isSameCartItem(item, String(foundProduct._id), color, size),
    );

    if (itemIndex > 0) {
      const nextQuantity = cart.items[itemIndex].quantity + quantity;

      if (nextQuantity > foundProduct.stock) {
        throw new AppError(
          400,
          "Quantity is more than the stock of this product",
        );
      }

      cart.items[itemIndex].quantity = nextQuantity;
    } else {
      cart.items.push({
        product: foundProduct._id,
        quantity,
        color,
        size,
      });
    }

    await cart.save();

    res.json(ok(await getCartResponse(String(dbUser._id))));
  }),
);

customerCartWishlistRouter.patch(
  "/cart/items/:productId/increase",
  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const productId = String(req.params.productId || "").trim();
    const colorValue = String(req.query.color || "").trim();
    const sizeValue = String(req.query.size || "").trim();

    requireText(productId, "Product id is required");

    const cart = await Cart.findOne({ user: dbUser._id });
    const foundCart = requireFound(cart, "Cart not found", 404);

    const product = await Product.findOne({
      _id: productId,
      status: "active",
    });

    const foundProduct = requireFound(product, "Product not found", 404);

    const { color, size } = getSelectedvariant(
      foundProduct,
      colorValue,
      sizeValue,
    );

    const itemIndex = cart.items.findIndex((item: CartItem) =>
      isSameCartItem(item, String(foundProduct._id), color, size),
    );

    if (itemIndex < 0) {
      throw new AppError(400, "Cart item not found here");
    }

    if (foundCart.items[itemIndex].quantity + 1 > foundProduct.stock) {
      throw new AppError(
        400,
        "Quantity is more than the stock of this product",
      );
    }

    foundCart.items[itemIndex].quantity += 1;

    await foundCart.save();

    res.json(ok(await getCartResponse(String(dbUser._id))));
  }),
);

customerCartWishlistRouter.patch(
  "/cart/items/:productId/decrease",
  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const productId = String(req.params.productId || "").trim();
    const colorValue = String(req.query.color || "").trim();
    const sizeValue = String(req.query.size || "").trim();

    requireText(productId, "Product id is required");

    const cart = await Cart.findOne({ user: dbUser._id });
    const foundCart = requireFound(cart, "Cart not found", 404);

    const product = await Product.findOne({
      _id: productId,
      status: "active",
    });

    const foundProduct = requireFound(product, "Product not found", 404);

    const { color, size } = getSelectedvariant(
      foundProduct,
      colorValue,
      sizeValue,
    );

    const itemIndex = cart.items.findIndex((item: CartItem) =>
      isSameCartItem(item, String(foundProduct._id), color, size),
    );

    if (itemIndex < 0) {
      throw new AppError(400, "Cart item not found here");
    }

    foundCart.items[itemIndex].quantity -= 1;

    if (foundCart.items[itemIndex].quantity <= 0) {
      foundCart.items.splice(itemIndex, 1);
    }

    await foundCart.save();

    res.json(ok(await getCartResponse(String(dbUser._id))));
  }),
);

customerCartWishlistRouter.delete(
  "/cart/items/:productId",
  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const productId = String(req.params.productId || "").trim();
    const colorValue = String(req.query.color || "").trim();
    const sizeValue = String(req.query.size || "").trim();

    requireText(productId, "Product id is required");

    const cart = await Cart.findOne({ user: dbUser._id });

    if (!cart) {
      res.json(ok({ items: [], totalQuantity: 0 }));
      return;
    }

    const product = await Product.findOne({
      _id: productId,
      status: "active",
    });

    const foundProduct = requireFound(product, "Product not found", 404);

    const { color, size } = getSelectedvariant(
      foundProduct,
      colorValue,
      sizeValue,
    );

    cart.items = cart.items.filter(
      (item: CartItem) => !isSameCartItem(item, productId, color, size),
    );

    await cart.save();
    res.json(ok(await getCartResponse(String(dbUser._id))));
  }),
);

customerCartWishlistRouter.post(
  "/cart/sync",
  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const incomingItems = Array.isArray(req.body.items)
      ? (req.body.items as SyncCartItemInput[])
      : [];

    let cart = await Cart.findOne({ user: dbUser._id });

    if (!cart) {
      cart = await cart.create({
        user: dbUser._id,
        items: [],
      });
    }

    for (const rawItem of incomingItems) {
      const productId = String(rawItem.productId || "").trim();
      const quantity = Number(rawItem.quantity || 0);
      const colorValue = String(rawItem.color || "").trim();
      const sizeValue = String(rawItem.size || "").trim();

      if (!productId || Number.isNaN(quantity) || quantity < 1) {
        continue;
      }

      const product = await Product.findOne({
        _id: productId,
        status: "active",
      });

      if (!product || product.stock < 1) {
        continue;
      }

      try {
        const { color, size } = getSelectedvariant(
          product,
          colorValue,
          sizeValue,
        );

        const itemIndex = cart.items.findIndex((item: CartItem) =>
          isSameCartItem(item, String(product._id), color, size),
        );

        if (itemIndex >= 0) {
          const nextQuantity = cart.items[itemIndex].quantity + quantity;

          cart.items[itemIndex].quantity = Math.min(
            nextQuantity,
            product.stock,
          );
        } else {
          cart.items.push({
            product: product._id,
            quantity: Math.min(quantity, product.stock),
            color,
            size,
          });
        }
      } catch {
        continue;
      }

      await cart.save();

      res.json(ok(await getCartResponse(String(dbUser._id))));
    }
  }),
);

customerCartWishlistRouter.get(
  "/wishlist",
  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    res.json(ok(await getWishlistResponse(String(dbUser._id))));
  }),
);

customerCartWishlistRouter.post(
  "/wishlist/items",
  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const productId = String(req.body.productId || "").trim();

    requireText(productId, "Product id is required");

    const product = await Product.findOne({
      _id: productId,
      status: "active",
    });

    const foundProduct = requireFound(product, "Product not found", 404);

    let wishlist = await Wishlist.findOne({ user: dbUser._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: dbUser._id,
        products: [],
      });
    }

    const exists = wishlist.products.some(
      (item: Types.ObjectId) => String(item) === String(foundProduct._id),
    );

    if (!exists) {
      wishlist.products.push(foundProduct._id);
      await wishlist.save();
    }

    res.json(ok(await getWishlistResponse(String(dbUser._id))));
  }),
);

customerCartWishlistRouter.delete(
  "/wishlist/items/:productId",
  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const productId = String(req.params.productId || "").trim();

    requireText(productId, "Product id is required");

    let wishlist = await Wishlist.findOne({ user: dbUser._id });

    if (!wishlist) {
      res.json(ok({ items: [] }));
      return;
    }

    wishlist.products = wishlist.products.filter(
      (item: Types.ObjectId) => String(item) !== productId,
    );

    await wishlist.save();

    res.json(ok(await getWishlistResponse(String(dbUser._id))));
  }),
);
