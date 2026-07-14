import axios from "axios";
import type { ApiErrorResponse } from "../types/api";

export const izvuciPorukuGreske = (error: unknown, podrazumijevanaPoruka = "Došlo je do greške.") => {

    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return error.response?.data?.poruka ?? podrazumijevanaPoruka;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return podrazumijevanaPoruka;
};