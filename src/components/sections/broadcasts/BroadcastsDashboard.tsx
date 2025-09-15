"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";
import { ReportsReadySection } from "./ReportsReadySection";
import { PerformanceAnalyticsSection } from "./PerformanceAnalyticsSection";
import { BroadcastChannelsSection } from "./BroadcastChannelsSection";
import BroadcastLogsSection from "./BroadcastLogsSection";
import { AllReportsSection } from "./AllReportsSection";
import Panel from "./Panel";
import {
    BROADCAST_LOGS,
    REPORTS,
    type BroadcastLog,
    type BroadcastStatus,
    type Report,
} from "@/components/constants/broadcastData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // 👈 NEW

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

    // NEW: All Reports modal state
    const [openAllReports, setOpenAllReports] = React.useState(false);

    function handleNewBroadcast() {
        const reportId = selectedReportId ?? genReportId();
        setReports(prev => {
            if (prev.some(r => r.id === reportId)) return prev;
            return [{ id: reportId, plate: "Plate: —", status: "Not Started", createdAt: isoNow() }, ...prev];
        });
        setLogs(prev => [{ ts: displayNow(), reportId, channel: "—", status: "Not Started" }, ...prev]);
        setSelectedReportId(reportId);
    }

    function handleShare(reportId: string) {
        setSelectedReportId(reportId);
        setReports(prev => prev.map(r => (r.id === reportId ? { ...r, status: "Sent" } : r)));
        setLogs(prev => [{ ts: displayNow(), reportId, channel: "Broadcast", status: "Sent" }, ...prev]);
    }

    function updateStatusFromLogIndex(index: number, status: BroadcastStatus) {
        setLogs(prev => {
            const next = prev.map((log, i) => (i === index ? { ...log, status, ts: displayNow() } : log));
            const reportId = prev[index]?.reportId;
            if (reportId) {
                setReports(rPrev => rPrev.map(r => (r.id === reportId ? { ...r, status } : r)));
            }
            return next;
        });
    }

    function appendLog(log: BroadcastLog) {
        setLogs(prev => [log, ...prev]);
        if (log.status) {
            setReports(prev => prev.map(r => (r.id === log.reportId ? { ...r, status: log.status } : r)));
        }
    }

    return (
        <div className="min-h-screen w-full">
            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* Page header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Broadcasts</h1>
                        <p className="text-sm text-muted-foreground">Create, monitor, and share vehicle reports.</p>
                    </div>
                    <div className="flex gap-2">
                        {/* 👇 NEW: open All Reports modal */}
                        <Button variant="outline" className="gap-2" onClick={() => setOpenAllReports(true)}>
                            <List className="h-4 w-4" />
                            All Reports
                        </Button>
                        <Button className="gap-2" onClick={handleNewBroadcast}>
                            <Plus className="h-4 w-4" />
                            New Broadcast
                        </Button>
                    </div>
                </div>

                {/* Responsive grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 isolate">
                    {/* LEFT column */}
                    <div className="xl:col-span-8 space-y-6">
                        <Panel title="Reports Ready to Share">
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

                    {/* FULL width row (you can remove this panel if you only want the modal) */}
                    {/*<div className="xl:col-span-12">*/}
                    {/*    <Panel title="All Reports">*/}
                    {/*        <AllReportsSection reports={reports} order="newest-first"/>*/}
                    {/*    </Panel>*/}
                    {/*</div>*/}
                </div>
            </div>

            {/* ========= All Reports Modal ========= */}
            <Dialog open={openAllReports} onOpenChange={setOpenAllReports}>
                <DialogContent className="sm:max-w-5xl max-w-[95vw]">
                    <DialogHeader>
                        <DialogTitle>All Reports</DialogTitle>
                    </DialogHeader>

                    {/* Limit modal height and allow scrolling; hide inner section title if your AllReportsSection has one */}
                    <div className="mt-2 max-h-[75vh] overflow-auto [&_h2]:hidden bg-slate-200  dark:bg-slate-800 ">
                        <AllReportsSection reports={reports} order="newest-first" />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BroadcastsDashboard;
