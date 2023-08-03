"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "patchFetch", {
    enumerable: true,
    get: function() {
        return patchFetch;
    }
});
const _constants = require("./trace/constants");
const _tracer = require("./trace/tracer");
const _constants1 = require("../../lib/constants");
const isEdgeRuntime = process.env.NEXT_RUNTIME === "edge";
function patchFetch({ serverHooks , staticGenerationAsyncStorage  }) {
    if (globalThis.fetch.__nextPatched) return;
    const { DynamicServerError  } = serverHooks;
    const originFetch = globalThis.fetch;
    globalThis.fetch = async (input, init)=>{
        var _init_method;
        let url;
        try {
            url = new URL(input instanceof Request ? input.url : input);
            url.username = "";
            url.password = "";
        } catch  {
            // Error caused by malformed URL should be handled by native fetch
            url = undefined;
        }
        const method = (init == null ? void 0 : (_init_method = init.method) == null ? void 0 : _init_method.toUpperCase()) || "GET";
        return await (0, _tracer.getTracer)().trace(_constants.AppRenderSpan.fetch, {
            kind: _tracer.SpanKind.CLIENT,
            spanName: [
                "fetch",
                method,
                (url == null ? void 0 : url.toString()) ?? input.toString()
            ].filter(Boolean).join(" "),
            attributes: {
                "http.url": url == null ? void 0 : url.toString(),
                "http.method": method,
                "net.peer.name": url == null ? void 0 : url.hostname,
                "net.peer.port": (url == null ? void 0 : url.port) || undefined
            }
        }, async ()=>{
            var _ref, _getRequestMeta;
            const staticGenerationStore = staticGenerationAsyncStorage.getStore();
            const isRequestInput = input && typeof input === "object" && typeof input.method === "string";
            const getRequestMeta = (field)=>{
                let value = isRequestInput ? input[field] : null;
                return value || (init == null ? void 0 : init[field]);
            };
            // If the staticGenerationStore is not available, we can't do any
            // special treatment of fetch, therefore fallback to the original
            // fetch implementation.
            if (!staticGenerationStore || ((_ref = init == null ? void 0 : init.next) == null ? void 0 : _ref.internal)) {
                return originFetch(input, init);
            }
            let revalidate = undefined;
            const getNextField = (field)=>{
                var _init_next, _init_next1, _input_next;
                return typeof (init == null ? void 0 : (_init_next = init.next) == null ? void 0 : _init_next[field]) !== "undefined" ? init == null ? void 0 : (_init_next1 = init.next) == null ? void 0 : _init_next1[field] : isRequestInput ? (_input_next = input.next) == null ? void 0 : _input_next[field] : undefined;
            };
            // RequestInit doesn't keep extra fields e.g. next so it's
            // only available if init is used separate
            let curRevalidate = getNextField("revalidate");
            const tags = getNextField("tags");
            const isOnlyCache = staticGenerationStore.fetchCache === "only-cache";
            const isForceCache = staticGenerationStore.fetchCache === "force-cache";
            const isDefaultNoStore = staticGenerationStore.fetchCache === "default-no-store";
            const isOnlyNoStore = staticGenerationStore.fetchCache === "only-no-store";
            const isForceNoStore = staticGenerationStore.fetchCache === "force-no-store";
            const _cache = getRequestMeta("cache");
            if (_cache === "force-cache" || isForceCache) {
                curRevalidate = false;
            }
            if ([
                "no-cache",
                "no-store"
            ].includes(_cache || "")) {
                curRevalidate = 0;
            }
            if (typeof curRevalidate === "number") {
                revalidate = curRevalidate;
            }
            if (curRevalidate === false) {
                revalidate = _constants1.CACHE_ONE_YEAR;
            }
            const _headers = getRequestMeta("headers");
            const initHeaders = typeof (_headers == null ? void 0 : _headers.get) === "function" ? _headers : new Headers(_headers || {});
            const hasUnCacheableHeader = initHeaders.get("authorization") || initHeaders.get("cookie");
            const isUnCacheableMethod = ![
                "get",
                "head"
            ].includes(((_getRequestMeta = getRequestMeta("method")) == null ? void 0 : _getRequestMeta.toLowerCase()) || "get");
            // if there are authorized headers or a POST method and
            // dynamic data usage was present above the tree we bail
            // e.g. if cookies() is used before an authed/POST fetch
            const autoNoCache = (hasUnCacheableHeader || isUnCacheableMethod) && staticGenerationStore.revalidate === 0;
            if (isForceNoStore) {
                revalidate = 0;
            }
            if (isOnlyNoStore) {
                if (_cache === "force-cache" || revalidate === 0) {
                    throw new Error(`cache: 'force-cache' used on fetch for ${input.toString()} with 'export const fetchCache = 'only-no-store'`);
                }
                revalidate = 0;
            }
            if (typeof revalidate === "undefined") {
                if (isOnlyCache && _cache === "no-store") {
                    throw new Error(`cache: 'no-store' used on fetch for ${input.toString()} with 'export const fetchCache = 'only-cache'`);
                }
                if (autoNoCache) {
                    revalidate = 0;
                } else if (isDefaultNoStore) {
                    revalidate = 0;
                } else {
                    revalidate = typeof staticGenerationStore.revalidate === "boolean" || typeof staticGenerationStore.revalidate === "undefined" ? _constants1.CACHE_ONE_YEAR : staticGenerationStore.revalidate;
                }
            }
            if (// we don't consider autoNoCache to switch to dynamic during
            // revalidate although if it occurs during build we do
            !autoNoCache && (typeof staticGenerationStore.revalidate === "undefined" || typeof revalidate === "number" && typeof staticGenerationStore.revalidate === "number" && revalidate < staticGenerationStore.revalidate)) {
                staticGenerationStore.revalidate = revalidate;
            }
            let cacheKey;
            if (staticGenerationStore.incrementalCache && typeof revalidate === "number" && revalidate > 0) {
                try {
                    cacheKey = await staticGenerationStore.incrementalCache.fetchCacheKey(isRequestInput ? input.url : input.toString(), isRequestInput ? input : init);
                } catch (err) {
                    console.error(`Failed to generate cache key for`, input);
                }
            }
            const requestInputFields = [
                "cache",
                "credentials",
                "headers",
                "integrity",
                "keepalive",
                "method",
                "mode",
                "redirect",
                "referrer",
                "referrerPolicy",
                "signal",
                "window",
                "duplex"
            ];
            if (isRequestInput) {
                const reqInput = input;
                const reqOptions = {
                    body: reqInput._ogBody || reqInput.body
                };
                for (const field of requestInputFields){
                    // @ts-expect-error custom fields
                    reqOptions[field] = reqInput[field];
                }
                input = new Request(reqInput.url, reqOptions);
            } else if (init) {
                const initialInit = init;
                init = {
                    body: init._ogBody || init.body
                };
                for (const field of requestInputFields){
                    // @ts-expect-error custom fields
                    init[field] = initialInit[field];
                }
            }
            const fetchUrl = (url == null ? void 0 : url.toString()) ?? "";
            const fetchIdx = staticGenerationStore.nextFetchId ?? 1;
            staticGenerationStore.nextFetchId = fetchIdx + 1;
            const doOriginalFetch = async ()=>{
                // add metadata to init without editing the original
                const clonedInit = {
                    ...init,
                    next: {
                        ...init == null ? void 0 : init.next,
                        fetchType: "origin",
                        fetchIdx
                    }
                };
                return originFetch(input, clonedInit).then(async (res)=>{
                    if (res.status === 200 && staticGenerationStore.incrementalCache && cacheKey && typeof revalidate === "number" && revalidate > 0) {
                        const bodyBuffer = Buffer.from(await res.arrayBuffer());
                        try {
                            await staticGenerationStore.incrementalCache.set(cacheKey, {
                                kind: "FETCH",
                                data: {
                                    headers: Object.fromEntries(res.headers.entries()),
                                    body: bodyBuffer.toString("base64"),
                                    status: res.status,
                                    tags
                                },
                                revalidate
                            }, revalidate, true, fetchUrl, fetchIdx);
                        } catch (err) {
                            console.warn(`Failed to set fetch cache`, input, err);
                        }
                        return new Response(bodyBuffer, {
                            headers: new Headers(res.headers),
                            status: res.status
                        });
                    }
                    return res;
                });
            };
            if (cacheKey && (staticGenerationStore == null ? void 0 : staticGenerationStore.incrementalCache)) {
                const entry = staticGenerationStore.isOnDemandRevalidate ? null : await staticGenerationStore.incrementalCache.get(cacheKey, true, revalidate, fetchUrl, fetchIdx);
                if ((entry == null ? void 0 : entry.value) && entry.value.kind === "FETCH") {
                    const currentTags = entry.value.data.tags;
                    // when stale and is revalidating we wait for fresh data
                    // so the revalidated entry has the updated data
                    if (!(staticGenerationStore.isRevalidate && entry.isStale)) {
                        if (entry.isStale) {
                            if (!staticGenerationStore.pendingRevalidates) {
                                staticGenerationStore.pendingRevalidates = [];
                            }
                            staticGenerationStore.pendingRevalidates.push(doOriginalFetch().catch(console.error));
                        } else if (tags && !tags.every((tag)=>{
                            return currentTags == null ? void 0 : currentTags.includes(tag);
                        })) {
                            var _staticGenerationStore_incrementalCache;
                            // if new tags are being added we need to set even if
                            // the data isn't stale
                            if (!entry.value.data.tags) {
                                entry.value.data.tags = [];
                            }
                            for (const tag of tags){
                                if (!entry.value.data.tags.includes(tag)) {
                                    entry.value.data.tags.push(tag);
                                }
                            }
                            (_staticGenerationStore_incrementalCache = staticGenerationStore.incrementalCache) == null ? void 0 : _staticGenerationStore_incrementalCache.set(cacheKey, entry.value, revalidate, true, fetchUrl, fetchIdx);
                        }
                        const resData = entry.value.data;
                        let decodedBody;
                        if (process.env.NEXT_RUNTIME === "edge") {
                            const { decode  } = require("../../shared/lib/bloom-filter/base64-arraybuffer");
                            decodedBody = decode(resData.body);
                        } else {
                            decodedBody = Buffer.from(resData.body, "base64").subarray();
                        }
                        return new Response(decodedBody, {
                            headers: resData.headers,
                            status: resData.status
                        });
                    }
                }
            }
            if (staticGenerationStore.isStaticGeneration) {
                if (init && typeof init === "object") {
                    const cache = init.cache;
                    // Delete `cache` property as Cloudflare Workers will throw an error
                    if (isEdgeRuntime) {
                        delete init.cache;
                    }
                    if (cache === "no-store") {
                        staticGenerationStore.revalidate = 0;
                        // TODO: ensure this error isn't logged to the user
                        // seems it's slipping through currently
                        const dynamicUsageReason = `no-store fetch ${input}${staticGenerationStore.pathname ? ` ${staticGenerationStore.pathname}` : ""}`;
                        const err = new DynamicServerError(dynamicUsageReason);
                        staticGenerationStore.dynamicUsageStack = err.stack;
                        staticGenerationStore.dynamicUsageDescription = dynamicUsageReason;
                        throw err;
                    }
                    const hasNextConfig = "next" in init;
                    const next = init.next || {};
                    if (typeof next.revalidate === "number" && (typeof staticGenerationStore.revalidate === "undefined" || next.revalidate < staticGenerationStore.revalidate)) {
                        const forceDynamic = staticGenerationStore.forceDynamic;
                        if (!forceDynamic || next.revalidate !== 0) {
                            staticGenerationStore.revalidate = next.revalidate;
                        }
                        if (!forceDynamic && next.revalidate === 0) {
                            const dynamicUsageReason = `revalidate: ${next.revalidate} fetch ${input}${staticGenerationStore.pathname ? ` ${staticGenerationStore.pathname}` : ""}`;
                            const err = new DynamicServerError(dynamicUsageReason);
                            staticGenerationStore.dynamicUsageStack = err.stack;
                            staticGenerationStore.dynamicUsageDescription = dynamicUsageReason;
                            throw err;
                        }
                    }
                    if (hasNextConfig) delete init.next;
                }
            }
            return doOriginalFetch();
        });
    };
    fetch.__nextGetStaticStore = ()=>{
        return staticGenerationAsyncStorage;
    };
    fetch.__nextPatched = true;
}

//# sourceMappingURL=patch-fetch.js.map