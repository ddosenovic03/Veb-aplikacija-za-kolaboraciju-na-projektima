export const formatirajStatus = (status: string) => {

    if (status === "nije_zapocet") return "Nije započet";
    if (status === "u_toku") return "U toku";
    if (status === "zavrsen") return "Završen";

    return status;
};