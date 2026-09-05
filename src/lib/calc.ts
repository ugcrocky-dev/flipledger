export type DealInput = {
  title: string;
  buyPrice: number;
  sellPrice: number;
  feesPercent: number;
  shippingCost: number;
  otherCosts: number;
  hours: number;
  platform: string;
};

export type DealResult = {
  title: string;
  buyPrice: number;
  sellPrice: number;
  fees: number;
  shippingCost: number;
  otherCosts: number;
  totalCost: number;
  netProfit: number;
  roi: number;
  margin: number;
  hourlyRate: number;
  multiple: number;
  passes3x: boolean;
  grade: "A" | "B" | "C" | "F";
  platform: string;
  verdict: string;
};

/** Change this when you sell Pro on Gumroad/Stripe and email buyers a unique code. */
export const PRO_UNLOCK_CODE = "MORTGAGE100";

export function analyzeDeal(input: DealInput): DealResult {
  const fees = (input.sellPrice * input.feesPercent) / 100;
  const totalCost =
    input.buyPrice + fees + input.shippingCost + input.otherCosts;
  const netProfit = input.sellPrice - totalCost;
  const roi = input.buyPrice > 0 ? (netProfit / input.buyPrice) * 100 : 0;
  const margin = input.sellPrice > 0 ? (netProfit / input.sellPrice) * 100 : 0;
  const hours = Math.max(input.hours, 0.25);
  const hourlyRate = netProfit / hours;
  const multiple = input.buyPrice > 0 ? input.sellPrice / input.buyPrice : 0;
  const passes3x = multiple >= 3;

  let grade: DealResult["grade"] = "F";
  if (netProfit >= 80 && passes3x && hourlyRate >= 40) grade = "A";
  else if (netProfit >= 40 && multiple >= 2 && hourlyRate >= 25) grade = "B";
  else if (netProfit >= 20 && multiple >= 1.5) grade = "C";

  const verdict =
    grade === "A"
      ? "Buy this. Strong profit, good hourly rate, clears the 3x rule."
      : grade === "B"
        ? "Solid flip. Take it if you can turn it fast."
        : grade === "C"
          ? "Thin margin. Only if you already know the buyer."
          : "Pass. Put this capital into a cleaner deal.";

  return {
    title: input.title.trim() || "Untitled deal",
    buyPrice: input.buyPrice,
    sellPrice: input.sellPrice,
    fees,
    shippingCost: input.shippingCost,
    otherCosts: input.otherCosts,
    totalCost,
    netProfit,
    roi,
    margin,
    hourlyRate,
    multiple,
    passes3x,
    grade,
    platform: input.platform,
    verdict,
  };
}

export function money(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}
