import * as React from "react";
import { SectionTitle } from "@/components/reusables/SectionTitle";
import { mockActivity } from "@/components/constants/mockActivity";

export function ActivityFeed() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <SectionTitle>Activity Feed</SectionTitle>

            <ul className="mt-4 space-y-8">
                {mockActivity.map((a, i) => {
                    const Icon = a.icon;
                    return (
                        <li key={i} className="flex items-start gap-3">
              <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${a.color}`}
              >
                <Icon />
              </span>
                            <div>
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {a.label}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {a.time}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>

            <button
                className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-sm
                   text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700
                   dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
                View all
            </button>
        </div>
    );
}
