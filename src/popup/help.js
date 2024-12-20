
const getPageInfo = () => {
  return new Promise((resolve, reject) => {
    // const chrome = window.chrome || chrome || {};
    console.log(chrome);
    if (!chrome || !chrome.tabs || !chrome.runtime) {
      // 拿不到 chrome.tabs 接口，说明不是在浏览器环境中
      resolve({
        title: window.document.title,
        url: window.location.href
      })
      return;
    }
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs.length > 0) {
        var activeTab = tabs[0];
        resolve({
          title: activeTab.title,
          url: activeTab.url
        });
      } else {
        reject('无法获取页面信息');
      }
    });
  });
}

const getServerConfig = () => {
    const serverConfig = localStorage.getItem('serverConfig') || '{}';
    try {
        return JSON.parse(serverConfig);
    } catch (e) {
        return {};
    }
}

const saveServerConfig = (config = {}) => {
    localStorage.setItem('serverConfig', JSON.stringify(config));
}

export default {
    getPageInfo,
    getServerConfig,
    saveServerConfig
}