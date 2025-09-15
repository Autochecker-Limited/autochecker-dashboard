// src/components/sections/broadcasts/Panel.tsx
"use client";
import * as React from "react";

type Props = React.PropsWithChildren<{
    title?: React.ReactNode;
    className?: string;
    headerRight?: React.ReactNode;
}>;

export default function Panel({ title, className, headerRight, children }: Props) {
    return (
        <section
            className={[
                "relative isolate overflow-hidden",          // ✅ new: isolate + overflow-hidden
                "rounded-2xl border bg-card/60 shadow-sm ring-1 ring-border/50",
                "backdrop-blur supports-[backdrop-filter]:bg-card/40",
                className ?? "",
            ].join(" ")}
        >
            {title ? (
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        {title}
                    </h2>
                    {headerRight}
                </div>
            ) : null}
            <div>{children}</div>
        </section>
    );
}
