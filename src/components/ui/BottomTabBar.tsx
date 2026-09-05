"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Receipt, TrendingUp, User } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { classNames } from "@/lib/class-names";

interface TabDescriptor {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  isActive: (pathname: string) => boolean;
}

const TABS: readonly TabDescriptor[] = [
  { href: "/", label: "Home", Icon: Home, isActive: (p) => p === "/" },
  {
    href: "/shop",
    label: "Shop",
    Icon: Store,
    isActive: (p) =>
      p === "/shop" ||
      p.startsWith("/shop/") ||
      p.startsWith("/products") ||
      p.startsWith("/checkout"),
  },
  {
    href: "/emi-dues",
    label: "EMI Dues",
    Icon: Receipt,
    isActive: (p) => p.startsWith("/emi-dues"),
  },
  {
    href: "/limit",
    label: "Limit",
    Icon: TrendingUp,
    isActive: (p) => p.startsWith("/limit"),
  },
  {
    href: "/profile",
    label: "Profile",
    Icon: User,
    isActive: (p) => p.startsWith("/profile"),
  },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-card rounded-tab-bar shadow-card border border-hairline"
    >
      <ul className="flex items-stretch justify-between px-2">
        {TABS.map(({ href, label, Icon, isActive }) => {
          const active = isActive(pathname);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={classNames(
                  "relative flex flex-col items-center justify-center gap-1 py-2.5 rounded-tab-bar",
                  focusRing,
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    "absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-b-full bg-brand-violet",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                <Icon
                  className={classNames(
                    "w-5 h-5",
                    active ? "text-brand-violet" : "text-ink-muted",
                  )}
                  aria-hidden="true"
                />
                <span
                  className={classNames(
                    "text-xs font-medium",
                    active ? "text-brand-violet" : "text-ink-muted",
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
