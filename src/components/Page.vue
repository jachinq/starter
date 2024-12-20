<template>
    <div class="page" v-cloak @click="leftClick" @mousewheel="handleWheel" @contextmenu.prevent="rightClick">

        <!--<el-button @click="toDark">黑暗</el-button>-->

        <!-- 左侧导航 -->
        <Navigation/>

        <div class="control-content">
            <!-- 日期和时间 -->
            <Clock/>

            <!-- 搜索框 -->
            <Search/>

            <!-- 应用区 -->
            <AppList/>
        </div>

        <!-- 右键菜单 -->
        <Menu/>

        <!-- 壁纸 -->
        <Background/>

        <!-- 设置 -->
        <Setting/>

    </div>
</template>

<script>

    import Util from '../utils/Util';
    import IndexedDb from '../utils/IndexedDb';
    import DefaultData from "../data/DefaultData";
    import EventBus from "../data/EventBus";

    import Navigation from '../components/layout/Navigation'
    import Clock from '../components/content/Clock'
    import Search from '../components/content/Search'
    import AppList from '../components/content/AppList'
    import Menu from '../components/content/Menu'
    import Setting from '../components/setting/Setting'
    import Background from "../components/content/Background";

    export default {
        name: "Page",
        components: {
            Navigation,
            Clock,
            Search,
            AppList,
            Menu,
            Setting,
            Background
        },
        data() {
            return{
                dark: false,
            }
        },
        created: function () {
            this.buildDefaultData();
        },
        methods: {
            async buildDefaultData() {
                try {
                    let result = await IndexedDb.getSetting().catch(e=>{console.log(e)});
                    if (result && result.success) {
                        if (result.data && result.data.length > 0) {
                            console.log("不需要初始化数据");
                            return;
                        }
                    }
                } catch (e) {
                    console.log('buildDefaultData exps', e);
                }

                for (let item of DefaultData.SEARCH_TYPE) {
                    if (item) IndexedDb.addSearchType(item).then().catch(e=>{console.log(e)});
                }
                for (let item of DefaultData.CATEGORY) {
                    if (item) IndexedDb.addCategory(item).then().catch(e=>{console.log(e)});
                }
                for (let item of DefaultData.APPLICATION) {
                    if (item) IndexedDb.addApplication(item).then().catch(e=>{console.log(e)});
                }
                for (let item of DefaultData.SETTING) {
                    if (item) IndexedDb.addSetting(item).then().catch(e=>{console.log(e)});
                }
                console.log(DefaultData.BACKUP);
            },

            // 操作交互：鼠标左键
            leftClick: function (e) {
                // console.log("全局鼠标左键", e);
                this.$bus.$emit(EventBus.MouseLeftClick, e);
            },

            // 操作交互：鼠标右键
            rightClick: function (e) {
                let that = this;
                // console.log('右键事件', e);

                let isStarter = Util.checkEventSourceClass(e, "page");
                let mask = Util.checkEventSourceClassOnce(e, "el-drawer__container");

                if (!isStarter || mask) {
                    return;
                }

                let type = '';
                // if (isIcon || isCard) {
                    // type = 'appShowDel';
                // }

                if (type === '') {
                    type = 'openMenu';
                }

                let params = {
                    type: type,
                    event: e,
                    // isIcon: isIcon,
                    // isCard: isCard,
                };

                this.$bus.$emit(EventBus.MouseRightClick, params);
            },

            // 操作交互：鼠标滚动事件
            handleWheel: function (e) {
                // console.log('全局鼠标滚动', e);

                let overCard = Util.checkEventSourceClass(e, "cus-card");
                let overSearchBox = Util.checkEventSourceClass(e, "control-search");
                let overSetting = false; //Util.checkEventSourceClass(e, "setting");
                let overContent = Util.checkEventSourceClass(e, "control-content");

                if (!overContent || overCard || overSearchBox || overSetting) {
                    return;
                }

                let upScroll = e.deltaY < 0; // 是否向上滚动
                this.$bus.$emit(EventBus.MouseScroll, upScroll);
            },
            toDark() {
                this.dark = !this.dark;
                Util.toDark(this.dark);
            },
        }
    }
</script>

<style scoped>
    .page {
        height: 100%;
        overflow-y: hidden;
        font-size: var(--font-size);
    }

    .control-content {
        height: 100%;
        overflow-y: hidden;
        font-size: 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        /*align-content: center;*/
        align-items: center;
        /*transition: all 1s;*/
    }

</style>
