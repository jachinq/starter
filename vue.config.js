//vue.config.js
module.exports = {

    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html'
        },
        popup: {
            entry: 'src/popup.js',
            template: 'public/popup.html',
            filename: 'popup.html'
        }
    },
    configureWebpack: {
        output: {
            filename: (chunkData) => {
                return chunkData.chunk.name === 'popup' ? 'js/popup.js' : 'js/[name].js';
            }
        }
    },

    devServer: {
        // port: 8080,

        // host: "localhost",

        https: false,

        // 自动启动浏览器
        open: false,


        // 本地开发请求代理
        proxy: {
            "/api": {
                target: "https://tuapi.eees.cc", //设置调用的接口域名和端口
                changeOrigin: true, //是否跨域
                ws: true,
                pathRewrite: {
                    "^/api": ""
                }
            },
            '/bingSuggestion': {
                // target: "https://www.bing.com/AS/Suggestions", //设置调用的接口域名和端口
                target: "https://api.bing.com/qsonhs.aspx", //设置调用的接口域名和端口
                changeOrigin: true, //是否跨域
                ws: true,
                pathRewrite: {
                    "^/bingSuggestion": ""
                }
            },
            '/xwApi': { // 小歪-二次元
                target: "https://api.ixiaowai.cn/api/api2.php", // 备用
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/xwApi": ""
                }
            },
            '/xwApi2': { // 小歪-风景
                target: "https://api.ixiaowai.cn/gqapi/gqapi2.php", // 备用
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/xwApi": ""
                }
            },
            '/yhApi': { // 樱花
                target: "https://www.dmoe.cc/random.php",
                changeOrigin: true,
                ws: true,
                pathRewrite: { "^/yhApi": "" },
            },
            '/myApi': { // 魅影
                target: "https://tuapi.eees.cc/api.php",
                changeOrigin: true,
                ws: true,
                pathRewrite: { "^/myApi": "" },
            },
            '/ydApi': { // 如诗
                target: encodeURI('https://api.r10086.com/樱道随机图片api接口.php?图片系列=动漫综合1&参数=json'),
                changeOrigin: true,
                ws: true,
                pathRewrite: { "^/ydApi": "" },
            },
            '/rsApi': { // 如诗
                target: 'https://api.likepoems.com/img/pc/',
                changeOrigin: true,
                ws: true,
                pathRewrite: { "^/rsApi": "" },
            }
        }
    }
};
