import { type Tx, type Campaign } from "@/lib/revenue/revenue";

/* date helpers */
const day = 24 * 60 * 60 * 1000;
const dISO = (d: Date) => d.toISOString().slice(0, 10);
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const atMidnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const daysInclusive = (a: Date, b: Date) =>
    Math.max(0, Math.floor((atMidnight(b).getTime() - atMidnight(a).getTime()) / day) + 1);
const overlapDays = (aS: Date, aE: Date, bS: Date, bE: Date) => {
    const s = new Date(Math.max(atMidnight(aS).getTime(), atMidnight(bS).getTime()));
    const e = new Date(Math.min(atMidnight(aE).getTime(), atMidnight(bE).getTime()));
    if (e < s) return 0;
    return daysInclusive(s, e);
};

export function computeMonthlyRevenue(transactions: Tx[], campaigns: Campaign[], when: Date) {
    const mS = startOfMonth(when);
    const mE = endOfMonth(when);

    let mpesa = 0, stripe = 0, ads = 0;

    // transactions (completed only)
    for (const t of transactions) {
        if (t.status !== "Completed") continue;
        const d = new Date(`${t.date}T00:00:00`);
        if (d >= mS && d <= mE) {
            if (t.type === "M-Pesa") mpesa += t.amount;
            else if (t.type === "Stripe") stripe += t.amount;
        }
    }

    // ads (prorated by overlap)
    for (const c of campaigns) {
        const cS = new Date(`${c.start}T00:00:00`);
        const cE = new Date(`${c.end}T00:00:00`);
        const total = Math.max(1, daysInclusive(cS, cE));
        const ov = overlapDays(cS, cE, mS, mE);
        if (ov > 0) ads += (c.earnings || 0) * (ov / total);
    }

    return { total: mpesa + stripe + ads, mpesa, stripe, ads, monthISO: dISO(mS) };
}

/** Month-over-month:
 *  - deltaPct: number (e.g. -3.2 means ↓3.2%)
 *  - deltaLabel: UI label with sign & '%' (e.g. "−3.2%")
 *  - direction: 'up' | 'down' | 'flat'
 */
export function computeMoMDelta(transactions: Tx[], campaigns: Campaign[], ref: Date = new Date()) {
    const current = computeMonthlyRevenue(transactions, campaigns, ref).total;
    const previous = computeMonthlyRevenue(
        transactions,
        campaigns,
        new Date(ref.getFullYear(), ref.getMonth() - 1, 1)
    ).total;

    let deltaPct = 0;
    if (previous > 0) {
        deltaPct = ((current - previous) / previous) * 100;
    } else if (previous === 0 && current > 0) {
        deltaPct = 100;
    }

    const direction = Math.abs(deltaPct) < 0.05 ? "flat" : deltaPct > 0 ? "up" : "down";
    // Use a true minus sign for negatives (looks better)
    const sign = deltaPct >= 0 ? "+" : "−";
    const deltaLabel = `${sign}${Math.abs(deltaPct).toFixed(1)}%`;

    return { currentTotal: current, previousTotal: previous, deltaPct, deltaLabel, direction };
}
