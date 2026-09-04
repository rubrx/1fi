import { describe, expect, it } from "vitest";
import { formatInr, rupeesToPaise } from "../src/lib/money";

describe("formatInr", () => {
  it("renders ₹1,27,400 for 12740000 paise", () => {
    expect(formatInr(12740000)).toBe("₹1,27,400");
  });

  it("renders ₹5,621 for 562100 paise", () => {
    expect(formatInr(562100)).toBe("₹5,621");
  });

  it("renders ₹0 for 0 paise", () => {
    expect(formatInr(0)).toBe("₹0");
  });

  it("throws on non-finite input", () => {
    expect(() => formatInr(Number.NaN)).toThrow();
    expect(() => formatInr(Number.POSITIVE_INFINITY)).toThrow();
  });
});

describe("rupeesToPaise", () => {
  it("converts whole rupees to paise", () => {
    expect(rupeesToPaise(1274)).toBe(127400);
  });

  it("rounds fractional paise", () => {
    expect(rupeesToPaise(56.215)).toBe(5622);
  });

  it("throws on non-finite input", () => {
    expect(() => rupeesToPaise(Number.NaN)).toThrow();
  });
});
