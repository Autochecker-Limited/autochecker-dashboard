// components/sections/dashboard/Dashboard.tsx
"use client";

import * as React from "react";
import {useMemo, useState} from "react";
import {ActivityFeed} from "@/components/sections/dashboard/ActivityFeed";
import ChecksChart from "@/components/sections/dashboard/ChecksChart";
import {SectionTitle} from "@/components/reusables/SectionTitle";
import {StatCard} from "@/components/reusables/StatCard";
import {mockSummary, type Summary} from "@/components/constants/mockSummary";
import {mockSmallCards, type SmallCard} from "@/components/constants";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";


// live revenue data & formatter
import {transactions, campaigns} from "@/components/constants/revenue.mock";
import {computeRevenueTotals, fmtUSD} from "@/lib/revenue/revenue";
import {computeMoMDelta} from "@/lib/revenue/revenue-metrics";

// NEW: the Revenue TS dialog
import RevenueTSDialog from "@/components/sections/revenue/RevenueTSDialog";

export function Dashboard() {
    const [analyticsSource, setAnalyticsSource] = useState<string | null>(null);
    const [, setReportOpen] = useState(false);

    // open/close "Revenue TS"
    const [tsOpen, setTsOpen] = useState(false);

    const {totalRevenue} = useMemo(
        () => computeRevenueTotals(transactions, campaigns),
        []
    );

    // compute MoM once
    const { currentTotal, previousTotal, deltaPct, deltaLabel, direction } = React.useMemo(
        () => computeMoMDelta(transactions, campaigns),
        []
    );

// use MoM values on the revenue card
    const summaryCards: Summary[] = React.useMemo(
        () =>
            mockSummary.map((c) =>
                c.label === "Total Revenue"
                    ? { ...c, value: fmtUSD(currentTotal), delta: deltaLabel }
                    : c
            ),
        [currentTotal, deltaLabel]
    );

    const onSummaryClick = (c: Summary) => {
        if (c.label === "Total Revenue") {
            setTsOpen(true); // ⬅️ open the Time Series dialog
            return;
        }
        setAnalyticsSource(c.label);
    };

    const onSmallCardClick = (c: SmallCard) => {
        if (c.label === "Stolen Reports (Week)") {
            setAnalyticsSource("Stolen Reports (Week)");
            setReportOpen(true);
        }
    };


    return (
        <div className="space-y-8 md:space-y-10">
            {/* Header */}
            <div className="space-y-2 md:space-y-3 pb-2 md:pb-3">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Monthly Summary Overview
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    A general overview of the Autochecker performance and activities in the present month,
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:gap-8 xl:grid-cols-3">
                {/* LEFT */}
                <div className="space-y-6 md:space-y-8 xl:col-span-2">
                    {/* Top summary cards */}
                    <div className="grid grid-cols-1 gap-4 md:gap-5 xl:gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {summaryCards.map((c) => {
                            const isRevenue = c.label === "Total Revenue";

                            // Build a spacious footer for desktop & mobile
                            const footer =
                                isRevenue ? (
                                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                                        <dl className="grid grid-cols-1 gap-3 text-[12px] md:grid-cols-3">
                                            <div>
                                                <dt className="text-slate-500 dark:text-slate-400">This month</dt>
                                                <dd className="font-medium text-slate-900 dark:text-slate-100">
                                                    {fmtUSD(currentTotal)}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-slate-500 dark:text-slate-400">Last month</dt>
                                                <dd className="font-medium text-slate-900 dark:text-slate-100">
                                                    {fmtUSD(previousTotal)}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-slate-500 dark:text-slate-400">Change</dt>
                                                <dd
                                                    className={`font-semibold ${
                                                        direction === "down"
                                                            ? "text-rose-600"
                                                            : direction === "up"
                                                                ? "text-emerald-600"
                                                                : "text-slate-500"
                                                    }`}
                                                >
                                                    {direction === "down" ? "↓" : direction === "up" ? "↑" : "→"}{" "}
                                                    {Math.abs(deltaPct).toFixed(1)}%
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                ) : null;

                            return (
                                <div
                                    key={c.label}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => onSummaryClick(c)}
                                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSummaryClick(c)}
                                    className={`relative ${isRevenue ? "cursor-pointer hover:ring-2 hover:ring-emerald-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-2xl" : ""}`}
                                    aria-label={isRevenue ? "Click to view Revenue TS" : undefined}
                                    title={isRevenue ? "Click to view Revenue TS" : undefined}
                                >
                                    {isRevenue && (
                                        <>
                                        <span className="absolute right-2 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                                          Revenue TS
                                        </span>

                                            {/* bottom overlay stays */}
                                            <div className="pointer-events-none absolute left-4 bottom-3 right-4 text-[11px] leading-tight text-slate-500 dark:text-slate-400 space-y-1">
                                                <div>This month: <span className="font-medium text-slate-700 dark:text-slate-200 ">{fmtUSD(currentTotal)}</span></div>
                                                <div>Last month: <span className="font-medium text-slate-700 dark:text-slate-200">{fmtUSD(previousTotal)}</span></div>
                                                <div className="mt-1">
                                                    Change from last month to this month:{" "}
                                                    <span className={`font-semibold ${direction === "down" ? "text-rose-600" : direction === "up" ? "text-emerald-600" : "text-slate-500"}`}>
                                                  {direction === "down" ? "↓" : direction === "up" ? "↑" : "→"} {Math.abs(deltaPct).toFixed(1)}%
                                                </span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* reserve space so overlay doesn't overlap */}
                                    <div className={isRevenue ? "pb-16 md:pb-20" : ""}>
                                        {/* ❗ Hide the top-right delta pill ONLY for Total Revenue */}
                                        <StatCard {...c} density="roomy" delta={isRevenue ? undefined : c.delta} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>



                    {/* Small cards */}
                    <div
                        className="grid grid-cols-1 gap-4 md:gap-5 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10 md:mt-12">
                        {mockSmallCards.map((c) => (
                            <div key={c.label} className="cursor-pointer" onClick={() => onSmallCardClick(c)}>
                                <StatCard label={c.label} value={c.value} icon={null} density="cozy"/>
                            </div>
                        ))}
                    </div>

                    {/* Optional analytics block */}
                    {analyticsSource && (
                        <div className="space-y-5 md:space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <SectionTitle>Analytics Summary</SectionTitle>
                                <div className="flex items-center gap-2">
                  <span
                      className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Source: {analyticsSource}
                  </span>
                                    <button
                                        onClick={() => setAnalyticsSource(null)}
                                        className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                        aria-label="Close analytics"
                                        title="Close analytics"
                                    >
                                        <CloseOutlinedIcon fontSize="small"/>
                                    </button>
                                </div>
                            </div>

                            <div
                                className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <ChecksChart focus="both"/>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT */}
                <div className="xl:mt-0">
                    <ActivityFeed/>
                </div>
            </div>

            {/* ⬇️ New Revenue TS modal */}
            <RevenueTSDialog
                open={tsOpen}
                onClose={() => setTsOpen(false)}
                transactions={transactions}
                campaigns={campaigns}
            />
        </div>
    );
}

export default Dashboard;
