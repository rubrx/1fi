"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Receipt, TrendingUp, User } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { classNames } from "@/lib/class-names";

interface NavDescriptor {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  isActive: (pathname: string) => boolean;
}

const LINKS: readonly NavDescriptor[] = [
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

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-hairline">
      <nav
        aria-label="Primary"
        className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16"
      >
        <Link
          href="/shop"
          className={classNames(
            "text-xl font-bold text-brand-violet tracking-tight rounded-md px-1",
            focusRing,
          )}
        >
          1Fi
        </Link>
        <ul className="flex items-center gap-1">
          {LINKS.map(({ href, label, Icon, isActive }) => {
            const active = isActive(pathname);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={classNames(
                    "inline-flex items-center gap-2 px-3 h-10 rounded-pill text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-violet-soft text-brand-violet"
                      : "text-ink-muted hover:text-ink hover:bg-hairline/60",
                    focusRing,
                  )}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
