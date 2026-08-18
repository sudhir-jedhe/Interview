import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Promo, PromoFormValues } from "@/features/admin/promo/types";
import { useEffect, useState } from "react";

const dialogContentClass =
  "max-h-[92vh] overflow-y-auto border-border bg-background sm:max-w-2xl";

const layoutClass = "grid gap-6";

const firstRowClass = "grid gap-4 md:grid-cols-2";

const secondRowClass = "grid gap-4 md:grid-cols-2";

const thirdRowClass = "grid gap-4 md:grid-cols-2";

const fieldWrapClass = "space-y-2";

const inputClass = "rounded-none";

const errorTextClass = "text-sm text-destructive";

const footerClass = "flex justify-end gap-3";

const outlineButtonClass = "rounded-none";

const primaryButtonClass = "rounded-none";

type PromoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promo: Promo | null;
  saving: boolean;
  onSaved: (values: PromoFormValues) => Promise<void>;
};

const defaultForm: PromoFormValues = {
  code: "",
  percentage: "",
  count: "",
  minimumOrderValue: "",
  startsAt: "",
  endsAt: "",
};

function toDateTimeLocal(value?: string) {
  if (!value) return "";
  const date = new Date(value);

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function PromoDialog({
  open,
  onOpenChange,
  promo,
  saving,
  onSaved,
}: PromoDialogProps) {
  const [form, setForm] = useState<PromoFormValues>(defaultForm);
  const isEditMode = !!promo;

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      return;
    }

    if (promo) {
      setForm({
        code: promo.code,
        percentage: String(promo.percentage),
        count: String(promo.count),
        minimumOrderValue: String(promo.minimumOrderValue),
        startsAt: toDateTimeLocal(promo.startsAt),
        endsAt: toDateTimeLocal(promo.endsAt),
      });

      return;
    }

    setForm(defaultForm);
  }, [open, promo]);

  function updateField<K extends keyof PromoFormValues>(
    key: K,
    value: PromoFormValues[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function submit() {
    if (
      !form.code.trim() ||
      !form.percentage.trim() ||
      !form.count.trim() ||
      !form.minimumOrderValue.trim() ||
      !form.startsAt.trim() ||
      !form.endsAt.trim()
    ) {
      return;
    }

    try {
      await onSaved({
        code: form.code.trim().toUpperCase(),
        percentage: form.percentage,
        count: form.count,
        minimumOrderValue: form.minimumOrderValue,
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Promo" : "Add Promo"}</DialogTitle>
        </DialogHeader>
        <div className={layoutClass}>
          <div className={firstRowClass}>
            <div className={fieldWrapClass}>
              <Label>Promo Code</Label>
              <Input
                className={inputClass}
                type="text"
                value={form.code}
                placeholder="SUMMARY10"
                onChange={(e) => updateField("code", e.target.value)}
              />
            </div>

            <div className={fieldWrapClass}>
              <Label>Discount Percentage</Label>
              <Input
                className={inputClass}
                type="number"
                min={"1"}
                max={"100"}
                value={form.percentage}
                placeholder="10"
                onChange={(e) => updateField("percentage", e.target.value)}
              />
            </div>
          </div>

          <div className={secondRowClass}>
            <div className={fieldWrapClass}>
              <Label>Promo Count</Label>
              <Input
                className={inputClass}
                type="number"
                min={"1"}
                value={form.count}
                placeholder="100"
                onChange={(e) => updateField("count", e.target.value)}
              />
            </div>

            <div className={fieldWrapClass}>
              <Label>Minimum Order Value</Label>
              <Input
                className={inputClass}
                type="number"
                min={"0"}
                value={form.minimumOrderValue}
                placeholder="999"
                onChange={(e) =>
                  updateField("minimumOrderValue", e.target.value)
                }
              />
            </div>
          </div>

          <div className={thirdRowClass}>
            <div className={fieldWrapClass}>
              <Label>Valid From</Label>
              <Input
                className={inputClass}
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => updateField("startsAt", e.target.value)}
              />
            </div>

            <div className={fieldWrapClass}>
              <Label>Valid Till</Label>
              <Input
                className={inputClass}
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) => updateField("endsAt", e.target.value)}
              />
            </div>
          </div>

          <div className={footerClass}>
            <Button
              className={outlineButtonClass}
              variant={"secondary"}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={saving}
              className={primaryButtonClass}
            >
              {saving
                ? "Saving..."
                : isEditMode
                  ? "Update Promo"
                  : "Create Promo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PromoDialog;
