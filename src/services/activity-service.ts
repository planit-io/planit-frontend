import api from "@/lib/api";
import {
    ActivityDTO,
    CreateActivityDayDTO,
    UpdateActivityDTO,
} from "@/types/dtos";

export const activityService = {
    // Generic Travel Activities
    getActivities: async (travelId: number) => {
        const response = await api.get<ActivityDTO[]>(`/api/travels/${travelId}/activities`);
        return response.data;
    },

    // Day-specific Activities
    getDayActivities: async (travelId: number, dayId: number) => {
        const response = await api.get<ActivityDTO[]>(`/api/travels/${travelId}/travelDays/${dayId}/activities`);
        return response.data;
    },

    createActivity: async (travelId: number, dayId: number | null, activity: CreateActivityDayDTO) => {
        const url = dayId
            ? `/api/travels/${travelId}/travelDays/${dayId}/activities`
            : `/api/travels/${travelId}/activities`;
        const response = await api.post<ActivityDTO>(url, activity);
        return response.data;
    },

    updateActivity: async (travelId: number, dayId: number | null, activityId: number, activity: UpdateActivityDTO) => {
        const url = dayId
            ? `/api/travels/${travelId}/travelDays/${dayId}/activities/${activityId}`
            : `/api/travels/${travelId}/activities/${activityId}`;
        const response = await api.put<ActivityDTO>(url, activity);
        return response.data;
    },

    deleteActivity: async (travelId: number, dayId: number | null, activityId: number) => {
        const url = dayId
            ? `/api/travels/${travelId}/travelDays/${dayId}/activities/${activityId}`
            : `/api/travels/${travelId}/activities/${activityId}`;
        await api.delete(url);
    },

    markActivityCompletition: async (travelId: number, dayId: number | null, activityId: number, mark: Boolean) => {
        const url = dayId
            ? `/api/travels/${travelId}/travelDays/${dayId}/activities/${activityId}`
            : `/api/travels/${travelId}/activities/${activityId}`;
        const response = await api.patch<ActivityDTO>(url, mark);
        return response.data;
    },

    moveActivity: async (travelId: number, travelDayId: number | null, activityId: number, targetTravelDayId: number | null) => {
        const targetQuery = targetTravelDayId ? `?targetTravelDayId=${targetTravelDayId}` : "";
        const url = travelDayId
            ? `/api/travels/${travelId}/travelDays/${travelDayId}/activities/${activityId}/move${targetQuery}`
            : `/api/travels/${travelId}/activities/${activityId}/move${targetQuery}`;
        await api.put(url);
    },
};
