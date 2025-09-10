// components/reusables/StatCard.tsx
import * as React from "react";
import type { JSX } from "react";

type StatCardProps = {
    icon?: React.ReactNode | React.ElementType;
    color?: string;
    label: string;
    value: number | string;
    delta?: number | string;
    valuePrefix?: string;
    valueSuffix?: string;
    locale?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    className?: string;
    density?: "compact" | "cozy" | "roomy";
    /** NEW: content shown inside the card below the main row */
    footer?: React.ReactNode;
};

export function StatCard({
                             icon,
                             color,
                             label,
                             value,
                             delta,
                             valuePrefix = "",
                             valueSuffix = "",
                             locale = "en-US",
                             onClick,
                             className = "",
                             density = "cozy",
                             footer,                      // NEW
                         }: StatCardProps) {
    const nf = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);
    const isNumber = typeof value === "number";
    const valueDisplay = isNumber ? nf.format(value as number) : String(value);

    const deltaNum =
        typeof delta === "number"
            ? delta
            : delta !== undefined
                ? Number(String(delta).replace(/[^\d.-]/g, ""))
                : undefined;

    const isNeg =
        typeof deltaNum === "number" ? deltaNum < 0 : String(delta || "").trim().startsWith("-");

    const renderIcon = () => {
        if (!icon) return null;
        if (React.isValidElement(icon)) return <span className="text-xl">{icon}</span>;
        const IconComp = icon as React.ElementType;
        return (
            <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    color ?? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                }`}
            >
        <IconComp fontSize="small" />
      </span>
        );
    };

    // spacing presets
    const pad = density === "roomy" ? "p-6" : density === "compact" ? "p-4" : "p-5";
    const blockSpacing = density === "roomy" ? "space-y-5" : density === "compact" ? "space-y-3" : "space-y-4";
    const headerGap = density === "roomy" ? "gap-3" : density === "compact" ? "gap-2" : "gap-2.5";
    const valueSize = density === "roomy" ? "text-2xl" : density === "compact" ? "text-lg" : "text-xl";

    const Wrapper: keyof JSX.IntrinsicElements = onClick ? "button" : "div";
    const clickableCls = onClick
        ? "transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        : "";

    return (
        <Wrapper
            {...(onClick ? { onClick, type: "button" } : {})}
            className={`w-full text-left rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${pad} ${clickableCls} ${className}`}
        >
            <div className={`flex flex-col ${blockSpacing}`}>
                <div className={`flex items-center ${headerGap} text-slate-500 dark:text-slate-400`}>
                    {renderIcon()}
                    <span className="text-sm font-medium">{label}</span>
                </div>

                <div className="flex items-end justify-between">
                    <div className={`${valueSize} font-semibold text-slate-900 dark:text-slate-100 tabular-nums`}>
                        {valuePrefix}
                        {valueDisplay}
                        {valueSuffix}
                    </div>

                    {delta !== undefined && (
                        <div
                            className={[
                                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium tabular-nums",
                                isNeg
                                    ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
                            ].join(" ")}
                        >
                            <span>{isNeg ? "↓" : "↑"}</span>
                            <span>
                {typeof deltaNum === "number"
                    ? nf.format(Math.abs(deltaNum))
                    : String(delta).replace("-", "")}
              </span>
                        </div>
                    )}
                </div>

                {/* NEW: roomy in-card footer if provided */}
                {footer ? <div className="mt-3">{footer}</div> : null}
            </div>
        </Wrapper>
    );
}

export default StatCard;
