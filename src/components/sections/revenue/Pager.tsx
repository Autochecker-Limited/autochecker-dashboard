"use client";

import * as React from "react";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export type PagerProps = {
    totalItems: number;
    page: number;
    pageSize: number;
    onPageChange: (p: number) => void;
    onPageSizeChange: (s: number) => void;
};

function makePageNumbers(totalPages: number) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
}

export default function Pager({
                                  totalItems,
                                  page,
                                  pageSize,
                                  onPageChange,
                                  onPageSizeChange,
                              }: PagerProps) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const pages = makePageNumbers(totalPages);
    const canPrev = page > 1;
    const canNext = page < totalPages;

    return (
        <div className="flex flex-col gap-2 border-top border-slate-200 p-2 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            {/* Rows per page */}
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span>Rows per page:</span>
                <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                    {PAGE_SIZE_OPTIONS.map((opt, idx) => {
                        const active = opt === pageSize;
                        return (
                            <button
                                key={opt}
                                onClick={() => onPageSizeChange(opt)}
                                className={`px-2 py-1 transition-colors ${
                                    active
                                        ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                                        : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                } ${idx > 0 ? "border-l border-slate-200 dark:border-slate-700" : ""}`}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Page numbers */}
            <div className="flex items-center justify-end gap-1">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={!canPrev}
                    className="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800/60"
                >
                    « First
                </button>
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={!canPrev}
                    className="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800/60"
                >
                    ‹ Prev
                </button>

                {pages.map((p) => {
                    const active = p === page;
                    return (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`min-w-8 rounded-md px-2 py-1 text-xs ${
                                active
                                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                            }`}
                        >
                            {p}
                        </button>
                    );
                })}

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={!canNext}
                    className="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800/60"
                >
                    Next ›
                </button>
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={!canNext}
                    className="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800/60"
                >
                    Last »
                </button>
            </div>
        </div>
    );
}
