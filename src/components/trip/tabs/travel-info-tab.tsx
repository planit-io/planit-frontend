"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, MapPin, ExternalLink, AlignLeft } from "lucide-react";

import { useToast } from "@/contexts/toast-context";
import { useI18n } from "@/contexts/i18n-context";

import { travelService } from "@/services/travel-service";
import { travelAddressService } from "@/services/travel-address-service";

import { TravelAddressDTO } from "@/types/dtos";

import CreateTravelAddressModal from "@/components/travel-address/add-travel-address-modal";
import UpdateTravelAddressModal from "@/components/travel-address/update-travel-address-modal";

type TabKey = "description" | "addresses";

export const TravelInfoTab = ({ travelId }: { travelId: number }) => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const { t } = useI18n();

    const [tab, setTab] = useState<TabKey>("description");

    // ---- Description query
    const { data: travel, isLoading: isLoadingTravel } = useQuery({
        queryKey: ["travel", travelId],
        queryFn: () => travelService.getById(travelId),
        enabled: !!travelId,
    });

    // ---- Addresses query
    const { data, isLoading: isLoadingAddresses } = useQuery({
        queryKey: ["travelAddresses", travelId],
        queryFn: () => travelAddressService.getTravelAddresses(travelId),
        enabled: !!travelId,
    });

    const addresses = useMemo(() => data ?? [], [data]);

    // ---- Modals state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editing, setEditing] = useState<TravelAddressDTO | null>(null);

    // ---- Delete address
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => travelAddressService.deleteTravelAddress(travelId, id),
        onSuccess: async () => {
            showToast(t("address_deleted") || "Deleted", "success");
            await queryClient.invalidateQueries({ queryKey: ["travelAddresses", travelId] });
        },
        onError: () => showToast(t("error_generic") || "Something went wrong", "error"),
    });

    const handleDelete = (a: TravelAddressDTO) => {
        if (!a.id) return;
        const ok = confirm((t("confirm_delete_address") || "Delete this address?") as string);
        if (!ok) return;
        deleteMutation.mutate(a.id);
    };

    return (
        <div className="pb-20">
            {/* Tabs header */}
            <div className="flex items-center justify-between gap-3 mb-6">
                <div className="inline-flex rounded-2xl border bg-white p-1">
                    <button
                        onClick={() => setTab("description")}
                        className={[
                            "px-4 py-2 rounded-xl text-sm font-semibold transition",
                            tab === "description"
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                        ].join(" ")}
                    >
                        {t("description") || "Description"}
                    </button>
                    <button
                        onClick={() => setTab("addresses")}
                        className={[
                            "px-4 py-2 rounded-xl text-sm font-semibold transition",
                            tab === "addresses"
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                        ].join(" ")}
                    >
                        {t("addresses") || "Addresses"}
                    </button>
                </div>

                {/* Context action */}
                {tab === "addresses" && (
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition"
                    >
                        <Plus size={16} />
                        {t("add") || "Add"}
                    </button>
                )}
            </div>

            {/* Tab content card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                {tab === "description" ? (
                    <>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="rounded-xl bg-gray-50 p-2 text-gray-500">
                                <AlignLeft size={18} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {t("description") || "Description"}
                            </h2>
                        </div>

                        {isLoadingTravel ? (
                            <div className="text-sm text-gray-500">{t("loading") || "Loading..."}</div>
                        ) : travel?.description ? (
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {travel.description}
                            </p>
                        ) : (
                            <div className="text-sm text-gray-500">
                                {t("no_description") || "No description yet."}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="rounded-xl bg-gray-50 p-2 text-gray-500">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {t("addresses") || "Addresses"}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {t("addresses_subtitle") || "Save important places for the trip."}
                                </p>
                            </div>
                        </div>

                        {isLoadingAddresses ? (
                            <div className="text-sm text-gray-500">{t("loading") || "Loading..."}</div>
                        ) : addresses.length === 0 ? (
                            <div className="rounded-2xl border bg-gray-50/40 p-5">
                                <div className="text-sm font-semibold text-gray-900">
                                    {t("no_addresses") || "No addresses yet"}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {t("no_addresses_hint") || "Add your first one to keep everything in one place."}
                                </div>
                                <button
                                    onClick={() => setIsCreateOpen(true)}
                                    className="mt-3 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-white transition"
                                >
                                    <Plus size={16} />
                                    {t("add_first") || "Add first address"}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {addresses.map((a) => (
                                    <div
                                        key={a.id ?? `${a.address}-${a.note ?? ""}`}
                                        className="rounded-2xl border p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex gap-3 flex-1">
                                                <div className="mt-1 text-gray-400">
                                                    <MapPin size={18} />
                                                </div>

                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900">{a.address}</div>

                                                    {a.note && (
                                                        <div className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">
                                                            {a.note}
                                                        </div>
                                                    )}

                                                    <div className="mt-2">
                                                        <a
                                                            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                                a.address
                                                            )}`}
                                                        >
                                                            {t("open_in_maps") || "Open in Maps"} <ExternalLink size={14} />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setEditing(a)}
                                                    className="rounded-xl px-2 py-1 text-gray-400 hover:text-gray-700 transition"
                                                    aria-label="Edit address"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(a)}
                                                    disabled={deleteMutation.isPending}
                                                    className="rounded-xl px-2 py-1 text-gray-400 hover:text-red-600 transition disabled:opacity-40"
                                                    aria-label="Delete address"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            <CreateTravelAddressModal
                travelId={travelId}
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            {editing && (
                <UpdateTravelAddressModal
                    travelId={travelId}
                    travelAddress={editing}
                    isOpen={true}
                    onClose={() => setEditing(null)}
                />
            )}
        </div>
    );
};