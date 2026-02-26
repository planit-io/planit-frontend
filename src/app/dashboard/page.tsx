"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Plus, Calendar, MapPin, ArrowRight, Loader2, Search } from "lucide-react";

import { travelService } from "@/services/travel-service";
import { AppShell } from "@/components/layout/app-shell";

function formatLocalDate(dateString?: string, locale = "en-US") {
    if (!dateString) return "";
    const parts = dateString.split("-").map(Number);
    if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
        const [y, m, d] = parts;
        const dt = new Date(y, m - 1, d);
        return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short" }).format(dt);
    }
    const dt = new Date(dateString);
    if (Number.isNaN(dt.getTime())) return dateString;
    return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short" }).format(dt);
}

export default function DashboardPage() {
    const { data: travels, isLoading, isError } = useQuery({
        queryKey: ["travels"],
        queryFn: () => travelService.getAll(),
    });

    const [q, setQ] = useState("");

    const hasTrips = (travels?.length ?? 0) > 0;

    const filtered = useMemo(() => {
        const list = travels ?? [];
        const query = q.trim().toLowerCase();
        if (!query) return list;
        return list.filter((t) =>
            `${t.name ?? ""} ${t.destination ?? ""}`.toLowerCase().includes(query)
        );
    }, [travels, q]);

    return (
        <AppShell title="Dashboard">
            <div className="pb-24">
                {/* Header card */}
                <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-5 md:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">My Trips</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Keep everything organized — itinerary, costs, and friends.
                            </p>
                        </div>

                        <Link
                            href="/trips/new"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            New trip
                        </Link>
                    </div>

                    {/* Search */}
                    {hasTrips && (
                        <div className="mt-5">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Search trips by name or destination…"
                                    className="w-full rounded-2xl border bg-white px-10 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* States */}
                {isLoading ? (
                    <div className="mt-6 rounded-3xl border bg-white shadow-sm p-6 flex items-center gap-4">
                        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                        <div>
                            <div className="font-semibold text-gray-900">Loading trips</div>
                            <div className="text-sm text-gray-500">Getting your adventures ready…</div>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="mt-6 rounded-3xl border bg-white shadow-sm p-8 text-center">
                        <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                            <Loader2 className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Failed to load trips</h3>
                        <p className="text-sm text-gray-500 mt-2">
                            We couldn't fetch your travel plans. Please try again later.
                        </p>
                    </div>
                ) : !hasTrips ? (
                    <div className="mt-6 rounded-3xl border border-dashed bg-white p-10 md:p-14 text-center">
                        <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-gray-900">No trips yet</h3>
                        <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                            Create your first travel plan and invite your friends.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/trips/new"
                                className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 text-white px-5 py-3 text-sm font-semibold hover:bg-black transition"
                            >
                                <Plus className="h-4 w-4" />
                                Create trip
                            </Link>
                        </div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="mt-6 rounded-3xl border bg-white p-10 text-center">
                        <h3 className="text-lg font-bold text-gray-900">No results</h3>
                        <p className="text-sm text-gray-500 mt-1">Try a different search.</p>
                        <button
                            onClick={() => setQ("")}
                            className="mt-4 rounded-2xl border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {filtered.map((travel) => (
                            <Link
                                key={travel.id}
                                href={`/trips/${travel.id}`}
                                className="group rounded-3xl border bg-white shadow-sm hover:shadow-lg transition overflow-hidden"
                            >
                                {/* Image */}
                                <div className="h-40 bg-gray-100 relative overflow-hidden">
                                    {travel.imageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={travel.imageUrl}
                                            alt={travel.destination}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                                            <MapPin className="h-12 w-12" />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                        <h3 className="text-white font-extrabold text-lg leading-tight">
                                            {travel.name}
                                        </h3>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-4">
                                    <div className="min-w-0">
                                        <div className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <span className="truncate">{travel.destination}</span>
                                        </div>

                                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>
                                                {formatLocalDate(travel.startDate)} – {formatLocalDate(travel.endDate)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                                        <span className="text-gray-500">
                                            {travel.days} {travel.days === 1 ? "day" : "days"}
                                        </span>
                                        <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                            View <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
}