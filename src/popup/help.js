
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
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
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
  const defaultConfig = {
    serverUrl: '',
    filePath: 'collect_v2.json',
    params: 'username=xxx&password=xxx',
  };
  const serverConfig = localStorage.getItem('serverConfig') || JSON.stringify(defaultConfig);
  try {
    return JSON.parse(serverConfig);
  } catch (e) {
    return defaultConfig;
  }
}

const saveServerConfig = (config = {}) => {
  localStorage.setItem('serverConfig', JSON.stringify(config));
}

const removeUrlPath = (url) => {
  try {
      // 创建一个新的URL对象
      const urlObj = new URL(url);
      // 返回协议加上域名
      return urlObj.protocol + '//' + urlObj.hostname;
  } catch (e) {
      // 如果传入的url格式不正确，返回错误信息
      return "";
  }
}

// 随机生成一对背景和前景色
function generateColors() {
  const bgColor = getRandomColorHSL();
  const fgColor = getForegroundColor(bgColor);
  return { bgColor, fgColor }
}

// 生成随机 HSL 颜色
function getRandomColorHSL() {
  const hue = Math.floor(Math.random() * 360); // 色相 [0, 360)
  const saturation = Math.floor(Math.random() * 100); // 饱和度 [0, 100)
  const lightness = Math.floor(Math.random() * 31) + 40; // 亮度 [40, 70) - 避免太暗
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// 根据背景色生成前景色
function getForegroundColor(backgroundColor) {
  const hslValues = backgroundColor.match(/(\d+), (\d+)%, (\d+)%/);
  // 计算明亮度值
  const lightness = parseInt(hslValues[3], 10);
  // 确保前景色比背景色明亮
  const newLightness = lightness < 60 ? lightness + 60 : lightness - 30; // 使前景色的亮度增加

  return `hsl(${hslValues[1]}, ${hslValues[2]}%, ${newLightness}%)`;
}

export default {
  getPageInfo,
  getServerConfig,
  saveServerConfig,
  removeUrlPath,
  generateColors,
}