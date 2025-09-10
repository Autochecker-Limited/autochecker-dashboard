// components/sections/revenue/CampaignsTable.tsx
"use client";

import * as React from "react";
import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";
import Pager from "./Pager";
import { fmtUSD, type Campaign } from "@/lib/revenue/revenue";
import { exportCampaignsPdf } from "./PdfExport";

type Props = {
    data: Campaign[];
    /** Optional: notify parent about selected range, to keep other tiles in sync */
    onRangeChange?: (range: { start: string; end: string }) => void;
};

/* ----- local date helpers (yyyy-mm-dd, local) ----- */
function toIso(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}
function parseIsoLocal(s: string): Date {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1);
}
function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
    return aStart <= bEnd && bStart <= aEnd;
}

export default function CampaignsTable({ data, onRangeChange }: Props) {
    /* ---------- timeframe (default: this year Jan 1 → today) ---------- */
    const today = React.useMemo(() => new Date(), []);
    const jan1 = React.useMemo(() => new Date(today.getFullYear(), 0, 1), [today]);

    const [start, setStart] = React.useState<string>(toIso(jan1));
    const [end, setEnd] = React.useState<string>(toIso(today));

    // data bounds (for "All")
    const { minDate, maxDate } = React.useMemo(() => {
        if (!data.length) {
            return { minDate: jan1, maxDate: today };
        }
        const pts = data
            .flatMap((c) => [parseIsoLocal(c.start).getTime(), parseIsoLocal(c.end).getTime()])
            .filter((n) => !Number.isNaN(n));
        return {
            minDate: new Date(Math.min(...pts)),
            maxDate: new Date(Math.max(...pts)),
        };
    }, [data, jan1, today]);

    React.useEffect(() => {
        onRangeChange?.({ start, end });
    }, [start, end, onRangeChange]);

    // Quick ranges (mirrors Transactions)
    const quick = (label: "this-year" | "30d" | "90d" | "this-month" | "all") => {
        const to = new Date(Math.min(parseIsoLocal(end).getTime(), maxDate.getTime()));
        let from = new Date(to);
        if (label === "this-year") from = new Date(to.getFullYear(), 0, 1);
        else if (label === "30d") from = new Date(to.getTime() - 29 * 86400000);
        else if (label === "90d") from = new Date(to.getTime() - 89 * 86400000);
        else if (label === "this-month") from = new Date(to.getFullYear(), to.getMonth(), 1);
        else if (label === "all") from = minDate;

        const s = toIso(from);
        const e = toIso(to);
        setStart(s);
        setEnd(e);
        onRangeChange?.({ start: s, end: e });
    };

    /* ---------- filter campaigns by overlap with [start, end] ---------- */
    const filtered = React.useMemo(() => {
        const s = parseIsoLocal(start);
        const e = parseIsoLocal(end);
        return data
            .filter((c) => overlaps(parseIsoLocal(c.start), parseIsoLocal(c.end), s, e))
            .sort((a, b) => parseIsoLocal(b.start).getTime() - parseIsoLocal(a.start).getTime());
    }, [data, start, end]);

    /* ---------- pagination ---------- */
    const [pageSize, setPageSize] = React.useState<number>(5);
    const [page, setPage] = React.useState<number>(1);

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    React.useEffect(() => {
        setPage((p) => Math.min(p, totalPages));
    }, [pageSize, totalPages]);

    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const rows = React.useMemo(() => filtered.slice(startIdx, endIdx), [filtered, startIdx, endIdx]);

    return (
        <section className="space-y-3">
            {/* Header + controls */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Ad Campaigns</h2>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Quick ranges */}
                    <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                        {[
                            { k: "this-year", label: "This Year" },
                            { k: "30d", label: "Last 30d" },
                            { k: "90d", label: "Last 90d" },
                            { k: "this-month", label: "This Month" },
                            { k: "all", label: "All" },
                        ].map(({ k, label }) => (
                            <button
                                key={k}
                                onClick={() => quick(k as any)}
                                className="px-2 py-1 text-xs border-r last:border-r-0 border-slate-200 hover:bg-slate-50
                           dark:border-slate-700 dark:hover:bg-slate-800/60"
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Date pickers */}
                    <label className="text-xs text-slate-500 dark:text-slate-400">
                        Start
                        <input
                            type="date"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            className="ml-1 rounded-lg border border-slate-300 bg-white p-1.5 text-xs
                         dark:border-slate-700 dark:bg-slate-900"
                        />
                    </label>
                    <label className="text-xs text-slate-500 dark:text-slate-400">
                        End
                        <input
                            type="date"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            className="ml-1 rounded-lg border border-slate-300 bg-white p-1.5 text-xs
                         dark:border-slate-700 dark:bg-slate-900"
                        />
                    </label>

                    {/* Export current page to PDF */}
                    <button
                        onClick={() => exportCampaignsPdf(rows, fmtUSD)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/50"
                        aria-label="Export campaigns as PDF"
                        title="Export PDF"
                    >
                        <SaveAltOutlinedIcon fontSize="small" className="-ml-0.5" />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                        <tr className="text-slate-500 dark:text-slate-400">
                            <th className="px-4 py-2 font-medium">Campaign</th>
                            <th className="px-4 py-2 font-medium">Start Date</th>
                            <th className="px-4 py-2 font-medium">End Date</th>
                            <th className="px-4 py-2 font-medium">Impressions</th>
                            <th className="px-4 py-2 font-medium">Earnings</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {rows.map((c, i) => (
                            <tr key={`${c.name}-${i}`}>
                                <td className="px-4 py-2 whitespace-nowrap font-medium text-slate-900 dark:text-slate-100">
                                    {c.name}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">{c.start}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{c.end}</td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {c.impressions.toLocaleString("en-US")}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">{fmtUSD(c.earnings)}</td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400"
                                >
                                    No campaigns in the selected range.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pager
                    totalItems={total}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={(s) => {
                        setPageSize(s);
                        setPage(1);
                    }}
                />
            </div>
        </section>
    );
}
