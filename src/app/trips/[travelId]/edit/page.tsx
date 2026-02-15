"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { travelService } from "@/services/travel-service";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import { UpdateTravelDTO } from "@/types/dtos";
import { useParams } from "next/navigation";

export default function EditTripPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const params = useParams();
    const travelId = Number(params.travelId);
    const { data: travel } = useQuery({
        queryKey: ["travels", travelId],
        queryFn: () => travelService.getById(travelId),
    });
    const [formData, setFormData] = useState<UpdateTravelDTO>({
        name: travel?.name || "",
        description: travel?.description || "",
        destination: travel?.destination || "",
        startDate: travel?.startDate || "",
        endDate: travel?.endDate || "",
        imageUrl: travel?.imageUrl || "",
        days: 0,
    });

    const mutation = useMutation({
        mutationFn: (data: UpdateTravelDTO) => travelService.update(travelId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["travels"] });
            // Go to trips page
            router.push("/trips/" + travelId);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Calculate days between start and end date roughly or let backend handle it?
        // Backend DTO allows sending 'days' but usually it's calculated. 
        // We'll just send what we have.
        // Basic day diff logic:
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive

        mutation.mutate({
            ...formData,
            days: diffDays > 0 ? diffDays : 1
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <Link
                    href={`/trips/${travelId}`}
                    className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Trip
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Edit Trip</h1>
                        <p className="text-gray-500 mt-2">Update your trip details.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Trip Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Summer Vacation 2024"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                                Destination
                            </label>
                            <input
                                type="text"
                                id="destination"
                                name="destination"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                                    required
                                    rows={4}
                                    maxLength={200}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white 
                                                shadow-sm focus:shadow-md 
                                                focus:ring-2 focus:ring-blue-500 
                                                focus:border-blue-500 
                                                outline-none transition-all duration-200 
                                                resize-y placeholder:text-gray-400"
                                    placeholder="e.g. A fun-filled vacation in Paris, France"
                                    value={formData.description}
                                    onChange={handleChange}
                                />

                                <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                                    {formData.description.length}/200
                                </div>
                            </div>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                    Start Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                    End Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                                Cover Image URL (Optional)
                            </label>
                            <input
                                type="url"
                                id="imageUrl"
                                name="imageUrl"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="https://images.unsplash.com/..."
                                value={formData.imageUrl || ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {mutation.isPending ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Updating Trip...
                                    </>
                                ) : (
                                    "Update Trip"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
