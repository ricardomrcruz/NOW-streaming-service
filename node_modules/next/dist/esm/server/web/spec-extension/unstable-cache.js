// TODO: generic callback type?
export function unstable_cache(cb, keyParts, options) {
    const joinedKey = cb.toString() + "-" + keyParts.join(", ");
    const staticGenerationAsyncStorage = fetch.__nextGetStaticStore == null ? void 0 : fetch.__nextGetStaticStore();
    const store = staticGenerationAsyncStorage == null ? void 0 : staticGenerationAsyncStorage.getStore();
    if (!store || !store.incrementalCache) {
        throw new Error(`Invariant: static generation store missing in unstable_cache ${joinedKey}`);
    }
    if (options.revalidate === 0) {
        throw new Error(`Invariant revalidate: 0 can not be passed to unstable_cache(), must be "false" or "> 0" ${joinedKey}`);
    }
    return async (...args)=>{
        // We override the default fetch cache handling inside of the
        // cache callback so that we only cache the specific values returned
        // from the callback instead of also caching any fetches done inside
        // of the callback as well
        return staticGenerationAsyncStorage == null ? void 0 : staticGenerationAsyncStorage.run({
            ...store,
            fetchCache: "only-no-store"
        }, async ()=>{
            var _store_incrementalCache, _store_incrementalCache1;
            const cacheKey = await ((_store_incrementalCache = store.incrementalCache) == null ? void 0 : _store_incrementalCache.fetchCacheKey(joinedKey));
            const cacheEntry = cacheKey && !store.isOnDemandRevalidate && await ((_store_incrementalCache1 = store.incrementalCache) == null ? void 0 : _store_incrementalCache1.get(cacheKey, true, options.revalidate));
            const invokeCallback = async ()=>{
                const result = await cb(...args);
                if (cacheKey && store.incrementalCache) {
                    await store.incrementalCache.set(cacheKey, {
                        kind: "FETCH",
                        data: {
                            headers: {},
                            // TODO: handle non-JSON values?
                            body: JSON.stringify(result),
                            status: 200,
                            tags: options.tags
                        },
                        revalidate: options.revalidate
                    }, options.revalidate, true);
                }
                return result;
            };
            if (!cacheEntry || !cacheEntry.value) {
                return invokeCallback();
            }
            if (cacheEntry.value.kind !== "FETCH") {
                console.error(`Invariant invalid cacheEntry returned for ${joinedKey}`);
                return invokeCallback();
            }
            let cachedValue;
            const isStale = cacheEntry.isStale;
            if (cacheEntry) {
                const resData = cacheEntry.value.data;
                cachedValue = JSON.parse(resData.body);
            }
            const currentTags = cacheEntry.value.data.tags;
            if (isStale) {
                if (!store.pendingRevalidates) {
                    store.pendingRevalidates = [];
                }
                store.pendingRevalidates.push(invokeCallback().catch((err)=>console.error(`revalidating cache with key: ${joinedKey}`, err)));
            } else if (options.tags && !options.tags.every((tag)=>{
                return currentTags == null ? void 0 : currentTags.includes(tag);
            })) {
                var _store_incrementalCache2;
                if (!cacheEntry.value.data.tags) {
                    cacheEntry.value.data.tags = [];
                }
                for (const tag of options.tags){
                    if (!cacheEntry.value.data.tags.includes(tag)) {
                        cacheEntry.value.data.tags.push(tag);
                    }
                }
                (_store_incrementalCache2 = store.incrementalCache) == null ? void 0 : _store_incrementalCache2.set(cacheKey, cacheEntry.value, options.revalidate, true);
            }
            return cachedValue;
        });
    };
}

//# sourceMappingURL=unstable-cache.js.map