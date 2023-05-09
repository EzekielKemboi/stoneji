function getStoneji(videoId) {
    let promise = fetch(`http://localhost:8080/get?key=${videoId}`);

    return promise.then(
        response => {
            if (!response.ok) {
                throw new Error(`API 请求失败，HTTP 状态码为 ${response.status}`);
            }
            return response.json();
        }
    ).then(
        (data) => {
            return data.value;
        }
    ).catch(
        error => {
            console.error(error);
            return null
        }
    );
}

function setStoneji(videoId, stoneji) {
    let promise = fetch(`http://localhost:8080/set?key=${videoId}&value=${stoneji}`);

    return promise.then(
        response => {
            if (!response.ok) {
                throw new Error(`API 请求失败，HTTP 状态码为 ${response.status}`);
            }
            return {}
        }
    ).then(
        (data) => {
            return data
        }
    ).catch(
        error => {
            console.error(error);
            return null
        }
    );
}