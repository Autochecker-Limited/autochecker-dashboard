// components/sections/revenue/RevenueTSDialog.tsx
"use client";

import * as React from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import TimeSeriesRevenue from "@/components/sections/revenue/TimeSeriesRevenue";
import type { Tx, Campaign } from "@/lib/revenue/revenue";

type Props = {
    open: boolean;
    onClose: () => void;
    transactions: Tx[];
    campaigns: Campaign[];
};

export default function RevenueTSDialog({ open, onClose, transactions, campaigns }: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="absolute left-1/2 top-1/2 w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                    <div className="text-sm font-medium">Revenue TS</div>
                    <button
                        className="rounded-md border px-2 py-1 text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                        onClick={onClose}
                    >
                        <CloseOutlinedIcon fontSize="small" />
                    </button>
                </div>

                {/* Content: the reusable time-series with filters */}
                <div className="p-4">
                    <TimeSeriesRevenue transactions={transactions} campaigns={campaigns} />
                </div>
            </div>
        </div>
    );
}
