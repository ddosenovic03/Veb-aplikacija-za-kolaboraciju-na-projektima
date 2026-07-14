import { apiClient } from "./apiClient";
import type { ApiResponse } from "../types/api";
import type { 
    Korisnik,
    PrijavaKorisnikaRequest,
    PrijavaKorisnikaResponse,
    RegistracijaKorisnikaRequest 
} from "../types/korisnik";

export const registracijaKorisnika = async (podaci: RegistracijaKorisnikaRequest) => {

    const response = await apiClient.post<ApiResponse<Korisnik>> ("/korisnici/registracija", podaci);

    return response.data.podaci;
};

export const prijavaKorisnika = async (podaci: PrijavaKorisnikaRequest) => {

    const response = await apiClient.post<ApiResponse<PrijavaKorisnikaResponse>> ("/korisnici/login", podaci);

    return response.data.podaci;
};