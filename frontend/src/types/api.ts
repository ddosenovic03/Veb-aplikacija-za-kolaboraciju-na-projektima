export type ApiResponse<T> = {
    uspjeh: boolean;
    poruka: string;
    podaci: T;
};

export type ApiErrorResponse = {
    uspjeh: false;
    poruka: string;
};