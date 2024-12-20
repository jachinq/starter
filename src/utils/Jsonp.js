// jsonp 跨域请求
export function Jsonp(option) {
    // 创建 script 元素
    let script = document.createElement("script");

    // 处理参数
    let param = "";
    for (let item in option.param) {
        if (item && option.param[item]) {
            param += `&${item}=${option.param[item]}`
        }
    }
    // 定义函数名
    let funcName = option.callback ? option.callback : "Jsonp" + Math.random().toString().replace(".", "");
    // 挂载全局函数
    window[funcName] = option.success;
    // 设置 src
    script.src = option.url + "?callback=" + funcName + param;

    // 追加节点
    try {
        document.body.appendChild(script);
    } catch (e) {
        let expFuncName = option.onerror ? option.onerror : "Jsonp" + Math.random().toString().replace(".", "");
        window[expFuncName] = option.error;
    }

    // 加载完成移除节点
    script.onload = (event) => {
        // console.log('onload', event);
        // console.log('onload', script);
        document.body.removeChild(script);
    }
}
