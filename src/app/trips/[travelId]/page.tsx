"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { travelService } from "@/services/travel-service";
import { useParams } from "next/navigation";
import { DollarSign, Map, Users, TrendingUp, FileText, DockIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import AddTravelerModal from "@/components/add-traveler-modal";
import SettlementCalculator from "@/components/cost/settlement-calculator";
import { DescriptionTab } from "@/components/trip/tabs/description-tab";
import { ItineraryTab } from "@/components/trip/tabs/itinerary-tab";
import { ExpensesTab } from "@/components/trip/tabs/expenses-tab";
import { TravelersTab } from "@/components/trip/tabs/travelers-tab";
import { DocumentsTab } from "@/components/trip/tabs/documents-tab";
import { TripHeader } from "@/components/trip/trip-header";
import { useI18n } from "@/contexts/i18n-context";

export default function TripDetailPage() {
    const params = useParams();
    const travelId = Number(params.travelId);
    const [activeTab, setActiveTab] = useState<"description" | "itinerary" | "expenses" | "settlement" | "travelers" | "documents">("description");
    const [isAddTravelerOpen, setIsAddTravelerOpen] = useState(false);
    const { t } = useI18n();

    const { data: travel, isLoading } = useQuery({
        queryKey: ["travel", travelId],
        queryFn: () => travelService.getById(travelId),
        enabled: !!travelId,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-indigo-100 rounded-full mb-4"></div>
                    <div className="text-indigo-600 font-medium">{t("loading")}</div>
                </div>
            </div>
        );
    }

    if (!travel) return <div className="p-10 text-center">Trip not found</div>;

    const tabs = [
        { key: "description", label: t("tabDescription"), icon: <FileText size={18} /> },
        { key: "itinerary", label: t("tabItinerary"), icon: <Map size={18} /> },
        { key: "expenses", label: t("tabExpenses"), icon: <DollarSign size={18} /> },
        { key: "settlement", label: t("tabSettlement"), icon: <TrendingUp size={18} /> },
        { key: "travelers", label: t("tabTravelers"), icon: <Users size={18} /> },
        { key: "documents", label: t("tabDocuments"), icon: <DockIcon size={18} /> },
    ] as const;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <TripHeader travel={travel} />

            <div className="max-w-5xl mx-auto px-3 md:px-4 -mt-8 relative z-10">
                {/* Tab bar — scrollable on mobile */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-1.5 flex overflow-x-auto mb-6 md:mb-8 gap-1 scrollbar-none">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 md:px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm md:text-base",
                                activeTab === tab.key
                                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <span className="flex-shrink-0">{tab.icon}</span>
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === "description" && <DescriptionTab travelId={travelId} />}
                    {activeTab === "itinerary" && <ItineraryTab travelId={travelId} />}
                    {activeTab === "expenses" && <ExpensesTab travelId={travelId} />}
                    {activeTab === "settlement" && (
                        <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("tabSettlement")}</h2>
                            <SettlementCalculator travelId={travelId} />
                        </div>
                    )}
                    {activeTab === "travelers" && (
                        <TravelersTab travelId={travelId} onAddTraveler={() => setIsAddTravelerOpen(true)} />
                    )}
                    {activeTab === "documents" && <DocumentsTab travelId={travelId} />}
                </div>
            </div>

            <AddTravelerModal
                travelId={travelId}
                isOpen={isAddTravelerOpen}
                onClose={() => setIsAddTravelerOpen(false)}
            />
        </div>
    );
}
