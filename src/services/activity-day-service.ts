import api from "@/lib/api";
import {
    ActivityDTO,
    CreateActivityDayDTO,
    UpdateActivityDTO,
} from "@/types/dtos";

export const activityDayService = {
    getActivities: async (travelId: number, dayId: number) => {
        const response = await api.get<ActivityDTO[]>(`/api/travels/${travelId}/travelDays/${dayId}/activities`);
        return response.data;
    },

    createActivity: async (travelId: number, dayId: number, activity: CreateActivityDayDTO) => {
        const response = await api.post<ActivityDTO>(`/api/travels/${travelId}/travelDays/${dayId}/activities`, activity);
        return response.data;
    },

    updateActivity: async (travelId: number, dayId: number, activityId: number, activity: UpdateActivityDTO) => {
        const response = await api.put<ActivityDTO>(`/api/travels/${travelId}/travelDays/${dayId}/activities/${activityId}`, activity);
        return response.data;
    },

    deleteActivity: async (travelId: number, dayId: number, activityId: number) => {
        await api.delete(`/api/travels/${travelId}/travelDays/${dayId}/activities/${activityId}`);
    },

    markActivityCompletition: async (travelId: number, dayId: number, activityId: number, mark: Boolean) => {
        const response = await api.patch<ActivityDTO>(`/api/travels/${travelId}/travelDays/${dayId}/activities/${activityId}`, mark);
        return response.data;
    },
}