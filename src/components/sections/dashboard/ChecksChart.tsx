// components/sections/dashboard/ChecksChart.tsx
"use client";

import * as React from "react";
import { useMemo } from "react";
import { useTheme } from "next-themes";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type ChecksChartProps = {
    /** which series to show; defaults to both */
    focus?: "both" | "stolen" | "vin";
};

const ChecksChart: React.FC<ChecksChartProps> = ({ focus = "both" }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const options = useMemo<Highcharts.Options>(() => {
        return {
            chart: {
                height: 280,
                backgroundColor: isDark ? "#f8fafc00" : "#ffffff", // transparent-ish in card
                style: { fontFamily: "inherit" },
            },
            title: { text: "Checks & Reports (7 days)", style: { color: isDark ? "#e2e8f0" : "#0f172a" } },
            xAxis: {
                categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                labels: { style: { color: isDark ? "#94a3b8" : "#475569" } },
                lineColor: isDark ? "#334155" : "#e2e8f0",
                tickColor: isDark ? "#334155" : "#e2e8f0",
            },
            yAxis: {
                title: { text: "Count", style: { color: isDark ? "#94a3b8" : "#475569" } },
                labels: { style: { color: isDark ? "#94a3b8" : "#475569" } },
                gridLineColor: isDark ? "#1f2937" : "#eef2f7",
            },
            legend: {
                enabled: true,
                itemStyle: { color: isDark ? "#cbd5e1" : "#1e293b" },
            },
            credits: { enabled: false },
            series: [
                {
                    name: "VIN/Plate Checks",
                    data: [120, 180, 160, 220, 240, 210, 250],
                    type: "line",
                    color: "#22c55e", // emerald-500
                    visible: focus !== "stolen",
                },
                {
                    name: "Stolen Reports",
                    data: [10, 12, 9, 15, 14, 11, 12],
                    type: "column",
                    color: "#0ea5e9", // sky-500 (readable on light)
                    visible: focus !== "vin",
                },
            ],
        };
    }, [isDark, focus]);

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ChecksChart;
