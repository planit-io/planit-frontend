"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { travelService } from "@/services/travel-service";
import { X, Loader2, UserPlus, AlertCircle } from "lucide-react";
import { CreateTravelerDTO } from "@/types/dtos";
import { useToast } from "@/contexts/toast-context";

export default function AddTravelerModal({
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
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const mutation = useMutation({
        mutationFn: (data: CreateTravelerDTO) => travelService.addTraveler(data),
        onSuccess: () => {
            // Invalidate queries to refresh the list
            // We might need to invalidate both general travelers and specific trip travelers if we had that query
            queryClient.invalidateQueries({ queryKey: ["travelers"] });
            showToast("Traveler added successfully!", "success");
            onClose();
            setUsername("");
            setError("");
        },
        onError: (err) => {
            setError("Failed to add traveler. Please check the username and try again.");
            console.error(err);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim()) {
            setError("Username is required");
            return;
        }

        mutation.mutate({
            username: username,
            travelId: travelId,
            role: "MEMBER"
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-indigo-600" />
                        Add Traveler
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            required
                            type="text"
                            autoFocus
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            The user must already exist in the system.
                        </p>
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
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : "Add Traveler"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
