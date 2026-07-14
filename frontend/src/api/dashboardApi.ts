import { apiClient } from "./apiClient";
import type { ApiResponse } from "../types/api";
import type { DashboardStatistika } from "../types/dashboard";

export const dobaviDashboardStatistiku = async () => {
    
    const response = await apiClient.get<ApiResponse<DashboardStatistika>> ("/dashboard");

    return response.data.podaci;
};