// 定义接口数据

import Util from "./Util";
import { isChromeExtension } from "../../public/js/chrome";
import { sendChromeMsg } from "../../public/js/sendmsg";
import IndexedDb from "../utils/IndexedDb"

import Vue from 'vue'
import Resource from 'vue-resource'
Vue.use(Resource);
let vue = new Vue();

// 已过期/不能正常使用的api源
const backgroundSourceError = [
    { // 要充钱
        name: '兔子',
        url: "https://api.kafuuchino.com.cn",
        param: {
            appid: '640f192dcfcba2acebf19d0c',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDBmMTg3ZGNmY2JhMmFjZWJmMTljZjAiLCJpYXQiOjE2Nzg3MTEwODV9.rO8jY80-360buVH3UQ8VdUIBnx3cQME0bhQPoMnYC28'
        },
        cross: false,
        func: async function () {
            try {
                let result = await vue.$http.get(this.url, { params: this.param }).catch(e => { console.log(e) });
                console.log(result);
                if (result.ok) {
                    // 返回 data 字段：url fsize from height width imgauthor
                    return result.data.data.url;
                }
            } catch (e) {
                console.log(e);
            }
            return null;
        },
    },
    { // 网站已挂
        name: '小歪',
        // https://api.ixiaowai.cn/api/api2.php?return=json
        // https://api.ixiaowai.cn/gqapi/gqapi2.php
        url: ["https://api.ixiaowai.cn/api/api2.php", "https://api.ixiaowai.cn/gqapi/gqapi2.php"].sort(Util.randomSort)[0],
        crossUrl: ["/xwApi", "/xwApi2"].sort(Util.randomSort)[0],
        param: {
            return: 'json'
        },
        func: async function () {
            try {
                let result = isChromeExtension() ?
                    await sendChromeMsg({ type: 'get', url: this.url, params: this.param }).catch(e => { console.log(e) }) :
                    await vue.$http.get(this.crossUrl, { params: this.param }).catch(e => { console.log(e) });
                if (!isChromeExtension()) result = result ? result.data : {};

                console.log(result);
                if (result && result.imgurl) {
                    return result.imgurl;
                }
            } catch (e) {
                console.log(e);
            }
            return null;
        },
    },
];

