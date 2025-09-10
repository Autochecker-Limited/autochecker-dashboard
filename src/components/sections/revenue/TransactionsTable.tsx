"use client";

import * as React from "react";
import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";
import Pager from "./Pager";
import { fmtUSD, type Tx } from "@/lib/revenue/revenue";
import { exportTransactionsPdf } from "./PdfExport";

type TxStatus = "Completed" | "Failed";

const pill = (status: TxStatus) =>
    status === "Completed"
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
        : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400";

type Props = {
    data: Tx[];
    onRangeChange?: (range: { start: string; end: string }) => void;
};

/* Local ISO helper (yyyy-mm-dd, no TZ shifts) */
function toIso(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

// 🔒 Strongly-type the quick-range keys so no `any` cast is needed
type QuickKey = "this-year" | "30d" | "90d" | "this-month" | "all";
const QUICK_OPTIONS: ReadonlyArray<{ k: QuickKey; label: string }> = [
    { k: "this-year", label: "This Year" },
    { k: "30d", label: "Last 30d" },
    { k: "90d", label: "Last 90d" },
    { k: "this-month", label: "This Month" },
    { k: "all", label: "All" },
];

export default function TransactionsTable({ data, onRangeChange }: Props) {
    // ----- Timeframe controls (default: this year) -----
    const today = React.useMemo(() => new Date(), []);
    const jan1 = React.useMemo(() => new Date(today.getFullYear(), 0, 1), [today]);

    const [start, setStart] = React.useState<string>(toIso(jan1));
    const [end, setEnd] = React.useState<string>(toIso(today));

    // Notify parent ONLY when start/end change (don’t depend on handler identity)
    React.useEffect(() => {
        if (onRangeChange) onRangeChange({ start, end });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, end]);

    const quick = (label: QuickKey) => {
        const to = new Date(end);
        let from = new Date(to);
        if (label === "this-year") from = new Date(to.getFullYear(), 0, 1);
        else if (label === "30d") from = new Date(to.getTime() - 29 * 86400000);
        else if (label === "90d") from = new Date(to.getTime() - 89 * 86400000);
        else if (label === "this-month") from = new Date(to.getFullYear(), to.getMonth(), 1);
        else if (label === "all") from = new Date(1970, 0, 1);

        setStart(toIso(from));
        setEnd(toIso(to));
    };

    // ----- Pagination -----
    const [pageSize, setPageSize] = React.useState<number>(5);
    const [page, setPage] = React.useState<number>(1);

    const total = data.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    React.useEffect(() => {
        setPage((p) => Math.min(p, totalPages));
    }, [pageSize, totalPages]);

    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const rows = React.useMemo(() => data.slice(startIdx, endIdx), [data, startIdx, endIdx]);

    return (
        <section className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Transactions</h2>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Quick ranges */}
                    <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                        {QUICK_OPTIONS.map(({ k, label }, idx) => (
                            <button
                                key={k}
                                onClick={() => quick(k)}
                                className={`px-2 py-1 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                                    idx < QUICK_OPTIONS.length - 1
                                        ? "border-r border-slate-200 dark:border-slate-700"
                                        : ""
                                }`}
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
                            className="ml-1 rounded-lg border border-slate-300 bg-white p-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                        />
                    </label>
                    <label className="text-xs text-slate-500 dark:text-slate-400">
                        End
                        <input
                            type="date"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            className="ml-1 rounded-lg border border-slate-300 bg-white p-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                        />
                    </label>

                    {/* Export current page to PDF */}
                    <button
                        onClick={() => exportTransactionsPdf(rows, fmtUSD)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/50"
                        aria-label="Export transactions as PDF"
                        title="Export PDF"
                    >
                        <SaveAltOutlinedIcon fontSize="small" className="-ml-0.5" />
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                        <tr className="text-slate-500 dark:text-slate-400">
                            <th className="px-4 py-2 font-medium">Date</th>
                            <th className="px-4 py-2 font-medium">Amount</th>
                            <th className="px-4 py-2 font-medium">Type</th>
                            <th className="px-4 py-2 font-medium">Status</th>
                            <th className="px-4 py-2 font-medium">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {rows.map((t, i) => (
                            <tr key={`${t.date}-${i}`} className="text-slate-800 dark:text-slate-200">
                                <td className="px-4 py-2 whitespace-nowrap">{t.date}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{fmtUSD(t.amount)}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{t.type}</td>
                                <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${pill(t.status as TxStatus)}`}>
                      {t.status}
                    </span>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {t.status === "Failed" ? (
                                        <button className="rounded-md px-2 py-1 text-xs text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-500/10">
                                            Retry
                                        </button>
                                    ) : t.type === "Stripe" ? (
                                        <button className="rounded-md px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50">
                                            Resend Receipt
                                        </button>
                                    ) : (
                                        <button className="rounded-md px-2 py-1 text-xs text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10">
                                            Refund
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                    No transactions in the selected range.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

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
