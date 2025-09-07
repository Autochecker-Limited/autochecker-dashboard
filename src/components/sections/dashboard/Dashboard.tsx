// components/sections/dashboard/Dashboard.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { ActivityFeed } from "@/components/sections/dashboard/ActivityFeed";
import ChecksChart from "@/components/sections/dashboard/ChecksChart";
import { SectionTitle } from "@/components/reusables/SectionTitle";
import { StatCard } from "@/components/reusables/StatCard";
import { mockSummary, type Summary } from "@/components/constants/mockSummary";
import { mockSmallCards, type SmallCard } from "@/components/constants";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export function Dashboard() {
    const [analyticsSource, setAnalyticsSource] = useState<string | null>(null);
    const [, setReportOpen] = useState(false);

    const showAnalytics = analyticsSource !== null;

    const onSummaryClick = (c: Summary) => setAnalyticsSource(c.label);
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
                    Summary Overview
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    A general overview of the Autochecker performance and activities,
                </p>
            </div>

            {/* Layout with Activity Feed on the right */}
            <div className="grid grid-cols-1 gap-6 md:gap-8 xl:grid-cols-3">
                {/* LEFT: Summary (4-up) + Small cards (3-up) + optional Analytics */}
                <div className="space-y-6 md:space-y-8 xl:col-span-2">
                    {/* Top summary cards (4 in a row on xl) */}
                    <div className="grid grid-cols-1 gap-4 md:gap-5 xl:gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {mockSummary.map((c) => (
                            <StatCard
                                key={c.label}
                                {...c}
                                density="roomy"
                                onClick={() => onSummaryClick(c)}
                            />
                        ))}
                    </div>

                    {/* Small stat cards (3 in a row on lg) */}
                    <div className="grid grid-cols-1 gap-4 md:gap-5 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10 md:mt-12">
                        {mockSmallCards.map((c) => (
                            <div
                                key={c.label}
                                className="cursor-pointer"
                                onClick={() => onSmallCardClick(c)}
                            >
                                <StatCard label={c.label} value={c.value} icon={null} density="cozy" />
                            </div>
                        ))}
                    </div>

                    {/* Analytics block (conditional, still on the left) */}
                    {showAnalytics && (
                        <div className="space-y-5 md:space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <SectionTitle>Analytics Summary</SectionTitle>
                                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Source: {analyticsSource}
                  </span>
                                    <button
                                        onClick={() => setAnalyticsSource(null)}
                                        className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                        aria-label="Close analytics"
                                        title="Close analytics"
                                    >
                                        <CloseOutlinedIcon fontSize="small" />
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <ChecksChart focus="both" />
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT: Activity Feed (always on the right) */}
                <div className="xl:mt-0">
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
