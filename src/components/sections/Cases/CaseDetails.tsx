// components/sections/Cases/CaseDetails.tsx
import React, {useEffect, useState} from "react";
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ActionsCard from "@/components/sections/Cases/ActionsCard";

type CrossCheck = { name: string; match: boolean };
type Reporter = { name: string; phone: string; email: string };

export type CaseDetailsData = {
    id: string | number;
    photos?: string[];
    reporter: Reporter;
    crossChecks?: CrossCheck[];
};

type Props = { selected: CaseDetailsData };

export default function CaseDetails({selected}: Props) {
    const [tab, setTab] = useState<"Photos" | "Logbook" | "Reporter Data" | "Cross-Check Results">(
        "Photos"
    );

    // --- Lightbox state ---
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const photos = selected.photos ?? [];

    const openAt = (idx: number) => {
        setLightboxIndex(idx);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => setIsLightboxOpen(false);

    const next = () => {
        setLightboxIndex((i) => (i + 1) % photos.length);
    };

    const prev = () => {
        setLightboxIndex((i) => (i - 1 + photos.length) % photos.length);
    };

    // Keyboard and body-scroll lock when lightbox is open
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        document.addEventListener("keydown", onKeyDown);
        document.body.classList.toggle("overflow-hidden", isLightboxOpen);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.classList.remove("overflow-hidden");
        };
    }, [isLightboxOpen]);

    return (
        <section className="mt-8 grid gap-6 md:grid-cols-3">
            {/* Left: Tabs + content */}
            <div className="md:col-span-2">
                <div
                    className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b px-4 py-3 dark:border-slate-800">
                        <h3 className="text-base font-semibold">Case Details: Case {selected.id}</h3>
                    </div>

                    {/* Tabs */}
                    <div className="px-4 pt-3">
                        <div className="flex gap-6 text-sm">
                            {(["Photos", "Logbook", "Reporter Data", "Cross-Check Results"] as const).map((t) => {
                                const active = tab === t;
                                return (
                                    <button
                                        key={t}
                                        onClick={() => setTab(t)}
                                        className={`pb-2 font-medium ${
                                            active
                                                ? "text-slate-900 dark:text-slate-50 border-b-2 border-green-600"
                                                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                        }`}
                                    >
                                        {t}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tab panels */}
                    <div className="p-4">
                        {tab === "Photos" && (
                            <div className="grid grid-cols-3 gap-3">
                                {photos.length ? (
                                    <>
                                        {/* Large left preview (first image) */}
                                        <button
                                            type="button"
                                            className="col-span-2 overflow-hidden rounded-xl bg-slate-100 outline-none ring-0 dark:bg-slate-800"
                                            onClick={() => openAt(0)}
                                            aria-label="Open photo"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={photos[0]}
                                                alt="main"
                                                className="h-80 w-full cursor-zoom-in object-cover"
                                            />
                                        </button>

                                        {/* Right column thumbs */}
                                        <div className="space-y-3">
                                            {(photos.slice(1) || []).map((src, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => openAt(i + 1)}
                                                    className="block w-full overflow-hidden rounded-xl bg-slate-100 outline-none ring-0 dark:bg-slate-800"
                                                    aria-label={`Open photo ${i + 2}`}
                                                >
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={src} alt={`thumb ${i + 1}`}
                                                         className="h-38 w-full cursor-zoom-in object-cover"/>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                                        No photos uploaded.
                                    </div>
                                )}
                            </div>
                        )}

                        {tab === "Logbook" && (
                            <div
                                className="rounded-xl border border-dashed p-6 text-sm text-slate-500 dark:border-slate-700">
                                Logbook goes here…
                            </div>
                        )}

                        {tab === "Reporter Data" && (
                            <div className="grid gap-3 sm:grid-cols-3 text-sm">
                                <div className="rounded-xl border p-3 dark:border-slate-800">
                                    <div className="text-slate-500">Name</div>
                                    <div className="font-medium">
                                        {selected.reporter?.name ?? "Masked for Privacy"}
                                    </div>
                                </div>
                                <div className="rounded-xl border p-3 dark:border-slate-800">
                                    <div className="text-slate-500">Phone</div>
                                    <div className="font-medium">
                                        {selected.reporter?.phone ?? "Masked for Privacy"}
                                    </div>
                                </div>
                                <div className="rounded-xl border p-3 dark:border-slate-800">
                                    <div className="text-slate-500">Email</div>
                                    <div className="font-medium">
                                        {selected.reporter?.email ?? "Masked for Privacy"}
                                    </div>
                                </div>
                            </div>
                        )}

                        {tab === "Cross-Check Results" && (
                            <div className="space-y-2">
                                {selected.crossChecks?.length ? (
                                    selected.crossChecks.map((r, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between rounded-lg border p-3 text-sm dark:border-slate-800"
                                        >
                                            <span>{r.name}</span>
                                            <span
                                                className={`font-medium ${r.match ? "text-emerald-600" : "text-rose-600"}`}
                                            >
                        {r.match ? "Match Found" : "No Match Found"}
                      </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                                        No cross-checks available.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Actions column */}
            <aside className="space-y-4">
                <ActionsCard/>
                {/*Reporter Data*/}
                <div
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-2 space-grotesk-bold">Reporter Data</div>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Name</span>
                            <span className="font-medium">{selected.reporter?.name ?? "Masked for Privacy"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Phone</span>
                            <span className="font-medium">{selected.reporter?.phone ?? "Masked for Privacy"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Email</span>
                            <span className="font-medium">{selected.reporter?.email ?? "Masked for Privacy"}</span>
                        </div>
                    </div>
                </div>

                {/*Cross-Check Results*/}
                <div
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-2 space-grotesk-bold">Cross-Check Results</div>
                    <ul className="space-y-2 text-sm">
                        {(selected.crossChecks || []).map((r, i) => (
                            <li key={i} className="flex items-center justify-between">
                                <span>{r.name}</span>
                                <span className={r.match ? "text-emerald-600" : "text-rose-600"}>
                  {r.match ? " ✅ Match Found" : "🚫 No Match Found"}
                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* --- Lightbox Modal --- */}
            {isLightboxOpen && photos.length > 0 && (
                <>
                    <div
                        className="fixed inset-0 z-[100] bg-black/80"
                        onClick={closeLightbox}
                        aria-hidden
                    />
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
                    >
                        <div className="relative max-h-[90vh] max-w-5xl">
                            {/* Image */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={photos[lightboxIndex]}
                                alt={`photo ${lightboxIndex + 1}`}
                                className="max-h-[90vh] w-auto max-w-[90vw] cursor-zoom-out rounded-xl object-contain shadow-2xl"
                                onClick={closeLightbox}
                            />

                            {/* Controls */}
                            {photos.length > 1 && (
                                <>
                                    <button
                                        onClick={prev}
                                        aria-label="Previous"
                                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-slate-900 shadow hover:bg-white"
                                    >
                                        ‹
                                    </button>
                                    <button
                                        onClick={next}
                                        aria-label="Next"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-slate-900 shadow hover:bg-white"
                                    >
                                        ›
                                    </button>
                                </>
                            )}

                            <button
                                onClick={closeLightbox}
                                aria-label="Close"
                                className="absolute right-2 top-2 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-slate-900 shadow hover:bg-white"
                            >
                                Close
                            </button>
                            <div
                                className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                                {lightboxIndex + 1} / {photos.length}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
