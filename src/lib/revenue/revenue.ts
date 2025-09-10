// lib/revenue.ts
export type TxStatus = "Completed" | "Failed";
export type Tx = {
    date: string;            // YYYY-MM-DD
    amount: number;
    type: "M-Pesa" | "Stripe" | string;
    status: TxStatus;
};

export type Campaign = {
    name: string;
    start: string;           // YYYY-MM-DD
    end: string;             // YYYY-MM-DD
    impressions: number;
    earnings: number;
};

// Existing deterministic formatter (example)
export const fmtUSD = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

// Sum all-time (you already have something similar)
export function computeRevenueTotals(transactions: Tx[], campaigns: Campaign[]) {
    const mpesaTotal = transactions
        .filter(t => t.status === "Completed" && t.type === "M-Pesa")
        .reduce((a, b) => a + b.amount, 0);
    const stripeTotal = transactions
        .filter(t => t.status === "Completed" && t.type === "Stripe")
        .reduce((a, b) => a + b.amount, 0);
    const adsTotal = campaigns.reduce((a, b) => a + (b.earnings || 0), 0);
    return { mpesaTotal, stripeTotal, adsTotal, totalRevenue: mpesaTotal + stripeTotal + adsTotal };
}

/** ---- New range helpers ---- */
const d = (s: string) => new Date(`${s}T00:00:00`);
const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) =>
    aStart <= bEnd && bStart <= aEnd;

export function computeRevenueForRange(
    transactions: Tx[],
    campaigns: Campaign[],
    startISO: string,
    endISO: string
) {
    const start = d(startISO);
    const end = d(endISO);

    const mpesa = transactions
        .filter(t => t.status === "Completed" && t.type === "M-Pesa")
        .filter(t => {
            const td = d(t.date);
            return td >= start && td <= end;
        })
        .reduce((a, b) => a + b.amount, 0);

    const stripe = transactions
        .filter(t => t.status === "Completed" && t.type === "Stripe")
        .filter(t => {
            const td = d(t.date);
            return td >= start && td <= end;
        })
        .reduce((a, b) => a + b.amount, 0);

    // Count a campaign if its date range intersects the selected window
    const ads = campaigns
        .filter(c => overlaps(d(c.start), d(c.end), start, end))
        .reduce((a, b) => a + (b.earnings || 0), 0);

    return { mpesa, stripe, ads, total: mpesa + stripe + ads };
}

export function monthBounds(yyyymm: string) {
    // yyyymm = "2025-09"
    const [y, m] = yyyymm.split("-").map(Number);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0); // last day of month
    const iso = (dt: Date) => dt.toISOString().slice(0, 10);
    return { start: iso(start), end: iso(end) };
}

export function availableMonthsFromData(transactions: Tx[], campaigns: Campaign[]) {
    const set = new Set<string>();
    const add = (iso: string) => set.add(iso.slice(0, 7));
    transactions.forEach(t => add(t.date));
    campaigns.forEach(c => add(c.start));
    campaigns.forEach(c => add(c.end));
    return Array.from(set).sort().reverse(); // newest first
}
