"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { travelService } from "@/services/travel-service";
import { X, Loader2, Plus, Trash2, Users } from "lucide-react";
import { CreateCostDTO, CreateCostUnitDTO } from "@/types/dtos";
import { useToast } from "@/contexts/toast-context";

interface CostSplit {
    travelerUsername: string;
    amount: string;
    selected: boolean;
}

export default function AddCostModal({
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
        reason: "",
        totalAmount: "",
        currency: "EUR",
        payedBy: "",
    });

    const [splits, setSplits] = useState<CostSplit[]>([]);
    const [splitError, setSplitError] = useState("");

    const { data: travelers } = useQuery({
        queryKey: ["travelers"],
        queryFn: () => travelService.getTravelers(),
    });

    const tripTravelers = travelers?.filter((t) => t.travelId === travelId) || [];

    // Initialize splits when travelers load
    useEffect(() => {
        if (tripTravelers.length > 0 && splits.length === 0) {
            setSplits(tripTravelers.map(t => ({
                travelerUsername: t.username,
                amount: "",
                selected: false
            })));
        }
    }, [tripTravelers, splits.length]);

    const mutation = useMutation({
        mutationFn: (data: CreateCostDTO) => travelService.createCost(travelId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["costs", travelId] });
            showToast("Expense added successfully!", "success");
            onClose();
            resetForm();
        },
    });

    const resetForm = () => {
        setFormData({
            reason: "",
            totalAmount: "",
            currency: "EUR",
            payedBy: "",
        });
        setSplits(tripTravelers.map(t => ({
            travelerUsername: t.username,
            amount: "",
            selected: false
        })));
        setSplitError("");
    };

    const toggleSplit = (username: string) => {
        setSplits(prev => prev.map(s =>
            s.travelerUsername === username
                ? { ...s, selected: !s.selected, amount: !s.selected ? s.amount : "" }
                : s
        ));
    };

    const updateSplitAmount = (username: string, amount: string) => {
        setSplits(prev => prev.map(s =>
            s.travelerUsername === username ? { ...s, amount } : s
        ));
        setSplitError("");
    };

    const splitEqually = () => {
        const selectedSplits = splits.filter(s => s.selected);
        if (selectedSplits.length === 0 || !formData.totalAmount) return;

        const total = parseFloat(formData.totalAmount);
        const perPerson = (total / selectedSplits.length).toFixed(2);

        setSplits(prev => prev.map(s =>
            s.selected ? { ...s, amount: perPerson } : s
        ));
        setSplitError("");
    };

    const validateSplits = (): boolean => {
        const selectedSplits = splits.filter(s => s.selected);
        if (selectedSplits.length === 0) {
            setSplitError("Select at least one person to split the cost");
            return false;
        }

        const total = parseFloat(formData.totalAmount);
        const splitSum = selectedSplits.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);

        if (Math.abs(splitSum - total) > 0.01) {
            setSplitError(`Split total (${splitSum.toFixed(2)}) must equal expense total (${total.toFixed(2)})`);
            return false;
        }

        setSplitError("");
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.payedBy || !validateSplits()) return;

        const amount = parseFloat(formData.totalAmount);
        const selectedSplits = splits.filter(s => s.selected);

        const costUnitList: CreateCostUnitDTO[] = selectedSplits.map(s => ({
            travelerUsername: s.travelerUsername,
            amount: parseFloat(s.amount),
            currency: formData.currency
        }));

        const payload: CreateCostDTO = {
            reason: formData.reason,
            totalAmount: amount,
            currency: formData.currency,
            payedBy: formData.payedBy,
            costType: "COST",
            payers: selectedSplits.map(s => s.travelerUsername),
            costUnitList,
            travelId: travelId,
            date: Date.now()
        };

        mutation.mutate(payload);
    };

    if (!isOpen) return null;

    const selectedCount = splits.filter(s => s.selected).length;
    const splitSum = splits.filter(s => s.selected).reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
    const total = parseFloat(formData.totalAmount) || 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">Add Expense</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400 transition-all"
                                placeholder="e.g. Dinner at Luigi's"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400 transition-all"
                                    placeholder="0.00"
                                    value={formData.totalAmount}
                                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-gray-900 transition-all"
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                >
                                    <option value="EUR">EUR (€)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Paid By</label>
                            <select
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-gray-900 transition-all"
                                value={formData.payedBy}
                                onChange={(e) => setFormData({ ...formData, payedBy: e.target.value })}
                            >
                                <option value="" disabled>Select who paid</option>
                                {tripTravelers.map((traveler) => (
                                    <option key={traveler.id} value={traveler.username}>
                                        {traveler.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Split Section */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-indigo-600" />
                                <h3 className="font-semibold text-gray-900">Split Among</h3>
                                <span className="text-sm text-gray-500">({selectedCount} selected)</span>
                            </div>
                            {selectedCount > 0 && (
                                <button
                                    type="button"
                                    onClick={splitEqually}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Split Equally
                                </button>
                            )}
                        </div>

                        <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                            {splits.map((split) => (
                                <div key={split.travelerUsername} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                                    <input
                                        type="checkbox"
                                        checked={split.selected}
                                        onChange={() => toggleSplit(split.travelerUsername)}
                                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                    <div className="flex-1 font-medium text-gray-900">
                                        {split.travelerUsername}
                                    </div>
                                    {split.selected && (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                value={split.amount}
                                                onChange={(e) => updateSplitAmount(split.travelerUsername, e.target.value)}
                                                className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900 text-sm"
                                            />
                                            <span className="text-gray-500 text-sm">{formData.currency}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Split Summary */}
                        {selectedCount > 0 && (
                            <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-700">Split Total:</span>
                                    <span className={`font-semibold ${Math.abs(splitSum - total) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                                        {splitSum.toFixed(2)} {formData.currency}
                                    </span>
                                </div>
                                {total > 0 && (
                                    <div className="flex justify-between text-sm mt-1">
                                        <span className="text-gray-700">Expense Total:</span>
                                        <span className="font-semibold text-gray-900">
                                            {total.toFixed(2)} {formData.currency}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {splitError && (
                            <div className="mt-3 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                {splitError}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
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
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {mutation.isPending ? <Loader2 className="animate-spin" size={20} /> : "Save Expense"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
