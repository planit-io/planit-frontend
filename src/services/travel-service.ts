import api from "@/lib/api";
import {
    CreateTravelDTO,
    RetrieveTravelDTO,
    TravelDTO,
    CostDTO,
    CreateCostDTO,
    ActivityDTO,
    TravelDayDTO,
    CreateTravelDayDTO,
    TravelerDTO,
    CreateTravelerDTO,
    UpdateTravelDTO
} from "@/types/dtos";

export const travelService = {
    getAll: async (params?: RetrieveTravelDTO) => {
        const response = await api.get<TravelDTO[]>("/api/travels", { params });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<TravelDTO>(`/api/travels/${id}`);
        return response.data;
    },

    create: async (data: CreateTravelDTO) => {
        const response = await api.post<TravelDTO>("/api/travels", data);
        return response.data;
    },

    update: async (id: number, data: UpdateTravelDTO) => {
        const response = await api.put<TravelDTO>(`/api/travels/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/api/travels/${id}`);
        return response.data;
    },


    // Activities (Per Travel Day)
    getActivities: async (travelId: number) => {
        const response = await api.get<ActivityDTO[]>(`/api/travels/${travelId}/activities`);
        return response.data;
    },

    // Travel Days
    getDays: async (travelId: number) => {
        const response = await api.get<TravelDayDTO[]>(`/api/travels/${travelId}/travelDays`);
        return response.data;
    },
    createDay: async (travelId: number, data: CreateTravelDayDTO) => {
        const response = await api.post<TravelDayDTO>(`/api/travels/${travelId}/travelDays`, data);
        return response.data;
    },

    // Travelers
    getTravelers: async () => {
        const response = await api.get<TravelerDTO[]>(`/api/travelers`);
        return response.data;
    },
    addTraveler: async (data: CreateTravelerDTO) => {
        const response = await api.post<TravelerDTO>(`/api/travelers`, data);
        return response.data;
    }
};
