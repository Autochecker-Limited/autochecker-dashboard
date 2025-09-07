"use client";

import * as React from "react";
import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from 'highcharts-react-official';

const ChecksChart: React.FC = () => {
    const options = useMemo<Highcharts.Options>(
        () => ({
            chart: { height: 280 },
            title: { text: "Checks & Reports (7 days)" },
            xAxis: {
                categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                title: { text: undefined },
            },
            yAxis: {
                title: { text: "Count" },
            },
            legend: { enabled: true },
            credits: { enabled: false },
            series: [
                {
                    name: "VIN/Plate Checks",
                    data: [120, 180, 160, 220, 240, 210, 250],
                    type: "line",
                },
                {
                    name: "Stolen Reports",
                    data: [10, 12, 9, 15, 14, 11, 12],
                    type: "column",
                },
            ],
        }),
        []
    );

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ChecksChart;
