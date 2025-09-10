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
};

export default function TransactionsTable({ data }: Props) {
    const [pageSize, setPageSize] = React.useState<number>(5);
    const [page, setPage] = React.useState<number>(1);

    const total = data.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    React.useEffect(() => {
        setPage((p) => Math.min(p, totalPages));
    }, [pageSize, totalPages]);

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const rows = React.useMemo(() => data.slice(start, end), [data, start, end]);

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Transactions</h2>
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
