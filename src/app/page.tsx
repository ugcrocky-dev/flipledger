"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Download,
  Lock,
  Sparkles,
  Trash2,
  TrendingUp,
  Unlock,
  Wallet,
} from "lucide-react";
import {
  analyzeDeal,
  money,
  PRO_UNLOCK_CODE,
  type DealResult,
} from "@/lib/calc";

type FormState = {
  title: string;
  buyPrice: string;
  sellPrice: string;
  feesPercent: string;
  shippingCost: string;
  otherCosts: string;
  hours: string;
  platform: string;
};

const DEFAULT_FORM: FormState = {
  title: "",
  buyPrice: "25",
  sellPrice: "90",
  feesPercent: "13",
  shippingCost: "0",
  otherCosts: "0",
  hours: "1",
  platform: "Facebook Marketplace",
};

const PLATFORMS = [
  "Facebook Marketplace",
  "eBay",
  "Mercari",
  "OfferUp",
  "Craigslist",
  "Local pickup",
];

function gradeColor(grade: DealResult["grade"]) {
  if (grade === "A") return "text-[#3dff9a]";
  if (grade === "B") return "text-[#9dff6a]";
  if (grade === "C") return "text-[#ffb84d]";
  return "text-[#ff6b6b]";
}

export default function HomePage() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [saved, setSaved] = useState<DealResult[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [unlockInput, setUnlockInput] = useState("");
  const [unlockMsg, setUnlockMsg] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem("flipledger_saved");
      const p = localStorage.getItem("flipledger_pro");
      if (s) setSaved(JSON.parse(s) as DealResult[]);
      if (p === "1") setIsPro(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("flipledger_saved", JSON.stringify(saved));
  }, [saved]);

  const result = useMemo(
    () =>
      analyzeDeal({
        title: form.title,
        buyPrice: Number(form.buyPrice) || 0,
        sellPrice: Number(form.sellPrice) || 0,
        feesPercent: Number(form.feesPercent) || 0,
        shippingCost: Number(form.shippingCost) || 0,
        otherCosts: Number(form.otherCosts) || 0,
        hours: Number(form.hours) || 1,
        platform: form.platform,
      }),
    [form],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function saveDeal() {
    if (!isPro && saved.length >= 3) {
      setUnlockMsg("Free plan saves 3 deals. Unlock Pro for unlimited.");
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setSaved((prev) => [result, ...prev].slice(0, isPro ? 100 : 3));
  }

  function removeDeal(idx: number) {
    setSaved((prev) => prev.filter((_, i) => i !== idx));
  }

  function unlockPro() {
    if (unlockInput.trim().toUpperCase() === PRO_UNLOCK_CODE) {
      setIsPro(true);
      localStorage.setItem("flipledger_pro", "1");
      setUnlockMsg("Pro unlocked. Unlimited saves + CSV export.");
    } else {
      setUnlockMsg("Invalid code. Buy Pro or use launch code MORTGAGE100.");
    }
  }

  function exportCsv() {
    if (!isPro) {
      setUnlockMsg("CSV export is Pro-only.");
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const header =
      "title,platform,buy,sell,fees,shipping,other,profit,roi,hourly,multiple,grade\n";
    const rows = saved
      .map((d) =>
        [
          `"${d.title.replace(/"/g, '""')}"`,
          d.platform,
          d.buyPrice,
          d.sellPrice,
          d.fees.toFixed(2),
          d.shippingCost,
          d.otherCosts,
          d.netProfit.toFixed(2),
          d.roi.toFixed(1),
          d.hourlyRate.toFixed(2),
          d.multiple.toFixed(2),
          d.grade,
        ].join(","),
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flipledger-deals.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyPitch() {
    const text = `FlipLedger graded this ${result.platform} deal "${result.title}" as ${result.grade}: buy ${money(result.buyPrice)} → sell ${money(result.sellPrice)} = ${money(result.netProfit)} profit (${result.multiple.toFixed(1)}x, ${money(result.hourlyRate)}/hr). ${result.verdict}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const totalProfit = saved.reduce((sum, d) => sum + d.netProfit, 0);

  return (
    <div className="grid-noise min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3dff9a] text-[#04140c]">
            <TrendingUp size={18} strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            FlipLedger
          </span>
          {isPro && (
            <span className="rounded-full border border-[#3dff9a]/40 bg-[#3dff9a]/10 px-2 py-0.5 text-xs font-semibold text-[#3dff9a]">
              PRO
            </span>
          )}
        </div>
        <a
          href="#pricing"
          className="btn-primary inline-flex items-center gap-1 px-4 py-2 text-sm"
        >
          Get Pro <ArrowRight size={14} />
        </a>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24">
        <section className="rise pb-12 pt-8 md:pt-12">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#24302a] bg-[#15201b]/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[#8fa396]">
            <Sparkles size={12} className="text-[#3dff9a]" />
            Built from what GitHub micro-SaaS actually sells
          </p>
          <h1 className="font-display max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-[#e8f0ea] sm:text-6xl">
            Only buy flips that{" "}
            <span className="text-[#3dff9a]">pay the mortgage</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#8fa396] sm:text-lg">
            Score thrift, Marketplace, and eBay deals in seconds — profit, ROI,
            hourly rate, and the 3× rule. Use it with your $100. Sell Pro to
            other flippers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#tool"
              className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm"
            >
              Analyze a deal <ArrowRight size={16} />
            </a>
            <a
              href="#playbook"
              className="btn-ghost inline-flex items-center gap-2 px-5 py-3 text-sm"
            >
              Money playbook
            </a>
          </div>
        </section>

        <section
          id="tool"
          className="rise-delay-2 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="card p-5 sm:p-6">
            <h2 className="font-display text-2xl font-bold">Deal analyzer</h2>
            <p className="mt-1 text-sm text-[#8fa396]">
              Enter listing numbers. Get a buy/pass grade instantly.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-[#8fa396] sm:col-span-2">
                Item
                <input
                  className="mt-1 w-full px-3 py-2.5 text-sm"
                  placeholder="IKEA desk, Dyson, Nintendo Switch…"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                />
              </label>
              <label className="text-xs text-[#8fa396]">
                Buy price ($)
                <input
                  className="mono mt-1 w-full px-3 py-2.5 text-sm"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.buyPrice}
                  onChange={(e) => update("buyPrice", e.target.value)}
                />
              </label>
              <label className="text-xs text-[#8fa396]">
                Expected sell ($)
                <input
                  className="mono mt-1 w-full px-3 py-2.5 text-sm"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.sellPrice}
                  onChange={(e) => update("sellPrice", e.target.value)}
                />
              </label>
              <label className="text-xs text-[#8fa396]">
                Fees (%)
                <input
                  className="mono mt-1 w-full px-3 py-2.5 text-sm"
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.feesPercent}
                  onChange={(e) => update("feesPercent", e.target.value)}
                />
              </label>
              <label className="text-xs text-[#8fa396]">
                Shipping / gas ($)
                <input
                  className="mono mt-1 w-full px-3 py-2.5 text-sm"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.shippingCost}
                  onChange={(e) => update("shippingCost", e.target.value)}
                />
              </label>
              <label className="text-xs text-[#8fa396]">
                Other costs ($)
                <input
                  className="mono mt-1 w-full px-3 py-2.5 text-sm"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.otherCosts}
                  onChange={(e) => update("otherCosts", e.target.value)}
                />
              </label>
              <label className="text-xs text-[#8fa396]">
                Hours to flip
                <input
                  className="mono mt-1 w-full px-3 py-2.5 text-sm"
                  type="number"
                  min="0.25"
                  step="0.25"
                  value={form.hours}
                  onChange={(e) => update("hours", e.target.value)}
                />
              </label>
              <label className="text-xs text-[#8fa396] sm:col-span-2">
                Sell platform
                <select
                  className="mt-1 w-full px-3 py-2.5 text-sm"
                  value={form.platform}
                  onChange={(e) => update("platform", e.target.value)}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={saveDeal}
                className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm"
              >
                <Wallet size={16} /> Save deal
              </button>
              <button
                type="button"
                onClick={copyPitch}
                className="btn-ghost inline-flex items-center gap-2 px-4 py-2.5 text-sm"
              >
                <Copy size={16} /> {copied ? "Copied" : "Copy summary"}
              </button>
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#8fa396]">
                  Grade
                </p>
                <div
                  className={`font-display text-6xl font-extrabold ${gradeColor(result.grade)}`}
                >
                  {result.grade}
                </div>
              </div>
              <div className="rounded-2xl border border-[#24302a] bg-[#0e1613] px-3 py-2 text-right">
                <p className="text-[10px] uppercase tracking-wider text-[#8fa396]">
                  Net profit
                </p>
                <p
                  className={`mono text-xl font-semibold ${result.netProfit >= 0 ? "text-[#3dff9a]" : "text-[#ff6b6b]"}`}
                >
                  {money(result.netProfit)}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#c5d4c9]">
              {result.verdict}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ["ROI", `${result.roi.toFixed(0)}%`],
                ["Multiple", `${result.multiple.toFixed(1)}×`],
                ["Hourly", money(result.hourlyRate)],
                ["Fees", money(result.fees)],
                ["Total cost", money(result.totalCost)],
                ["3× rule", result.passes3x ? "PASS" : "FAIL"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-[#24302a] bg-[#0e1613]/80 px-3 py-2.5"
                >
                  <div className="text-[10px] uppercase tracking-wider text-[#8fa396]">
                    {label}
                  </div>
                  <div className="mono mt-0.5 text-sm font-medium text-[#e8f0ea]">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card mt-8 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold">Saved deals</h2>
              <p className="text-sm text-[#8fa396]">
                Pipeline:{" "}
                <span className="mono text-[#3dff9a]">{money(totalProfit)}</span>
                {!isPro && " · Free saves 3"}
              </p>
            </div>
            <button
              type="button"
              onClick={exportCsv}
              className="btn-ghost inline-flex items-center gap-2 px-4 py-2 text-sm"
            >
              {isPro ? <Download size={16} /> : <Lock size={16} />} Export CSV
            </button>
          </div>
          {saved.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-[#24302a] px-4 py-8 text-center text-sm text-[#8fa396]">
              No saved deals yet. Analyze one and hit Save.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {saved.map((d, i) => (
                <li
                  key={`${d.title}-${i}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#24302a] bg-[#0e1613]/60 px-4 py-3"
                >
                  <div>
                    <div className="font-medium">{d.title}</div>
                    <div className="text-xs text-[#8fa396]">
                      {d.platform} ·{" "}
                      <span className={gradeColor(d.grade)}>
                        Grade {d.grade}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="mono text-sm text-[#3dff9a]">
                      {money(d.netProfit)}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDeal(i)}
                      className="rounded-lg p-2 text-[#8fa396] hover:bg-[#ff6b6b]/10 hover:text-[#ff6b6b]"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="playbook" className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "What GitHub shows works",
              d: "Hot repos are micro-SaaS starters with Stripe, AI wrappers people pay for once, and tools around n8n. Buyers pay for speed and a clear outcome.",
            },
            {
              t: "Your $100 this weekend",
              d: "Use FlipLedger before every purchase. Only A/B deals. Target power tools, brand electronics, furniture with local pickup. Half to reinvest, half to mortgage.",
            },
            {
              t: "How this app makes money",
              d: "Free analyzer = distribution. Pro ($9) unlocks unlimited saves + CSV. Sell codes on Gumroad/Stripe, or white-label for reseller Discords at $19/mo.",
            },
          ].map((item) => (
            <article key={item.t} className="card p-5">
              <h3 className="font-display text-lg font-bold">{item.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8fa396]">
                {item.d}
              </p>
            </article>
          ))}
        </section>

        <section id="pricing" className="card mt-10 overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="border-b border-[#24302a] p-6 md:border-b-0 md:border-r">
              <p className="text-xs uppercase tracking-[0.16em] text-[#8fa396]">
                Free
              </p>
              <h3 className="font-display mt-2 text-3xl font-bold">$0</h3>
              <ul className="mt-4 space-y-2 text-sm text-[#c5d4c9]">
                {[
                  "Unlimited analyses",
                  "A–F grading + 3× rule",
                  "Save 3 deals",
                ].map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#3dff9a]" /> {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3dff9a]/10 to-transparent" />
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.16em] text-[#3dff9a]">
                  Pro — sell this
                </p>
                <h3 className="font-display mt-2 text-3xl font-bold">
                  $9{" "}
                  <span className="text-base font-medium text-[#8fa396]">
                    lifetime
                  </span>
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-[#c5d4c9]">
                  {[
                    "Unlimited saved deals",
                    "CSV export for taxes / tracking",
                    "Launch unlock code included",
                  ].map((x) => (
                    <li key={x} className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#3dff9a]" /> {x}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <input
                    className="mono flex-1 px-3 py-2.5 text-sm"
                    placeholder="Enter unlock code"
                    value={unlockInput}
                    onChange={(e) => setUnlockInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={unlockPro}
                    className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm"
                  >
                    <Unlock size={16} /> Unlock
                  </button>
                </div>
                {unlockMsg && (
                  <p className="mt-2 text-xs text-[#8fa396]">{unlockMsg}</p>
                )}
                <p className="mt-3 text-xs text-[#8fa396]">
                  Demo code:{" "}
                  <span className="mono text-[#3dff9a]">{PRO_UNLOCK_CODE}</span>
                </p>
                <a
                  href="https://gumroad.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm"
                >
                  Open Gumroad to sell Pro <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-14 border-t border-[#24302a] pt-6 text-center text-xs text-[#8fa396]">
          FlipLedger · Use it. Sell it. Point profits at the mortgage.
        </footer>
      </main>
    </div>
  );
}
