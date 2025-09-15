"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "./SectionsPrimitives";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import {KPI_CARDS, PERFORMANCE_SERIES} from "@/components/constants/broadcastData";

export const PerformanceAnalyticsSection: React.FC = () => (
    <section className="mb-8">

        <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-2 mx-2">
            {KPI_CARDS.map((kpi) => (
                <Card key={kpi.key}>
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground">{kpi.label}</p>
                        <div className="mt-1 flex items-end justify-between">
                            <p className="text-2xl font-semibold">{kpi.value}</p>
                        </div>
                        <p className={`mt-2 text-xs ${kpi.trend === "down" ? "text-destructive" : "text-emerald-600 dark:text-emerald-500"}`}>{kpi.delta}</p>
                    </CardContent>
                </Card>
            ))}
        </div>

        <Card className="mt-4">
            <CardContent className="p-4">
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[...PERFORMANCE_SERIES]} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis hide />
                            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                            <Legend verticalAlign="top" height={24} />
                            <Line type="monotone" dataKey="impressions" name="Impressions" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="clicks" name="Clicks" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    </section>
);
