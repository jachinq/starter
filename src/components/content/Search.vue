<!-- 搜索栏 -->

<template>
    <div v-if='isShowSearch' class="search cent-box" ref="search">
        <div class="flex-col control-search">
            <!-- 搜索框 -->
            <div class="search-box-wrap effect-ground-grass"
                 :class="{'input-focus' : isShowHistory() || isShowSuggest()}">
                <!-- 搜索方式 -->
                <div ref="searchType" class="select-engine-box control-item-engine"
                     @contextmenu="rightClickItem(searchType)"
                     @mouseenter="mouseHover('searchTypeIcon')"
                     @mouseleave="mouseOut('searchTypeIcon')"
                     @click="onSearchTypeChange">

                    <div v-if="(searchType.icon && searchType.icon !== '')" class="engine-icon">
                        <template v-if="searchType.iconType === 2">
                            <div class="engine-svg" v-html="searchType.icon"></div>
                        </template>
                        <template v-else-if="searchType.icon && searchType.icon !== ''">
                            <div class="engine-svg">
                                <el-image :src="searchType.icon" style="width: var(--search-icon-size);height: auto" fit="cover"></el-image>
                            </div>
                        </template>
                    </div>

                    <span v-else class="select-engine-text">{{searchType.name}}</span>
                </div>

                <!-- 搜索输入框 -->
                <div class="input-box">
                    <input class="search-input" ref="searchInput" v-model="searchText" placeholder="输入搜索内容"
                            :style="searchType.name? '':'margin-left:62px'"
                            @keyup.enter="goSearch(searchText)"
                            @keyup.down="changeSuggest('down')"
                            @keyup.up="changeSuggest('up')"
                            @focusin="focusInput"
                            @input="onInputChange"
                    />
                </div>

                <div style="margin-right: 20px" v-if="searchText!==''" @click="searchText=''"><i class="el-icon-close search-icon"></i></div>

                <!-- 搜索图标 -->
                <!--<div style="margin: 0 20px 0 0;font-size: 20px">-->
                    <!--<i class="el-icon-search search-icon" @click="goSearch(searchText)"></i>-->
                <!--</div>-->
            </div>

            <!-- 搜索引擎 -->
            <div class="engine-wrap effect-ground-grass" v-if="openSearchTypeSelect">
                <div class='engine-option' v-for="item in searchTypes" @click="changeSearchType(item)">
                    <div class="engine-option-item">
                        <div v-if="(item.icon && item.icon !== '')" class="engine-icon" style="margin: 0 5px 0 0">
                            <template v-if="item.iconType === 2">
                                <div class="engine-svg" v-html="item.icon"></div>
                            </template>
                            <template v-else-if="item.icon && item.icon !== ''">
                                <div class="engine-svg">
                                    <el-image :src="searchType.icon" fit="cover"
                                            style="width: var(--search-icon-size);height: auto">
                                    </el-image>
                                </div>
                            </template>
                        </div>

                        <span>{{item.name}}</span>
                    </div>
                </div>
                <div class='engine-option' @click="addSearchType"><i class="el-icon-plus"></i></div>
            </div>

            <!-- 搜索建议 -->
            <div class="input-help-wrap effect-ground-grass" v-if="isShowSuggest()">
                <div v-for="(item, index) in searchSuggests" :key="index" class="search-suggest"
                     :class="{'active-suggest': activeSuggest === index}"
                     @keyup.enter="goSearch(item)"
                     @click="goSearch(item)">
                    <div>
                        <i class="el-icon-search search-icon"></i>
                        <span class="search-suggest-text">{{item}}</span>
                    </div>
                </div>
            </div>

            <!-- 搜索历史 -->
            <div class="history-wrap effect-ground-grass" v-if="isShowHistory()">
                <div class="history-title-box">
                    <div class="history-title">搜索历史</div>
                    <div class="history-clear" @click="clearHistory('all')">清空</div>
                </div>
                <div class="history-content-box">
                    <div v-for="(item, index) in searchHistories" :key="index" class="history-item" @click="goSearch(item.text)">
                        <div class="history-item-txt text-hidden">{{item.text}}</div>
                        <div class="history-item-clear" @click="clearHistory('item', index)"><i class="el-icon-error"></i></div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import IndexedDb from '@/utils/IndexedDb';
    import Util from '@/utils/Util';
    import EventBus from "../../data/EventBus";
    import {History} from "../../data/Entity";
    import {Jsonp} from "../../utils/Jsonp";
    import {isChromeExtension} from "../../../public/js/chrome";
    import {sendChromeMsg} from "../../../public/js/sendmsg";

    import SearchType from "../setting/EngineForm";

    export default {
        name: "Search",
        component: {
            SearchType,
        },
        data() {
            return {
                isShowSearch: false,
                searchText: '',
                openSearchTypeSelect: false,
                searchTypes: [],
                searchType: {},

                startInput: false,
                searchSuggests: [], //["163邮箱","126邮箱","123", "139邮箱", "12306官网", "1688批发网阿里巴巴1688批发网阿里巴巴1688批发网阿里巴巴1688批发网阿里巴巴1688批发网阿里巴巴1688批发网阿里巴巴", "126邮箱登陆"],

                showHistory: false,
                searchHistories: [],
                clickClearHistory: false,
                inputTimeStamp: 0,
                activeSuggest: -1,

                timer: null, // 定时器，监听输入，当输入停止才去请求搜索建议

                openHistory: true,
                openSuggest: true,
                searchTypeName: '',
            }
        },
        async created() {
            await this.getSetting().catch(e=>{console.log(e)});
            // console.log(this.openSuggest, this.openHistory);
            await this.getSearchTypes().catch(e=>{console.log(e)});

            if (this.openHistory) {
                await this.getHistory().catch(e=>{console.log(e)});
            }
            // this.$refs.search.style.display = 'flex';
            this.isShowSearch = true;
            // console.log('搜索组件加载完毕', new Date());
        },
        watch: {
            searchText: function (val) {
                // console.log(val);
                if (val === null || val === undefined || val === '') {
                    this.startInput = false;
                } else {
                    this.startInput = true;
                }
            }
        },
        mounted() {
            this.$bus.$on(EventBus.MouseLeftClick, (e) => {
                if ((this.isShowSuggest() || this.isShowHistory()) && !Util.checkEventSourceClass(e, 'control-search')) {
                    this.startInput = false; // 关闭输入建议显示
                    this.showHistory = false; // 关闭历史显示
                    if (this.$refs.searchInput) this.$refs.searchInput.blur(); // 输入搜索框失去焦点
                }

                if (this.openSearchTypeSelect
                    && !Util.checkEventSourceClass(e, 'select-engine-box')
                    && !Util.checkEventSourceClass(e, 'engine-wrap')) {
                    this.openSearchTypeSelect = false;
                }
            });

            this.$bus.$on(EventBus.RefreshSearchType, (data) => {
                if (data && data.name) {
                    this.searchTypeName = data.name;
                }
                this.getSearchTypes();
            });

            this.$bus.$on(EventBus.MouseScroll, () => { // 监听鼠标滚轮事件，设置动画效果
                this.openSearchTypeSelect = false; // 关闭搜索方式选择
                this.startInput = false; // 关闭输入建议显示
                this.showHistory = false; // 关闭历史显示
                if (this.$refs.searchInput) this.$refs.searchInput.blur(); // 输入搜索框失去焦点

            });

            this.$bus.$on(EventBus.RefreshSearchSetting, () => {
                this.getSetting();
            });

            this.$bus.$on(EventBus.PasteSearchText, async () => {
                let text = await Util.pasteText().catch(e=>{console.log(e)});
                if (text) {
                    text = text.trim();
                    if (text !== '') this.goSearch(text);
                }
            });

            // 监听右键菜单操作
            this.$bus.$on(EventBus.MenuEditEngine, async (data) => {
                if (data !== null) {
                    if (data.type === 'batch') {
                        let item = data.item;
                        if (item !== undefined && item !== null) {
                            let result = await this.$confirm('确定删除搜索引擎：' + item.name + '?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).catch(e => {
                            });
                            if (result) {
                                result = await IndexedDb.delSearchType(item).catch(e => {console.log(e)});
                                if (result && result.success) {
                                    this.$bus.$emit(EventBus.RefreshSearchType);
                                }
                            }
                        }
                    } else if (data.type === 'single') {
                        if (data.item) {
                            this.$bus.$emit(EventBus.OpenDrawSearchType, {searchTypeOptType: 'set', item: data.item});
                        }
                    }
                }

            });
        },
        methods: {
            // 数据获取:获取搜索方式
            async getSearchTypes() {
                let result = await IndexedDb.getSearchType().catch(e=>{console.log(e);});
                if (result && result.success) {
                    this.searchTypes = result.data;
                }

                let matchEngine = false;
                if (this.searchTypeName != null && this.searchType !== '') {
                    for (let item of this.searchTypes) {
                        if (item.name === this.searchTypeName) {
                            this.searchType = item;
                            matchEngine = true;
                            break;
                        }
                    }
                }

                if (!matchEngine) {
                    // 没设置的话，取默认第一个
                    if (this.searchTypes && this.searchTypes.length > 0) {
                        this.searchType = this.searchTypes[0];
                    }
                }

                // console.log('test', this.searchType.name, matchEngine, this.searchTypeName);

                // data test
                // for (let i = 0; i < 100; i++) {
                //     this.searchTypes.push({name: 'url' + i, url: '', icon: ''});
                // }
            },
            async getHistory() {
                let result = await IndexedDb.getHistory();
                // console.log(result);
                if (result && result.success) {
                    this.searchHistories = result.data;
                }

                // data test
                // for (let i = 0; i < 100; i++) {
                //     this.searchHistories.push({text: "111"});
                // }
            },
            async getSetting() {
                let result = await IndexedDb.getSetting();
                if (result.success && result.data) {
                    if (result.data.length > 0) {
                        let setting = result.data[0];
                        this.openHistory = setting.openHistory === null || setting.openHistory === undefined ? true : setting.openHistory;
                        this.openSuggest = setting.openSuggest === null || setting.openSuggest === undefined ? true : setting.openSuggest;
                        this.searchTypeName = setting.searchTypeName;
                        // console.log(this.openSuggest, this.openHistory);
                    }
                }
            },

            // 跳转查询
            goSearch(txt) {
                if (this.clickClearHistory) {
                    this.clickClearHistory = false;
                    return;
                }
                if (txt) {
                    this.searchText = txt;
                    this.startInput = false;
                }
                // if (this.activeSuggest >= 0) {
                //     this.searchText = this.searchSuggests[this.activeSuggest];
                // }

                if (this.searchText && this.searchText !== '') {
                    let url = this.searchType.url + this.searchText;
                    console.log(url);
                    window.top.open(url);

                    this.dataPushHistory(this.searchText);
                }
            },
            // 更改搜索方式
            async changeSearchType(item) {
                // console.log(this.searchTypes);
                // console.log(this.searchType);
                this.searchType = item;
                this.searchTypeName = item.name;
                this.openSearchTypeSelect = false;

                let result = await IndexedDb.getSetting();
                if (result.success && result.data) {
                    if (result.data.length > 0) {
                        let setting = result.data[0];
                        if (setting) {
                            setting.searchTypeName = item.name;
                        }
                        await IndexedDb.setSetting(setting);
                    }
                }
            },

            // 监听输入框输入
            async onInputChange(e) {
               this.delayTimer(0);
            },
            // 定时器延时
            delayTimer(i){
                let j = 1;
                //避免开启多个计时器
                clearInterval(this.timer);

                let that = this;
                this.timer = setInterval(async () => {
                    // console.log(this.timer, i, j);
                    ++i;
                    if (i === j) {

                        await that.getSuggestions();

                        clearInterval(this.timer);
                    }
                }, 300);
            },

            // 获取搜索建议
            async getSuggestions() {
                this.searchSuggests = [];
                if (!this.isOpenSuggest()) {
                    return;
                }
                let newVal = this.searchText;
                if (!newVal || newVal === '') {
                    return;
                }

                let that = this;
                let url = "https://api.bing.com/qsonhs.aspx";

                // 谷歌插件，走后台服务完成跨域请求
                if (isChromeExtension()) {
                    sendChromeMsg({
                        type: 'get',
                        url: url + "?q=" + that.searchText,
                    }).then(result => {
                        that.searchSuggests = [];
                        if (that.searchText) {
                            if (result && result.AS && result.AS.Results) {
                                result.AS.Results.forEach(item => {
                                    if (item && item.Type === 'AS') {
                                        item['Suggests'].forEach(item => {
                                            if (item && item.Txt) {
                                                that.searchSuggests.push(item.Txt);
                                            }
                                        })
                                    }
                                });
                                that.activeSuggest = -1;
                            }
                        }
                    }).catch(error => {
                        that.searchSuggests = [];
                        console.log('isChromeExtension get url error', error);
                    })
                } else {
                    // 非谷歌插件，走 Jsonp 完成跨域请求

                    Jsonp({
                        url: url,
                        callback: 'jsonpCallback',
                        param: {
                            type: 'cb',
                            cb: 'jsonpCallback',
                            q: newVal,
                        },
                        success: function (result) {
                            // console.log(result);
                            that.searchSuggests = [];
                            if (that.searchText) {
                                if (result && result.AS && result.AS.Results) {
                                    result.AS.Results.forEach(item => {
                                        if (item && item.Type === 'AS') {
                                            item['Suggests'].forEach(item => {
                                                if (item && item.Txt) {
                                                    that.searchSuggests.push(item.Txt);
                                                }
                                            })
                                        }
                                    });
                                    that.activeSuggest = -1;
                                }
                            }
                        },
                        error: function () {
                            that.searchSuggests = [];
                        }
                    });
                }
            },

            // 监听键盘事件,选择建议
            changeSuggest(type) {
                if (!this.isOpenSuggest()) {
                    return;
                }
                // console.log(type);
                let index = this.activeSuggest;
                let list = this.searchSuggests;
                if ('down' === type) {
                    this.activeSuggest = (index + 1) % list.length;
                    // console.log(indexMove);
                }
                else if ('up' === type) {
                    this.activeSuggest = (list.length + index - 1) % list.length;
                    // console.log(indexMove);
                }
                this.searchText = list[this.activeSuggest];
            },

            mouseHover(type) {
                if (type === 'searchTypeIcon') {
                    if (this.isShowHistory() || this.isShowSuggest()) {
                        return
                    }
                    let el = this.$refs.searchType;
                    el.classList.add('select-engine-hover');
                }
            },
            mouseOut(type) {
                if (type === 'searchTypeIcon') {
                    let el = this.$refs.searchType;
                    el.classList.remove('select-engine-hover');
                }
            },



            // 数据交互: 新增历史记录, 去重
            dataPushHistory(searchText) {
                if (!this.isOpenHistory()) {
                    return;
                }
                let that = this;
                if (!searchText) {
                    return;
                }

                let sameTxt = false;
                let max = 0;
                this.searchHistories.forEach(item => {
                    if (item.text) {
                        if (item.text === this.searchText) {
                            sameTxt = true;
                        }
                        if (item.sort && item.sort > max) {
                            max = item.sort;
                        }
                    }
                });
                if (sameTxt) {
                    return;
                }

                max += 1;
                let history = new History(searchText, max);
                // this.searchHistories.push(history);
                IndexedDb.addHistory(history).then(result => {
                    if (result && result.success) {
                        that.getHistory();
                    } else {
                        console.log(result);
                    }
                }).catch(e=>{console.log(e)});

            },

            // 删除历史记录
            clearHistory(type, index) {
                this.clickClearHistory = true;
                if ('all' === type) {
                    this.searchHistories.forEach(item => {
                        IndexedDb.delHistory(item).then(result=> {
                            if (result && !result.success) {
                                console.log(result);
                            }
                        }).catch(e=>{console.log(e)})
                    });
                    this.searchHistories = [];
                }

                else if ('item' === type && this.searchHistories && this.searchHistories.length > 0) {
                    let history = this.searchHistories[index];
                    if (history) {
                        IndexedDb.delHistory(history).then(result => {
                            if (result && !result.success) {
                                console.log(result);
                            }
                        }).catch(e=>{console.log(e)});
                        this.searchHistories.splice(index, 1);
                    }
                }
            },

            // 激活输入框
            focusInput() {
                this.startInput = true;
                this.showHistory = true;
            },

            // 新增搜索方式
            addSearchType() {
                if (this.searchTypes && this.searchTypes.length > 50) {
                    this.$notify({
                        title: '提示',
                        message: '自定义搜索方式已达上限',
                        type: 'warning'
                    });
                    return;
                }
                // console.log("add");
                this.$bus.$emit(EventBus.OpenDrawSearchType, {searchTypeOptType: 'add'})
            },
            // 点击搜索方式
            onSearchTypeChange() {
                this.openSearchTypeSelect = !this.openSearchTypeSelect;
                this.startInput = false; // 关闭输入建议显示
                this.showHistory = false; // 关闭历史显示
            },

            isOpenHistory() {return this.openHistory},
            isOpenSuggest() {return this.openSuggest},

            // 显示历史记录
            isShowHistory() {
                if (!this.isOpenHistory()) {
                    return false;
                }
                if (!this.showHistory) {
                    return false;
                }
                if (this.searchHistories.length <= 0) {
                    return false;
                }
                if (this.searchText !== '') {
                    return false;
                }

                return true;
            },
            // 显示搜索建议
            isShowSuggest() {
                if (!this.isOpenSuggest()) {
                    return false;
                }
                if (!this.startInput) {
                    return false;
                }

                if (this.searchText === '') {
                    return false;
                }
                if (this.searchSuggests.length <= 0) {
                    return false
                }

                return true;
            },

            // 右键搜索引擎
            rightClickItem(item) {
                // 把当前右键的数据，传送给菜单组件，保存起来等待下一步操作
                this.$bus.$emit(EventBus.RecordEditItem, item);
            },
        }

    }
