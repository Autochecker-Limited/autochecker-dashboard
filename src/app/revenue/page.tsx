"use client";

import * as React from "react";
import { transactions, campaigns } from "@/components/constants/revenue.mock";
import { computeRevenueForRange, fmtUSD } from "@/lib/revenue/revenue";

import SummaryCards from "@/components/sections/revenue/SummaryCards";
import TransactionsTable from "@/components/sections/revenue/TransactionsTable";
import CampaignsTable from "@/components/sections/revenue/CampaignsTable";

// Local ISO helper
function toIso(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export default function RevenuePage() {
    // Default timeframe: this year (Jan 1 → today)
    const today = React.useMemo(() => new Date(), []);
    const jan1 = React.useMemo(() => new Date(today.getFullYear(), 0, 1), [today]);

    const [range, setRange] = React.useState<{ start: string; end: string }>({
        start: toIso(jan1),
        end: toIso(today),
    });

    // stabilize the handler identity
    const handleRangeChange = React.useCallback((r: { start: string; end: string }) => {
        setRange(r);
    }, []);

    const { mpesa, stripe, ads, total } = React.useMemo(
        () => computeRevenueForRange(transactions, campaigns, range.start, range.end),
        [range]
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Revenue</h1>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Range: <span className="font-medium">{range.start}</span> →{" "}
                    <span className="font-medium">{range.end}</span>
                </p>
            </div>

            <SummaryCards totalRevenue={total} mpesaTotal={mpesa} stripeTotal={stripe} />

            <TransactionsTable data={transactions} onRangeChange={handleRangeChange} />

            <section className="space-y-3">
                <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Advertising Revenue</h2>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Total Ad Revenue</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        {fmtUSD(ads)}
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Same range: {range.start} → {range.end}
                    </p>
                </div>
            </section>

            <CampaignsTable data={campaigns} />
        </div>
    );
}
