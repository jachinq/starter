/* 通用工具 */

/**
 * vue对象深拷贝：自己定义了一个对象，因该对象要做双向数据绑定操作，因开发需要所以要备份一下该对象的初始状态，但是普通的备份对象无效仍然会因双向数据绑定而导致备份对象跟着改变
 * @param data：json对象
 * @returns {any} 深度拷贝后的新对象
 */
const deepClone = function (data) {
    return JSON.parse(JSON.stringify(data));
};

/**
 * 排列函数，根据 sort 字段排序
 * 对象 sort 的值要求是数字
 * @param a
 * @param b
 * @returns {number}
 */
const sortAsc = function (a, b) {
    let x = a.sort;
    let y = b.sort;
    if (x == null || y == null) {
        // console.log(a, b);
        return 0;
    }
    if (x < y) {
        return -1;
    }
    if (x > y) {
        return 1;
    }
    return 0;
};

/**
 * 排列函数，根据 sort 字段排序
 * 对象 sort 的值要求是数字
 * @param a
 * @param b
 * @returns {number}
 */
const sortDesc = function (a, b) {
    let x = a.sort;
    let y = b.sort;
    if (x == null || y == null) {
        // console.log(a, b);
        return 0;
    }
    if (x > y) {
        return -1;
    }
    if (x < y) {
        return 1;
    }
    return 0;
};

/**
 * 随机打乱数组
 * @param a
 * @param b
 * @returns {number}
 */
const randomSort = function(a, b) {
    return Math.random()>.5 ? -1 : 1;
    //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1，使用例子如下
    // var arr = [1, 2, 3, 4, 5];
    // arr.sort(randomSort);
};

/**
 * 设置 :root 的 css 变量
 */
const setRootCssValue = function (key, value) {
    let root = document.querySelector(":root");
    if (root && root.style) {
        root.style.setProperty(key, value);
    }
    // console.log(root.style.getPropertyValue(key));
};
/**
 * 获取 :root 的 css 变量
 */
const getRootCssValue = function (key) {
    let root = document.querySelector(":root");
    if (root && root.style) {
        return root.style.getPropertyValue(key);
    }
    return null;
};


/**
 * 下载图片，通过不跨域的 Canvas 下载
 * @param imgSrc
 * @param name
 */
const downloadPicture = function(imgSrc, name) {

    const image = new Image();
    // 解决跨域Canvas 污染问题
    image.setAttribute('crossOrigin', 'Anonymous');
    image.src = imgSrc;
    console.log(image);
    image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.download = name || new Date().format("bgimg_yyyyMMddhhmmss");
            a.href = url;
            a.click();
            a.remove();
            // 用完释放URL对象
            URL.revokeObjectURL(url);
        })
    };
    image.onerror = ()=> downloadPictureByLink(imgSrc);
};

/**
 * 下载图片，通过链接标签下载。跨域时会打开新窗口
 * @param url
 */
const downloadPictureByLink = function (url) {
    let a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    // a.setAttribute('download', '');
    let timestamp = (new Date()).valueOf();
    a.setAttribute("download", '');
    document.body.appendChild(a);
    console.log(a);
    a.click();
    a.remove();

// <a href="/getAttachmentFileStream?name=test.jpg" download target="_blank">附件jpg流</a>
};

const downloadText = function (fileName, text) {

    fileName = fileName + new Date().format("yyyyMMddhhmmss") + ".starter";
    console.log('downloadText', fileName);

    // type 的格式可以可以设置，可以把 appcation/json 设置进去，然后设置导出的类型
    const blob = new Blob([text],{ type:'charset=utf-8' });
    // 兼容ie和360浏览器
    if(window.navigator && window.navigator.msSaveOrOpenBlob){
        //  fileName需要指定后缀类型例：.starter
        window.navigator.msSaveOrOpenBlob(blob, fileName);
    }else {
        let url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);   // 删除节点
        window.URL.revokeObjectURL(url);  // 释放blob对象
    }
};

/**
 * 检查事件源，判断是否为对应 class 元素发起的事件。不会检索父元素
 * @param e
 * @param key
 * @returns {boolean}
 */
const checkEventSourceClassOnce = function (e, key) {
    let check = false;

    try {
        if (e === null) {
            return check;
        }
        let element = e.target;
        if (element === undefined || element === null) {
            return check;
        }

        let className = element.className;
        if (className === undefined || className === null || className === '') {
            return check;
        }

        if (!className instanceof String) {
            return check;
        }
        if (className instanceof SVGAnimatedString) {
            className = className.baseVal || '';
        }

        // console.log('once click check', className);
        let classNameArray = className.split(' ');
        for (let item of classNameArray) {
            if (item === key) {
                check = true;
                return check;
            }
        }

    } catch (e) {
        console.log('checkEventSourceClass has exception', e);
    }

    return check;
};

/**
 * 检查事件源，判断是否为对应 class 元素发起的事件。会检索父元素，直到匹配到 class 名
 * @param e
 * @param key
 * @returns {boolean}
 */
