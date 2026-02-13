"use client";

import { useQuery } from "@tanstack/react-query";
import { travelService } from "@/services/travel-service";
import Link from "next/link";
import { Plus, Calendar, MapPin, ArrowRight, Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { data: travels, isLoading, isError } = useQuery({
        queryKey: ["travels"],
        queryFn: () => travelService.getAll(),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
                <p className="text-gray-500">Loading your adventures...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-full mb-4">
                    <Loader2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Failed to load trips</h3>
                <p className="text-gray-500 max-w-sm mt-2">
                    We couldn't fetch your travel plans. Please try again later.
                </p>
            </div>
        );
    }

    const hasTrips = travels && travels.length > 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
                {hasTrips && (
                    <Link
                        href="/trips/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:hidden"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Trip
                    </Link>
                )}
            </div>

            {!hasTrips ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                        <MapPin className="h-12 w-12" />
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No trips yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Get started by creating your first travel plan.
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/trips/new"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            Create Trip
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {travels.map((travel) => (
                        <Link
                            key={travel.id}
                            href={`/trips/${travel.id}`}
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
                        >
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                {travel.imageUrl ? (
                                    <img
                                        src={travel.imageUrl}
                                        alt={travel.destination}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                                        <MapPin className="h-16 w-16" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-xl">{travel.name}</h3>
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 flex items-center gap-1 mb-1">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            {travel.destination}
                                        </h4>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {travel.startDate} - {travel.endDate}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                                    <span className="text-gray-500">
                                        {travel.days} {travel.days === 1 ? 'day' : 'days'}
                                    </span>
                                    <span className="text-indigo-600 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                        View Details <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
