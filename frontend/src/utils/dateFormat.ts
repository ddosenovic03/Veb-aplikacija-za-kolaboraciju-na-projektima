export const formatirajDatum = (datum?: string | null) => {

    if (!datum) return "Nije definisano";

    return new Date(datum).toLocaleDateString("sr-RS");
};

export const formatirajDatumZaInput = (datum?: string | null) => {

    if (!datum) return "";

    return new Date(datum).toISOString().split("T")[0];
};