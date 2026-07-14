export const formatirajDatum = (datum: string) => {

    return new Date(datum).toLocaleDateString("sr-RS");
};