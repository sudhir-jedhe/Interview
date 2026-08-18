const dialogClass =
  "max-h-[92vh] overflow-y-auto border-border bg-background sm:max-w-5xl";

const dialogTitle = "flex items-center gap-2";

const shellClass = "space-y-6";
const accountCardClass = "border border-border/60 bg-card/80 p-5";
const accountRowClass = "flex flex-wrap items-center justify-between gap-4";
const accountTextClass = "space-y-1";
const accountTitleClass = "text-xl font-semibold text-foreground";
const emailClass = "text-sm text-muted-foreground";
const pointsClass =
  "inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary";

const gridClass = "grid gap-6 lg:grid-cols-[1.1fr_0.9fr]";
const singleGridClass = "grid gap-6";

const sectionClass = "space-y-4";
const sectionHeaderClass = "flex items-center justify-between gap-3";
const sectionTitleClass = "text-lg font-semibold text-foreground";
const sectionTextClass = "text-sm text-muted-foreground";

const listClass = "space-y-3";
const itemClass = "space-y-3 border border-border/60 bg-card/80 p-4";
const itemTopClass = "flex flex-wrap items-start justify-between gap-3";
const itemTextClass = "space-y-1";
const defaultClass =
  "inline-flex rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary";
const nameClass = "font-medium text-foreground";
const addressClass = "text-sm text-muted-foreground";
const actionRowClass = "flex gap-2";
const buttonClass = "rounded-none";
const emptyClass = "text-sm text-muted-foreground";

const formWrapClass = "space-y-4 border border-border/60 bg-card/80 p-5";
const twoColumnClass = "grid gap-4 sm:grid-cols-2";
const threeColumnClass = "grid gap-4 sm:grid-cols-3";
const fieldClass = "space-y-2";
const inputClass = "rounded-none";
const checkboxRowClass =
  "flex items-center gap-3 border border-border bg-secondary/40 px-3 py-3 text-sm text-foreground";
const checkboxClass = "h-4 w-4 accent-[var(--primary)]";
const formActionsClass = "flex flex-wrap justify-end gap-3";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-checkout/store";
import { useCustomerProfileStore } from "@/features/customer/profile/store";
import { useUser } from "@clerk/react";
import { Pencil, Plus, Trash2 } from "lucide-react";

function CustomerProfileDialog() {
  const {
    isOpen,
    closeProfile,
    mode,
    startAdd,
    startEdit,
    updateForm,
    cancelForm,
    saveForm,
    removeAddress,
    items,
    form,
  } = useCustomerProfileStore();

  const { points } = useCustomerCartAndCheckoutStore((state) => state);

  const { user } = useUser();

  const showForm = mode !== "none";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeProfile()}>
      <DialogContent className={dialogClass}>
        <DialogHeader>
          <DialogTitle className={dialogTitle}>Profile</DialogTitle>
        </DialogHeader>

        <div className={shellClass}>
          <section className={accountCardClass}>
            <div className={accountRowClass}>
              <div className={accountTextClass}>
                <h2 className={accountTitleClass}>{user?.fullName}</h2>
                <p className={emailClass}>
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>

              <p className={pointsClass}>Points: {points}</p>
            </div>
          </section>
          <div className={showForm ? gridClass : singleGridClass}>
            <section className={sectionClass}>
              <div className={sectionHeaderClass}>
                <div>
                  <h3 className={sectionTitleClass}>Saved Addresses</h3>
                </div>

                <Button className={buttonClass} onClick={startAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Address
                </Button>
              </div>

              {!items.length ? (
                <p className={emptyClass}>No address added</p>
              ) : null}

              {items.length ? (
                <div className={listClass}>
                  {items.map((item) => (
                    <div key={item._id} className={itemClass}>
                      <div className={itemTopClass}>
                        <div className={itemTextClass}>
                          <p>{item.fullName}</p>

                          {item?.isDefault ? (
                            <span className={defaultClass}>Default</span>
                          ) : null}
                        </div>

                        <p className={addressClass}>
                          {item.address}, {item.state}, {item.postalCode}
                        </p>
                      </div>
                      <div className={actionRowClass}>
                        <Button
                          type="button"
                          variant={"default"}
                          className={buttonClass}
                          onClick={() => startEdit(item)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant={"default"}
                          className={buttonClass}
                          onClick={() => removeAddress(item._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>

            {/* form render here */}
            {showForm ? (
              <section className={formWrapClass}>
                <h3 className={sectionTitleClass}>
                  {mode === "edit" ? "Edit Address" : "Add Address"}
                </h3>

                <div className={twoColumnClass}>
                  <div className={fieldClass}>
                    <Label>Full Name</Label>
                    <Input
                      className={inputClass}
                      value={form.fullName}
                      onChange={(e) => updateForm("fullName", e.target.value)}
                      placeholder="Full Name"
                    />
                  </div>
                  <div className={fieldClass}>
                    <Label>Address</Label>
                    <Input
                      className={inputClass}
                      value={form.address}
                      onChange={(e) => updateForm("address", e.target.value)}
                      placeholder="Address"
                    />
                  </div>
                </div>
                <div className={twoColumnClass}>
                  <div className={fieldClass}>
                    <Label>State</Label>
                    <Input
                      className={inputClass}
                      value={form.state}
                      onChange={(e) => updateForm("state", e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  <div className={fieldClass}>
                    <Label>Postal Code</Label>
                    <Input
                      className={inputClass}
                      value={form.postalCode}
                      onChange={(e) => updateForm("postalCode", e.target.value)}
                      placeholder="Postal Code"
                    />
                  </div>
                </div>

                <label className={checkboxRowClass}>
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(event) =>
                      updateForm("isDefault", event.target.checked)
                    }
                    className={checkboxClass}
                  />
                  <span>Set as default address</span>
                </label>
                <div className={formActionsClass}>
                  <Button
                    type="button"
                    variant={"outline"}
                    className={buttonClass}
                    onClick={cancelForm}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    variant={"default"}
                    className={buttonClass}
                    onClick={() => void saveForm()}
                  >
                    {mode === "edit" ? "Update Address" : "Save Address"}
                  </Button>
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomerProfileDialog;
