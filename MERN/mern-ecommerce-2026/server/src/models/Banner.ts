import mongoose, { HydratedDocument, model, Schema, Types } from "mongoose";

export type BannerItem = {
  imageUrl: string;
  imagePublicId: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type BannerDocument = HydratedDocument<BannerItem>;

const bannerSchema = new Schema<BannerItem>(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    imagePublicId: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Banner =
  mongoose.models.Banner || model<BannerItem>("Banner", bannerSchema);
