import type { ApiResponse } from "../types/api";
import type { AzuriranjeProcentaPoslaRequest, IzmjenaPoslaRequest, KreiranjePoslaRequest, PosaoDetalji, PosaoZaListu, PrijavaNaPosaoRequest } from "../types/posao";
import { apiClient } from "./apiClient";

export const kreirajPosao = async (projekatId: number, podaci: KreiranjePoslaRequest) => {

    const response = await apiClient.post<ApiResponse<PosaoDetalji>>(`/projekti/${projekatId}/poslovi`, podaci);

    return response.data.podaci;
};

export const dobaviDetaljePosla = async (posaoId: number) => {

    const response = await apiClient.get<ApiResponse<PosaoDetalji>>(`/poslovi/${posaoId}`);

    return response.data.podaci;
};

export const dobaviMojePoslove = async () => {

    const response = await apiClient.get<ApiResponse<PosaoZaListu[]>>("/poslovi/moji");

    return response.data.podaci;
};

export const dobaviKreiranePoslove = async () => {

    const response = await apiClient.get<ApiResponse<PosaoZaListu[]>>("poslovi/kreirani");

    return response.data.podaci;
};

export const prijaviSeNaPosao = async (posaoId: number, podaci: PrijavaNaPosaoRequest) => {

    const response = await apiClient.post<ApiResponse<PosaoDetalji>>(`/poslovi/${posaoId}/prijava`, podaci);

    return response.data.podaci;
};

export const azurirajProcenatPosla = async (posaoId: number, podaci: AzuriranjeProcentaPoslaRequest) => {

    const response = await apiClient.patch<ApiResponse<unknown>>(`/poslovi/${posaoId}/procenat`, podaci);

    return response.data.podaci;
};

export const izmijeniPosao = async (posaoId: number, podaci: IzmjenaPoslaRequest) => {

    const response = await apiClient.patch<ApiResponse<PosaoDetalji>>(`/poslovi/${posaoId}`, podaci);

    return response.data.podaci;
};

export const obrisiPosao = async (posaoId: number) => {

    const response = await apiClient.delete<ApiResponse<PosaoDetalji>>(`/poslovi/${posaoId}`);

    return response.data.podaci;
};