"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Map } from "lucide-react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { travelDayService } from "@/services/travel-day-service";
import { activityService } from "@/services/activity-service";
import AddActivityModal from "@/components/activity/add-activity-modal";
import ActivityDayItem from "@/components/activity/activity-day-item";
import { DayCard } from "@/components/day/day-card";
import { useToast } from "@/contexts/toast-context";
import { useI18n } from "@/contexts/i18n-context";

export const ItineraryTab = ({ travelId }: { travelId: number }) => {
    const [activeDayId, setActiveDayId] = useState<number | null | "general">(null);

    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const { t } = useI18n();

    const addDayMutation = useMutation({
        mutationFn: (day: number) => travelDayService.createDay(travelId, { day }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["travelDays", travelId] });
            queryClient.invalidateQueries({ queryKey: ["travel", travelId] });
            showToast(t("dayAddedSuccess"), "success");
        },
        onError: () => {
            showToast(t("dayAddedError"), "error");
        }
    });

    const { data: days, isLoading: isLoadingDays } = useQuery({
        queryKey: ["travelDays", travelId],
        queryFn: () => travelDayService.getDays(travelId),
    });

    const { data: activities, isLoading: isLoadingActivities } = useQuery({
        queryKey: ["activities", travelId],
        queryFn: () => activityService.getActivities(travelId),
    });

    const isLoading = isLoadingDays || isLoadingActivities;

    if (isLoading) return <div className="p-8 text-center text-gray-500">{t("loadingItinerary")}</div>;

    const generalActivities = activities?.filter((a: any) => !a.travelDayId) || [];

    const handleDragEnd = async (result: DropResult) => {
        const { source, destination, type, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        if (type === "DAY") {
            const newDays = Array.from(days || []);
            const [movedDay] = newDays.splice(source.index, 1);
            newDays.splice(destination.index, 0, movedDay);

            queryClient.setQueryData(["travelDays", travelId], newDays);

            try {
                await travelDayService.moveDay(travelId, (movedDay as any).id, destination.index + 1);
                showToast(t("dayMoved"), "success");
            } catch {
                showToast(t("dayMovedError"), "error");
            } finally {
                queryClient.invalidateQueries({ queryKey: ["travelDays", travelId] });
            }
        } else if (type === "ACTIVITY") {
            const sourceDayId = parseInt(source.droppableId.replace("day-", ""));
            const destDayId = parseInt(destination.droppableId.replace("day-", ""));
            const actId = parseInt(draggableId.replace("activity-", ""));

            const newDays = Array.from(days || []);
            const sourceDay = newDays.find((d: any) => d.id === sourceDayId);
            const destDay = newDays.find((d: any) => d.id === destDayId);

            if (!sourceDay || !destDay) return;

            const sourceActivities = Array.from(sourceDay.activities || []);
            const destActivities = sourceDayId === destDayId ? sourceActivities : Array.from(destDay.activities || []);

            const [movedActivity] = sourceActivities.splice(source.index, 1);
            destActivities.splice(destination.index, 0, movedActivity);

            sourceDay.activities = sourceActivities;
            if (sourceDayId !== destDayId) {
                destDay.activities = destActivities;
            }

            queryClient.setQueryData(["travelDays", travelId], newDays);

            try {
                if (sourceDayId !== destDayId) {
                    await activityService.moveActivity(travelId, sourceDayId, actId, destDayId);
                    showToast(t("activityMoved"), "success");
                }
            } catch {
                showToast(t("activityMovedError"), "error");
            } finally {
                queryClient.invalidateQueries({ queryKey: ["travelDays", travelId] });
            }
        }
    };

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{t("itinerary")}</h2>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => addDayMutation.mutate(1)}
                        disabled={addDayMutation.isPending}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg transition-colors shadow-sm font-medium text-sm disabled:opacity-50"
                    >
                        <Plus size={15} /> {t("addDayBefore")}
                    </button>
                    <button
                        onClick={() => addDayMutation.mutate((days?.length || 0) + 1)}
                        disabled={addDayMutation.isPending}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors shadow-sm font-medium text-sm disabled:opacity-50"
                    >
                        <Plus size={15} /> {t("addDayAfter")}
                    </button>
                </div>
            </div>

            {/* Two-column layout: days on left, general activities on right */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Days list */}
                <div className="flex-1 w-full">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="day-list" type="DAY">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="grid gap-4 lg:gap-6 max-h-[70vh] overflow-y-auto pr-1"
                                >
                                    {days?.map((day: any, index: number) => (
                                        <DayCard key={day.id} day={day} index={index} travelId={travelId} onAddActivity={() => setActiveDayId(day.id)} />
                                    ))}
                                    {provided.placeholder}

                                    {days?.length === 0 && (
                                        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
                                            <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                                                <Map size={24} />
                                            </div>
                                            <p className="text-gray-500 text-sm">{t("noDaysYet")}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                {/* General Activities sidebar */}
                <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 lg:sticky lg:top-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{t("generalActivities")}</h3>
                        <button
                            onClick={() => setActiveDayId("general")}
                            className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm font-medium text-sm"
                        >
                            <Plus size={14} /> {t("add")}
                        </button>
                    </div>

                    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[80px] ${generalActivities.length > 0 ? "divide-y divide-gray-50" : "flex items-center justify-center p-8 text-center"}`}>
                        {generalActivities.length > 0 ? (
                            generalActivities.map((act: any) => (
                                <ActivityDayItem key={act.id} activity={act} travelId={travelId} dayId={null} />
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm italic">{t("noGeneralActivities")}</p>
                        )}
                    </div>
                </div>
            </div>

            <AddActivityModal
                travelId={travelId}
                travelDayId={activeDayId === "general" ? null : activeDayId}
                isOpen={activeDayId !== null}
                onClose={() => setActiveDayId(null)}
            />
        </div>
    );
};
