import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState } from "react";

const wrapperClass = "space-y-3";

const headerClass = "space-y-1";

const titleClass = "text-sm font-semibold text-foreground";

const descriptionClass = "text-sm text-muted-foreground";

const actionsRowClass = "flex flex-wrap items-center gap-3";

const colorInputClass = "h-11 w-16 rounded-lg p-1";

const colorsListClass = "flex flex-wrap gap-2";

const colorChipClass =
  "group inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground transition hover:bg-muted";

const colorDotClass = "h-4 w-4 rounded-full border border-black/10";

const removeIconClass =
  "h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground";

type ColorPickerProps = {
  colors: string[];
  onAdd: (color: string) => void;
  onRemove: (color: string) => void;
};

export function ColorPicker({ colors, onAdd, onRemove }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState("#111111");

  return (
    <div className={wrapperClass}>
      <div className={headerClass}>
        <h3 className={titleClass}>Colors</h3>
      </div>

      <div className={actionsRowClass}>
        <Input
          value={selectedColor}
          onChange={(event) => setSelectedColor(event.target.value)}
          type="color"
          className={colorInputClass}
        />

        <Button
          onClick={() => onAdd(selectedColor)}
          type="button"
          variant="secondary"
        >
          Add Color
        </Button>
      </div>

      <div className={colorsListClass}>
        {colors.map((colorItem) => (
          <button
            key={colorItem}
            type="button"
            onClick={() => onRemove(colorItem)}
            className={colorChipClass}
          >
            <span
              className={colorDotClass}
              style={{ backgroundColor: colorItem }}
            />
            <X className={removeIconClass} />
          </button>
        ))}
      </div>
    </div>
  );
}
