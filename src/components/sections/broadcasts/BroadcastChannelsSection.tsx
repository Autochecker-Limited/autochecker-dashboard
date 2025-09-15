"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CHANNELS, WHATSAPP_GROUPS, type BroadcastLog } from "@/components/constants/broadcastData";
import { SectionTitle } from "./SectionsPrimitives";

type Props = {
    selectedReportId?: string | null;
    onLog?: (log: BroadcastLog) => void;
    id?: string; // to allow scrolling from parent
};

export const BroadcastChannelsSection: React.FC<Props> = ({ selectedReportId, onLog, id = "broadcast-channels" }) => {
    const disabled = !selectedReportId;

    // dialogs
    const [openWA, setOpenWA] = React.useState(false);
    const [openEmail, setOpenEmail] = React.useState(false);

    // WA groups
    const [selectedGroups, setSelectedGroups] = React.useState<string[]>([]);

    // Email chip input
    const [emailInput, setEmailInput] = React.useState("");
    const [emails, setEmails] = React.useState<string[]>([]);

    function openFor(channelName: string) {
        if (disabled) return;
        if (channelName === "WhatsApp Groups") setOpenWA(true);
        if (channelName === "Partner Organizations") setOpenEmail(true);
    }

    function addEmailsFromInput() {
        const parts = emailInput.split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean);
        setEmails((prev) => Array.from(new Set([...prev, ...parts])));
        setEmailInput("");
    }

    function record(channel: string, status: BroadcastLog["status"] = "Sent") {
        if (!onLog || !selectedReportId) return;
        const now = new Date();
        onLog({
            ts: now.toLocaleString(undefined, { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
            reportId: selectedReportId,
            channel,
            status,
        });
    }

    return (
        <section className="mb-8" id={id}>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
                {CHANNELS.map((c) => {
                    const Icon = c.action.icon;
                    return (
                        <Card key={c.name}>
                            <CardContent className="flex items-center justify-between p-4">
                                <div>
                                    <p className="font-medium">{c.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {c.description}
                                        {disabled && <span className="ml-2 text-xs italic">Select a report above first</span>}
                                    </p>
                                </div>
                                <Button variant="secondary" className="gap-2" disabled={disabled} onClick={() => openFor(c.name)}>
                                    <Icon className="h-4 w-4" />
                                    {c.action.label}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* WhatsApp dialog */}
            <Dialog open={openWA} onOpenChange={setOpenWA}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Share via WhatsApp Groups</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Report: <span className="font-medium">{selectedReportId}</span>
                        </p>
                        <div className="space-y-2">
                            {WHATSAPP_GROUPS.map((g) => (
                                <label key={g.id} className="flex items-center gap-3">
                                    <Checkbox
                                        checked={selectedGroups.includes(g.id)}
                                        onCheckedChange={(v) =>
                                            setSelectedGroups((arr) => (v ? [...arr, g.id] : arr.filter((x) => x !== g.id)))
                                        }
                                    />
                                    <span>{g.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            disabled={!selectedGroups.length}
                            onClick={() => {
                                record("WhatsApp Groups", "Sent");
                                setSelectedGroups([]);
                                setOpenWA(false);
                            }}
                        >
                            Send
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Partner email dialog */}
            <Dialog open={openEmail} onOpenChange={setOpenEmail}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Share with Partner Organizations</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Report: <span className="font-medium">{selectedReportId}</span>
                        </p>
                        <div>
                            <Label htmlFor="emails">Email addresses</Label>
                            <div className="mt-2 flex items-center gap-2">
                                <Input
                                    id="emails"
                                    placeholder="type an email and press Enter"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === ",") {
                                            e.preventDefault();
                                            addEmailsFromInput();
                                        }
                                    }}
                                />
                                <Button type="button" variant="secondary" onClick={addEmailsFromInput}>
                                    Add
                                </Button>
                            </div>
                            {!!emails.length && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {emails.map((em) => (
                                        <span key={em} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                      {em}
                                            <button
                                                className="text-muted-foreground hover:text-foreground"
                                                onClick={() => setEmails((prev) => prev.filter((x) => x !== em))}
                                                aria-label={`Remove ${em}`}
                                            >
                        ×
                      </button>
                    </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            disabled={!emails.length}
                            onClick={() => {
                                record("Partner Organizations", "Sent");
                                setEmails([]);
                                setOpenEmail(false);
                            }}
                        >
                            Send
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
};
