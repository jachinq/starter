// 谷歌插件后台服务，主要用于跨域请求
if (chrome.runtime) {

    // 监听消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        // console.log('chromeListener', request);
        if (request.action === 'openPopup') {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                // console.log('tabs', tabs);
                if (tabs.length > 0) {
                    chrome.action.openPopup();
                }
            });
            return;
        }

        new Promise((resolve, reject) => {
            if (typeof request !== 'object' || !request.type) {
                console.error('参数异常');
                resolve(`消息 ${JSON.stringify(request)} 格式不符合规范`);
                return;
            }

            // 处理参数
            let param = "";
            for (let item in request.params) {
                if (item && request.params[item]) {
                    param += `&${item}=${request.params[item]}`
                }
            }
            let url = request.url + "?" + param;
            console.log('url', url);

            switch (request.type) {
                case 'get':
                    // console.log('get request', request);
                    fetch(url).then((res) => {
                        console.log(res);
                        resolve(res.json());
                    }).catch(event => {
                        console.log(event);
                        resolve({ success: false, ok: false, msg: "请求错误url=" + request.url, data: event });
                    });
                    break;
                case 'test':
                    console.log('test request', request);
                    resolve({ msg: '测试', data: request });
                    break;
            }
        }).then((res) => {
            sendResponse(res); // 回传，会关联到 sendMessage 中的 resolve
        }).catch((e) => {
            console.log('chromeListener', e);
        });
        return true;
    })
}