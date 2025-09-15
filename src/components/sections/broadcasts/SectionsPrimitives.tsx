"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";


/* ===== Titles ===== */
export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">
        {children}
    </h2>
);

/* ===== Table header cell (<th>) ===== */
type TableHeaderCellProps = React.ComponentPropsWithoutRef<"th">;

export const TableHeaderCell = React.forwardRef<HTMLTableHeaderCellElement, TableHeaderCellProps>(
    function TableHeaderCell({ className, ...props }, ref) {
        return (
            <th
                ref={ref}
                className={`px-4 py-2 text-left text-xs font-medium text-muted-foreground ${className ?? ""}`}
                {...props}
            />
        );
    }
);

/* ===== Table data cell (<td>) ===== */
type TableCellProps = React.ComponentPropsWithoutRef<"td">;

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
    function TableCell({ className, ...props }, ref) {
        return (
            <td
                ref={ref}
                className={`px-4 py-3 text-sm text-foreground/90 ${className ?? ""}`}
                {...props}
            />
        );
    }
);

/* ===== Status pill (unchanged) ===== */
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

// export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//     <h2 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">{children}</h2>
// );
//
// export const TableHeaderCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
//     <th className={`px-4 py-2 text-left text-xs font-medium text-muted-foreground ${className ?? ""}`}>{children}</th>
// );
//
// export const TableCell: React.FC<{ children: React.ReactNode, className?: string, colSpan?: number }> = ({
//                                                                                                              children,
//                                                                                                              className,
//                                                                                                              colSpan
//                                                                                                          }) => (
//     <td className={`px-4 py-3 text-sm text-foreground/90 ${className ?? ""}`}>{children}</td>
// );
//
// export const StatusPill: React.FC<{ label: string }> = ({ label }) => (
//     <Badge variant="secondary" className="rounded-full bg-muted text-foreground/80 border-none">
//         {label}
//     </Badge>
// );
