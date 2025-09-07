"use client";

import * as React from "react";
import {useState} from "react";
import {ModeToggle} from "@/components/theme/ModeToggle";
import {Dashboard} from "@/components/sections/dashboard/Dashboard";
import {CasesPage} from "@/components/sections/Cases/CasesPage";
import {AppSidebar} from "@/components/sections/AppSidebar";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

type Page = "dashboard" | "cases";

export default function Home() {
    const [page, setPage] = useState<Page>("dashboard");

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar on the left */}
            <AppSidebar current={page} onChange={(key) => setPage(key as Page)}/>


            {/* Right content area */}
            <div className="flex flex-1 flex-col">
                {/* Top bar stays above content */}
                <header
                    className="sticky top-0 z-10 border-b border-slate-200 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
                    <div className="mx-auto flex max-w-7xl items-center justify-end px-4 py-3 md:px-6 gap-4">
                        <button className=" h-6 w-6 transition-all
                         text-emerald-500 dark:text-cyan-400 relative flex items-center justify-center rounded-full p-3">
                            <NotificationsNoneOutlinedIcon/>
                        </button>
                        <ModeToggle/>
                    </div>
                </header>

                {/* Page content */}
                <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
                    {page === "dashboard" && <Dashboard/>}
                    {page === "cases" && <CasesPage/>}
                    {page !== "dashboard" && page !== "cases" && (
                        <div
                            className="rounded-2xl border bg-white p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                            This section is a placeholder for the {page} page.
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
