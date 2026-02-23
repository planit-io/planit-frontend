import api from "@/lib/api";
import {
    CreateTravelDTO,
    RetrieveTravelDTO,
    TravelDTO,
    CostDTO,
    CreateCostDTO,
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
