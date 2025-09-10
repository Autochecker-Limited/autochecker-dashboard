"use client";

import * as React from "react";
import ChecksChart from "@/components/sections/dashboard/ChecksChart";
import { SectionTitle } from "@/components/reusables/SectionTitle";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

type Props = {
    source: string;
    onClose: () => void;
};

export default function AnalyticsPanel({ source, onClose }: Props) {
    return (
        <div className="space-y-5 md:space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <SectionTitle>Analytics Summary</SectionTitle>
                <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Source: {source}
          </span>
                    <button
                        onClick={onClose}
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
    );
}
