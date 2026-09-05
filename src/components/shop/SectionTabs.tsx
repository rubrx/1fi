"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { classNames } from "@/lib/class-names";

const TABS = [
  { value: "top-brands", short: "Top Brands", long: "Top Brands" },
  { value: "nearby-stores", short: "Nearby", long: "Nearby Stores" },
  { value: "marketplace", short: "Marketplace", long: "1Fi Marketplace" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

const DEFAULT_TAB: TabValue = "marketplace";

function isTabValue(value: string | null): value is TabValue {
  return TABS.some((t) => t.value === value);
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2 focus-visible:ring-offset-brand-violet-soft";

export function SectionTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const rawTab = searchParams.get("tab");
  const activeTab: TabValue = isTabValue(rawTab) ? rawTab : DEFAULT_TAB;
  const activeIndex = TABS.findIndex((t) => t.value === activeTab);

  const setTab = useCallback(
    (value: TabValue) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      if (value === DEFAULT_TAB) {
        nextParams.delete("tab");
      } else {
        nextParams.set("tab", value);
      }
      const queryString = nextParams.toString();
      router.replace(queryString ? `?${queryString}` : "?", { scroll: false });
    },
    [router, searchParams],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex: number | null = null;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % TABS.length;
      else if (event.key === "ArrowLeft")
        nextIndex = (index - 1 + TABS.length) % TABS.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = TABS.length - 1;

      if (nextIndex !== null) {
        event.preventDefault();
        setTab(TABS[nextIndex].value);
        buttonRefs.current[nextIndex]?.focus();
      }
    },
    [setTab],
  );

  useEffect(() => {
    buttonRefs.current = buttonRefs.current.slice(0, TABS.length);
  }, []);

  return (
    <div
      role="tablist"
      aria-label="Shop sections"
      className="flex items-stretch gap-1 rounded-pill bg-brand-violet-soft p-1"
    >
      {TABS.map((tab, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            id={`section-tab-${tab.value}`}
            aria-selected={isActive}
            aria-controls={`section-panel-${tab.value}`}
            tabIndex={isActive ? 0 : -1}
            ref={(node) => {
              buttonRefs.current[index] = node;
            }}
            onClick={() => setTab(tab.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={classNames(
              "relative flex-1 h-11 px-3 rounded-pill text-[15px] sm:text-[17px] font-semibold transition-colors duration-segment",
              isActive
                ? "bg-card text-brand-violet shadow-card"
                : "text-ink-muted hover:text-ink",
              focusRing,
            )}
          >
            <span className="sm:hidden">{tab.short}</span>
            <span className="hidden sm:inline">{tab.long}</span>
            <span
              aria-hidden="true"
              className={classNames(
                "absolute bottom-1.5 left-1/2 -translate-x-1/2 h-[3px] w-2/5 rounded-full bg-brand-violet transition-opacity duration-segment",
                isActive ? "opacity-100" : "opacity-0",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
