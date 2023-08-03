"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getFallbackMetadataBaseIfPresent: function() {
        return getFallbackMetadataBaseIfPresent;
    },
    isStringOrURL: function() {
        return isStringOrURL;
    },
    resolveUrl: function() {
        return resolveUrl;
    }
});
const _path = /*#__PURE__*/ _interop_require_default(require("../../../shared/lib/isomorphic/path"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function isStringOrURL(icon) {
    return typeof icon === "string" || icon instanceof URL;
}
function createLocalMetadataBase() {
    return new URL(`http://localhost:${process.env.PORT || 3000}`);
}
function getFallbackMetadataBaseIfPresent(metadataBase) {
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
    const joinedPath = _path.default.join(basePath, url);
    return new URL(joinedPath, metadataBase);
}

//# sourceMappingURL=resolve-url.js.map