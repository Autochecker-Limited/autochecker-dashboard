"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {ReportsReadySection} from "./ReportsReadySection";
import {PerformanceAnalyticsSection} from "./PerformanceAnalyticsSection";
import {BroadcastChannelsSection} from "./BroadcastChannelsSection";
import BroadcastLogsSection from "./BroadcastLogsSection";
import {AllReportsSection} from "./AllReportsSection";
import Panel from "./Panel";
import {
    BROADCAST_LOGS,
    REPORTS,
    type BroadcastLog,
    type BroadcastStatus,
    type Report,
} from "@/components/constants/broadcastData";

const isoNow = () => new Date().toISOString();
const displayNow = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const genReportId = () => `#${Math.floor(100000 + Math.random() * 900000)}`;

const BroadcastsDashboard: React.FC = () => {
    const [selectedReportId, setSelectedReportId] = React.useState<string | null>(null);
    const [reports, setReports] = React.useState<Report[]>([...REPORTS]);
    const [logs, setLogs] = React.useState<BroadcastLog[]>([...BROADCAST_LOGS]);

    // Create a new report row (Not Started) and a log
    function handleNewBroadcast() {
        const reportId = selectedReportId ?? genReportId();
        setReports(prev => {
            if (prev.some(r => r.id === reportId)) return prev;
            return [{id: reportId, plate: "Plate: —", status: "Not Started", createdAt: isoNow()}, ...prev];
        });
        setLogs(prev => [{ts: displayNow(), reportId, channel: "—", status: "Not Started"}, ...prev]);
        setSelectedReportId(reportId);
    }

    // Clicking Share in Ready section = broadcast now
    function handleShare(reportId: string) {
        setSelectedReportId(reportId);

        // Update report -> Sent (removes it from the Ready filter)
        setReports(prev =>
            prev.map(r => (r.id === reportId ? {...r, status: "Sent"} : r))
        );

        // Add a log entry recording the broadcast
        setLogs(prev => [
            {ts: displayNow(), reportId, channel: "Broadcast", status: "Sent"},
            ...prev,
        ]);
    }

    // These handlers let you move a log through statuses; they also keep reports in sync
    function updateStatusFromLogIndex(index: number, status: BroadcastStatus) {
        setLogs(prev =>
            prev.map((log, i) => (i === index ? {...log, status, ts: displayNow()} : log))
        );
        const reportId = logs[index]?.reportId;
        if (reportId) {
            setReports(prev => prev.map(r => (r.id === reportId ? {...r, status} : r)));
        }
    }

    function appendLog(log: BroadcastLog) {
        setLogs(prev => [log, ...prev]);
        // Keep report in sync if we know the status
        if (log.status) {
            setReports(prev => prev.map(r => (r.id === log.reportId ? {...r, status: log.status} : r)));
        }
    }

    return (
        <div className="min-h-screen w-full ">
            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* Page header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Broadcasts</h1>
                        <p className="text-sm text-muted-foreground">Create, monitor, and share vehicle reports.</p>
                    </div>
                    <Button className="gap-2" onClick={handleNewBroadcast}>
                        <Plus className="h-4 w-4" />
                        New Broadcast
                    </Button>
                </div>

                {/* Responsive grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* LEFT column */}
                    <div className="xl:col-span-8 space-y-6">
                        <Panel title="Reports Ready to Share">
                            {/* Reuse your section but give it zebra/hover in its table tbody */}
                            <ReportsReadySection
                                reports={reports}
                                onShare={handleShare}
                                selectedReportId={selectedReportId}
                            />
                        </Panel>

                        <Panel title="Activity Log">
                            <BroadcastLogsSection
                                logs={logs}
                                frameless
                                onStart={(idx) => updateStatusFromLogIndex(idx, "In Progress")}
                                onMarkReady={(idx) => updateStatusFromLogIndex(idx, "Ready")}
                                onCancel={(idx) => updateStatusFromLogIndex(idx, "Cancelled")}
                            />
                        </Panel>

                        <Panel title="Broadcast Channels">
                            <BroadcastChannelsSection
                                selectedReportId={selectedReportId}
                                onLog={appendLog}
                                id="broadcast-channels"
                            />
                        </Panel>
                    </div>

                    {/* RIGHT column */}
                    <div className="xl:col-span-4 space-y-6">
                        <Panel title="Ad Performance Analytics">
                            <PerformanceAnalyticsSection />
                        </Panel>

                    </div>

                    {/* FULL width row */}
                    <div className="xl:col-span-12">
                        <Panel title="All Reports">
                            <AllReportsSection reports={reports} order="newest-first" />
                        </Panel>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default BroadcastsDashboard;
