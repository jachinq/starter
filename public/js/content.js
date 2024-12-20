// 双击快捷键 c 打开 popup 页面

let lastKeyPressTime = 0;
const doubleClickThreshold = 300; // 双击的阈值时间，单位为毫秒

document.addEventListener('keydown', function (event) {
    if (event.key === 'c' || event.key === 'C') {
        const currentTime = new Date().getTime();
        if (currentTime - lastKeyPressTime < doubleClickThreshold) {
            // 双击事件检测成功
            if (chrome.runtime) {
                chrome.runtime.sendMessage({ action: "openPopup"});
            }
        }
        lastKeyPressTime = currentTime;
    }
});
