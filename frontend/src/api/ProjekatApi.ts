import { apiClient } from "./apiClient";
import type { ApiResponse } from "../types/api";
import type { PosaoZaListu } from "../types/Posao";
import type { 
    Projekat,
    KreiranjeProjektaRequest,
    IzmjenaProjektaRequest,
    PozivanjeKorisnikaRequest,
    ClanProjekta,
    PozivKorisnika,
    PozivZaProjekat,
    NapredakProjekta
} from "../types/projekat";

export const dobaviMojeProjekte = async () => {

    const response = await apiClient.get<ApiResponse<Projekat[]>>("/projekti/moji");

    return response.data.podaci;
};

export const kreirajProjekat = async (podaci: KreiranjeProjektaRequest) => {

    const response = await apiClient.post<ApiResponse<Projekat>>("/projekti", podaci);
    
    return response.data.podaci;
};

export const dobaviDetaljeProjekta = async (projekatId: number) => {

    const response = await apiClient.get<ApiResponse<Projekat>>(`projekti/${projekatId}`);

    return response.data.podaci;
};

export const izmijeniProjekat = async (projekatId: number, podaci: IzmjenaProjektaRequest) => {

    const response = await apiClient.patch<ApiResponse<Projekat>>(`/projekti/${projekatId}`, podaci);

    return response.data.podaci;
};

export const obrisiProjekat = async (projekatId: number) => {

    const response = await apiClient.delete<ApiResponse<Projekat>>(`/projekti/${projekatId}`);

    return response.data.podaci;
};

export const dobaviPoziveKorisnika = async () => {

    const response = await apiClient.get<ApiResponse<PozivKorisnika[]>>("/projekti/pozivi");

    return response.data.podaci
};

export const prihvatiPoziv = async (projekatId: number) => {

    const response = await apiClient.patch<ApiResponse<PozivKorisnika>>(`/projekti/${projekatId}/prihvati`);

    return response.data.podaci;
};

export const odbijPoziv = async (projekatId: number) => {

    const response = await apiClient.patch<ApiResponse<PozivKorisnika>>(`/projekti/${projekatId}/odbij`);

    return response.data.podaci;
};

export const dobaviClanoveProjekta = async (projekatId: number) => {

    const response = await apiClient.get<ApiResponse<ClanProjekta[]>>(`/projekti/${projekatId}/clanovi`);

    return response.data.podaci;
};

export const dobaviPoziveZaProjekat = async (projekatId: number) => {

    const response = await apiClient.get<ApiResponse<PozivZaProjekat[]>>(`/projekti/${projekatId}/pozivi`);

    return response.data.podaci;
};

export const dobaviNapredakProjekta = async (projekatId: number) => {

    const response = await apiClient.get<ApiResponse<NapredakProjekta>>(`/projekti/${projekatId}/napredak`);

    return response.data.podaci;
};

export const dobaviPosloveZaProjekat = async (projekatId: number) => {
    
    const response = await apiClient.get<ApiResponse<PosaoZaListu[]>>(`/projekti/${projekatId}/poslovi`);

    return response.data.podaci;
};

export const pozoviKorisnikaNaProjekat = async (projekatId: number, podaci: PozivanjeKorisnikaRequest) => {

    const response = await apiClient.post<ApiResponse<PozivanjeKorisnikaRequest>>(`/projekti/${projekatId}/pozovi`, podaci);

    return response.data.podaci;
}