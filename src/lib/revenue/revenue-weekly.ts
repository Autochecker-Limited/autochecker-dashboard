// components/sections/dashboard/revenue-weekly.ts

import type { Tx, Campaign } from "@/lib/revenue/revenue";

// Time constants
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

const toDate = (iso: string) => new Date(`${iso}T00:00:00`);
const iso = (d: Date) => d.toISOString().slice(0, 10);
const clampDate = (d: Date, min: Date, max: Date) => (d < min ? min : d > max ? max : d);

/** Inclusive number of 7-day buckets between start and end */
function weekCount(start: Date, end: Date): number {
    const span = end.getTime() - start.getTime();
    return Math.floor(span / WEEK_MS) + 1;
}

/** Returns ISO labels for each weekly bucket starting at startISO (inclusive) */
export function weekLabels(startISO: string, endISO: string): string[] {
    const start = toDate(startISO);
    const end = toDate(endISO);
    const n = weekCount(start, end);
    const labels: string[] = [];
    for (let i = 0; i < n; i++) {
        const d = new Date(start.getTime() + i * WEEK_MS);
        labels.push(iso(d));
    }
    return labels;
}

/**
 * Aggregate revenue weekly for the given range:
 * - Transactions: sum amounts for Completed tx in the week they occur.
 * - Campaigns: bucket full earnings into the week of their effective start within the range.
 */
export function weeklyTotalsForRange(
    transactions: Tx[],
    campaigns: Campaign[],
    startISO: string,
    endISO: string
): number[] {
    const start = toDate(startISO);
    const end = toDate(endISO);
    if (end < start) return [];

    const weeks = weekCount(start, end);
    const totals = Array<number>(weeks).fill(0);

    // Transactions
    for (const t of transactions) {
        if (t.status !== "Completed") continue;
        const td = toDate(t.date);
        if (td < start || td > end) continue;
        const idx = Math.floor((td.getTime() - start.getTime()) / WEEK_MS);
        totals[idx] += t.amount;
    }

    // Campaigns (earnings → effective start week inside the range)
    for (const c of campaigns) {
        const cStart = toDate(c.start);
        const cEnd = toDate(c.end);
        if (cEnd < start || cStart > end) continue; // no overlap
        const effStart = clampDate(cStart, start, end);
        const idx = Math.floor((effStart.getTime() - start.getTime()) / WEEK_MS);
        totals[idx] += c.earnings || 0;
    }

    return totals;
}

/** Build recharts-friendly dataset aligned to weekly buckets of left range */
export function buildWeeklyCompareDataset(
    transactions: Tx[],
    campaigns: Campaign[],
    leftStartISO: string,
    leftEndISO: string,
    rightStartISO: string,
    rightEndISO: string
): Array<{ week: string; A: number; B: number }> {
    const labels = weekLabels(leftStartISO, leftEndISO);
    const A = weeklyTotalsForRange(transactions, campaigns, leftStartISO, leftEndISO);
    const B = weeklyTotalsForRange(transactions, campaigns, rightStartISO, rightEndISO);

    // Align by index; if right has fewer/more weeks, pad with 0
    const out: Array<{ week: string; A: number; B: number }> = [];
    const n = labels.length;
    for (let i = 0; i < n; i++) {
        out.push({ week: labels[i], A: A[i] ?? 0, B: B[i] ?? 0 });
    }
    return out;
}