const backgroundSourceList = [
    {
        name: '博天',
        site: 'http://api.btstu.cn/doc/sjbz.php',
        url: "http://api.btstu.cn/sjbz/api.php",
        param: {
            lx: '',
            format: 'json'
        },
        select: {
            default: 'suiji',
            category: [
                { value: "suiji", label: "随机" },
                { value: "meizi", label: "妹子" },
                { value: "dongman", label: "动漫" },
                { value: "fengjing", label: "风景" },
            ]
        },
        func: async function (category) {
            try {
                if (category) {
                    this.param.lx = category
                } else {
                    this.param.lx = this.select.default;
                }

                let result = isChromeExtension() ?
                    await sendChromeMsg({ type: 'get', url: this.url, params: this.param }).catch(e => { console.log(e) }) :
                    await vue.$http.get(this.url, { params: this.param }).catch(e => { console.log(e) });
                if (!isChromeExtension()) result = result ? result.data : {};

                console.log(result);
                if (result && result.imgurl) {
                    return result.imgurl;
                }
            } catch (e) {
                console.log(e);
            }
            return null;
        },
    },
    {
        name: '魅影',
        site: 'https://tuapi.eees.cc',
        url: "https://tuapi.eees.cc/api.php",
        crossUrl: '/myApi',
        param: {
            category: '',
            type: 'json',
            px: 'pc'
        },
        select: {
            default: 'random',
            category: [
                { value: "random", label: "随机" },
                { value: "meinv", label: "美女" },
                { value: "biying", label: "必应" },
                { value: "fengjing", label: "风景" },
                { value: "dongman", label: "动漫" },
            ],
        },
        func: async function (category) {
            try {
                if (category === this.select.default) {
                    let categoryList = this.select.category.map(p => { return p.value });
                    categoryList.splice(0, 1); // 去掉随机
                    this.param.category = categoryList.sort(Util.randomSort)[0];
                } else {
                    this.param.category = category;
                }

                let result = isChromeExtension() ?
                    await sendChromeMsg({ type: 'get', url: this.url, params: this.param }).catch(e => { console.log(e) }) :
                    await vue.$http.get(this.crossUrl, { params: this.param }).catch(e => { console.log(e) });
                if (!isChromeExtension()) result = result ? result.data : {};

                console.log(result);
                if (result && result.img) {
                    return result.img;
                }
            } catch (e) {
                console.log(e);
            }
            return null;
        },
    },
    {
        name: '樱花',
        site: 'https://www.dmoe.cc',
        url: "https://www.dmoe.cc/random.php",
        crossUrl: "/yhApi",
        param: {
            return: 'json',
        },
        func: async function () {
            try {
                let result = isChromeExtension() ?
                    await sendChromeMsg({ type: 'get', url: this.url, params: this.param }).catch(e => { console.log(e) }) :
                    await vue.$http.get(this.crossUrl, { params: this.param }).catch(e => { console.log(e) });
                if (!isChromeExtension()) result = result ? result.data : {};

                console.log(result);
                if (result && result.imgurl) {
                    // 返回 data 字段：imgurl code height width
                    return result.imgurl;
                }
            } catch (e) {
                console.log(e);
            }
            return null;
        },
    },
    {
        name: '如诗',
        site: 'https://api.likepoems.com',
        url: 'https://api.likepoems.com/img/',
        crossUrl: '/rsApi',
        param: {
            json: 'JSON'
        },
        select: {
            default: 'random',
            category: [
                { value: "random", label: "随机" },
                { value: "pc/", label: "PC壁纸" },
                { value: "mc/", label: "mc酱" },
                { value: "pixiv/", label: "p站" },
                { value: "nature/", label: "自然" },
                { value: "bing/", label: "必应" }],
        },

        func: async function (category) {
            if (category === this.select.default) {
                let categoryList = this.select.category.map(p => { return p.value });
                categoryList.splice(0, 1);
                this.url = 'https://api.likepoems.com/img/' + categoryList.sort(Util.randomSort)[0];
            } else {
                this.url = 'https://api.likepoems.com/img/' + category;
            }
            /*
            code:200
            height:1152
            mime:"image/jpeg"
            size:"199903"
            url:"https://jihulab.com/weblog/gallery01/-/raw/master/mc/s87S96O2Slmep7XW28Pw.jpg"
            width:2048
            */

            try {
                let result = isChromeExtension() ?
                    await sendChromeMsg({ type: 'get', url: this.url, params: this.param }).catch(e => { console.log(e) }) :
                    await vue.$http.get(this.crossUrl, { params: this.param }).catch(e => { console.log(e) });
                if (!isChromeExtension()) result = result ? result.data : {};

                console.log(result);
                if (result && result.url) {
                    return result.url;
                }
            } catch (e) {
                console.log(e);
            }
            return null;
        }
    },
    { // 清晰度不够
        name: '东方',
        site: 'https://img.paulzzh.com',
        url: "https://img.paulzzh.com/touhou/random",
        param: {
            type: 'json',
            site: 'all',
            size: 'pc',
            tag: undefined,
        },
        select: {
            default: 'random',
            category: [
                { value: "random", label: "随机" },
                { value: "reimu", label: "博丽灵梦" },
                { value: "mokou", label: "藤原妹红" },
                { value: "kaguya", label: "蓬莱山辉夜" },
                { value: "cirno", label: "琪露诺" },
                { value: "short_hair", label: "短发" },
                { value: "red_eyes", label: "红眼" },
                { value: "night", label: "夜晚" },
            ],
        },
        func: async function (category) {
            try {
                if (category === this.select.default) {
                    delete this.param.tag;
                } else {
                    this.param.tag = category;
                }

                let result = isChromeExtension() ?
                    await sendChromeMsg({ type: 'get', url: this.url, params: this.param }).catch(e => { console.log(e) }) :
                    await vue.$http.get(this.url, { params: this.param }).catch(e => { console.log(e) });
                if (!isChromeExtension()) result = result ? result.data : {};

                console.log(result);
                if (result && result.preview) {
                    return result.preview;
                }
            } catch (e) {
                console.log(e);
            }

            return null;
        },
    },
    { // 中文参数请求出错
        name: '樱道',
        site: 'https://img.r10086.com/',
        url: encodeURI("https://api.r10086.com/樱道随机图片api接口.php"),
        crossUrl: "/ydApi",
        param: {
            // 参数: 'json',
            // 图片系列: '',
            // '%E5%9B%BE%E7%89%87%E7%B3%BB%E5%88%97': '动漫综合1',
            // '%E5%8F%82%E6%95%B0': 'json',
        },
        select: {
            default: 'dongman',
            category: [
                { value: 'dongman', label: '动漫' },
                { value: 'nature', label: '风景' },
                { value: 'meinv', label: '少女写真' },
                { value: '死库水萝莉', label: '死库水萝莉' },
                { value: '萝莉', label: '萝莉' },
                { value: '极品美女图片', label: '极品美女图片' },
                { value: '日本COS中国COS', label: 'COSer' },
                { value: '赛马娘横屏系列1', label: '赛马娘' },
                { value: '东京食尸鬼横屏系列1', label: '东京食尸鬼' },
                { value: 'Fate横屏系列1', label: 'Fate' },
                { value: '为美好世界献上祝福横屏系列1', label: '为美好世界献上祝福' },
                { value: '某科学的超电磁炮横屏系列1', label: '某科学的超电磁炮' },
                { value: '原神横屏系列1', label: '原神' },
                { value: '我的世界系列1', label: '我的世界' },
                { value: '神奇宝贝横屏系列1', label: '神奇宝贝' },
                { value: '龙珠横屏系列1', label: '龙珠' },
                { value: '罪恶王冠横屏系列1', label: '罪恶王冠' },
                { value: '鬼灭之刃横屏系列1', label: '鬼灭之刃' },
                { value: '火影忍者横屏系列1', label: '火影忍者' },
                { value: '海贼王横屏系列1', label: '海贼王' },
                { value: '进击的巨人横屏系列1', label: '进击的巨人' },
                { value: '从零开始的异世界生活横屏系列1', label: '从零开始的异世界生活' },
                { value: '刀剑神域横屏系列1', label: '刀剑神域' },
                { value: '钢之炼金术师横屏系列1', label: '钢之炼金术师' },
                { value: '妖精的尾巴横屏系列1', label: '妖精的尾巴' },
                { value: '缘之空横屏系列1', label: '缘之空' },
                { value: '东方project1', label: '东方project' },
                { value: '猫娘1', label: '猫娘' },
                { value: '物语系列', label: '物语' },
                { value: '少女前线1', label: '少女前线' },
                { value: '明日方舟', label: '明日方舟' },
                { value: '重装战姬1', label: '重装战姬' },
                { value: 'P站系列', label: 'P站' },
                { value: 'CG系列', label: 'CG' },
                { value: '守望先锋', label: '守望先锋' },
                { value: '王者荣耀', label: '王者荣耀' },
                { value: '橘里橘气横屏系列1', label: '橘里橘气' },

            ],
        },
        cross: true,
        func: async function (category) {
            try {
                let isChrome = isChromeExtension();
                if (isChrome) {
                    let args = [];
                    switch (category) {
                        case 'dongman':
                            for (let i = 1; i < 19; i++) {
                                args.push(encodeURI("动漫综合" + i));
                            }
                            break;
                        case 'meinv':
                            for (let i = 1; i < 7; i++) {
                                args.push(encodeURI("少女写真" + i));
                            }
                            break;
                        case 'nature':
                            for (let i = 1; i < 11; i++) {
                                args.push(encodeURI("风景系列" + i));
                            }
                            break;
                        case '物语系列':
                        case '明日方舟':
                            for (let i = 1; i < 3; i++) {
                                args.push(encodeURI(category + i));
                            }
                            break;
                        case 'P站系列':
                            for (let i = 1; i < 5; i++) {
                                args.push(encodeURI(category + i));
                            }
                            break;
                        case 'CG系列':
                            for (let i = 1; i < 6; i++) {
                                args.push(encodeURI(category + i));
                            }
                            break;
                        default:
                            args.push(encodeURI(category));
                            break;

                    }

                    this.param[encodeURI("参数")] = 'json';
                    this.param[encodeURI("图片系列")] = args.sort(Util.randomSort)[0];
                }
                console.log('樱道', this);
                let result = isChrome ?
                    await sendChromeMsg({ type: 'get', url: this.url, params: this.param }).catch(e => { console.log(e) }) :
                    await vue.$http.get(this.crossUrl, { params: this.param }).catch(e => { console.log(e) });
                if (!isChromeExtension()) result = result ? result.data : {};

                console.log(result);
                if (result && result.img) {
                    // return result.img
                    return 'https:' + result.img
                }
            } catch (e) {
                console.log(e);
            }
            return null;
        }
    },
];

