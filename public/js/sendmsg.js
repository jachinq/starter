/**
 * 向 Chrome 发送消息
 * @param message 消息
 */
export function sendChromeMsg(message) {
    console.log('sendChromeMsg chrome.runtime', chrome.runtime);

    return new Promise((resolve) => {

        // 判断谷歌插件环境，正常的话，就调发送消息的 api，传入 promise 回调的 resolve
        if (chrome.runtime) {
            chrome.runtime.sendMessage(message, resolve);
        } else {
            console.log("not chrome extension", message);
            resolve({success: false, ok: false, msg: "not chrome extension", data: message});
        }
    }).catch((e) => {
        console.log('sendChromeMsg', e);
    });

}

