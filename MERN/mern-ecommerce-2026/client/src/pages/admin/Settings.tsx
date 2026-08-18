import AdminSettingsBannersTable from "@/components/admin/settings/admin-settings-banner-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAdminSettings } from "@/features/admin/settings/use-admin-settings";
import { ImagePlus } from "lucide-react";

const pageWrapClass = "min-h-screen bg-background";
const contentContainerClass = "mx-auto max-w-7xl px-4 py-8";
const uploadPanelClass = "grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]";

const cardClass = "border-border/60 bg-card/80";
const cardTitleClass = "text-2xl font-semibold text-foreground";
const cardContentClass = "space-y-6";

const uploadBoxClass =
  "flex min-h-[220px] flex-col items-center justify-center gap-4 border border-dashed border-border bg-background/40 p-6 text-center";
const uploadIconWrapClass =
  "flex h-14 w-14 items-center justify-center border border-border bg-secondary/50";
const uploadIconClass = "h-6 w-6 text-primary";
const uploadTextWrapClass = "space-y-2";
const uploadHeadingClass = "text-base font-medium text-foreground";
const uploadSubtextClass = "text-sm text-muted-foreground";
const fileInputClass = "rounded-none";
const fileCountClass = "text-xs text-muted-foreground";
const fullButtonClass = "w-full rounded-none";
const buttonClass = "rounded-none";

const errorBoxClass =
  "border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground";
const emptyStateClass =
  "border border-border bg-background/40 p-6 text-sm text-muted-foreground";
const tableHeaderClass = "flex flex-row items-center justify-between gap-3";

function AdminSettings() {
  const {
    items,
    files,
    setFiles,
    fileCountLabel,
    loading,
    setLoading,
    refreshBanners,
    handleUpload,
    uploading,
  } = useAdminSettings();

  return (
    <div className={pageWrapClass}>
      <div className={contentContainerClass}>
        <div className={uploadPanelClass}>
          <Card className={cardClass}>
            <CardHeader>
              <CardTitle className={cardTitleClass}>Banner Settings</CardTitle>
            </CardHeader>

            <CardContent className={cardContentClass}>
              <div className={uploadBoxClass}>
                <div className={uploadIconWrapClass}>
                  <ImagePlus className={uploadIconClass} />
                </div>

                <div className={uploadTextWrapClass}>
                  <p className={uploadHeadingClass}>Upload Homepage Banners</p>
                </div>

                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  className={fileInputClass}
                  onChange={(event) =>
                    setFiles(Array.from(event.target.files || []))
                  }
                />

                <p className={fileCountClass}>{fileCountLabel}</p>

                <Button
                  className={fullButtonClass}
                  disabled={uploading}
                  onClick={() => handleUpload()}
                >
                  {uploading ? "Uploading..." : "Upload Banners"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className={cardClass}>
            <CardHeader className={tableHeaderClass}>
              <CardTitle className={cardTitleClass}>
                Current Homepage Banners
              </CardTitle>
              <Button className={buttonClass} onClick={() => refreshBanners()}>
                Refresh
              </Button>
            </CardHeader>

            <CardContent className={cardContentClass}>
              {loading ? null : !items.length ? (
                <div className={emptyStateClass}>No banners uploaded yet !</div>
              ) : (
                <AdminSettingsBannersTable items={items} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
