import path from "../../../shared/lib/isomorphic/path";
function isStringOrURL(icon) {
    return typeof icon === "string" || icon instanceof URL;
}
function createLocalMetadataBase() {
    return new URL(`http://localhost:${process.env.PORT || 3000}`);
}
// For deployment url for metadata routes, prefer to use the deployment url if possible
// as these routes are unique to the deployments url.
export function getFallbackMetadataBaseIfPresent(metadataBase) {
    const defaultMetadataBase = createLocalMetadataBase();
    const deploymentUrl = process.env.VERCEL_URL && new URL(`https://${process.env.VERCEL_URL}`);
    if (process.env.NODE_ENV === "development") {
        return defaultMetadataBase;
    }
    return process.env.NODE_ENV === "production" && deploymentUrl && process.env.VERCEL_ENV === "preview" ? deploymentUrl : metadataBase || deploymentUrl || defaultMetadataBase;
}
function resolveUrl(url, metadataBase) {
    if (url instanceof URL) return url;
    if (!url) return null;
    try {
        // If we can construct a URL instance from url, ignore metadataBase
        const parsedUrl = new URL(url);
        return parsedUrl;
    } catch (_) {}
    if (!metadataBase) {
        metadataBase = createLocalMetadataBase();
    }
    // Handle relative or absolute paths
    const basePath = metadataBase.pathname || "";
    const joinedPath = path.join(basePath, url);
    return new URL(joinedPath, metadataBase);
}
export { isStringOrURL, resolveUrl };

//# sourceMappingURL=resolve-url.js.map