// 根据图片源名称拿到源
const getBackgroundSource = function (sourceName) {
    for (let so of Object.keys(backgroundSourceList)) {
        let sourceObj = backgroundSourceList[so];
        if (sourceName === sourceObj.name) {
            return sourceObj;
        }
    }
};

const requestApi = async function (source, category) {
    return await getBackgroundSource(source).func(category) || '';
};

/**
 * 设置背景壁纸
 * @param imgUrl 背景url
 */
const setBackground = async (imgUrl, func) => {
    if (imgUrl == null || imgUrl === '') {
        return
    }

    let isUseCache = false;

    let url = imgUrl;
    if (isUseCache) {
        url = "https://wsrv.nl/?url=" + imgUrl;
    }
    // console.log('set bg img', url);
    Util.setRootCssValue("--bg-url", "url('" + url + "')");

    let bgImgRefs = document.getElementsByClassName("bg-img");
    if (bgImgRefs && bgImgRefs.length > 0) {
        let bgImgRef = bgImgRefs[0];
        if (bgImgRef != null) {
            bgImgRef.style.background = '';
        }
    }

    if (func && func instanceof Function) {
        let getUIResult = await IndexedDb.getSetting().catch(e => { console.log(e) });
        if (getUIResult.success) {
            if (getUIResult.data && getUIResult.data.length > 0) {
                let uiData = getUIResult.data[0];
                uiData.bgUrl = imgUrl;
                let setUIResult = await IndexedDb.setSetting(uiData).catch(e => { console.log(e) });
                if (setUIResult.success) {
                    func(); // 设置图片成功的回调
                    console.log("set bg ok;");
                } else {
                    this.$message({ type: 'error', message: '保存失败!' });
                }
            }
        } else {
            that.$message({ type: 'error', message: '获取原背景图失败!' });
        }
    }
};

