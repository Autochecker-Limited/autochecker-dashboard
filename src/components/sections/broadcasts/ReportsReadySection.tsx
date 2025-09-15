"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import type { Report } from "@/components/constants/broadcastData";
import { SectionTitle, TableHeaderCell, TableCell, StatusPill } from "./SectionsPrimitives";

type Props = {
    reports: ReadonlyArray<Report>;
    onShare: (reportId: string) => void; // will broadcast immediately
    selectedReportId?: string | null;
};

export const ReportsReadySection: React.FC<Props> = ({ reports, onShare, selectedReportId }) => {
    const ready = React.useMemo(() => reports.filter(r => r.status === "Ready"), [reports]);

    return (
        <section className="mb-8">

            <Card className="mt-3">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b">
                                <TableHeaderCell className="w-1/4">Report ID</TableHeaderCell>
                                <TableHeaderCell className="w-1/2">VIN/Plate</TableHeaderCell>
                                <TableHeaderCell className="w-1/6">Status</TableHeaderCell>
                                <TableHeaderCell className="w-1/6">Actions</TableHeaderCell>
                            </tr>
                            </thead>
                            <tbody>
                            {ready.length === 0 ? (
                                <tr>
                                    <TableCell colSpan={4} className="text-sm text-muted-foreground">
                                        No reports are ready yet.
                                    </TableCell>
                                </tr>
                            ) : (
                                ready.map((r) => (
                                    <tr
                                        key={r.id}
                                        className={`border-b last:border-b-0 ${selectedReportId === r.id ? "bg-muted/40" : ""}`}
                                    >
                                        <TableCell>
                                            <button className="text-primary hover:underline">Report {r.id}</button>
                                        </TableCell>
                                        <TableCell>{r.plate}</TableCell>
                                        <TableCell><StatusPill label={r.status} /></TableCell>
                                        <TableCell>
                                            <button
                                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                onClick={() => onShare(r.id)}            // <- broadcast now
                                                aria-label={`Share report ${r.id}`}
                                            >
                                                <Play className="h-4 w-4" />
                                                <span>Share</span>
                                            </button>
                                        </TableCell>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
};