const checkEventSourceClass = function(e, key) {
    // let path = e.path;
    // let target = e.target;
    let check = false;

    try {
        let path = getPath(e);
        // console.log(path);

        if (path === undefined || path === null || path.length === 0) {
            return false;
        }

        for(let element of path) {
            if (element === undefined || element === null) {
                continue;
            }

            let className = element.className;
            if (className === undefined || className === null || className === '') {
                continue
            }

            if (!className instanceof String) {
                continue;
            }
            if (className instanceof SVGAnimatedString) {
                // console.log('className', className);
                className = className.baseVal || '';
            }

            // console.log("source click check", className);
            let classNameArray = className.split(' ');
            for (let item of classNameArray) {
                // let reg = new RegExp("\\b" + item + "\\b");

                // let result = reg.test(key);

                // if (key === 'search-input') {
                //     console.log(key, ":", item, result);
                // }

                if (item === key) {
                    check = true;
                    return check;
                }
            }

            // console.log(className);
            // if (className !== undefined && className !== null && className !== '') {
            //     let reg = new RegExp("\\b" + className + "\\b");
            //     console.log(key, ":", className, reg.test(key));
            //     // 点击了应用区内的item
            //     if (reg.test(key)) {
            //         check = true;
            //     }
            // }
        }
    } catch (e) {
        console.log('checkEventSourceClass has exception', e);
    }

    return check;
};

/**
 * 获取事件的元素路径
 * @param e
 * @returns {SVGPathElement}
 */
const getPath = function(e) {
    let path = e.path;
    if (path !== undefined && path !== null && path.length !== 0) {
        return path;
    }

    let target = e.target;
    if (target !== undefined && target !== null) {
        path = [];
        path.push(target);
        recursionGetPath(target, path);
        // console.log(path);
    }
    return path;
};

/**
 * 递归获取事件的父元素
 * @param node
 * @param path
 */
const recursionGetPath = function(node, path) {
    let parentNode = node.parentNode;
    if (parentNode === undefined || parentNode === null) {
        return;
    }
    path.push(parentNode);
    recursionGetPath(parentNode, path);
};

/**
 * 复制指定文本到剪贴板
 * @param text
 * @returns {boolean}
 */
const copyText = function (text) {
    if (text == null || text === '') {
        return true;
    }
    let textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand("copy");
    } catch (err) {
        console.log('复制文本到剪贴板失败', err);
        return false;
    } finally {
        document.body.removeChild(textArea);
    }
    return true;
};

/**
 * 从剪贴板读取文本
 * @returns {string}
 */
const pasteText = async function () {
    try {
        return await navigator.clipboard.readText().catch((e) => {console.log(e);});
    } catch (err) {
        console.log('读取剪贴板失败', err);
        return "";
    }
};

/**
 * 取出url
 * @param s
 * @returns {null}
 */
const getStrUrl = function(s) {
    // var reg= /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
    let reg= /(https?|http|ftp|file)?:?\/\/?([^\/\n]+)?/gi;
    s = s.match(reg);
    return(s&&s.length?s[0]:null);
};

/**
 * 全局转为黑暗/明亮主题
 */
const toDark = function (dark) {
    const darkId = 'dark-style';
    if (dark) { // 黑暗主题
        console.log('set dark');
        const style = `
        html {
            background-color: rgba(255, 255, 255) !important;
            filter: invert(1) contrast(0.95) !important;
        }
        /*iframe {
            background-color: rgba(255, 255, 255) !important;
            filter: invert(1) contrast(0.95) !important;
        }
        img {
            filter: invert(1) contrast(0.95) !important;
        }*/
        `;
        const styleElement = document.createElement('style');
        styleElement.id = darkId;
        styleElement.textContent = style;
        document.head.append(styleElement);
        console.log('set dark end');
    } else {
        console.log('remove dark');
        let styleElement = document.getElementById(darkId);
        if (styleElement) {
            styleElement.remove();
            console.log('remove dark end');
        }
    }
};

/**
 * 获取元素在页面的绝对坐标值
 * @param node
 * @returns {{left: number, top: number}}
 */
const getPosition = function(node) {
    //获取元素相对于其父元素的left值var left
    let left = node.offsetLeft;
    let top = node.offsetTop;
    // 取得元素的offsetParent
    let current = node.offsetParent;

    // 一直循环直到根元素
    while(current != null) {
        left += current.offsetLeft;
        top += current.offsetTop;
        current = current.offsetParent;
    }
    return {
        "left": left,
        "top": top
    }
};

export default {
    getPath,
    toDark,
    deepClone,
    sortAsc,
    sortDesc,
    setRootCssValue,
    getRootCssValue,
    randomSort,
    downloadPicture,
    downloadText,
    checkEventSourceClass,
    checkEventSourceClassOnce,
    copyText,
    pasteText,
    getStrUrl,
    getPosition,
};
