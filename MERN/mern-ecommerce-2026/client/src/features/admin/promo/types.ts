export type Promo = {
  _id: string;
  code: string;
  percentage: number;
  count: number;
  minimumOrderValue: number;
  startsAt: string;
  endsAt: string;
  createdAt?: string;
};

export type AdminPromosResponse = {
  items: Promo[];
};

export type PromoFormValues = {
  code: string;
  percentage: string;
  count: string;
  minimumOrderValue: string;
  startsAt: string;
  endsAt: string;
};
