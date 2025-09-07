import * as React from "react";

type StatCardProps = {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    /** e.g. "+12%", "-5", 3.2 */
    delta?: number | string;
    /** optional suffix for value, e.g. "$", "%", etc. */
    valuePrefix?: string;
    valueSuffix?: string;
};

export function StatCard({
                             icon,
                             label,
                             value,
                             delta,
                             valuePrefix = "",
                             valueSuffix = "",
                         }: StatCardProps) {
    const isNumber = typeof value === "number";
    const valueDisplay = isNumber
        ? new Intl.NumberFormat().format(value as number)
        : String(value);

    const deltaNum =
        typeof delta === "number"
            ? delta
            : delta !== undefined
                ? Number(String(delta).replace(/[^\d.-]/g, ""))
                : undefined;

    const isNeg = typeof deltaNum === "number" ? deltaNum < 0 : String(delta || "").trim().startsWith("-");

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <span className="text-xl">{icon}</span>
                <span className="text-sm font-medium">{label}</span>
            </div>

            <div className="mt-2 flex items-end justify-between">
                <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                    {valuePrefix}
                    {valueDisplay}
                    {valueSuffix}
                </div>

                {delta !== undefined && (
                    <div
                        className={[
                            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                            isNeg
                                ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
                        ].join(" ")}
                        aria-label={`Change ${isNeg ? "decrease" : "increase"} of ${Math.abs(deltaNum ?? 0)}`}
                    >
                        <span>{isNeg ? "↓" : "↑"}</span>
                        <span>
              {typeof delta === "number"
                  ? Math.abs(delta).toLocaleString()
                  : String(delta).replace("-", "")}
            </span>
                    </div>
                )}
            </div>
        </div>
    );
}