const setDefaultBackground = function (bgImgRef) {
    if (bgImgRef == null) {
        bgImgRef = document.getElementsByClassName("bg-img");
        if (bgImgRef && bgImgRef.length > 0) {
            bgImgRef = bgImgRef[0];
        }
    }
    console.log('set default background', bgImgRef);
    if (bgImgRef == null) {
        return;
    }
    let colorList = [];
    colorList.push(['#d98e98', '#d8bbbf']);
    colorList.push(['#26aacc', '#6dd5ed']);
    colorList.push(['#896add', '#eaafc8']);
    colorList.push(['#fff1eb', '#ace0f9']);
    colorList.push(['#ccebe9', '#ace0f9']);
    colorList.push(['#d5e47f', '#a1c66c']);
    colorList.push(['#d3cce3', '#e9e4f0']);
    colorList.push(['#00b1d5', '#66d8b5']);
    colorList.push(['#9adfba', '#00d3d6']);
    colorList.push(['#5e80c6', '#93bca8']);
    // colorList.push(colorToRgba('#ee9ca7', 0.5));
    // colorList.push(colorToRgba('#26aacc', 0.5));
    // colorList.push(colorToRgba('#896add', 0.5));
    // colorList.push(colorToRgba('#fff1eb', 0.5));
    // colorList.push(colorToRgba('#ccebe9', 0.5));
    // colorList.push(colorToRgba('#eeff8e', 0.5));
    // colorList.push(colorToRgba('#d3cce3', 0.5));
    // colorList.push(colorToRgba('#00c6ee', 0.5));
    // colorList.push(colorToRgba('#ecd3ae', 0.5));
    // colorList.push(colorToRgba('#6c93e4', 0.5));

    // let randomNum = Math.round(Math.random() * colorList.length);
    // if (randomNum < 0 || randomNum >= colorList.length) { // 下标保护
    //     randomNum = 0;
    // }
    // let color1 = colorList[randomNum][0];
    // let color2 = colorList[randomNum][1];

    let fun = () => {
        // let date = new Date();
        // let fmt = date.format("mmsshh");
        // console.log(fmt);
        // color1 = '#' + fmt;

        // fmt = date.format("ssmmhh");
        // color2 = '#' + fmt;

        // let {color1, color2, color3, color4, color5, second} = convertTimeToColor();
        // // console.log(second);
        // let deg = second * 6 % 360;
        //
        // let bg = `linear-gradient(
        //     ${deg}deg,
        //     ${color1} 0%,
        //     ${color4} 100%
        //     )`;

        let randomNum = Math.round(Math.random() * colorList.length);
        if (randomNum < 0 || randomNum >= colorList.length) { // 下标保护
            randomNum = 0;
        }
        let color1 = colorList[randomNum][0];
        let color2 = colorList[randomNum][1];
        // let color1 = colorList[randomNum];

        let bg = `linear-gradient(
            to bottom,
            ${color1} 0%,
            ${color2} 100%
            )`;

        bgImgRef.style.background = bg;
        // bgImgRef.style.background = color1;
    };
    fun();
    setInterval(fun, 60 * 1000);

    // bgImgRef.style.background = 'linear-gradient(to bottom, ' + color1 + ' 0%, ' + color2 + ' 60%)';
    // Util.setRootCssValue("--bg-mask-rgba", "rgba(0,0,0,0.1)");
};

