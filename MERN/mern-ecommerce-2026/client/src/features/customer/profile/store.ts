import { create } from "zustand";
import type { CustomerAddress, CustomerAddressFormValues } from "./types";
import {
  createCustomerAddresses,
  deleteCustomerAddress,
  getCustomerAddresses,
  updateCustomerAddresses,
} from "./api";
import { toast } from "sonner";

const emptyForm: CustomerAddressFormValues = {
  fullName: "",
  address: "",
  state: "",
  postalCode: "",
  isDefault: false,
};

type FormMode = "none" | "add" | "edit";

type CustomerProfileStore = {
  isOpen: boolean;
  items: CustomerAddress[];
  mode: FormMode;
  editingAddressId: string;
  form: CustomerAddressFormValues;
  openProfile: () => Promise<void>;
  closeProfile: () => void;
  loadAddresses: () => Promise<void>;
  startAdd: () => void;
  startEdit: (address: CustomerAddress) => void;
  updateForm: <K extends keyof CustomerAddressFormValues>(
    key: K,
    value: CustomerAddressFormValues[K],
  ) => void;
  cancelForm: () => void;
  saveForm: () => Promise<void>;
  removeAddress: (addressId: string) => Promise<void>;
  clear: () => void;
};

export const useCustomerProfileStore = create<CustomerProfileStore>(
  (set, get) => ({
    isOpen: false,
    items: [],
    mode: "none",
    editingAddressId: "",
    form: emptyForm,
    openProfile: async () => {
      set({ isOpen: true });
      // fetch the loadAddress method
      await get().loadAddresses();
    },
    closeProfile: () => {
      set({
        isOpen: false,
        mode: "none",
        editingAddressId: "",
        form: emptyForm,
      });
    },
    loadAddresses: async () => {
      try {
        const response = await getCustomerAddresses();
        set({ items: response?.items ?? [] });
      } catch {
        set({ items: [] });
      }
    },
    startAdd: () => {
      set({
        mode: "add",
        editingAddressId: "",
        form: emptyForm,
      });
    },
    startEdit: (currentAddress) => {
      set({
        mode: "edit",
        editingAddressId: currentAddress?._id,
        form: {
          fullName: currentAddress.fullName,
          address: currentAddress.address,
          state: currentAddress.state,
          postalCode: currentAddress.postalCode,
          isDefault: currentAddress.isDefault,
        },
      });
    },
    updateForm: (key, value) => {
      set((state) => ({
        form: {
          ...state.form,
          [key]: value,
        },
      }));
    },
    cancelForm: () => {
      set({
        mode: "none",
        editingAddressId: "",
        form: emptyForm,
      });
    },
    saveForm: async () => {
      const { mode, editingAddressId, form } = get();

      const payload = {
        fullName: form.fullName.trim(),
        address: form.address.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        isDefault: form.isDefault,
      };

      try {
        const response =
          mode === "edit"
            ? await updateCustomerAddresses(editingAddressId, payload)
            : await createCustomerAddresses(payload);

        set({
          items: response?.items ?? [],
          mode: "none",
          editingAddressId: "",
          form: emptyForm,
        });

        toast.success(mode === "edit" ? "Address updated" : "Address created");
      } catch {
        toast.error("Failed to add or update address");
      }
    },

    removeAddress: async (addressId) => {
      try {
        const response = await deleteCustomerAddress(addressId);

        set((state) => ({
          items: response?.items ?? [],
          mode: state.editingAddressId === addressId ? "none" : state.mode,
          editingAddressId:
            state.editingAddressId === addressId ? "" : state.editingAddressId,
          form: state.editingAddressId === addressId ? emptyForm : state.form,
        }));

        toast.success("Address deleted successfully");
      } catch {
        toast.error("Failed to delete address!");
      }
    },
    clear: () => {
      set({
        isOpen: false,
        items: [],
        mode: "none",
        form: emptyForm,
        editingAddressId: "",
      });
    },
  }),
);
