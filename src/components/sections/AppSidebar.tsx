"use client";

import * as React from "react";
import type {SvgIconComponent} from "@mui/icons-material";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PodcastsOutlinedIcon from "@mui/icons-material/PodcastsOutlined";
import CasesOutlinedIcon from "@mui/icons-material/CasesOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";

export type Page = "dashboard" | "cases" | "broadcasts" | "reports" | "api";

type AppSidebarProps = {
    current: Page;
    onChange: (key: Page) => void;
};

const items: { key: Page; label: string; icon: SvgIconComponent; color: string }[] = [
    {
        key: "dashboard", label: "Dashboard", icon: DashboardOutlinedIcon,
        color: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
    },
    {
        key: "cases", label: "Cases", icon: CasesOutlinedIcon,
        color: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
    },
    {
        key: "broadcasts", label: "Broadcasts", icon: PodcastsOutlinedIcon,
        color: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
    },
    {
        key: "reports", label: "Reports", icon: ArticleOutlinedIcon,
        color: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
    },
    {
        key: "api", label: "API Health", icon: MonitorHeartOutlinedIcon,
        color: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
    },
];

export function AppSidebar({current, onChange}: AppSidebarProps) {
    return (
        <aside className="hidden h-screen w-64 flex-shrink-0 border-r
        border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:block">
            {/* Brand */}
            <div className="flex items-center gap-2 px-2">
                <div className="h-8 w-8 rounded-xl bg-slate-900 dark:bg-white"/>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">AutoChecker</div>
            </div>

            {/* Nav */}
            <nav className="mt-6 space-y-1">
                {items.map((it) => {
                    const Icon = it.icon;
                    const active = current === it.key;
                    return (
                        <button
                            key={it.key}
                            onClick={() => onChange(it.key)}
                            aria-current={active ? "page" : undefined}
                            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-1 text-sm transition-colors
                ${active
                                ? "bg-emerald-200 text-emerald-600"
                                : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                        >
              <span className={`flex h-8 w-8 items-center justify-center rounded-full ${it.color}`}>
                <Icon fontSize="small"/>
              </span>
                            <span className="font-medium">{it.label}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
