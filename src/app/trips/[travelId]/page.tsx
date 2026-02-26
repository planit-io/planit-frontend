"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { DollarSign, Map, Users, TrendingUp, DockIcon, MapPin, Loader2, ChevronLeft, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

import { travelService } from "@/services/travel-service";
import { AppShell } from "@/components/layout/app-shell";

import AddTravelerModal from "@/components/add-traveler-modal";
import SettlementCalculator from "@/components/cost/settlement-calculator";
import { TravelInfoTab } from "@/components/trip/tabs/travel-info-tab";
import { ItineraryTab } from "@/components/trip/tabs/itinerary-tab";
import { ExpensesTab } from "@/components/trip/tabs/expenses-tab";
import { TravelersTab } from "@/components/trip/tabs/travelers-tab";
import { DocumentsTab } from "@/components/trip/tabs/documents-tab";
import { TripHeader } from "@/components/trip/trip-header";
import { useI18n } from "@/contexts/i18n-context";
import EditTripModal from "@/components/trip/edit-trip-modal";

type TabKey = "travelInfo" | "itinerary" | "expenses" | "settlement" | "travelers" | "documents";

export default function TripDetailPage() {
    const params = useParams();
    const router = useRouter();
    const travelId = Number(params.travelId);

    const [activeTab, setActiveTab] = useState<TabKey>("travelInfo");
    const [isAddTravelerOpen, setIsAddTravelerOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const { t } = useI18n();

    const { data: travel, isLoading } = useQuery({
        queryKey: ["travel", travelId],
        queryFn: () => travelService.getById(travelId),
        enabled: !!travelId,
    });

    const tabs = useMemo(
        () =>
            [
                { key: "travelInfo", label: t("tabTravelInfo"), icon: MapPin },
                { key: "itinerary", label: t("tabItinerary"), icon: Map },
                { key: "expenses", label: t("tabExpenses"), icon: DollarSign },
                { key: "settlement", label: t("tabSettlement"), icon: TrendingUp },
                { key: "travelers", label: t("tabTravelers"), icon: Users },
                { key: "documents", label: t("tabDocuments"), icon: DockIcon },
            ] as const,
        [t]
    );

    const backButton = (
        <button
            onClick={() => (window.history.length > 1 ? router.back() : router.push("/dashboard"))}
            className="inline-flex items-center justify-center h-10 w-10 rounded-2xl hover:bg-gray-100 transition outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Back"
            title="Back"
        >
            <ChevronLeft size={20} className="text-gray-700" />
        </button>
    );

    const editButton = (
        <button
            onClick={() => setIsEditOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Edit trip"
            title="Edit"
        >
            <Pencil size={16} />
            <span className="hidden sm:inline">{t("editTrip")}</span>
        </button>
    );

    if (isLoading) {
        return (
            <AppShell title={t("trip") || "Trip"} leftSlot={backButton}>
                <div className="min-h-[70vh] flex items-center justify-center px-4">
                    <div className="rounded-3xl border bg-white shadow-sm p-6 flex items-center gap-4">
                        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                        <div>
                            <div className="font-semibold text-gray-900">{t("loading")}</div>
                            <div className="text-sm text-gray-500">Preparing your trip…</div>
                        </div>
                    </div>
                </div>
            </AppShell>
        );
    }

    if (!travel) {
        return (
            <AppShell title={t("trip") || "Trip"} leftSlot={backButton}>
                <div className="rounded-3xl border bg-white shadow-sm p-10 text-center">Trip not found</div>
            </AppShell>
        );
    }

    const bottomNav = (
        <div className="md:hidden rounded-3xl border bg-white/90 backdrop-blur shadow-xl p-1.5">
            <div className="grid grid-cols-6 gap-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.key;

                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 rounded-2xl py-2 transition outline-none",
                                active ? "bg-indigo-600 text-white shadow" : "text-gray-600 hover:bg-gray-50"
                            )}
                        >
                            <Icon size={18} />
                            <span className="text-[10px] font-semibold leading-none truncate max-w-[64px]">
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <AppShell title={t("trip") || "Trip"}
            leftSlot={backButton}
            rightSlot={editButton}
            bottomSlot={bottomNav}
        >
            <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <TripHeader travel={travel} />
            </div>

            <div className="hidden md:flex mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 gap-1 overflow-x-auto scrollbar-none">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.key;

                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition whitespace-nowrap flex-shrink-0 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                                active ? "bg-indigo-600 text-white shadow" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-4 md:mt-6 rounded-3xl border border-gray-100 bg-white shadow-sm p-3 md:p-6">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {activeTab === "travelInfo" && <TravelInfoTab travelId={travelId} />}
                    {activeTab === "itinerary" && <ItineraryTab travelId={travelId} />}
                    {activeTab === "expenses" && <ExpensesTab travelId={travelId} />}

                    {activeTab === "settlement" && (
                        <div className="bg-white">
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

            <AddTravelerModal travelId={travelId} isOpen={isAddTravelerOpen} onClose={() => setIsAddTravelerOpen(false)} />
            <EditTripModal
                travelId={travelId}
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
            />
        </AppShell>
    );
}