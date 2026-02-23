import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, ChevronDown, ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
import { costService } from "@/services/cost-service";
import AddCostModal from "@/components/cost/add-cost-modal";
import { useI18n } from "@/contexts/i18n-context";

export const ExpensesTab = ({ travelId }: { travelId: number }) => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const { t } = useI18n();

    const { data: costs, isLoading } = useQuery({
        queryKey: ["costs", travelId],
        queryFn: () => costService.getCosts(travelId),
    });

    if (isLoading) return <div className="p-8 text-center text-gray-500">{t("loadingExpenses")}</div>;

    const allEntries = [...(costs || [])].sort((a: any, b: any) => (b.createdDate || 0) - (a.createdDate || 0));

    const total = allEntries
        .filter((e: any) => e.costType === "COST")
        .reduce((acc: number, c: any) => acc + (c.totalAmount || 0), 0);

    const currency = allEntries[0]?.currency || "EUR";

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t("expenses")}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {t("total")}: <span className="font-bold text-gray-900">{total.toFixed(2)} {currency}</span>
                    </p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium text-sm"
                >
                    <Plus size={16} /> {t("addExpense")}
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Mobile card view */}
                <div className="divide-y divide-gray-100 sm:hidden">
                    {allEntries.map((entry: any) => {
                        const isRefund = entry.costType === "REFUND";
                        return (
                            <div key={entry.id} className={`p-4 ${isRefund ? "bg-green-50/30" : ""}`}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {isRefund ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                    <TrendingUp className="w-3 h-3" /> {t("tabSettlement")}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                                    <TrendingDown className="w-3 h-3" /> Cost
                                                </span>
                                            )}
                                        </div>
                                        <p className="font-medium text-gray-900 truncate">{entry.reason}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{t("paidBy")}: {entry.payedBy}</p>
                                    </div>
                                    <span className={`font-bold text-base flex-shrink-0 ${isRefund ? "text-green-600" : "text-gray-900"}`}>
                                        {isRefund ? "−" : ""}{entry.totalAmount?.toFixed(2)} {entry.currency}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    {allEntries.length === 0 && (
                        <p className="px-4 py-10 text-center text-gray-400 italic text-sm">{t("noExpenses")}</p>
                    )}
                </div>

                {/* Desktop table view */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium w-12"></th>
                                <th className="px-6 py-4 font-medium">{t("type")}</th>
                                <th className="px-6 py-4 font-medium">{t("description")}</th>
                                <th className="px-6 py-4 font-medium">{t("paidBy")}</th>
                                <th className="px-6 py-4 font-medium">{t("split")}</th>
                                <th className="px-6 py-4 font-medium text-right">{t("amount")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allEntries.map((entry: any) => {
                                const isExpanded = expandedId === entry.id;
                                const splitCount = entry.costUnitList?.length || 0;
                                const isRefund = entry.costType === "REFUND";

                                return (
                                    <React.Fragment key={entry.id}>
                                        <tr
                                            className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${isRefund ? "bg-green-50/30" : ""}`}
                                            onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                                        >
                                            <td className="px-6 py-4">
                                                {splitCount > 1 && (isExpanded
                                                    ? <ChevronDown className="w-4 h-4 text-gray-400" />
                                                    : <ChevronRight className="w-4 h-4 text-gray-400" />)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {isRefund ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap">
                                                        <TrendingUp className="w-3 h-3" /> Refund
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full whitespace-nowrap">
                                                        <TrendingDown className="w-3 h-3" /> Cost
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{entry.reason}</td>
                                            <td className="px-6 py-4 text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold uppercase">
                                                        {entry.payedBy?.substring(0, 2)}
                                                    </div>
                                                    {entry.payedBy}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {splitCount > 1 ? `${splitCount} people` : '1 person'}
                                            </td>
                                            <td className={`px-6 py-4 text-right font-semibold ${isRefund ? "text-green-600" : "text-gray-900"}`}>
                                                {isRefund ? "−" : ""}{entry.totalAmount?.toFixed(2)} {entry.currency}
                                            </td>
                                        </tr>
                                        {isExpanded && splitCount > 1 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 bg-gray-50/50">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                                        {isRefund ? t("refundBreakdown") : t("costBreakdown")}
                                                    </p>
                                                    <div className="grid gap-2">
                                                        {entry.costUnitList?.map((unit: any, idx: number) => (
                                                            <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold uppercase">
                                                                        {unit.travelerUsername?.substring(0, 2)}
                                                                    </div>
                                                                    <span className="text-sm font-medium text-gray-700">{unit.travelerUsername}</span>
                                                                </div>
                                                                <span className={`text-sm font-semibold ${isRefund ? "text-green-600" : "text-gray-900"}`}>
                                                                    {isRefund ? "−" : ""}{unit.amount?.toFixed(2)} {unit.currency}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                            {allEntries.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">{t("noExpenses")}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddCostModal travelId={travelId} isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
        </div>
    );
};
