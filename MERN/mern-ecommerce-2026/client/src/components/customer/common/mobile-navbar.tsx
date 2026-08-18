import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Heart,
  LogIn,
  LogOut,
  Menu,
  ShoppingBag,
  ShoppingCart,
  Store,
  User,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

type CustomerMobileNavbarProps = {
  isSignedIn: boolean;
};

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const collectionsPage: NavItem = {
  label: "Collections",
  href: "/collections",
  icon: ShoppingBag,
};

const iconLink =
  "relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground/90 transition hover:bg-white/5 hover:text-foreground";

const mobileWrap = "ml-auto flex items-center gap-1 lg:hidden";

const menuButton =
  "h-11 w-11 rounded-xl border border-white/10 bg-white/5 text-foreground hover:bg-white/10";

const sheetContent =
  "w-[380px] max-w-[92vw] border-r border-border bg-background p-0 sm:w-[460px]";

const brandWrap = "flex items-center gap-3";

const brandTitle =
  "text-[25px] font-semibold tracking-[-0.02em] text-foreground";

const brandBlock = "px-5 py-6 sm:px-6";

const drawerSection = "space-y-3 px-5 py-5 sm:px-6";

const drawerTitle = "text-sm font-semibold tracking-wide text-muted-foreground";

const drawerItemsWrap = "space-y-1";

const drawerItemLink =
  "flex items-center gap-3 rounded-xl px-2 py-3 text-[18px] font-medium text-foreground transition hover:bg-white/5";

const cartBadge =
  "absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-semibold leading-5 text-black";

function DrawerSection({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <section className={drawerSection}>
      <p className={drawerTitle}>{title}</p>
      <div className={drawerItemsWrap}>
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.label} to={item.href} className={drawerItemLink}>
              <Icon className="h-4.5 w-4.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function CustomerMobileNavbar({
  isSignedIn,
}: CustomerMobileNavbarProps) {
  const mobileAccountItems: NavItem[] = isSignedIn
    ? [
        { label: "Account", href: "/account", icon: User },
        { label: "Wishlist", href: "/wishlist", icon: Heart },
        { label: "Sign Out", href: "/logout", icon: LogOut },
      ]
    : [
        {
          label: "Login",
          href: "/sign-in",
          icon: LogIn,
        },
      ];

  return (
    <div className={mobileWrap}>
      <Link to={"/cart"} className={iconLink}>
        <ShoppingCart className="h-4.5 w-4.5" />
        <span className={cartBadge}>{0}</span>
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant={"ghost"} size={"icon"} className={menuButton}>
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className={sheetContent}>
          <SheetHeader className="sr-only">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className={brandBlock}>
            <Link to={"/"} className={brandWrap}>
              <Store className="h-10 w-10" />
              <span className={brandTitle}>E-Shopify</span>
            </Link>
          </div>
          <Separator />
          <DrawerSection title="Collections" items={[collectionsPage]} />

          <Separator />
          <DrawerSection title="Account" items={mobileAccountItems} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
