"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { costService } from "@/services/cost-service";
import { CostDTO } from "@/types/dtos";
import { ArrowRight, Loader2, Check, HandCoins } from "lucide-react";
import { useToast } from "@/contexts/toast-context";
import { useI18n } from "@/contexts/i18n-context";

export default function SettlementCalculator({ travelId }: { travelId: number }) {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const { t } = useI18n();

    const { data: pendingSettlements, isLoading } = useQuery({
        queryKey: ["refunds", travelId],
        queryFn: () => costService.getRefunds(travelId),
    });

    const settleMutation = useMutation({
        mutationFn: (settlement: CostDTO) =>
            costService.createRefund(travelId, {
                reason: settlement.reason,
                totalAmount: settlement.totalAmount!,
                currency: settlement.currency,
                payedBy: settlement.payedBy,
                payers: settlement.payers ?? [],
                costUnitList: settlement.costUnitList.map(u => ({
                    travelerUsername: u.travelerUsername,
                    amount: u.amount!,
                    currency: u.currency,
                })),
                costType: "REFUND",
                travelId,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["refunds", travelId] });
            showToast(t("settledSuccess"), "success");
        },
        onError: () => {
            showToast(t("settledError"), "error");
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!pendingSettlements || pendingSettlements.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t("allSettled")}</h3>
                <p className="text-gray-500">{t("allSettledDescription")}</p>
            </div>
        );
    }

    const formatAmount = (amount: number, currency: string) =>
        currency === "EUR" ? `€${amount.toFixed(2)}` : `${amount.toFixed(2)} ${currency}`;

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-600">
                {pendingSettlements.length} {t("pendingPayments")}{pendingSettlements.length !== 1 ? "s" : ""}.{" "}
                Click <span className="font-medium text-indigo-600">{t("settleButton")}</span> to record.
            </p>

            <div className="space-y-3">
                {pendingSettlements.map((settlement: CostDTO, index: number) => {
                    const receiver =
                        settlement.payers?.[0] ??
                        settlement.costUnitList?.[0]?.travelerUsername ??
                        "?";

                    return (
                        <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {settlement.payedBy.substring(0, 2).toUpperCase()}
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {receiver.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm">
                                            {settlement.payedBy} → {receiver}
                                        </p>
                                        {settlement.reason && (
                                            <p className="text-xs text-gray-500 truncate">{settlement.reason}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-3">
                                    <span className="font-bold text-lg text-indigo-600">
                                        {formatAmount(settlement.totalAmount || 0, settlement.currency)}
                                    </span>
                                    <button
                                        onClick={() => settleMutation.mutate(settlement)}
                                        disabled={settleMutation.isPending}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
                                    >
                                        {settleMutation.isPending
                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                            : <HandCoins className="w-4 h-4" />}
                                        {t("settleButton")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
