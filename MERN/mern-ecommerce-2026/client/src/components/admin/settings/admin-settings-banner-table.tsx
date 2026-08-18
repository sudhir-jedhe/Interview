import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminBanner } from "@/features/admin/settings/types";

const tableWrapClass = "overflow-x-auto";
const previewWrapClass =
  "h-16 w-28 overflow-hidden border border-border bg-muted";
const imageClass = "h-full w-full object-cover";
const publicIdTextClass =
  "max-w-[360px] truncate text-sm text-muted-foreground";

function formatDateTime(value: string) {
  return new Date(value).toLocaleDateString();
}

function AdminSettingsBannersTable({ items }: { items: AdminBanner[] }) {
  return (
    <div className={tableWrapClass}>
      <Table>
        <TableHeader>
          <TableHead>Preview</TableHead>
          <TableHead>Public ID</TableHead>
          <TableHead>Created At</TableHead>
        </TableHeader>

        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <div className={previewWrapClass}>
                  <img
                    src={item.imageUrl}
                    alt="banner"
                    className={imageClass}
                  />
                </div>
              </TableCell>

              <TableCell>
                <p className={publicIdTextClass}>{item.imagePublicId}</p>
              </TableCell>
              <TableCell>
                <p>{formatDateTime(item.createdAt)}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminSettingsBannersTable;
