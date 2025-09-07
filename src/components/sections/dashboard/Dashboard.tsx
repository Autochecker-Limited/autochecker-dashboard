import * as React from "react";
import { ActivityFeed } from "@/components/sections/dashboard/ActivityFeed";
import ChecksChart from "@/components/sections/dashboard/ChecksChart";


export function Dashboard() {
    return (
        <div>
            <ChecksChart/>
            <ActivityFeed/>

        </div>
    );
}
