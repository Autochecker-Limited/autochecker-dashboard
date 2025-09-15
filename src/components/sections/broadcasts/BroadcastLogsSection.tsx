"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableHeaderCell, StatusPill } from "@/components/sections/broadcasts/ui";
import type { BroadcastLog } from "@/components/constants/broadcastData";
import { BROADCAST_LOGS } from "@/components/constants/broadcastData";

type Props = {
    logs?: ReadonlyArray<BroadcastLog> | null;
    onStart?: (index: number) => void;
    onMarkReady?: (index: number) => void;
    onCancel?: (index: number) => void;
    frameless?: boolean;
};

export default function BroadcastLogsSection({
                                                 logs,
                                                 onStart,
                                                 onMarkReady,
                                                 onCancel,
                                                 frameless = false,
                                             }: Props) {
    const rows = Array.isArray(logs) ? logs : BROADCAST_LOGS;

    if (rows.length === 0) {
        return <div className="p-6 text-sm text-muted-foreground">No broadcast logs yet.</div>;
    }

    return (
        <div className={frameless ? "" : "rounded-2xl border"}>
            {/* horizontal scroll + inner padding so right-edge buttons aren't cut */}
            <div className="overflow-x-auto px-2 md:px-3">
                {/* table-fixed + min width keeps columns from collapsing */}
                <table className="w-full min-w-[780px] table-fixed">
                    {/* control column widths */}
                    <colgroup>
                        <col className="w-[22%]" /> {/* Timestamp */}
                        <col className="w-[14%]" /> {/* Report */}
                        <col className="w-[26%]" /> {/* Channel */}
                        <col className="w-[16%]" /> {/* Status */}
                        <col className="w-[22%]" /> {/* Actions */}
                    </colgroup>

                    <thead className="border-b">
                    <tr>
                        <TableHeaderCell>Timestamp</TableHeaderCell>
                        <TableHeaderCell>Report</TableHeaderCell>
                        <TableHeaderCell>Channel</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                        <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                    </tr>
                    </thead>

                    {/* zebra + hover */}
                    <tbody className="[&>tr:nth-child(odd)]:bg-muted/20 [&>tr:hover]:bg-muted/40 transition-colors">
                    {rows.map((log, idx) => (
                        <tr key={`${log.ts}-${idx}`} className="border-b last:border-b-0">
                            <TableCell className="whitespace-nowrap">{log.ts}</TableCell>
                            <TableCell className="whitespace-nowrap">{log.reportId}</TableCell>

                            {/* allow channel to wrap or truncate gracefully */}
                            <TableCell className="sm:whitespace-normal sm:break-words truncate">
                                {log.channel || "—"}
                            </TableCell>

                            <TableCell className="whitespace-nowrap">
                                <StatusPill label={log.status} />
                            </TableCell>

                            {/* allow buttons to wrap on narrow widths */}
                            <TableCell className="whitespace-nowrap">
                                <div className="flex flex-wrap justify-end gap-2">
                                    {log.status === "Not Started" && (
                                        <Button size="sm" variant="outline" onClick={() => onStart?.(idx)}>
                                            Start
                                        </Button>
                                    )}
                                    {log.status === "In Progress" && (
                                        <>
                                            <Button size="sm" onClick={() => onMarkReady?.(idx)}>Mark Ready</Button>
                                            <Button size="sm" variant="destructive" onClick={() => onCancel?.(idx)}>Cancel</Button>
                                        </>
                                    )}
                                    {(log.status === "Ready" || log.status === "Cancelled" || log.status === "Sent") && (
                                        <span className="text-muted-foreground">—</span>
                                    )}
                                </div>
                            </TableCell>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
