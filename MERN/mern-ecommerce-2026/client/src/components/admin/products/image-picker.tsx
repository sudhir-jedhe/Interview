import { Button } from "@/components/ui/button";
import type { ProductImage } from "@/features/admin/products/types";
import { ImagePlus, Star, X } from "lucide-react";
import { useEffect, useMemo } from "react";

const wrapperClass = "space-y-4";

const headerClass = "space-y-1";

const titleClass = "text-sm font-semibold text-foreground";

const descriptionClass = "text-sm text-muted-foreground";

const uploadLabelClass =
  "flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center transition hover:bg-muted";

const uploadIconClass = "mb-2 h-5 w-5 text-muted-foreground";

const uploadTitleClass = "text-sm font-medium text-foreground";

const uploadSubtitleClass = "mt-1 text-xs text-muted-foreground";

const hiddenInputClass = "hidden";

const sectionClass = "space-y-2";

const sectionTitleClass = "text-sm font-medium text-foreground";

const gridClass = "grid grid-cols-2 gap-3 md:grid-cols-4";

const imageCardClass =
  "overflow-hidden rounded-xl border border-border bg-card";

const imageClass = "h-28 w-full object-cover";

const imageActionsClass = "flex items-center justify-between gap-2 p-2";

const starIconClass = "mr-1 h-3.5 w-3.5";

const removeIconClass = "h-4 w-4";

const fileNameClass = "p-2 text-xs text-muted-foreground";

type ImagePickerProps = {
  existingImages: ProductImage[];
  newFiles: File[];
  coverImagePublicId: string;
  onFilesAdd: (files: FileList | null) => void;
  onExistingRemove: (publicId: string) => void;
  onCoverImageChange: (publicId: string) => void;
};

export function ImagePicker({
  existingImages,
  newFiles,
  coverImagePublicId,
  onFilesAdd,
  onExistingRemove,
  onCoverImageChange,
}: ImagePickerProps) {
  const previewUrls = useMemo(
    () => newFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [newFiles],
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previewUrls]);

  return (
    <div className={wrapperClass}>
      <div className={headerClass}>
        <h3 className={titleClass}>Images</h3>
      </div>
      <label className={uploadLabelClass}>
        <ImagePlus className={uploadIconClass} />
        <span className={uploadTitleClass}>Upload Product Images</span>

        <input
          type="file"
          accept="image/*"
          multiple
          className={hiddenInputClass}
          onChange={(event) => onFilesAdd(event.target.files)}
        />
      </label>

      {existingImages.length > 0 ? (
        <div className={sectionClass}>
          <p className={sectionTitleClass}>Existing Images</p>

          <div className={gridClass}>
            {existingImages.map((image) => {
              const isCover = coverImagePublicId === image.publicId;

              return (
                <div key={image.publicId} className={imageCardClass}>
                  <img src={image.url} alt="product" className={imageClass} />

                  <div className={imageActionsClass}>
                    <Button
                      type="button"
                      size="sm"
                      variant={isCover ? "default" : "secondary"}
                      onClick={() => onCoverImageChange(image.publicId)}
                    >
                      <Star className={starIconClass} />
                      {isCover ? "Cover" : "Set Cover"}
                    </Button>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => onExistingRemove(image.publicId)}
                    >
                      <X className={removeIconClass} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {previewUrls.length > 0 ? (
        <div className={sectionClass}>
          <p className={sectionTitleClass}>New Uploads</p>
          <div className={gridClass}>
            {previewUrls.map((previewItem, index) => (
              <div
                key={`${previewItem.file.name}-${index}`}
                className={imageCardClass}
              >
                <img
                  src={previewItem.url}
                  alt={previewItem.file.name}
                  className={imageClass}
                />
                <div className={fileNameClass}>{previewItem.file.name}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
