"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader2 } from "lucide-react";
import { CreateTravelAddressDTO, UpdateTravelAddressDTO } from "@/types/dtos";
import { travelAddressService } from "@/services/travel-address-service";
import { useToast } from "@/contexts/toast-context";

export default function CreateTravelAddressModal({
    travelId,
    isOpen,
    onClose
}: {
    travelId: number;
    isOpen: boolean;
    onClose: () => void;
}) {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        address: "",
        note: "",
    });

    const mutation = useMutation({
        mutationFn: async (data: CreateTravelAddressDTO) => {
            return await travelAddressService.createTravelAddress(travelId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["travelAddresses", travelId] });
            showToast("TravelAddress added successfully!", "success");
            onClose();
            setFormData({ address: "", note: "" });
        },
        onError: () => {
            showToast("Failed to update travelAddress.", "error");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Add Address</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400 transition-all"
                            placeholder="e.g. Baker Street, 40 London"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none h-24 resize-none text-gray-900 placeholder:text-gray-400 transition-all"
                            placeholder="Details"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
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
                            {mutation.isPending ? <Loader2 className="animate-spin" size={20} /> : "Save Address"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
