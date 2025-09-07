import * as React from "react";
import { SectionTitle } from "@/components/reusables/SectionTitle";

type Case = {
    id: number | string;
    ob: string;
    vin: string;
    status: "Open" | "In Progress" | "Resolved" | "Closed" | string;
    assignee: string;
};

type CasesTableProps = {
    mockCases: Case[];
    onSelect: (c: Case) => void;
};

const statusClasses: Record<string, string> = {
    Open: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    Resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    Closed: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
};

function StatusPill({ value }: { value: string }) {
    const cls =
        statusClasses[value] ?? "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300";
    return (
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${cls}`} aria-label={`Status ${value}`}>
      {value}
    </span>
    );
}

export function CasesTable({ mockCases, onSelect }: CasesTableProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-2">
                <SectionTitle>Cases</SectionTitle>
                <button
                    className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white transition-colors hover:bg-slate-800
                     dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                >
                    + New Case
                </button>
            </div>

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
                            key={c.id}
                            className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                            <td className="py-3 font-medium text-slate-900 dark:text-slate-100">Case {c.id}</td>
                            <td className="py-3 text-slate-700 dark:text-slate-300">{c.ob}</td>
                            <td className="py-3 text-slate-700 dark:text-slate-300">VIN: {c.vin}</td>
                            <td className="py-3">
                                <StatusPill value={c.status} />
                            </td>
                            <td className="py-3 text-slate-700 dark:text-slate-300">{c.assignee}</td>
                            <td className="py-3 text-right">
                                <button
                                    className="rounded-lg border border-slate-200 px-3 py-1 text-sm
                               text-slate-700 transition-colors hover:bg-slate-100
                               dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
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
