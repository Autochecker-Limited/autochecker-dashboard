
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CasesOutlinedIcon from "@mui/icons-material/CasesOutlined";
import PodcastsOutlinedIcon from "@mui/icons-material/PodcastsOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';

type Item = { href: string; label: string; Icon: typeof DashboardOutlinedIcon };

const items: Item[] = [
    { href: "/dashboard", label: "Dashboard", Icon: DashboardOutlinedIcon },
    { href: "/cases", label: "Cases", Icon: CasesOutlinedIcon },
    { href: "/revenue", label: "Revenue", Icon: MonetizationOnOutlinedIcon },
    { href: "/broadcasts", label: "Broadcasts", Icon: PodcastsOutlinedIcon },
    { href: "/reports", label: "Reports", Icon: ArticleOutlinedIcon },
    { href: "/api-health", label: "API Health", Icon: MonitorHeartOutlinedIcon },
];

export function AppSidebar() {
    const pathname = usePathname();

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/");

    return (
        <aside className="hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:block">
            {/* Brand */}
            <div className="flex items-center gap-2 px-2">
                <div className="h-8 w-8 rounded-xl bg-slate-900 dark:bg-white" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    AutoChecker
                </div>
            </div>

            {/* Nav */}
            <nav className="mt-6 space-y-1" aria-label="Primary">
                {items.map(({ href, label, Icon }) => {
                    const active = isActive(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={`group flex items-center gap-3 rounded-md px-3 py-1 text-sm transition-colors
                ${
                                active
                                    ? "bg-emerald-200 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-300"
                                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50"
                            }`}
                        >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                <Icon fontSize="small" />
              </span>
                            <span className="font-medium">{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

export default AppSidebar;
