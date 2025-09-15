"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import type { Report } from "@/components/constants/broadcastData";
import { TableHeaderCell, TableCell, StatusPill } from "./SectionsPrimitives";

type Props = {
    reports: ReadonlyArray<Report>;
    onShare: (reportId: string) => void;
    selectedReportId?: string | null;
};

export const ReportsReadySection: React.FC<Props> = ({ reports, onShare, selectedReportId }) => {
    const ready = React.useMemo(() => reports.filter((r) => r.status === "Ready"), [reports]);

    return (
        <section className="mb-8">
            <Card className="mt-3">
                <CardContent className="p-0">
                    <div className="overflow-x-auto px-2 md:px-3">
                        <table className="w-full min-w-[720px] table-fixed">
                            {/* IMPORTANT: keep <colgroup>{[ ... ]}</colgroup> on one line -> no whitespace text nodes */}
                            <colgroup>{[
                                <col key="id" style={{ width: "22%" }} />,
                                <col key="vin" style={{ width: "46%" }} />,
                                <col key="status" style={{ width: "16%" }} />,
                                <col key="actions" style={{ width: "16%" }} />,
                            ]}</colgroup>

                            <thead className="border-b">
                            <tr>
                                <TableHeaderCell>Report ID</TableHeaderCell>
                                <TableHeaderCell>VIN/Plate</TableHeaderCell>
                                <TableHeaderCell>Status</TableHeaderCell>
                                <TableHeaderCell>Actions</TableHeaderCell>
                            </tr>
                            </thead>

                            <tbody className="[&>tr:nth-child(odd)]:bg-muted/20 [&>tr:hover]:bg-muted/40 transition-colors">
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
                                        className={`border-b last:border-b-0 ${selectedReportId === r.id ? "bg-muted/40 ring-1 ring-primary/30" : ""}`}
                                    >
                                        <TableCell className="whitespace-nowrap">
                                            <button
                                                className="text-primary hover:underline rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                                onClick={() => onShare(r.id)}
                                                aria-label={`Open report ${r.id}`}
                                            >
                                                Report {r.id}
                                            </button>
                                        </TableCell>

                                        <TableCell className="truncate sm:whitespace-normal sm:break-words" title={r.plate}>
                                            {r.plate}
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap">
                                            <StatusPill label={r.status} />
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap">
                                            <button
                                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                                                onClick={() => onShare(r.id)}
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
