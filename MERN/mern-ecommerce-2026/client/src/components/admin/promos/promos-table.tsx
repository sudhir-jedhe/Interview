import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Promo } from "@/features/admin/promo/types";
import { Pencil, Trash2 } from "lucide-react";

type PromoTableProps = {
  promos: Promo[];
  loading: boolean;
  deletingPromoId: string;
  onEdit: (promo: Promo) => void;
  onDelete: (promoId: string) => Promise<void>;
};

const wrapClass = "overflow-x-auto rounded-xl border border-border";

const tableHeaderClass = "bg-muted/50";

const loadingCellClass = "h-28 text-center text-muted-foreground";

const codeCellClass = "font-medium text-foreground";

const rightWrapClass = "flex justify-end";

const iconButtonClass = "rounded-none";

const deleteButtonClass =
  "rounded-none text-destructive hover:text-destructive";

function formatDateTime(value: string) {
  return new Date(value).toLocaleDateString();
}

function PromoTable({
  promos,
  loading,
  onDelete,
  onEdit,
  deletingPromoId,
}: PromoTableProps) {
  return (
    <div className={wrapClass}>
      <Table>
        <TableHeader className={tableHeaderClass}>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Min Order</TableHead>
            <TableHead>valid From</TableHead>
            <TableHead>Valid Till</TableHead>
            <TableHead className="w-[80px] text-right">Edit</TableHead>
            <TableHead className="w-[80px] text-right">Delete</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className={loadingCellClass}>
                Loading Promos...
              </TableCell>
            </TableRow>
          ) : promos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className={loadingCellClass}>
                No Promos found
              </TableCell>
            </TableRow>
          ) : (
            promos.map((promo) => (
              <TableRow key={promo._id}>
                <TableCell className={codeCellClass}>{promo.code}</TableCell>
                <TableCell>{promo.percentage}%</TableCell>
                <TableCell>{promo.count}</TableCell>
                <TableCell>{promo.minimumOrderValue}</TableCell>
                <TableCell>{formatDateTime(promo.startsAt)}</TableCell>
                <TableCell>{formatDateTime(promo.endsAt)}</TableCell>
                <TableCell>
                  <div className={rightWrapClass}>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      className={iconButtonClass}
                      onClick={() => onEdit(promo)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={rightWrapClass}>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      className={deleteButtonClass}
                      disabled={deletingPromoId === promo._id}
                      onClick={() => onDelete(promo._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default PromoTable;
