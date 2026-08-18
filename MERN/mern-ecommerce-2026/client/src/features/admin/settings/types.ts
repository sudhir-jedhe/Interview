export type AdminBanner = {
  _id: string;
  imageUrl: string;
  imagePublicId: string;
  createdAt: string;
};

export type AdminBannersResponse = {
  items: AdminBanner[];
};
