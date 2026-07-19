import type { ApiResponse } from "../types/api";
import type { DodavanjeLinkPrilogaRequest, Prilog } from "../types/prilog";
import { apiClient } from "./apiClient";

export const dobaviPrilogeZaKomentar = async (komentarId: number) => {
    
    const response = await apiClient.get<ApiResponse<Prilog[]>>(`/prilozi/${komentarId}`);

    return response.data.podaci;
};

export const dodajLinkPrilog = async (komentarId: number, podaci: DodavanjeLinkPrilogaRequest) => {

    const response = await apiClient.post<ApiResponse<Prilog>>(`/prilozi/${komentarId}`, podaci);

    return response.data.podaci;
};

export const dodajFajlPrilog = async (komentarId: number, fajl: File) => {

    const formData = new FormData();
    formData.append("fajl", fajl);

    const response = await apiClient.post<ApiResponse<Prilog>>(`/prilozi/${komentarId}/fajl`, formData);

    return response.data.podaci;
};

export const obrisiPrilog = async (prilogId: number) => {

    const response = await apiClient.delete<ApiResponse<Prilog>>(`/prilozi/${prilogId}`);

    return response.data.podaci;
};