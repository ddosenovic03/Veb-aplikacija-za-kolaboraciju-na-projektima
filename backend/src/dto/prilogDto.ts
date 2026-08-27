import { izvuciYoutubeVideoId } from "../utils/youtubeHelper";

export const mapPrilog = (prilog: any) => {
    const youtubeVideoId = prilog.tip === "link" && prilog.url_linka ? izvuciYoutubeVideoId(prilog.url_linka) : null;

    return {
        id: prilog.id,
        komentar_id: prilog.komentar_id,
        tip: prilog.tip,
        url_linka: prilog.url_linka,
        datum_kreiranja: prilog.datum_kreiranja,
        je_youtube: youtubeVideoId !== null,
        youtube_video_id: youtubeVideoId
    };
};