</script>

<style scoped>
    /* 毛玻璃效果 */
    .effect-ground-grass {
        color: var(--color-text);
        background: rgba(64, 64, 64, 0.27);
        backdrop-filter: blur(5px);
        /*filter: drop-shadow(0px 2px 7px rgba(137, 137, 137, 0.5));*/
    }

    /*搜索区*/
    .search {
        /*display: none;*/
        width: 100%;
        --min-width: 250px;
        --color-text: #e6e6e6;
        --color-text-hover: white;
        --color-background: rgba(87, 87, 87, 0.32);
        --search-icon-size: 24px;
        --search-box-height: 50px;
    }

    .flex-col {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        width: 35%;
        min-width: var(--min-width);
    }

    .search-box-wrap {
        display: flex;
        border-radius: 50px;
        height: var(--search-box-height);
        /*background: white;*/
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
    }

    .input-focus {
        border-radius: calc(var(--search-box-height) / 2) calc(var(--search-box-height) / 2) 0 0;
    }

    .select-engine-box {
        /*width: 50px;*/
        background: transparent;
        user-select: none;
        cursor: pointer;
        display: flex;
        height: var(--search-box-height);
        border-radius: 50px 0 0 50px;
        box-sizing: border-box;
    }

    .select-engine-hover {
        background: rgba(87, 87, 87, 0.16);
    }

    .select-engine-text {
        line-height: var(--search-box-height);
        max-width: 80px;
        margin: 0 10px 0 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
        float: left;
    }

    .input-box {
        width: 100%;
        margin-left: 4px;
    }

    .input-box input {
        font-family: 'LXGW WenKai', Avenir, Helvetica, Arial, sans-serif;
        width: 100%;
        background: transparent;
        border: none;
        font-size: 16px;
        color: var(--color-text);
    }

    .input-box input:focus {
        /*background: gray;*/
        outline: none;
        caret-color: var(--color-text); /*将input框光标改颜色*/
    }
    input:-moz-placeholder, textarea:-moz-placeholder {
        color: var(--color-text); /*将input框默认提示文字改颜色*/
    }
    input:-ms-input-placeholder, textarea:-ms-input-placeholder {
        color: var(--color-text);
    }
    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
        color: var(--color-text);
    }


    /* 搜索引擎 */
    .engine-wrap {
        margin-top: calc(var(--search-box-height) + 10px);
        position: absolute;

        min-width: var(--min-width);
        width: 35%;
        max-height: 220px;
        display: flex;
        overflow-y: scroll !important;
        flex-wrap: wrap; /*流式布局自动换行*/
        border-radius: 20px;
        padding: 6px 10px;
        box-sizing: border-box; /*避免padding撑大div*/
        z-index: 1;
    }

    .engine-option {
        margin: 2px 5px;
        padding: 5px 10px;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        align-content: center;
    }

    .engine-option:hover {
        background: var(--color-background);
        /*transform: translateY(-2px);*/
    }

    .engine-option-item {
        display: flex;
        justify-content: center;
        flex-wrap: nowrap;
        align-items: center;
    }

    .search-icon:hover {
        color: var(--color-text-hover);
    }

    .search-icon {
        cursor: pointer;
        margin-left: 10px;
    }

    .engine-icon {
        display: flex;
        margin: 0 10px 0 14px;
        justify-content: center;
        align-items: center;
    }

    .engine-svg {
        height: var(--search-icon-size);
        width: var(--search-icon-size);
    }

    /* 搜索建议 */
    .input-help-wrap {
        position: absolute;
        margin-top: var(--search-box-height);
        width: 35%;
        min-width: var(--min-width);
        border-radius: 0 0 calc(var(--search-box-height) / 2) calc(var(--search-box-height) / 2);
        z-index: 1;
        box-sizing: border-box;
    }

    .search-suggest {
        padding: 3px 0 3px 4px;
    }
    .search-suggest-text {
        margin-left: 16px;
    }

    .search-suggest:nth-last-child(1) {
        border-radius: 0 0 calc(var(--search-box-height) / 2) calc(var(--search-box-height) / 2);
    }

    .active-suggest,.search-suggest:hover {
        background-color: var(--color-background);
        cursor: pointer;
    }

    /* 搜索历史 */
    .history-wrap{
        width: 35%;
        min-width: var(--min-width);
        position: absolute;
        margin-top: var(--search-box-height);
        border-radius: 0 0 calc(var(--search-box-height) / 2) calc(var(--search-box-height) / 2);
        padding-bottom: 10px;
        z-index: 1;
        box-sizing: border-box;
        overflow-y: scroll !important;
    }

    .history-title-box {
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .history-title {
        padding: 5px 0;
        height: 24px;
        font-size: 16px;
        line-height: 24px;
    }
    .history-clear {
        font-size: 12px;
        line-height: 15px;
        height: 15px;
        color: var(--color-text);
        cursor: pointer;
        padding: 2px 5px;
        border-radius: 5px;
    }

    .history-content-box {
        padding: 10px 20px 0 20px;
        display: flex;
        flex-wrap: wrap;
        margin-right: 5px;
        margin-bottom: 4px;
        max-height: 300px;
        overflow-y: auto;
        justify-content: space-between;
    }

    .history-item {
        /*display: inline-block;*/
        /*background-color: #e8e8e8;*/
        /*max-width: 100px;*/
        /*box-sizing: border-box;*/
        /*border-radius: 5px;*/
        /*padding: 5px 20px;*/
        /*margin-right: 10px;*/

        position: relative;
        box-sizing: border-box;
        height: 30px;
        padding: 7px 10px 8px;
        font-size: 12px;
        line-height: 15px;
        background: var(--color-background);
        border-radius: 4px;
        margin-right: 10px;
        margin-bottom: 10px;
        cursor: pointer;
    }

    .history-item-clear {
        display: none;
        box-sizing: border-box;
        position: absolute;
        width: 16px;
        height: 16px;
        top: -6px;
        right: -6px;
        padding: 2px;
        color: var(--color-text);
    }
    .history-item-clear:hover {
        transform: scale(1.3);
        color: var(--color-text-hover);
    }

    .history-item-txt {
        max-width: 100px;

    }

    .history-item:hover .history-item-clear{
        display: block;
    }
    .history-item:hover .history-item-txt{
        color: var(--color-text-hover);
    }

    .history-clear:hover {
        background-color: var(--color-background);
        color: var(--color-text-hover);
    }
</style>
