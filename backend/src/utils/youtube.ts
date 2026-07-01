export const izvuciYoutubeVideoId = (url: string): string | null => {
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname.replace('www.', '');

        if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
            return parsedUrl.searchParams.get('v');
        }

        if (hostname === 'youtu.be') {
            return parsedUrl.pathname.replace('/', '') || null;
        }

        return null;
    } catch (error) {
        return null;
    }
};