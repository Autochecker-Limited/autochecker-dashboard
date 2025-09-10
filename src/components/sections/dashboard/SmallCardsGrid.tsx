"use client";

import * as React from "react";
import { StatCard } from "@/components/reusables/StatCard";
import { mockSmallCards, type SmallCard } from "@/components/constants";

type Props = {
    onClick?: (c: SmallCard) => void;
};

export default function SmallCardsGrid({ onClick }: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10 md:mt-12">
            {mockSmallCards.map((c) => (
                <button
                    key={c.label}
                    onClick={() => onClick?.(c)}
                    className="text-left cursor-pointer"
                >
                    <StatCard label={c.label} value={c.value} icon={null} density="cozy" />
                </button>
            ))}
        </div>
    );
}
