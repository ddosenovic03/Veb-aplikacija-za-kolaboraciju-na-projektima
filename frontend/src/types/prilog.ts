export type TipPriloga = "link" | "fajl";

export type Prilog = {
    id: number;
    komentar_id: number;
    tip: TipPriloga;

    url_linka?: string | null;

    datum_kreiranja?: string;

    je_youtube?: boolean;
    youtube_video_id?: string | null;
};

export type DodavanjeLinkPrilogaRequest = {
    tip: "link";
    url: string;
};
