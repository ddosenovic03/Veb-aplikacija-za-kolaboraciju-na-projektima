export const formatirajStatus = (status: string) => {

    if (status === "nije_zapocet") return "Nije započet";
    if (status === "u_toku") return "U toku";
    if (status === "zavrsen") return "Završen";

    if (status === "pozvan") return "Pozvan";
    if (status === "prihvacen") return "Prihvaćen"
    if (status === "odbijen") return "Odbijen"

    if (status === "vlasnik") return "Vlasnik";
    if (status === "clan") return "Član"

    return status;
};

export const odrediStatusVariant = (status?: string | null): "default" | "success" | "warning" | "danger" => {

    if (!status) return "default";

    if (status === "zavrsen" || status === "prihvacen") return "success";
    if (status === "u_toku" || status === "pozvan") return "warning";
    if (status === "odbijen") return "danger";

    return "default";
};