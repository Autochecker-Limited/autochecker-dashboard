"use client";

import * as React from "react";
import { fmtUSD } from "@/lib/revenue/revenue";

type Props = {
    totalRevenue: number;
    mpesaTotal: number;
    stripeTotal: number;
};

export default function SummaryCards({ totalRevenue, mpesaTotal, stripeTotal }: Props) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {fmtUSD(totalRevenue)}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="text-sm text-slate-500 dark:text-slate-400">M-Pesa</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {fmtUSD(mpesaTotal)}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="text-sm text-slate-500 dark:text-slate-400">Stripe</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {fmtUSD(stripeTotal)}
                </div>
            </div>
        </div>
    );
}
