"use client";

import * as React from "react";
import { useMemo } from "react";
import { useTheme } from "next-themes";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const ChecksChart: React.FC = () => {
    const { theme } = useTheme(); // "light" | "dark" | "system"

    const options = useMemo<Highcharts.Options>(() => {
        const isDark = theme === "dark";

        return {
            chart: {
                height: 280,
                backgroundColor: isDark ? "#0f172a" : "#ffffff", // slate-950 vs white
                style: { fontFamily: "inherit" },
            },
            title: {
                text: "Checks & Reports (7 days)",
                style: { color: isDark ? "#f1f5f9" : "#0f172a" }, // slate-100 vs slate-900
            },
            xAxis: {
                categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                labels: { style: { color: isDark ? "#cbd5e1" : "#475569" } }, // slate-400 vs slate-600
            },
            yAxis: {
                title: {
                    text: "Count",
                    style: { color: isDark ? "#cbd5e1" : "#475569" },
                },
                labels: { style: { color: isDark ? "#cbd5e1" : "#475569" } },
            },
            legend: {
                enabled: true,
                itemStyle: { color: isDark ? "#e2e8f0" : "#1e293b" },
            },
            credits: { enabled: false },
            series: [
                {
                    name: "VIN/Plate Checks",
                    data: [120, 180, 160, 220, 240, 210, 250],
                    type: "line",
                    color: "#22c55e", // emerald-500
                },
                {
                    name: "Stolen Reports",
                    data: [10, 12, 9, 15, 14, 11, 12],
                    type: "column",
                    color: "#ef4444", // red-500
                },
            ],
        };
    }, [theme]);

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ChecksChart;
