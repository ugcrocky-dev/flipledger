# FlipLedger

Reseller deal analyzer micro-SaaS — score thrift / Marketplace / eBay flips by profit, ROI, hourly rate, and the **3× rule**.

## Money model

| Plan | Price | Includes |
|------|-------|----------|
| Free | $0 | Unlimited analyses, grade A–F, save 3 deals |
| Pro | $9 lifetime | Unlimited saves + CSV export |

1. Deploy on Vercel
2. Create a Gumroad / Stripe Payment Link for $9
3. After purchase, email buyers the unlock code (change `PRO_UNLOCK_CODE` in `src/lib/calc.ts`)
4. Drive traffic: reseller Discords, Reddit r/Flipping, Facebook flip groups

## Local run

```bash
npm install
npm run dev
```

Demo unlock code: `MORTGAGE100`

## Stack

- Next.js + TypeScript + Tailwind
- Client-side calc + localStorage (no database required to launch)
- Zero API keys needed
