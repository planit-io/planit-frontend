"use client";

import { useState, useTransition } from "react";
import { Pencil, Check, X } from "lucide-react";
import { ActivityDTO } from "@/types/dtos";
import { activityService } from "@/services/activity-service";

type Props = {
    travelId: number;
    dayId: number | null;
    activity: ActivityDTO;
};

export default function ActivityDayItem({
    travelId,
    dayId,
    activity,
}: Props) {
    const [completed, setCompleted] = useState(activity.completed);
    const [isPending, startTransition] = useTransition();
    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState(activity.name);
    const [time, setTime] = useState(activity.time ?? "");
    const [description, setDescription] = useState(
        activity.description ?? ""
    );

    // Toggle completed
    const handleToggle = (checked: boolean) => {
        if (!activity.id) return;

        const prev = completed;
        setCompleted(checked);

        startTransition(async () => {
            try {
                await activityService.markActivityCompletition(
                    travelId,
                    dayId,
                    activity.id!,
                    checked
                );
            } catch (err) {
                console.error(err);
                setCompleted(prev);
            }
        });
    };

    // Save edit
    const handleSave = () => {
        if (!activity.id) return;

        const prevData = {
            name: activity.name,
            time: activity.time,
            description: activity.description,
        };

        startTransition(async () => {
            const updateActivity = {
                name,
                time,
                description,
            }
            try {
                await activityService.updateActivity(
                    travelId,
                    dayId,
                    activity.id!,
                    updateActivity
                );

                setIsEditing(false);
            } catch (err) {
                console.error(err);

                // rollback UI
                setName(prevData.name);
                setTime(prevData.time ?? "");
                setDescription(prevData.description ?? "");
            }
        });
    };

    const handleCancel = () => {
        setName(activity.name);
        setTime(activity.time ?? "");
        setDescription(activity.description ?? "");
        setIsEditing(false);
    };

    return (
        <div className="p-4 hover:bg-gray-50 rounded-lg transition-colors flex justify-between items-start group">
            <div className="flex gap-3 w-full">
                <div className="mt-1">
                    <input
                        type="checkbox"
                        checked={completed}
                        disabled={isPending || isEditing}
                        onChange={(e) => handleToggle(e.target.checked)}
                        className="cursor-pointer disabled:cursor-not-allowed"
                    />
                </div>

                <div className="flex-1">
                    {isEditing ? (
                        <div className="space-y-2">
                            {dayId !== null && (
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="text-sm text-gray-500 border rounded px-2 py-1 w-24"
                                />
                            )}

                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Activity name"
                                className="font-medium border rounded px-2 py-1 w-full"
                            />

                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description"
                                className="text-sm text-gray-500 border rounded px-2 py-1 w-full"
                            />
                        </div>
                    ) : (
                        <>
                            {time && (
                                <h5 className="text-gray-500 text-sm">{time}</h5>
                            )}

                            <h4
                                className={`font-medium ${completed
                                    ? "line-through text-gray-400"
                                    : "text-gray-900"
                                    }`}
                            >
                                {name}
                            </h4>

                            {description && (
                                <p className="text-gray-500 text-sm mt-0.5">
                                    {description}
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 ml-3">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            disabled={isPending}
                            className="text-green-600 hover:text-green-800 disabled:opacity-30"
                        >
                            <Check size={18} />
                        </button>

                        <button
                            onClick={handleCancel}
                            disabled={isPending}
                            className="text-red-500 hover:text-red-700 disabled:opacity-30"
                        >
                            <X size={18} />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        disabled={isPending}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-700"
                    >
                        <Pencil size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}
