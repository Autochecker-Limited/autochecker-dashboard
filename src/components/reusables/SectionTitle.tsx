import * as React from "react";

type SectionTitleProps = {
    children: React.ReactNode;
};

export function SectionTitle({ children }: SectionTitleProps) {
    return (
        <h2
            className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight"
        >
            {children}
        </h2>
    );
}
