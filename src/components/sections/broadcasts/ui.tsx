"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";

export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">{children}</h2>
);

export const TableHeaderCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <th className={`px-4 py-2 text-left text-xs font-medium text-muted-foreground ${className ?? ""}`}>{children}</th>
);

export const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <td className={`px-4 py-3 text-sm text-foreground/90 ${className ?? ""}`}>{children}</td>
);

const statusClasses: Record<string, string> = {
    Ready: "bg-green-100 text-green-800",
    "In Progress": "bg-amber-100 text-amber-800",
    "Not Started": "bg-slate-100 text-slate-700",
    Cancelled: "bg-red-100 text-red-800",
    Sent: "bg-blue-100 text-blue-800",
};

export const StatusPill: React.FC<{ label: string }> = ({ label }) => {
    const cls = statusClasses[label] ?? "bg-muted text-foreground/80";
    return (
        <Badge variant="secondary" className={`rounded-full border-none ${cls}`}>
            {label}
        </Badge>
    );
};

