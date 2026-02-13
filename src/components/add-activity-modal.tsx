"use client";

import { useState } from "react";
// We need to use raw api call here or add specific method for day activity
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader2 } from "lucide-react";
import { CreateActivityDTO } from "@/types/dtos";
import { useToast } from "@/contexts/toast-context";

export default function AddActivityModal({
    travelId,
    travelDayId,
    isOpen,
    onClose
}: {
    travelId: number;
    travelDayId: number | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const mutation = useMutation({
        mutationFn: async (data: CreateActivityDTO) => {
            const res = await api.post(`/api/travels/${travelId}/travelDays/${travelDayId}/activities`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["travelDays", travelId] });
            showToast("Activity added successfully!", "success");
            onClose();
            setFormData({ name: "", description: "" });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!travelDayId) return;
        mutation.mutate(formData);
    };

    if (!isOpen || !travelDayId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Add Activity</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Activity Name</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400 transition-all"
                            placeholder="e.g. Visit Colosseum"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none h-24 resize-none text-gray-900 placeholder:text-gray-400 transition-all"
                            placeholder="Details, time, location..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                        >
                            {mutation.isPending ? <Loader2 className="animate-spin" size={20} /> : "Save Activity"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
