"use client";

import { Calendar, MapPin, Clock } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";

export const TripHeader = ({ travel }: { travel: any }) => {
    const { t } = useI18n();

    const hasImage = !!travel?.imageUrl;

    return (
        <div className="relative overflow-hidden rounded-3xl">
            {/* Cover */}
            <div className="relative h-56 md:h-80 bg-gray-900">
                {hasImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={travel.imageUrl}
                        alt={travel.destination}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-purple-700 to-slate-900" />
                )}

                {/* Soft overlay layers */}
                <div className="absolute inset-0">
                    {/* darken bottom for text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
                    {/* subtle vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.35)_100%)]" />
                    {/* tiny noise feel */}
                    <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-10">
                    {/* small badge */}
                    <div className="mb-3 md:mb-4 flex items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] md:text-xs font-semibold text-white/90 backdrop-blur">
                            <MapPin size={14} />
                            {t("trip") || "Trip"}
                        </span>

                        {travel?.travelersCount != null && (
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] md:text-xs font-semibold text-white/90 backdrop-blur">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                                {travel.travelersCount} {t("travelers") || "travelers"}
                            </span>
                        )}
                    </div>

                    {/* Titles */}
                    <h1 className="text-2xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.05] line-clamp-2 drop-shadow-sm">
                        {travel.destination}
                    </h1>

                    <p className="mt-2 text-sm md:text-lg text-white/85 font-medium line-clamp-1">
                        {travel.name}
                    </p>

                    {/* Pills */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 md:gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs md:text-sm font-semibold text-white/90 backdrop-blur">
                            <Calendar size={15} />
                            <span className="whitespace-nowrap">
                                {travel.startDate} – {travel.endDate}
                            </span>
                        </span>

                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs md:text-sm font-semibold text-white/90 backdrop-blur">
                            <Clock size={15} />
                            <span className="whitespace-nowrap">
                                {travel.days} {t("days") || "days"}
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom “shine” separator */}
            <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500/30 via-white/40 to-purple-500/30" />
        </div>
    );
};