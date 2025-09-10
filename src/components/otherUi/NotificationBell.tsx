"use client";

import * as React from "react";
import {Bell} from "lucide-react";

export type Notification = {
    id: string;
    title: string;
    detail?: string;
    time: string;     // e.g. "10m ago"
    read?: boolean;   // true = muted style, false/undefined = bold/bright
};

type Props = {
    initial?: Notification[];
    /** If provided, overrides the computed unread count shown on the bell */
    count?: number;
};

export function NotificationBell({initial, count}: Props) {
    const [open, setOpen] = React.useState(false);
    const [items, setItems] = React.useState<Notification[]>(
        initial ?? [
            {id: "1", title: "New stolen report", detail: "OB2025-014 added", time: "10m ago", read: false},
            {id: "2", title: "Broadcast sent", detail: "Case 12345", time: "1h ago", read: false},
            {id: "3", title: "VIN check complete", detail: "XYZ123 • Match", time: "2h ago", read: true},
        ]
    );

    // unread count (overridden by `count` if provided)
    const computedUnread = items.filter((i) => !i.read).length;
    const unread = typeof count === "number" ? count : computedUnread;
    const badgeText = unread > 99 ? "99+" : String(unread);

    const btnRef = React.useRef<HTMLButtonElement | null>(null);
    const popRef = React.useRef<HTMLDivElement | null>(null);

    // Close on outside click / Esc
    React.useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!open) return;
            const t = e.target as Node;
            if (popRef.current?.contains(t) || btnRef.current?.contains(t)) return;
            setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("mousedown", onClick);
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("mousedown", onClick);
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const markAllRead = () => setItems((p) => p.map((n) => ({...n, read: true})));

    return (
        <div className="relative">
            {/* Bell button */}
            <button
                ref={btnRef}
                type="button"
                onClick={() => setOpen(v => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={`Notifications${unread ? `: ${badgeText} unread` : ""}`}
                className="group relative flex h-9 w-9 items-center justify-center rounded-full
             border border-slate-200 hover:bg-slate-100
             dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-700"
            >
                {unread > 0 && (
                    <span
                        className="
                            pointer-events-none absolute top-0 right-0 translate-x-[5%] -translate-y-[5%]
                            inline-flex h-5 min-w-[14px] items-center justify-center rounded-full
                            px-[2px] text-[11px] font-semibold leading-none tabular-nums
                            text-rose-400 bg-transparent ring-0
                          "
                                            aria-hidden="true"
                                        >
                          {badgeText}
                        </span>
                )}

                <Bell className="h-5 w-5 text-green-600 dark:text-cyan-500" aria-hidden/>
            </button>

            {/* Popover */}
            {open && (
                <div
                    ref={popRef}
                    role="menu"
                    aria-label="Notifications"
                    className="absolute right-0 z-50 mt-2
                     w-[22rem] sm:w-[26rem] md:w-[30rem] lg:w-[34rem]
                     max-w-[calc(100vw-2rem)]
                     overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5
                     dark:border-slate-700 dark:bg-slate-900"
                >
                    {/* Header with stable width/spacing */}
                    <div
                        className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 text-sm font-medium dark:border-slate-800">
                        {/* left: title truncates, number uses fixed width to avoid jitter */}
                        <div className="min-w-0 flex items-baseline gap-1">
                            <span className="truncate">Unread</span>
                            {unread ? (
                                <span className="ml-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">(
                                    <span className="inline-block w-[3ch] text-center">{badgeText}</span>
                                    )
                                </span>
                            ) : null}
                        </div>

                        {/* right: never wraps or shrinks */}
                        <button
                            onClick={markAllRead}
                            className="shrink-0 whitespace-nowrap rounded-md px-2 py-1 text-xs leading-none text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                        >
                            Mark all read
                        </button>
                    </div>

                    {/* List */}
                    <ul className="max-h-80 overflow-y-auto p-2">
                        {items.length === 0 && (
                            <li className="p-4 text-sm text-slate-500 dark:text-slate-400">You’re all caught up.</li>
                        )}

                        {items.map((n) => {
                            const isUnread = !n.read;
                            return (
                                <li
                                    key={n.id}
                                    className="rounded-lg px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                >
                                    <div className="min-w-0">
                                        {/* Title: unread = bold/bright; read = muted */}
                                        <div
                                            className={`truncate text-sm ${
                                                isUnread
                                                    ? "font-semibold"
                                                    : "text-slate-500 dark:text-slate-400"
                                            }`}
                                        >
                                            {n.title}
                                        </div>

                                        {/* Detail */}
                                        {n.detail && (
                                            <div
                                                className={`truncate text-xs ${
                                                    isUnread
                                                        ? "text-slate-600 dark:text-slate-400"
                                                        : "text-slate-500 dark:text-slate-500"
                                                }`}
                                            >
                                                {n.detail}
                                            </div>
                                        )}

                                        {/* Time */}
                                        <div
                                            className={`mt-0.5 text-xs ${
                                                isUnread
                                                    ? "text-slate-500 dark:text-slate-400"
                                                    : "text-slate-400 dark:text-slate-500"
                                            }`}
                                        >
                                            {n.time}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Footer */}
                    <div className="border-t border-slate-200 p-3 text-right text-xs dark:border-slate-800">
                        <a
                            href="/notifications"
                            className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                        >
                            View all
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
