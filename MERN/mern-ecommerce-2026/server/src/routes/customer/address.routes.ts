import { Router, type Request, type Response } from "express";
import { getDbUserFromReq, requireAuth } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../models/User";
import { requireFound, requireText } from "../../utils/helpers";
import { ok } from "../../utils/envelope";
import { AppError } from "../../utils/AppError";

type AddressItem = {
  _id?: string;
  fullName: string;
  address: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
};

function mapAddress(item: AddressItem) {
  return {
    _id: String(item._id || ""),
    fullName: item.fullName,
    address: item.address,
    state: item.state,
    postalCode: item.postalCode,
    isDefault: item.isDefault,
  };
}

export const customerAddressRouter = Router();

customerAddressRouter.use(requireAuth);

customerAddressRouter.get(
  "/addresses",

  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const user = await User.findById(dbUser._id);

    const foundUser = requireFound(user, "User not found", 404);

    const addresses = (foundUser.addresses || []) as AddressItem[];

    const items = [...addresses]
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
      .map(mapAddress);

    res.json(ok({ items }));
  }),
);

customerAddressRouter.post(
  "/addresses",

  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const fullName = String(req.body.fullName || "").trim();
    const address = String(req.body.address || "").trim();
    const state = String(req.body.state || "").trim();
    const postalCode = String(req.body.postalCode || "").trim();

    requireText(fullName, "Full name is required");
    requireText(address, "Address is required");
    requireText(state, "State is required");
    requireText(postalCode, "postal code is required");

    const user = await User.findById(dbUser._id);

    const foundUser = requireFound(user, "User not found", 404);

    const addresses = (foundUser.addresses || []) as AddressItem[];

    const shouldMarkAsDefault =
      req.body.isDefault === true || addresses.length === 0;

    if (shouldMarkAsDefault) {
      addresses.forEach((item) => {
        item.isDefault = false;
      });
    }

    addresses.push({
      fullName,
      address,
      state,
      postalCode,
      isDefault: shouldMarkAsDefault,
    });

    await foundUser.save();
    const items = [...addresses]
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
      .map(mapAddress);

    res.json(ok({ items }));
  }),
);

customerAddressRouter.patch(
  "/addresses/:addressId",

  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const addressId = String(req.params.addressId || "").trim();

    requireText(addressId, "Address id is required");

    const fullName = String(req.body.fullName || "").trim();
    const address = String(req.body.address || "").trim();
    const state = String(req.body.state || "").trim();
    const postalCode = String(req.body.postalCode || "").trim();

    requireText(fullName, "Full name is required");
    requireText(address, "Address is required");
    requireText(state, "State is required");
    requireText(postalCode, "postal code is required");

    const user = await User.findById(dbUser._id);

    const foundUser = requireFound(user, "User not found", 404);

    const addresses = (foundUser.addresses || []) as AddressItem[];

    const getAddressTheUserWantToEdit = addresses.find(
      (currentAddress) => String(currentAddress._id) === addressId,
    );

    if (!getAddressTheUserWantToEdit) {
      throw new AppError(404, "Address not found");
    }

    const shouldMarkAsDefault =
      req.body.isDefault === true || addresses.length === 0;

    if (shouldMarkAsDefault) {
      addresses.forEach((item) => {
        item.isDefault = false;
      });
    }

    getAddressTheUserWantToEdit.fullName = fullName;
    getAddressTheUserWantToEdit.address = address;
    getAddressTheUserWantToEdit.state = state;
    getAddressTheUserWantToEdit.postalCode = postalCode;

    if (shouldMarkAsDefault) {
      getAddressTheUserWantToEdit.isDefault = true;
    }

    await foundUser.save();

    const items = [...(foundUser.addresses as AddressItem[])]
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
      .map(mapAddress);

    res.json(ok({ items }));
  }),
);

customerAddressRouter.delete(
  "/addresses/:addressId",

  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const addressId = String(req.params.addressId || "").trim();

    requireText(addressId, "Address id is required");

    const user = await User.findById(dbUser._id);

    const foundUser = requireFound(user, "User not found", 404);

    const addresses = (foundUser.addresses || []) as AddressItem[];

    const addressToBeDeletedIndex = addresses.findIndex(
      (currentAddress) => String(currentAddress._id) === addressId,
    );

    if (addressToBeDeletedIndex < 0) {
      throw new AppError(404, "Address not found");
    }

    const wasDefault = addresses[addressToBeDeletedIndex].isDefault;

    addresses.splice(addressToBeDeletedIndex, 1);

    if (
      wasDefault &&
      addresses.length > 0 &&
      !addresses.some((address) => address.isDefault)
    ) {
      addresses[0].isDefault = true;
    }

    await foundUser.save();

    const items = [...(foundUser.addresses as AddressItem[])]
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
      .map(mapAddress);

    res.json(ok({ items }));
  }),
);
