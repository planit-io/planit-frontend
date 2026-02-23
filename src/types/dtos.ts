export type CostType = 'COST' | 'REFUND';
export type TravelerRole = 'ADMIN' | 'MEMBER';

export interface UserDTO {
    id?: number;
    keycloakId?: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
    createDate?: number;
    lastUpdateDate?: number;
}

export interface CreateUserDTO {
    keycloakId?: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface TravelerDTO {
    id?: number;
    username: string;
    role?: TravelerRole;
    createdDate?: number;
    lastUpdatedDate?: number;
    travelId?: number;
}

export interface CreateTravelerDTO {
    username: string;
    travelId?: number;
    role?: TravelerRole;
}

export interface CostUnitDTO {
    id?: number;
    amount?: number;
    currency: string;
    travelerUsername: string;
    costId?: number;
}

export interface CreateCostUnitDTO {
    travelerUsername: string;
    amount: number;
    currency?: string;
}

export interface UpdateCostUnitDTO {
    travelerUsername: string;
    amount: number;
    currency?: string;
}

export interface CostDTO {
    id?: number;
    reason: string;
    totalAmount?: number;
    currency: string;
    costUnitList: CostUnitDTO[];
    payedBy: string;
    payers?: string[];
    createdDate?: number;
    lastUpdatedDate?: number;
    date?: number;
    travelId: number;
    costType: CostType;
}

export interface CreateCostDTO {
    reason: string;
    totalAmount: number;
    currency: string;
    costUnitList: CreateCostUnitDTO[];
    payers: string[];
    payedBy: string;
    date?: number;
    travelId: number;
    costType: CostType;
}

export interface CreateRefundDTO {
    reason: string;
    totalAmount: number;
    currency: string;
    costUnitList: CreateCostUnitDTO[];
    payers: string[];
    payedBy: string;
    date?: number;
    travelId: number;
    costType: CostType;
}

export interface UpdateCostDTO {
    reason: string;
    totalAmount: number;
    currency: string;
    costUnitList: UpdateCostUnitDTO[];
    payers: string[];
    payedBy: string;
    date?: number;
    costType: CostType;
}

export interface ActivityDTO {
    id?: number;
    travelId?: number;
    travelDayId?: number;
    name: string;
    description?: string;
    time?: string;
    completed?: boolean;
    createDate?: number;
    lastUpdateDate?: number;
}

export interface CreateActivityDTO {
    name: string;
    description?: string;
}

export interface CreateActivityDayDTO {
    name: string;
    description?: string;
    time: string;
}

export interface UpdateActivityDTO {
    // Empty in swagger but usually has fields
    name?: string;
    description?: string;
    time?: string;
    completed?: boolean;
}

export interface TravelDayDTO {
    id?: number;
    travelId: number;
    dayNumber?: number;
    date?: string; // LocalDate yyyy-MM-dd
    activities?: ActivityDTO[];
    createDate?: number;
    lastUpdateDate?: number;
}

export interface CreateTravelDayDTO {
    day: number;
}

export interface UpdateTravelDayDTO {
    destination: string;
    name: string;
    imageUrl?: string;
    days?: number;
}

export interface TravelDTO {
    id?: number;
    description?: string;
    destination: string;
    name: string;
    code?: string;
    startDate: string; // LocalDate yyyy-MM-dd
    endDate: string; // LocalDate yyyy-MM-dd
    imageUrl?: string;
    days?: number;
    travelDays?: TravelDayDTO[];
    createDate?: number;
    lastUpdateDate?: number;
}

export interface CreateTravelDTO {
    description: string;
    destination: string;
    name: string;
    startDate: string; // LocalDate
    endDate: string; // LocalDate
    imageUrl?: string;
    days?: number;
}

export interface UpdateTravelDTO {
    description: string;
    destination: string;
    name: string;
    startDate: string; // LocalDate
    endDate: string; // LocalDate
    imageUrl?: string;
    days?: number;
}

export interface RetrieveTravelDTO {
    destination?: string;
    name?: string;
    startDate?: string;
    endDate?: string;
    userKeycloakId?: string;
}
