import mongoose, { HydratedDocument, model, Schema, Types } from "mongoose";

export type Wishlist = {
  user: Types.ObjectId;
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
};

export type WishlistDocument = HydratedDocument<Wishlist>;

const wishlistSchema = new Schema<Wishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export const Wishlist =
  mongoose.models.Wishlist || model<Wishlist>("Wishlist", wishlistSchema);
