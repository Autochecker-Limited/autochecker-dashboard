// components/sections/dashboard/RevenueCompareDialog.tsx
"use client";

import * as React from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
} from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import {
    fmtUSD,
    computeRevenueForRange,
    monthBounds,
    availableMonthsFromData,
    type Tx,
    type Campaign,
} from "@/lib/revenue";
import {
    buildWeeklyCompareDataset,
} from "@/lib/revenue-weekly";

type Props = {
    open: boolean;
    onClose: () => void;
    transactions: Tx[];
    campaigns: Campaign[];
};

type Mode = "months" | "range";

// Colors
const EMERALD = "#10b981"; // Range A
const CYAN = "#06b6d4";    // Range B

export default function RevenueCompareDialog({ open, onClose, transactions, campaigns }: Props) {
    const months = React.useMemo(
        () => availableMonthsFromData(transactions, campaigns),
        [transactions, campaigns]
    );

    const [mode, setMode] = React.useState<Mode>("months");
    const [leftMonth, setLeftMonth] = React.useState<string>(months[0] || "2025-09");
    const [rightMonth, setRightMonth] = React.useState<string>(months[1] || "2025-08");

    const initialLeft = monthBounds(leftMonth);
    const initialRight = monthBounds(rightMonth);

    const [leftStart, setLeftStart] = React.useState<string>(initialLeft.start);
    const [leftEnd, setLeftEnd] = React.useState<string>(initialLeft.end);
    const [rightStart, setRightStart] = React.useState<string>(initialRight.start);
    const [rightEnd, setRightEnd] = React.useState<string>(initialRight.end);

    // Keep date ranges synced to month pickers when "months" mode is active
    React.useEffect(() => {
        if (mode === "months") {
            const a = monthBounds(leftMonth);
            const b = monthBounds(rightMonth);
            setLeftStart(a.start); setLeftEnd(a.end);
            setRightStart(b.start); setRightEnd(b.end);
        }
    }, [mode, leftMonth, rightMonth]);

    // Top tiles (totals per selected ranges)
    const leftTotals = React.useMemo(
        () => computeRevenueForRange(transactions, campaigns, leftStart, leftEnd),
        [transactions, campaigns, leftStart, leftEnd]
    );
    const rightTotals = React.useMemo(
        () => computeRevenueForRange(transactions, campaigns, rightStart, rightEnd),
        [transactions, campaigns, rightStart, rightEnd]
    );

    // Weekly dataset (ensures a data point for every week)
    const weeklyData = React.useMemo(
        () =>
            buildWeeklyCompareDataset(
                transactions,
                campaigns,
                leftStart,
                leftEnd,
                rightStart,
                rightEnd
            ),
        [transactions, campaigns, leftStart, leftEnd, rightStart, rightEnd]
    );

    if (!open) return null;

    // Simple date label for X-axis ticks (MMM DD)
    const tickFormat = (weekISO: string) => {
        // weekISO is "YYYY-MM-DD"
        const d = new Date(`${weekISO}T00:00:00`);
        return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
    };

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="absolute left-1/2 top-1/2 w-[95vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                    <div className="text-sm font-medium">Compare Revenue (Weekly)</div>
                    <button
                        className="rounded-md border px-2 py-1 text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                        onClick={onClose}
                    >
                        <CloseOutlinedIcon fontSize="small" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Mode toggle */}
                    <div className="flex gap-2 text-xs">
                        <button
                            onClick={() => setMode("months")}
                            className={`rounded-md px-2 py-1 border ${
                                mode === "months" ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                            } border-slate-200 dark:border-slate-700`}
                        >
                            Compare Months
                        </button>
                        <button
                            onClick={() => setMode("range")}
                            className={`rounded-md px-2 py-1 border ${
                                mode === "range" ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                            } border-slate-200 dark:border-slate-700`}
                        >
                            Custom Ranges
                        </button>
                    </div>

                    {/* Controls */}
                    {mode === "months" ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                            <label className="text-xs text-slate-500 dark:text-slate-400">
                                Left Month
                                <select
                                    value={leftMonth}
                                    onChange={(e) => setLeftMonth(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                                >
                                    {months.map((m) => (
                                        <option key={m} value={m}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="text-xs text-slate-500 dark:text-slate-400">
                                Right Month
                                <select
                                    value={rightMonth}
                                    onChange={(e) => setRightMonth(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                                >
                                    {months.map((m) => (
                                        <option key={m} value={m}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="grid grid-cols-2 gap-2">
                                <label className="text-xs text-slate-500 dark:text-slate-400">
                                    A Start
                                    <input
                                        type="date"
                                        value={leftStart}
                                        onChange={(e) => setLeftStart(e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                                    />
                                </label>
                                <label className="text-xs text-slate-500 dark:text-slate-400">
                                    A End
                                    <input
                                        type="date"
                                        value={leftEnd}
                                        onChange={(e) => setLeftEnd(e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                                    />
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <label className="text-xs text-slate-500 dark:text-slate-400">
                                    B Start
                                    <input
                                        type="date"
                                        value={rightStart}
                                        onChange={(e) => setRightStart(e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                                    />
                                </label>
                                <label className="text-xs text-slate-500 dark:text-slate-400">
                                    B End
                                    <input
                                        type="date"
                                        value={rightEnd}
                                        onChange={(e) => setRightEnd(e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                                    />
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Summary tiles */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="rounded-xl border p-3 dark:border-slate-700">
                            <div className="font-medium">{mode === "months" ? leftMonth : "Range A"}</div>
                            <div className="mt-1 space-y-1 text-slate-600 dark:text-slate-300">
                                <div>
                                    Total:{" "}
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {fmtUSD(leftTotals.total)}
                  </span>
                                </div>
                                <div>M-Pesa: {fmtUSD(leftTotals.mpesa)}</div>
                                <div>Stripe: {fmtUSD(leftTotals.stripe)}</div>
                                <div>Ads: {fmtUSD(leftTotals.ads)}</div>
                            </div>
                        </div>
                        <div className="rounded-xl border p-3 dark:border-slate-700">
                            <div className="font-medium">{mode === "months" ? rightMonth : "Range B"}</div>
                            <div className="mt-1 space-y-1 text-slate-600 dark:text-slate-300">
                                <div>
                                    Total:{" "}
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {fmtUSD(rightTotals.total)}
                  </span>
                                </div>
                                <div>M-Pesa: {fmtUSD(rightTotals.mpesa)}</div>
                                <div>Stripe: {fmtUSD(rightTotals.stripe)}</div>
                                <div>Ads: {fmtUSD(rightTotals.ads)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Weekly line chart (a point for every week) */}
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyData} margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                                <XAxis dataKey="week" tickFormatter={tickFormat} />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={(label: string) => `Week of ${tickFormat(label)}`}
                                    formatter={(value: ValueType, _name: NameType) =>
                                        typeof value === "number" ? fmtUSD(value) : String(value)
                                    }
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="A"
                                    name={mode === "months" ? leftMonth : "Range A"}
                                    stroke={EMERALD}
                                    strokeWidth={2.25}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="B"
                                    name={mode === "months" ? rightMonth : "Range B"}
                                    stroke={CYAN}
                                    strokeWidth={2.25}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
