import * as React from "react";
import type { Case } from "@/components/constants";

type CasesTableProps = {
    mockCases: Case[];
    onSelect: (c: Case) => void;
};

const statusClasses: Record<string, string> = {
    "Pending Review": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    Approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    Duplicate: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
    Broadcasted: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
    "Manual Review": "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
};

function StatusPill({ value }: { value: string }) {
    const cls =
        statusClasses[value] ?? "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300";
    return <span className={`rounded-full px-2 py-1 text-xs font-medium ${cls}`}>{value}</span>;
}

export function CasesTable({ mockCases, onSelect }: CasesTableProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead>
                    <tr className="text-slate-500 dark:text-slate-400">
                        <th className="py-2 font-medium">Case ID</th>
                        <th className="py-2 font-medium">OB Number</th>
                        <th className="py-2 font-medium">VIN/Plate</th>
                        <th className="py-2 font-medium">Status</th>
                        <th className="py-2 font-medium">Assigned To</th>
                        <th className="py-2" />
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {mockCases.map((c) => (
                        <tr
                            key={String(c.id)}
                            className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                            <td className="py-3 font-medium text-slate-900 dark:text-slate-100">Case {c.id}</td>
                            <td className="py-3 text-slate-700 dark:text-slate-300">{c.ob}</td>
                            <td className="py-3 text-slate-700 dark:text-slate-300">
                                {c.plate ? `Plate: ${c.plate}` : `VIN: ${c.vin}`}
                            </td>
                            <td className="py-3">
                                <StatusPill value={c.status} />
                            </td>
                            <td className="py-3 text-slate-700 dark:text-slate-300">{c.assignee}</td>
                            <td className="py-3 text-right">
                                <button
                                    className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                                    onClick={() => onSelect(c)}
                                    aria-label={`View case ${c.id}`}
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
