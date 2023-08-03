"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "unstable_revalidateTag", {
    enumerable: true,
    get: function() {
        return unstable_revalidateTag;
    }
});
function unstable_revalidateTag(tag) {
    const staticGenerationAsyncStorage = fetch.__nextGetStaticStore == null ? void 0 : fetch.__nextGetStaticStore();
    const store = staticGenerationAsyncStorage == null ? void 0 : staticGenerationAsyncStorage.getStore();
    if (!store || !store.incrementalCache) {
        throw new Error(`Invariant: static generation store missing in unstable_revalidateTag ${tag}`);
    }
    if (!store.pendingRevalidates) {
        store.pendingRevalidates = [];
    }
    store.pendingRevalidates.push(store.incrementalCache.revalidateTag == null ? void 0 : store.incrementalCache.revalidateTag(tag).catch((err)=>{
        console.error(`revalidateTag failed for ${tag}`, err);
    }));
}

//# sourceMappingURL=unstable-revalidate-tag.js.map