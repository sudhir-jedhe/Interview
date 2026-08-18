export type CustomerAddress = {
  _id: string;
  fullName: string;
  address: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
};

export type CustomerAddressResponse = {
  items: CustomerAddress[];
};

export type CustomerAddressFormValues = {
  fullName: string;
  address: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
};
