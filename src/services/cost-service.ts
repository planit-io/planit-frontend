import api from "@/lib/api";
import {
    CostDTO,
    CreateCostDTO,
    UpdateCostDTO,
} from "@/types/dtos";

export const costService = {
    getCosts: async (travelId: number) => {
        const response = await api.get<CostDTO[]>(`/api/travel/${travelId}/costs`);
        return response.data;
    },

    createCost: async (travelId: number, cost: CreateCostDTO) => {
        const response = await api.post<CostDTO>(`/api/travel/${travelId}/costs`, cost);
        return response.data;
    },

    updateCost: async (travelId: number, costId: number, cost: UpdateCostDTO) => {
        const response = await api.put<CostDTO>(`/api/travel/${travelId}/costs/${costId}`, cost);
        return response.data;
    },

    deleteCost: async (travelId: number, costId: number) => {
        await api.delete(`/api/travel/${travelId}/costs/${costId}`);
    },
}