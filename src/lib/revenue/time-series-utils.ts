// components/sections/revenue/time-series-utils.ts
import { fmtUSD, type Tx, type Campaign } from "@/lib/revenue/revenue";

export type Granularity = "daily" | "weekly" | "monthly";

const DAY = 24 * 60 * 60 * 1000;
const toDate = (iso: string) => new Date(`${iso}T00:00:00`);
const iso = (d: Date) => d.toISOString().slice(0, 10);
const startOfWeek = (d: Date) => {
    const nd = new Date(d);
    const day = nd.getDay(); // 0=Sun
    nd.setDate(nd.getDate() - day); // start on Sunday
    return new Date(nd.getFullYear(), nd.getMonth(), nd.getDate());
};
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export function findDataBounds(transactions: Tx[], campaigns: Campaign[]) {
    const dates: number[] = [];
    for (const t of transactions) dates.push(toDate(t.date).getTime());
    for (const c of campaigns) {
        dates.push(toDate(c.start).getTime());
        dates.push(toDate(c.end).getTime());
    }
    if (!dates.length) {
        const today = new Date();
        return { min: iso(today), max: iso(today) };
    }
    const min = new Date(Math.min(...dates));
    const max = new Date(Math.max(...dates));
    return { min: iso(min), max: iso(max) };
}

type Point = { date: string; "M-Pesa": number; Stripe: number; Ads: number; Total: number };

/** Build DAILY series between [startISO, endISO] (inclusive). */
export function buildDailySeries(
    transactions: Tx[],
    campaigns: Campaign[],
    startISO: string,
    endISO: string,
    opts?: { distributeAds?: "start" | "even" } // default "start"
): Point[] {
    const start = toDate(startISO);
    const end = toDate(endISO);
    if (end < start) return [];

    const days = Math.floor((end.getTime() - start.getTime()) / DAY) + 1;
    const rows: Point[] = Array.from({ length: days }, (_, i) => {
        const d = new Date(start.getTime() + i * DAY);
        const key = iso(d);
        return { date: key, "M-Pesa": 0, Stripe: 0, Ads: 0, Total: 0 };
    });

    // Map date -> index for quick adds
    const index = new Map(rows.map((r, i) => [r.date, i]));

    // Transactions (Completed only)
    for (const t of transactions) {
        if (t.status !== "Completed") continue;
        const key = iso(toDate(t.date));
        const idx = index.get(key);
        if (idx == null) continue;
        if (t.type === "M-Pesa") rows[idx]["M-Pesa"] += t.amount;
        else if (t.type === "Stripe") rows[idx].Stripe += t.amount;
    }

    // Ads (campaign earnings)
    const dist = opts?.distributeAds ?? "start";
    for (const c of campaigns) {
        const s = toDate(c.start);
        const e = toDate(c.end);
        // overlap with [start, end]?
        if (e < start || s > end) continue;

        if (dist === "even") {
            // spread evenly across overlapping days
            const effStart = s < start ? start : s;
            const effEnd = e > end ? end : e;
            const spanDays =
                Math.floor((effEnd.getTime() - effStart.getTime()) / DAY) + 1;
            const perDay = (c.earnings || 0) / spanDays;
            for (let d = 0; d < spanDays; d++) {
                const key = iso(new Date(effStart.getTime() + d * DAY));
                const idx = index.get(key);
                if (idx != null) rows[idx].Ads += perDay;
            }
        } else {
            // bucket to start day inside the range
            const eff = s < start ? start : s;
            const key = iso(eff);
            const idx = index.get(key);
            if (idx != null) rows[idx].Ads += c.earnings || 0;
        }
    }

    // Totals
    for (const r of rows) r.Total = r["M-Pesa"] + r.Stripe + r.Ads;
    return rows;
}

/** Aggregate daily -> weekly/monthly */
export function aggregateSeries(points: Point[], granularity: Granularity): Point[] {
    if (granularity === "daily") return points;
    const buckets = new Map<string, Point>();

    for (const p of points) {
        const d = toDate(p.date);
        const key =
            granularity === "weekly" ? iso(startOfWeek(d)) : iso(startOfMonth(d));
        const curr = buckets.get(key) ?? { date: key, "M-Pesa": 0, Stripe: 0, Ads: 0, Total: 0 };
        curr["M-Pesa"] += p["M-Pesa"];
        curr.Stripe += p.Stripe;
        curr.Ads += p.Ads;
        curr.Total += p.Total;
        buckets.set(key, curr);
    }

    return Array.from(buckets.values()).sort((a, b) => (a.date < b.date ? -1 : 1));
}

/** X-axis label for any granularity */
export function tickLabel(dateISO: string, granularity: Granularity) {
    const d = toDate(dateISO);
    if (granularity === "monthly") {
        return d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
    }
    return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}

/** Tooltip formatter (typed) */
export function tooltipValueFormatter(value: unknown) {
    return typeof value === "number" ? fmtUSD(value) : String(value);
}


export function tinyTickLabel(dateISO: string, granularity: Granularity) {
    const d = new Date(`${dateISO}T00:00:00`);
    const mm = d.getMonth() + 1;
    const dd = d.getDate();

    if (granularity === "monthly") {
        // "Sep"
        return d.toLocaleDateString(undefined, { month: "short" });
    }
    // daily/weekly: "9/06"
    return `${mm}/${dd.toString().padStart(2, "0")}`;
}