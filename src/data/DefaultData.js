// 系统默认数据

import IndexedDb from "../utils/IndexedDb";
import Date from '@/utils/OriginExpand';
import {CategoryType, Backup, SearchType, Category, Card, Icon} from "./Entity";

const SEARCH_TYPE = [
    new SearchType("百度", "https://www.baidu.com/s?ie=UTF-8&wd="),
    new SearchType("必应", "https://cn.bing.com/search?q="),
    new SearchType("谷歌", "https://www.google.com/search?q="),
];

const CATEGORY = [
    new Category("Home", CategoryType.ICON),
    new Category("常用", CategoryType.CARD),
];

const APPLICATION = [
    new Icon("Home", CategoryType.ICON, "哔哩哔哩", "https://www.bilibili.com", "https://files.codelife.cc/website/bilibili2.svg", 1),
    new Icon("Home", CategoryType.ICON, "音乐磁场", "https://www.hifini.com/sg_sign.htm", "https://files.codelife.cc/icons/www.hifini.com.svg", 1),
    new Icon("Home", CategoryType.ICON, "吾爱破解论坛", "https://www.52pojie.cn/forum.php?mod=guide&view=hot", "https://files.codelife.cc/icons/52pojie.svg", 1),
    new Card("常用", CategoryType.CARD, "开发工具",
        [
            {name: "sql美化", url: "https://tool.lu/sql/"},
            {name: "大小写转换", url: "https://www.iamwawa.cn/daxiaoxie.html"},
            {name: "时间戳转换", url: "https://tool.lu/timestamp/"},
            {name: "element-UI", url: "https://element.eleme.io/#/zh-CN/component/icon"},
            {name: "JSON格式转换", url: "https://www.bejson.com/"},
        ]
    ),
    new Card("常用", CategoryType.CARD, "常用",
        [
            {name: "文本比对", url: "https://www.jq22.com/textDifference"},
            {name: "腾讯文档", url: "https://docs.qq.com/desktop//"},
            {name: "表情", url: "https://fabiaoqing.com/"}
        ]
    ),
];

// setting 库
const SETTING = [
    {
        bgBlur: 5, // 背景模糊
        bgMaskRgba: 0.1, // 遮罩透明度
        bgUrl: '',
        bgSource:'',
        iconRadius: 40,
        iconSize: 80,
        cardHeight: 190,
        cardWidth: 170,
        iconOpacity: 100,
        cardOpacity: 100,
        iconMargin: 15,
        cardMargin: 10,
        formatTime: 'hh:mm',
        formatDate: 'MM-dd EEE',
        formatDateList: ['月日', 'MM-dd', " EEE"],
        openNewTabCard: true,
        openNewTabIcon: true,
        openHistory: true,
        openSuggest: true,
    }
];

// backup 库
const BACKUP = [
    new Backup("初始数据", new Date().format("yyyy-MM-dd hh:mm:ss"), [
        {
            database: IndexedDb.DATABASE.STARTER,
            table: IndexedDb.STARTER_TABLE_NAME.SEARCH_TYPE,
            data: SEARCH_TYPE
        },
        {
            database: IndexedDb.DATABASE.STARTER,
            table: IndexedDb.STARTER_TABLE_NAME.CATEGORY,
            data: CATEGORY
        },
        {
            database: IndexedDb.DATABASE.STARTER,
            table: IndexedDb.STARTER_TABLE_NAME.APPLICATION,
            data: APPLICATION
        },
        {
            database: IndexedDb.DATABASE.SETTING,
            table: IndexedDb.SETTING_TABLE_NAME.SETTING,
            data: SETTING
        }
    ])
];

const COLOR = [
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgba(255,120,0,0.89)',
    'rgba(255,215,0,0.82)',
    'rgba(144,238,144,0.8)',
    'hsla(181,100%,37%,0.74)',
    'hsla(209,100%,56%,0.73)',
    'rgba(199,21,133,0.47)'
];

export default {
    SEARCH_TYPE,
    CATEGORY,
    APPLICATION,
    SETTING,
    BACKUP,
    COLOR
};
