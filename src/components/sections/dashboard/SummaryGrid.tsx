// components/sections/dashboard/SummaryGrid.tsx
"use client";

import * as React from "react";
import { StatCard } from "@/components/reusables/StatCard";
import type { Summary } from "@/components/constants/mockSummary";

type Props = {
    cards: Summary[];
    onCardClick?: (c: Summary) => void;
    /** The card label that should look/act clickable (e.g., "Total Revenue") */
    clickableLabel?: string;
};

export default function SummaryGrid({ cards, onCardClick, clickableLabel }: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 md:gap-5 xl:gap-6 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((c) => {
                const clickable = c.label === (clickableLabel ?? "");
                return (
                    <div
                        key={c.label}
                        role={clickable ? "button" : undefined}
                        tabIndex={clickable ? 0 : -1}
                        onClick={clickable ? () => onCardClick?.(c) : undefined}
                        onKeyDown={
                            clickable
                                ? (e) => {
                                    if (e.key === "Enter" || e.key === " ") onCardClick?.(c);
                                }
                                : undefined
                        }
                        className={`relative ${clickable ? "cursor-pointer hover:ring-2 hover:ring-emerald-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-2xl" : ""}`}
                        aria-label={clickable ? "Click to compare revenue" : undefined}
                        title={clickable ? "Click to compare revenue" : undefined}
                    >
                        {clickable && (
                            <span className="absolute right-2 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                Click to compare
              </span>
                        )}
                        <StatCard {...c} density="roomy" />
                    </div>
                );
            })}
        </div>
    );
}
