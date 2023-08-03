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
    handleExternalUrl: function() {
        return handleExternalUrl;
    },
    navigateReducer: function() {
        return navigateReducer;
    }
});
const _approutercontext = require("../../../../shared/lib/app-router-context");
const _fetchserverresponse = require("../fetch-server-response");
const _createrecordfromthenable = require("../create-record-from-thenable");
const _readrecordvalue = require("../read-record-value");
const _createhreffromurl = require("../create-href-from-url");
const _invalidatecachebelowflightsegmentpath = require("../invalidate-cache-below-flight-segmentpath");
const _fillcachewithdataproperty = require("../fill-cache-with-data-property");
const _createoptimistictree = require("../create-optimistic-tree");
const _applyrouterstatepatchtotree = require("../apply-router-state-patch-to-tree");
const _shouldhardnavigate = require("../should-hard-navigate");
const _isnavigatingtonewrootlayout = require("../is-navigating-to-new-root-layout");
const _handlemutable = require("../handle-mutable");
const _applyflightdata = require("../apply-flight-data");
function handleExternalUrl(state, mutable, url, pendingPush) {
    mutable.previousTree = state.tree;
    mutable.mpaNavigation = true;
    mutable.canonicalUrl = url;
    mutable.pendingPush = pendingPush;
    mutable.scrollableSegments = undefined;
    return (0, _handlemutable.handleMutable)(state, mutable);
}
function generateSegmentsFromPatch(flightRouterPatch) {
    const segments = [];
    const [segment, parallelRoutes] = flightRouterPatch;
    if (Object.keys(parallelRoutes).length === 0) {
        return [
            [
                segment
            ]
        ];
    }
    for (const [parallelRouteKey, parallelRoute] of Object.entries(parallelRoutes)){
        for (const childSegment of generateSegmentsFromPatch(parallelRoute)){
            // If the segment is empty, it means we are at the root of the tree
            if (segment === '') {
                segments.push([
                    parallelRouteKey,
                    ...childSegment
                ]);
            } else {
                segments.push([
                    segment,
                    parallelRouteKey,
                    ...childSegment
                ]);
            }
        }
    }
    return segments;
}
function navigateReducer(state, action) {
    const { url , isExternalUrl , navigateType , cache , mutable , forceOptimisticNavigation  } = action;
    const { pathname , hash  } = url;
    const href = (0, _createhreffromurl.createHrefFromUrl)(url);
    const pendingPush = navigateType === 'push';
    const isForCurrentTree = JSON.stringify(mutable.previousTree) === JSON.stringify(state.tree);
    if (isForCurrentTree) {
        return (0, _handlemutable.handleMutable)(state, mutable);
    }
    if (isExternalUrl) {
        return handleExternalUrl(state, mutable, url.toString(), pendingPush);
    }
    const prefetchValues = state.prefetchCache.get((0, _createhreffromurl.createHrefFromUrl)(url, false));
    if (prefetchValues) {
        // The one before last item is the router state tree patch
        const { treeAtTimeOfPrefetch , data  } = prefetchValues;
        // Unwrap cache data with `use` to suspend here (in the reducer) until the fetch resolves.
        const [flightData, canonicalUrlOverride] = (0, _readrecordvalue.readRecordValue)(data);
        // Handle case when navigating to page in `pages` from `app`
        if (typeof flightData === 'string') {
            return handleExternalUrl(state, mutable, flightData, pendingPush);
        }
        let currentTree = state.tree;
        let currentCache = state.cache;
        let scrollableSegments = [];
        for (const flightDataPath of flightData){
            const flightSegmentPath = flightDataPath.slice(0, -3);
            // The one before last item is the router state tree patch
            const [treePatch] = flightDataPath.slice(-3);
            // Create new tree based on the flightSegmentPath and router state patch
            let newTree = (0, _applyrouterstatepatchtotree.applyRouterStatePatchToTree)(// TODO-APP: remove ''
            [
                '',
                ...flightSegmentPath
            ], currentTree, treePatch);
            // If the tree patch can't be applied to the current tree then we use the tree at time of prefetch
            // TODO-APP: This should instead fill in the missing pieces in `currentTree` with the data from `treeAtTimeOfPrefetch`, then apply the patch.
            if (newTree === null) {
                newTree = (0, _applyrouterstatepatchtotree.applyRouterStatePatchToTree)(// TODO-APP: remove ''
                [
                    '',
                    ...flightSegmentPath
                ], treeAtTimeOfPrefetch, treePatch);
            }
            if (newTree !== null) {
                if ((0, _isnavigatingtonewrootlayout.isNavigatingToNewRootLayout)(currentTree, newTree)) {
                    return handleExternalUrl(state, mutable, href, pendingPush);
                }
                const applied = (0, _applyflightdata.applyFlightData)(currentCache, cache, flightDataPath, true);
                const hardNavigate = (0, _shouldhardnavigate.shouldHardNavigate)(// TODO-APP: remove ''
                [
                    '',
                    ...flightSegmentPath
                ], currentTree);
                if (hardNavigate) {
                    cache.status = _approutercontext.CacheStates.READY;
                    // Copy subTreeData for the root node of the cache.
                    cache.subTreeData = currentCache.subTreeData;
                    (0, _invalidatecachebelowflightsegmentpath.invalidateCacheBelowFlightSegmentPath)(cache, currentCache, flightSegmentPath);
                    // Ensure the existing cache value is used when the cache was not invalidated.
                    mutable.cache = cache;
                } else if (applied) {
                    mutable.cache = cache;
                }
                currentCache = cache;
                currentTree = newTree;
                for (const subSegment of generateSegmentsFromPatch(treePatch)){
                    scrollableSegments.push(// the last segment is the same as the first segment in the patch
                    [
                        ...flightSegmentPath.slice(0, -1),
                        ...subSegment
                    ].filter((segment)=>segment !== '__PAGE__'));
                }
            }
        }
        mutable.previousTree = state.tree;
        mutable.patchedTree = currentTree;
        mutable.scrollableSegments = scrollableSegments;
        mutable.canonicalUrl = canonicalUrlOverride ? (0, _createhreffromurl.createHrefFromUrl)(canonicalUrlOverride) : href;
        mutable.pendingPush = pendingPush;
        mutable.hashFragment = hash;
        return (0, _handlemutable.handleMutable)(state, mutable);
    }
    // When doing a hard push there can be two cases: with optimistic tree and without
    // The with optimistic tree case only happens when the layouts have a loading state (loading.js)
    // The without optimistic tree case happens when there is no loading state, in that case we suspend in this reducer
    // forceOptimisticNavigation is used for links that have `prefetch={false}`.
    if (forceOptimisticNavigation) {
        const segments = pathname.split('/');
        // TODO-APP: figure out something better for index pages
        segments.push('');
        // Optimistic tree case.
        // If the optimistic tree is deeper than the current state leave that deeper part out of the fetch
        const optimisticTree = (0, _createoptimistictree.createOptimisticTree)(segments, state.tree, false);
        // Copy subTreeData for the root node of the cache.
        cache.status = _approutercontext.CacheStates.READY;
        cache.subTreeData = state.cache.subTreeData;
        // Copy existing cache nodes as far as possible and fill in `data` property with the started data fetch.
        // The `data` property is used to suspend in layout-router during render if it hasn't resolved yet by the time it renders.
        const res = (0, _fillcachewithdataproperty.fillCacheWithDataProperty)(cache, state.cache, // TODO-APP: segments.slice(1) strips '', we can get rid of '' altogether.
        segments.slice(1), ()=>(0, _fetchserverresponse.fetchServerResponse)(url, optimisticTree, state.nextUrl));
        // If optimistic fetch couldn't happen it falls back to the non-optimistic case.
        if (!(res == null ? void 0 : res.bailOptimistic)) {
            mutable.previousTree = state.tree;
            mutable.patchedTree = optimisticTree;
            mutable.pendingPush = pendingPush;
            mutable.hashFragment = hash;
            mutable.scrollableSegments = [];
            mutable.cache = cache;
            mutable.canonicalUrl = href;
            return (0, _handlemutable.handleMutable)(state, mutable);
        }
    }
    // Below is the not-optimistic case. Data is fetched at the root and suspended there without a suspense boundary.
    // If no in-flight fetch at the top, start it.
    if (!cache.data) {
        cache.data = (0, _createrecordfromthenable.createRecordFromThenable)((0, _fetchserverresponse.fetchServerResponse)(url, state.tree, state.nextUrl));
    }
    // Unwrap cache data with `use` to suspend here (in the reducer) until the fetch resolves.
    const [flightData, canonicalUrlOverride] = (0, _readrecordvalue.readRecordValue)(cache.data);
    // Handle case when navigating to page in `pages` from `app`
    if (typeof flightData === 'string') {
        return handleExternalUrl(state, mutable, flightData, pendingPush);
    }
    // Remove cache.data as it has been resolved at this point.
    cache.data = null;
    let currentTree = state.tree;
    let currentCache = state.cache;
    let scrollableSegments = [];
    for (const flightDataPath of flightData){
        // The one before last item is the router state tree patch
        const [treePatch] = flightDataPath.slice(-3, -2);
        // Path without the last segment, router state, and the subTreeData
        const flightSegmentPath = flightDataPath.slice(0, -4);
        // Create new tree based on the flightSegmentPath and router state patch
        const newTree = (0, _applyrouterstatepatchtotree.applyRouterStatePatchToTree)(// TODO-APP: remove ''
        [
            '',
            ...flightSegmentPath
        ], currentTree, treePatch);
        if (newTree === null) {
            throw new Error('SEGMENT MISMATCH');
        }
        if ((0, _isnavigatingtonewrootlayout.isNavigatingToNewRootLayout)(currentTree, newTree)) {
            return handleExternalUrl(state, mutable, href, pendingPush);
        }
        mutable.canonicalUrl = canonicalUrlOverride ? (0, _createhreffromurl.createHrefFromUrl)(canonicalUrlOverride) : href;
        const applied = (0, _applyflightdata.applyFlightData)(currentCache, cache, flightDataPath);
        if (applied) {
            mutable.cache = cache;
            currentCache = cache;
        }
        currentTree = newTree;
        for (const subSegment of generateSegmentsFromPatch(treePatch)){
            scrollableSegments.push([
                ...flightSegmentPath,
                ...subSegment
            ].filter((segment)=>segment !== '__PAGE__'));
        }
    }
    mutable.previousTree = state.tree;
    mutable.patchedTree = currentTree;
    mutable.scrollableSegments = scrollableSegments;
    mutable.pendingPush = pendingPush;
    mutable.hashFragment = hash;
    return (0, _handlemutable.handleMutable)(state, mutable);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=navigate-reducer.js.map