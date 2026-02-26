"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Calendar, Loader2 } from "lucide-react";

import { travelService } from "@/services/travel-service";
import { UpdateTravelDTO } from "@/types/dtos";

export default function EditTripModal({
    travelId,
    isOpen,
    onClose,
}: {
    travelId: number;
    isOpen: boolean;
    onClose: () => void;
}) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: travel, isLoading } = useQuery({
        queryKey: ["travel", travelId],
        queryFn: () => travelService.getById(travelId),
        enabled: isOpen && !!travelId,
    });

    const [formData, setFormData] = useState<UpdateTravelDTO>({
        name: "",
        description: "",
        destination: "",
        startDate: "",
        endDate: "",
        imageUrl: "",
        days: 0,
    });

    // sync form when data arrives
    useEffect(() => {
        if (!travel) return;
        setFormData({
            name: travel.name ?? "",
            description: travel.description ?? "",
            destination: travel.destination ?? "",
            startDate: travel.startDate ?? "",
            endDate: travel.endDate ?? "",
            imageUrl: travel.imageUrl ?? "",
            days: travel.days ?? 0,
        });
    }, [travel]);

    // close on ESC
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen, onClose]);

    const mutation = useMutation({
        mutationFn: (data: UpdateTravelDTO) => travelService.update(travelId, data),
        onSuccess: async () => {
            // refresh both list + detail
            await queryClient.invalidateQueries({ queryKey: ["travels"] });
            await queryClient.invalidateQueries({ queryKey: ["travel", travelId] });

            onClose();
            // Optional: if you're already on /trips/[id], you can skip this.
            // router.refresh(); // in App Router you can refresh the page data
        },
    });

    const diffDays = useMemo(() => {
        if (!formData.startDate || !formData.endDate) return 0;

        // IMPORTANT: handle YYYY-MM-DD safely (local dates)
        const [sy, sm, sd] = formData.startDate.split("-").map(Number);
        const [ey, em, ed] = formData.endDate.split("-").map(Number);
        if (![sy, sm, sd, ey, em, ed].every((n) => Number.isFinite(n))) return 0;

        const start = new Date(sy, sm - 1, sd);
        const end = new Date(ey, em - 1, ed);
        const diffTime = end.getTime() - start.getTime();
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
        return Math.max(1, days);
    }, [formData.startDate, formData.endDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            ...formData,
            days: diffDays || 1,
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-900">Edit Trip</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Update your trip details.</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="h-10 w-10 inline-flex items-center justify-center rounded-2xl hover:bg-gray-50 transition"
                        aria-label="Close"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
                    {isLoading ? (
                        <div className="rounded-3xl border bg-white p-6 flex items-center gap-3 text-sm text-gray-600">
                            <Loader2 className="animate-spin text-indigo-600" size={18} />
                            Loading trip…
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
                                    Trip Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    placeholder="e.g. Summer Vacation 2026"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="destination" className="block text-sm font-semibold text-gray-800">
                                    Destination
                                </label>
                                <input
                                    id="destination"
                                    name="destination"
                                    required
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    placeholder="e.g. Paris, France"
                                    value={formData.destination}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="block text-sm font-semibold text-gray-800">
                                    Description
                                </label>
                                <div className="relative">
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        maxLength={200}
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-y placeholder:text-gray-400"
                                        placeholder="Trip details…"
                                        value={formData.description || ""}
                                        onChange={handleChange}
                                    />
                                    <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                                        {(formData.description?.length ?? 0)}/200
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="startDate" className="block text-sm font-semibold text-gray-800">
                                        Start Date
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                        <input
                                            type="date"
                                            id="startDate"
                                            name="startDate"
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="endDate" className="block text-sm font-semibold text-gray-800">
                                        End Date
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                        <input
                                            type="date"
                                            id="endDate"
                                            name="endDate"
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Nice hint for days */}
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                                Duration: <span className="font-semibold text-gray-900">{diffDays || 1}</span>{" "}
                                {diffDays === 1 ? "day" : "days"}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-800">
                                    Cover Image URL (optional)
                                </label>
                                <input
                                    type="url"
                                    id="imageUrl"
                                    name="imageUrl"
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    placeholder="https://images.unsplash.com/..."
                                    value={formData.imageUrl || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Footer actions */}
                            <div className="pt-2 flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full sm:w-1/3 px-4 py-3 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Updating…
                                        </>
                                    ) : (
                                        "Update Trip"
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}