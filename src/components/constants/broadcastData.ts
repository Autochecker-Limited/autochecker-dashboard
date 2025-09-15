// components/constants/broadcastData.ts
import type React from "react";
import { Send } from "lucide-react";

export type Report = {
    id: string;
    plate: string;
    status: BroadcastStatus;
    createdAt: string; // ISO timestamp for ordering
};

export type KpiCard = {
    key: "impressions" | "clicks" | "ctr" | "conversions" | string;
    label: string;
    value: string;
    delta: string;
    trend: "up" | "down" | "flat" | string;
};

export type BroadcastStatus = "Not Started" | "In Progress" | "Ready" | "Cancelled" | "Sent";

export type BroadcastLog = {
    ts: string;         // display timestamp
    reportId: string;
    channel: string;
    status: BroadcastStatus;
};


export type PerformancePoint = { month: string; impressions: number; clicks: number };//
// export type BroadcastLog = { ts: string; reportId: string; channel: string; status: "Sent" | "Failed" | string };
type IconType = React.ComponentType<{ className?: string }>;
export type Channel = { name: string; description: string; action: { label: string; icon: IconType } };



export const KPI_CARDS: readonly KpiCard[] = [
    { key: "impressions", label: "Impressions", value: "1.2M", delta: "+15% vs last month", trend: "up" },
    { key: "clicks", label: "Clicks", value: "82.5K", delta: "+12% vs last month", trend: "up" },
    { key: "ctr", label: "CTR", value: "6.88%", delta: "-0.5% vs last month", trend: "down" },
    { key: "conversions", label: "Conversions", value: "1,234", delta: "+20% vs last month", trend: "up" },
] as const;

export const PERFORMANCE_SERIES: readonly PerformancePoint[] = [
    { month: "Jan", impressions: 1_000_000, clicks: 75_000 },
    { month: "Feb", impressions: 1_100_000, clicks: 78_000 },
    { month: "Mar", impressions: 1_050_000, clicks: 79_000 },
    { month: "Apr", impressions: 1_130_000, clicks: 81_000 },
    { month: "May", impressions: 1_180_000, clicks: 83_000 },
    { month: "Jun", impressions: 1_200_000, clicks: 85_000 },
] as const;

export const CHANNELS: readonly Channel[] = [
    { name: "WhatsApp Groups", description: "Send to predefined WhatsApp groups", action: { label: "Send", icon: Send } },
    { name: "Partner Organizations", description: "Send to partner organizations", action: { label: "Send", icon: Send } },
] as const;

export const BROADCAST_LOGS: readonly BroadcastLog[] = [
    { ts: "2024-01-20 10:00 AM", reportId: "#12345", channel: "WhatsApp Groups", status: "Ready" },
    { ts: "2024-01-20 10:15 AM", reportId: "#67890", channel: "Partner Organizations", status: "In Progress" },
    { ts: "2024-01-20 10:30 AM", reportId: "#11223", channel: "WhatsApp Groups", status: "Not Started" },
] as const;

export const WHATSAPP_GROUPS = [
    { id: "auto-news", name: "Auto News Team" },
    { id: "dealer-east", name: "Dealer Network – East" },
    { id: "marketing", name: "Marketing Leads" },
] as const;


// Seed reports (example timestamps; use any ISO strings)
export const REPORTS: readonly Report[] = [
    { id: "#12345", plate: "VIN: 1234567890ABCDEFG", status: "Ready",       createdAt: "2024-01-20T10:00:00.000Z" },
    { id: "#67890", plate: "Plate: XY2123",          status: "In Progress", createdAt: "2024-01-20T10:10:00.000Z" },
    { id: "#11223", plate: "VIN: 0987654321GFEDCBA", status: "Not Started", createdAt: "2024-01-20T10:20:00.000Z" },
] as const;


export const REPORTS_READY: ReadonlyArray<Report> = REPORTS.filter(r => r.status === "Ready");