"use client";

import * as React from "react";
import type { Report } from "@/components/constants/broadcastData";
import { SectionTitle, TableHeaderCell, TableCell, StatusPill } from "./SectionsPrimitives";

type Props = {
    reports: ReadonlyArray<Report>;
    order?: "newest-first" | "oldest-first"; // default newest-first
};

export const AllReportsSection: React.FC<Props> = ({ reports, order = "newest-first" }) => {
    const sorted = React.useMemo(() => {
        const byTime = [...reports].sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        return order === "newest-first" ? byTime.reverse() : byTime;
    }, [reports, order]);

    return (
        <section className="mb-8">
            <div className="mt-3 overflow-x-auto rounded-xl border">
                <table className="min-w-full divide-y">
                    <thead>
                    <tr>
                        <TableHeaderCell>Report ID</TableHeaderCell>
                        <TableHeaderCell>VIN/Plate</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                    </tr>
                    </thead>
                    <tbody>
                    {sorted.length === 0 ? (
                        <tr>
                            <TableCell colSpan={3} className="text-sm text-muted-foreground">
                                No reports yet.
                            </TableCell>
                        </tr>
                    ) : (
                        sorted.map((r) => (
                            <tr key={r.id} className="border-b last:border-b-0">
                                <TableCell className="whitespace-nowrap">{r.id}</TableCell>
                                <TableCell className="whitespace-nowrap">{r.plate}</TableCell>
                                <TableCell className="whitespace-nowrap"><StatusPill label={r.status} /></TableCell>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
