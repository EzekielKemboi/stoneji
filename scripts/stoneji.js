console.log("StoneJi")

document.addEventListener("mouseover", showProfileDebounce);
document.addEventListener("mousemove", (event) => userProfileCard.updateCursor(event.pageX, event.pageY));

document.addEventListener("keydown", function (event) {
    // 按下 Alt + Shift + F 时
    if (event.altKey && event.shiftKey && event.keyCode === 70) {
        if (!userProfileCard.enable) {
            return
        }

        let target = getTarget(document.elementFromPoint(userProfileCard.cursorX, userProfileCard.cursorY));

        console.log(target.tagName, target.href)

        if (target) {
            var comment = prompt("Please enter your comment:", "");

            if (comment) {
                console.log("Submitting comment for video " + ": " + comment);
            }
        }
    }
});

function getVideoId(target) {
    let regex = /https:\/\/www\.youtube\.com\/watch\?v=(\w+)&?.*/;

    console.log(target.href);

    let match = target.href.match(regex);
    if (match && match[1]) {
        return match[1]
    }

    return null;
}

function getTarget(target) {
    for (let userLink of [target, target.parentNode, target.parentNode.parentNode]) {
        if (userLink && userLink.tagName == "A" && userLink.href.startsWith("https://www.youtube.com/watch?v=")) {
            return userLink;
        }
    }

    return null;
}

userInfoCache = new Map()

function cacheAndUpdate(callback, videoId, api, value) {
    let cache = {};
    if (!userInfoCache.has(videoId)) {
        userInfoCache.set(videoId, cache);
    } else {
        cache = userInfoCache.get(videoId);
    }
    cache[api] = value;

    console.log(value)

    callback({ "uid": videoId, "api": api, "value": value });
}

function updateUserInfo(videoId, callback) {
    let value = fetch(`http://localhost:8080/get?key=${videoId}`)
        .then(response => {
            console.log(response.ok)
            if (!response.ok) { // 如果返回码不为 200，则抛出异常
                throw new Error(`API 请求失败，HTTP 状态码为 ${response.status}`);
            }
            return response.json();
        })
        .then((data) => cacheAndUpdate(callback, videoId, "comment", data.value))
        .catch(error => {
            console.error(error);
        });
}

function showProfile(event) {
    let target = getTarget(event.target);

    if (target && userProfileCard.enable()) {
        let videoId = getVideoId(target);

        console.log(videoId);

        if (videoId) {
            userProfileCard.updateCursor(event.clientX, event.clientY);
            userProfileCard.updateTarget(target);
            userProfileCard.updateData(target);
            updateUserInfo(videoId, (data) => userProfileCard.updateData(data));
        }
    }
}

function showProfileDebounce(event) {
    clearTimeout(showProfileDebounce.timer);
    event.target.addEventListener("mouseout", () => clearTimeout(showProfileDebounce.timer));
    showProfileDebounce.timer = setTimeout(() => {
        showProfile(event)
    }, 200);
}