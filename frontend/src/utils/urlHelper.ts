import { SERVER_BASE_URL } from "../api/apiClient";

export const napraviUrlFajla = (putanja?: string | null) => {

    if (!putanja) return "#";
    if (putanja.startsWith("http://") || putanja.startsWith("https://")) return putanja;

    const normalizovanjaPutanja = putanja.startsWith("/") ? putanja : `/${putanja}`;

    return `${SERVER_BASE_URL}${normalizovanjaPutanja}`;
};