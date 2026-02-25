import api from "@/lib/api";
import {
    TravelAddressDTO,
    CreateTravelAddressDTO,
    UpdateTravelAddressDTO
} from "@/types/dtos";

export const travelAddressService = {
    getTravelAddresses: async (travelId: number) => {
        const response = await api.get<TravelAddressDTO[]>(`/api/travels/${travelId}/addresses`);
        return response.data;
    },

    createTravelAddress: async (travelId: number, travelAddress: CreateTravelAddressDTO) => {
        const response = await api.post<TravelAddressDTO>(`/api/travels/${travelId}/addresses`, travelAddress);
        return response.data;
    },

    updateTravelAddress: async (travelId: number, travelAddressId: number, travelAddress: UpdateTravelAddressDTO) => {
        const response = await api.put<TravelAddressDTO>(`/api/travels/${travelId}/addresses/${travelAddressId}`, travelAddress);
        return response.data;
    },

    deleteTravelAddress: async (travelId: number, travelAddressId: number) => {
        await api.delete(`/api/travels/${travelId}/addresses/${travelAddressId}`);
    },
};