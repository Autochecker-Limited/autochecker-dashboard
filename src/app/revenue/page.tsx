"use client";

import * as React from "react";
import { transactions, campaigns } from "@/components/constants/revenue.mock";
import { computeRevenueTotals } from "@/lib/revenue/revenue";
import SummaryCards from "@/components/sections/revenue/SummaryCards";
import TransactionsTable from "@/components/sections/revenue/TransactionsTable";
import CampaignsTable from "@/components/sections/revenue/CampaignsTable";


export default function RevenuePage() {
    const { mpesaTotal, stripeTotal, adsTotal, totalRevenue } = React.useMemo(
        () => computeRevenueTotals(transactions, campaigns),
        []
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Revenue</h1>
            </div>

            {/* Top summary cards */}
            <SummaryCards
                totalRevenue={totalRevenue}
                mpesaTotal={mpesaTotal}
                stripeTotal={stripeTotal}
            />

            {/* Transactions */}
            <TransactionsTable data={transactions} />

            {/* Advertising Revenue quick card */}
            <section className="space-y-3">
                <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Advertising Revenue</h2>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Total Ad Revenue</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        {/* Use same compute result so it's consistent */}
                        {/* You can also recompute adsTotal here if you prefer */}
                        ${adsTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
            </section>

            {/* Ad Campaigns */}
            <CampaignsTable data={campaigns} />
        </div>
    );
}
