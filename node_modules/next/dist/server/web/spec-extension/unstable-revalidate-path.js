"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "unstable_revalidatePath", {
    enumerable: true,
    get: function() {
        return unstable_revalidatePath;
    }
});
const _headers = require("../../../client/components/headers");
const _constants = require("../../../lib/constants");
function unstable_revalidatePath(path, ctx = {}) {
    var _store_incrementalCache, _store_incrementalCache_prerenderManifest, _store_incrementalCache_prerenderManifest_preview, _store_incrementalCache1, _store_incrementalCache2, _store_incrementalCache3;
    const staticGenerationAsyncStorage = fetch.__nextGetStaticStore == null ? void 0 : fetch.__nextGetStaticStore();
    const store = staticGenerationAsyncStorage == null ? void 0 : staticGenerationAsyncStorage.getStore();
    if (!store) {
        throw new Error(`Invariant: static generation store missing in unstable_revalidatePath ${path}`);
    }
    if (!store.pendingRevalidates) {
        store.pendingRevalidates = [];
    }
    const previewModeId = ((_store_incrementalCache = store.incrementalCache) == null ? void 0 : (_store_incrementalCache_prerenderManifest = _store_incrementalCache.prerenderManifest) == null ? void 0 : (_store_incrementalCache_prerenderManifest_preview = _store_incrementalCache_prerenderManifest.preview) == null ? void 0 : _store_incrementalCache_prerenderManifest_preview.previewModeId) || process.env.__NEXT_PREVIEW_MODE_ID;
    const reqHeaders = ((_store_incrementalCache1 = store.incrementalCache) == null ? void 0 : _store_incrementalCache1.requestHeaders) || Object.fromEntries((0, _headers.headers)());
    const host = reqHeaders["host"];
    const proto = ((_store_incrementalCache2 = store.incrementalCache) == null ? void 0 : _store_incrementalCache2.requestProtocol) || "https";
    // TODO: glob handling + blocking/soft revalidate
    const revalidateURL = `${proto}://${host}${path}`;
    const revalidateHeaders = {
        [_constants.PRERENDER_REVALIDATE_HEADER]: previewModeId,
        ...ctx.unstable_onlyGenerated ? {
            [_constants.PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER]: "1"
        } : {}
    };
    const curAllowedRevalidateHeaderKeys = ((_store_incrementalCache3 = store.incrementalCache) == null ? void 0 : _store_incrementalCache3.allowedRevalidateHeaderKeys) || process.env.__NEXT_ALLOWED_REVALIDATE_HEADERS;
    const allowedRevalidateHeaderKeys = [
        ...curAllowedRevalidateHeaderKeys || [],
        ...!store.incrementalCache ? [
            "cookie",
            "x-vercel-protection-bypass"
        ] : []
    ];
    for (const key of Object.keys(reqHeaders)){
        if (allowedRevalidateHeaderKeys.includes(key)) {
            revalidateHeaders[key] = reqHeaders[key];
        }
    }
    const fetchIPv4v6 = (v6 = false)=>{
        const curUrl = new URL(revalidateURL);
        const hostname = curUrl.hostname;
        if (!v6 && hostname === "localhost") {
            curUrl.hostname = "127.0.0.1";
        }
        return fetch(curUrl, {
            method: "HEAD",
            headers: revalidateHeaders
        }).then((res)=>{
            const cacheHeader = res.headers.get("x-vercel-cache") || res.headers.get("x-nextjs-cache");
            if ((cacheHeader == null ? void 0 : cacheHeader.toLowerCase()) !== "revalidated") {
                throw new Error(`received invalid response ${res.status} ${cacheHeader}`);
            }
        }).catch((err)=>{
            if (err.code === "ECONNREFUSED" && !v6) {
                return fetchIPv4v6(true);
            }
            console.error(`revalidatePath failed for ${revalidateURL}`, err);
        });
    };
    store.pendingRevalidates.push(fetchIPv4v6());
}

//# sourceMappingURL=unstable-revalidate-path.js.map