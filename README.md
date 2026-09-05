# FlipLedger

Reseller deal analyzer micro-SaaS — score thrift / Marketplace / eBay flips by profit, ROI, hourly rate, and the **3× rule**.

## Why this exists

GitHub research (2026) shows money clusters around:

1. **Micro-SaaS + Stripe/Gumroad unlocks** (ShipGenAI, saasfly, AI starters)
2. **Tools that sell a clear outcome** (resume/cover-letter generators, automation around n8n)
3. **Managed services on top of open source** (longer path)

FlipLedger is path #1 + #2: a free tool that distributes itself, with a **$9 Pro unlock** you can sell.

## Money model

| Plan | Price | Includes |
|------|-------|----------|
| Free | $0 | Unlimited analyses, grade A–F, save 3 deals |
| Pro | $9 lifetime | Unlimited saves + CSV export |

1. Deploy this app (Vercel)
2. Create a Gumroad / Stripe Payment Link for $9
3. After purchase, email buyers the unlock code (change `PRO_UNLOCK_CODE` in `src/lib/calc.ts`)
4. Drive traffic: reseller Discords, Reddit r/Flipping, Facebook flip groups, TikTok “deal or no deal”

## Local run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo unlock code: `MORTGAGE100`

## Stack

- Next.js + TypeScript + Tailwind
- Client-side calc + localStorage (no database required to launch)
- Zero API keys needed

## Your $100 play

1. Use FlipLedger before every thrift/Marketplace buy — only take **A/B** grades
2. Flip for cash this weekend
3. Sell Pro codes to other flippers while you operate
