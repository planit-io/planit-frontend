"use client";

import { useState, useEffect } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, ChevronDown } from "lucide-react";
import { formatLocalDateCustom } from "@/lib/utils";
import ActivityDayItem from "@/components/activity/activity-day-item";

export const DayCard = ({
    day,
    index,
    travelId,
    onAddActivity,
}: {
    day: any;
    index: number;
    travelId: number;
    onAddActivity: () => void;
}) => {
    // We add index to the dependency array of useEffect to trigger re-renders 
    // when the day order changes, fixing the accordion header staleness bug.
    const [open, setOpen] = useState(false);

    // We can run an effect on index change if we need to force update other local state
    // but React should handle standard props natively. Using key={day.id} or key={day.date} 
    // in the parent list helps React keep track.
    useEffect(() => {
        // Any specific reset logic if day is moved can go here.
    }, [index, day]);

    const activitiesCount = day.activities?.length ?? 0;

    return (
        <Draggable draggableId={"day-" + day.id} index={index}>
            {(providedDay) => (
                <div
                    ref={providedDay.innerRef}
                    {...providedDay.draggableProps}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all"
                >
                    {/* Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center group/header">
                        <div className="flex items-center gap-3">
                            <div
                                {...providedDay.dragHandleProps}
                                className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing p-1 -ml-2"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grip-vertical"><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></svg>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen((v) => !v)}
                                className="text-left outline-none"
                            >
                                <h3 className="font-bold text-lg text-gray-900">
                                    {formatLocalDateCustom(
                                        day.date,
                                        "en-GB",
                                        {
                                            "day": "numeric",
                                            "month": "numeric",
                                            "year": "numeric",
                                            "weekday": "long",
                                        }
                                    )}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {day.destination}
                                    <span className="ml-2 text-gray-400">• {activitiesCount} activities</span>
                                </p>
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddActivity();
                                }}
                                className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                            >
                                <Plus size={16} /> Activity
                            </button>

                            <button
                                onClick={() => setOpen((v) => !v)}
                                className="p-1 outline-none relative"
                            >
                                <ChevronDown
                                    size={18}
                                    className={`text-gray-400 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                        <div className="overflow-hidden">
                            <div className="p-2">
                                <Droppable droppableId={"day-" + day.id} type="ACTIVITY">
                                    {(providedAct) => (
                                        <div
                                            ref={providedAct.innerRef}
                                            {...providedAct.droppableProps}
                                        >
                                            {day.activities && day.activities.length > 0 ? (
                                                <div className="divide-y divide-gray-50">
                                                    {day.activities.map((act: any, actIndex: number) => (
                                                        <Draggable key={act.id} draggableId={"activity-" + act.id} index={actIndex}>
                                                            {(providedItem) => (
                                                                <div
                                                                    ref={providedItem.innerRef}
                                                                    {...providedItem.draggableProps}
                                                                    className="flex items-center group/item"
                                                                >
                                                                    <div
                                                                        {...providedItem.dragHandleProps}
                                                                        className="pl-2 text-gray-300 hover:text-gray-400 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity"
                                                                    >
                                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grip-vertical"><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></svg>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <ActivityDayItem activity={act} travelId={travelId} dayId={day.id} />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {providedAct.placeholder}
                                                </div>
                                            ) : (
                                                <div className="p-6 text-center text-gray-400 text-sm italic">
                                                    No activities yet.
                                                    {providedAct.placeholder}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};
