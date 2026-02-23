import api from "@/lib/api";
import { TravelDayDTO, CreateTravelDayDTO } from "@/types/dtos";

export const travelDayService = {
    // Travel Days
    getDays: async (travelId: number) => {
        const response = await api.get<TravelDayDTO[]>(`/api/travels/${travelId}/travelDays`);
        return response.data;
    },
    createDay: async (travelId: number, data: CreateTravelDayDTO) => {
        const response = await api.post<TravelDayDTO>(`/api/travels/${travelId}/travelDays`, data);
        return response.data;
    },
    moveDay: async (travelId: number, travelDayId: number, newDayNumber: number) => {
        await api.put(`/api/travels/${travelId}/travelDays/${travelDayId}/move?newDayNumber=${newDayNumber}`);
    },
};
