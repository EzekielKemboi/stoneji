userInfoCache = new Map()

function cacheAndUpdate(callback, videoId, api, value) {
    let cache = {};
    if (!userInfoCache.has(videoId)) {
        userInfoCache.set(videoId, cache);
    } else {
        cache = userInfoCache.get(videoId);
    }
    cache[api] = value;

    callback({ "uid": videoId, "api": api, "value": value });
}