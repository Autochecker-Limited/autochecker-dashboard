"use client";

import * as React from "react";
import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";
import Pager from "./Pager";
import { fmtUSD, type Campaign } from "@/lib/revenue/revenue";
import { exportCampaignsPdf } from "./PdfExport";

type Props = { data: Campaign[] };

export default function CampaignsTable({ data }: Props) {
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
                <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Ad Campaigns</h2>
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
                                <td className="px-4 py-2 whitespace-nowrap font-medium text-slate-900 dark:text-slate-100">{c.name}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{c.start}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{c.end}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{c.impressions.toLocaleString("en-US")}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{fmtUSD(c.earnings)}</td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                    No campaigns to show.
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
