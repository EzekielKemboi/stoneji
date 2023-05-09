console.log("StoneJi")

document.addEventListener("keydown", keydownProcess);
document.addEventListener("mouseover", mouseoverProcess);
document.addEventListener("mousemove", (event) => card.updateCursor(event.pageX, event.pageY));

// 从target中获取视频id
function getVideoId(target) {
    let regex = /https:\/\/www\.youtube\.com\/watch\?v=(\w+)&?.*/;

    let match = target.href.match(regex);
    if (match && match[1]) {
        return match[1]
    }

    return null;
}

// 获取带有youtube视频链接的target
function getTarget(target) {
    for (let userLink of [target, target.parentNode, target.parentNode.parentNode]) {
        console.log(userLink.tagName, userLink.href)
        if (userLink && userLink.tagName == "A" && userLink.href.startsWith("https://www.youtube.com/watch?v=")) {
            return userLink;
        }
    }
    return null;
}

// 展示stone记卡片
function showCard(event) {
    if (!event.target) {
        return
    }
    let target = getTarget(event.target);

    if (target && card.enable()) {
        let videoId = getVideoId(target);

        console.log(videoId);

        if (videoId) {
            card.updateCursor(event.clientX, event.clientY);
            card.updateTarget(target);

            getStoneji(videoId).then(
                value => {
                    console.log(value)
                    if (value) {
                        card.updateData(value)
                    }
                }
            );
        }
    }
}

// 鼠标悬停200ms展示stone记卡片
function mouseoverProcess(event) {
    clearTimeout(mouseoverProcess.timer);

    event.target.addEventListener("mouseout", () => clearTimeout(mouseoverProcess.timer));

    mouseoverProcess.timer = setTimeout(() => {
        showCard(event)
    }, 20);
}

// 按下Alt+Shift+F时展示开始stone记
function keydownProcess(event) {
    // 按下 Alt + Shift + F 时
    if (event.altKey && event.shiftKey && event.keyCode === 70) {
        if (!card.enable) {
            console.log("card not enable")
            return
        }

        let target = document.elementFromPoint(card.cursorX - window.pageXOffset, card.cursorY - window.pageYOffset)

        if (!target) {
            console.log("no target", card.cursorX, card.cursorY)
            return
        }

        target = getTarget(target);

        if (!target) {
            return
        }
        let videoId = getVideoId(target);

        console.log(videoId);

        if (videoId) {
            var comment = prompt("Please enter your comment:", "");

            if (comment) {
                console.log("Submitting comment for video " + ": " + comment);
                setStoneji(videoId, comment)
            }
        }
    }
}