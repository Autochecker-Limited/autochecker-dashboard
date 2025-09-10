// components/sections/revenue/TimeSeriesRevenue.tsx
"use client";

import * as React from "react";
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

import { type Tx, type Campaign } from "@/lib/revenue";
import {
    aggregateSeries,
    buildDailySeries,
    findDataBounds,
    tickLabel,
    tooltipValueFormatter,
    type Granularity,
    tinyTickLabel,
} from "@/lib/time-series-utils";

// Colors (Tailwind palette)
const EMERALD = "#10b981"; // M-Pesa
const CYAN = "#06b6d4";    // Stripe
const PURPLE = "#8b5cf6";  // Ads
const SLATE = "#64748b";   // Total (optional dashed)

type Props = {
    transactions: Tx[];
    campaigns: Campaign[];
};

type QuickKey = "7d" | "30d" | "90d" | "this-month" | "ytd" | "all";

const QUICK_OPTIONS: ReadonlyArray<{ key: QuickKey; label: string }> = [
    { key: "7d",         label: "Last 7d" },
    { key: "30d",        label: "Last 30d" },
    { key: "90d",        label: "Last 90d" },
    { key: "this-month", label: "This Month" },
    { key: "ytd",        label: "YTD" },
    { key: "all",        label: "All" },
] as const;

export default function TimeSeriesRevenue({ transactions, campaigns }: Props) {
    // Bounds from data
    const { min, max } = React.useMemo(
        () => findDataBounds(transactions, campaigns),
        [transactions, campaigns]
    );

    // Default last 30 days
    const defaultEnd = new Date(max);
    const defaultStart = new Date(defaultEnd.getTime() - 29 * 24 * 60 * 60 * 1000);

    const [start, setStart] = React.useState<string>(toIso(defaultStart));
    const [end, setEnd] = React.useState<string>(toIso(defaultEnd));
    const [granularity, setGranularity] = React.useState<Granularity>("daily");
    const [show, setShow] = React.useState({
        mpesa: true,
        stripe: true,
        ads: true,
        total: false, // optional
    });

    // Build + aggregate
    const daily = React.useMemo(
        () => buildDailySeries(transactions, campaigns, start, end, { distributeAds: "even" }),
        [transactions, campaigns, start, end]
    );
    const data = React.useMemo(() => aggregateSeries(daily, granularity), [daily, granularity]);

    // Keep at most ~8 x-axis labels
    const ticks = React.useMemo<string[]>(() => {
        const maxTicks = 8;
        const step = Math.max(1, Math.ceil(data.length / maxTicks));
        return data.map((d) => d.date).filter((_, i) => i % step === 0);
    }, [data]);

    // Typed quick-range setter
    const quick = (label: QuickKey) => {
        const to = new Date(max);
        let from = new Date(to);
        if (label === "7d") from = new Date(to.getTime() - 6 * 24 * 60 * 60 * 1000);
        else if (label === "30d") from = new Date(to.getTime() - 29 * 24 * 60 * 60 * 1000);
        else if (label === "90d") from = new Date(to.getTime() - 89 * 24 * 60 * 60 * 1000);
        else if (label === "this-month") from = new Date(to.getFullYear(), to.getMonth(), 1);
        else if (label === "ytd") from = new Date(to.getFullYear(), 0, 1);
        else if (label === "all") from = new Date(min);
        setStart(toIso(from));
        setEnd(toIso(to));
    };

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Quick ranges:</span>
                    {QUICK_OPTIONS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => quick(key)}
                            className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60"
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <label className="text-xs text-slate-500 dark:text-slate-400">
                        Start
                        <input
                            type="date"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            className="ml-1 rounded-lg border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                        />
                    </label>
                    <label className="text-xs text-slate-500 dark:text-slate-400">
                        End
                        <input
                            type="date"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            className="ml-1 rounded-lg border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                        />
                    </label>

                    <div className="ml-2 inline-flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                        {(["daily", "weekly", "monthly"] as const).map((g) => (
                            <button
                                key={g}
                                onClick={() => setGranularity(g)}
                                className={`px-2 py-1 text-xs ${
                                    granularity === g ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                }`}
                            >
                                {g[0].toUpperCase() + g.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Channel toggles */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
                {([
                    ["mpesa", "M-Pesa"],
                    ["stripe", "Stripe"],
                    ["ads", "Ads"],
                    ["total", "Total"],
                ] as const).map(([k, label]) => (
                    <label key={k} className="flex items-center gap-1 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={show[k]}
                            onChange={(e) => setShow((s) => ({ ...s, [k]: e.target.checked }))}
                        />
                        <span>{label}</span>
                    </label>
                ))}
            </div>

            {/* Chart */}
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                        <XAxis
                            dataKey="date"
                            ticks={ticks}
                            interval={0}
                            minTickGap={12}
                            tick={{ fontSize: 10 }}
                            tickFormatter={(v: string) => tinyTickLabel(v, granularity)}
                        />
                        <YAxis />
                        <Tooltip
                            labelFormatter={(label: string) =>
                                `${granularity === "monthly" ? "Month of" : "Week/Day of"} ${tickLabel(label, granularity)}`
                            }
                            formatter={(value: ValueType, _name: NameType) => tooltipValueFormatter(value)}
                        />
                        <Legend />

                        {show.mpesa && (
                            <Line type="monotone" dataKey="M-Pesa" stroke={EMERALD} strokeWidth={2.25} dot={{ r: 2.5 }} activeDot={{ r: 4 }} />
                        )}
                        {show.stripe && (
                            <Line type="monotone" dataKey="Stripe" stroke={CYAN} strokeWidth={2.25} dot={{ r: 2.5 }} activeDot={{ r: 4 }} />
                        )}
                        {show.ads && (
                            <Line type="monotone" dataKey="Ads" stroke={PURPLE} strokeWidth={2.25} dot={{ r: 2.5 }} activeDot={{ r: 4 }} />
                        )}
                        {show.total && (
                            <Line type="monotone" dataKey="Total" stroke={SLATE} strokeDasharray="5 5" strokeWidth={2} dot={{ r: 2 }} />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

/* local */
function toIso(d: Date) {
    return d.toISOString().slice(0, 10);
}