/**
 * 把时间转出颜色
 */
function convertTimeToColor() {
    let time = new Date().format("hhmmss");

    let second = parseInt(time.substr(4, 2), 10);

    let color1 = parseInt(time.substr(0, 2), 16) % 99;
    let color2 = parseInt(time.substr(2, 2), 16) % 99;
    let color3 = parseInt(String(second), 16) % 99;

    let color2_0 = (color2 + 50) % 128;
    let color2_1 = (color2 + 80) % 128;
    let color2_2 = (color2 + 110) % 128;
    let color2_3 = (color2 + 140) % 128;


    let res = {};
    res.color1 = `rgba(${color1},${color2},${color3}, 0.5)`;
    res.color2 = `rgba(${color1},${color2_0},${color3}, 0.5)`;
    res.color3 = `rgba(${color1},${color2_1},${color3}, 0.5)`;
    res.color4 = `rgba(${color1},${color2_2},${color3}, 0.5)`;
    res.color5 = `rgba(${color1},${color2_3},${color3}, 0.5)`;
    res.second = second;
    return res;
}


// 将十六进制转成rgb
function colorToRgb(color) {
    if (color.indexOf("#") !== -1) {
        color = color.replace("#", "", color)
    }
    let color1 = parseInt(color.substr(0, 2), 16);
    let color2 = parseInt(color.substr(2, 2), 16);
    let color3 = parseInt(color.substr(4, 2), 16);
    return "rgb(" + color1 + "," + color2 + "," + color3 + ")";
}
// 将十六进制转成rgb
function colorToRgba(color, opacity) {
    if (color.indexOf("#") !== -1) {
        color = color.replace("#", "", color)
    }
    let color1 = parseInt(color.substr(0, 2), 16);
    let color2 = parseInt(color.substr(2, 2), 16) % 128;
    let color3 = parseInt(color.substr(4, 2), 16);
    return `rgba(${color1},${color2},${color3},${opacity})`;
}
// 将十六进制转成rgb
function colorToRgbComplementary(color) {
    if (color.indexOf("#") !== -1) {
        color = color.replace("#", "", color)
    }
    let color1 = 255 - parseInt(color.substr(0, 2), 16);
    let color2 = 255 - parseInt(color.substr(2, 2), 16);
    let color3 = 255 - parseInt(color.substr(4, 2), 16);

    return "rgb(" + color1 + "," + color2 + "," + color3 + ")";
}

export default {
    setBackground, requestApi, backgroundSourceList, getBackgroundSource, setDefaultBackground
}
