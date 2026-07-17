import type { ApiResponse } from "../types/api";
import type { DodavanjeKomentaraRequest, IzmjenaKomentaraRequest, Komentar } from "../types/komentar";
import { apiClient } from "./apiClient";

export const dobaviKomentareZaPosao = async (posaoId: number) => {

    const response = await apiClient.get<ApiResponse<Komentar[]>>(`/komentari/${posaoId}`);

    return response.data.podaci;
};

export const dodajKomentar = async (posaoId: number, podaci: DodavanjeKomentaraRequest) => {

    const response = await apiClient.post<ApiResponse<Komentar>>(`/komentari/${posaoId}`, podaci);

    return response.data.podaci;
};

export const izmijeniKomentar = async (komentarId: number, podaci: IzmjenaKomentaraRequest) => {

    const response = await apiClient.patch<ApiResponse<Komentar>>(`/komentari/${komentarId}`, podaci);
    
    return response.data.podaci;
};

export const obrisiKomentar = async (komentarId: number) => {

    const response = await apiClient.delete<ApiResponse<Komentar>>(`/komentari/${komentarId}`);

    return response.data.podaci;
};
