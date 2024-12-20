<template>
    <div class="apps" v-if="true">

        <div v-for="(category, index) in categoryList" :key="index"
            v-if="showApplication && category.category === activeCategory.category"
            :class="category.category !== activeCategory.category ? 'hide-app' : 'show-app'"
            class="app-box">
            <template v-for="item in apps" v-if="item.category === activeCategory.category">

                <template v-if="item.type === 'icon'">
                    <div class="icon_wrap control-app-item"
                        @contextmenu="rightClickItem(item)"
                        @click="openUrl(item)">
                        <div class="icon_box">
                            <cus-avatar :type="item.iconType"
                                        :name="item.name"
                                        :content="item.icon"
                                        :background-color="item.color"
                            ></cus-avatar>
                        </div>
                        <div class="icon-text text-hidden" style="margin-top: 5px">{{item.name}}</div>
                        <i class="el-icon-error icon-del del-btn" v-if="isShowDelBtn" @click="delToolItem(item)"></i>
                    </div>
                </template>

                <template v-else-if="item.type === 'card'">
                    <div class="card_wrap control-app-item" @contextmenu="rightClickItem(item)" @mousemove="cardHover" >
                        <cus-card :style="`background-color: ${item.color};`">
                            <div slot="header">
                                <div class="hidden-text" :title="item.name">{{item.name}}</div>
                            </div>
                            <div>
                                <span class="card-item hidden-text" v-for="cont in item.list"
                                    @click="openUrl(cont)"
                                    :title="cont.name + cont.url">
                                    {{cont.name}}
                                </span>
                            </div>
                        </cus-card>
                        <i class="el-icon-error card-del del-btn" v-if="isShowDelBtn" @click="delToolItem(item)"></i>
                    </div>
                </template>

                <!--<div v-else>-->
                    <!--{{ item.name }}-->
                <!--</div>-->
            </template>

        </div>

    </div>
</template>

<script>
    import Util from '@/utils/Util';
    import IndexedDb from '@/utils/IndexedDb';
    import EventBus from "../../data/EventBus";
    import CusAvatar from "../formItem/cus-avatar";
    import CusCard from "../formItem/cus-card";

    export default {
        name: "AppList",
        components: {CusCard, CusAvatar},
        props: [],
        data() {
            return {
                setting: {},
                apps: [],
                appsSet: "",
                isShowDelBtn: false,
                activeCategory: {},
                categoryList: [],
                showApplication: true,

                longClick: false,
                timer: null, // 定时器
            }
        },
        watch: {},
        created() {
            this.getAppList();
            this.getSetting();
            // console.log('应用组件加载完毕', new Date());
        },
        mounted() {
            this.$bus.$on(EventBus.MouseScroll, (upScroll) => { // 监听鼠标滚轮事件，设置动画效果
                Util.setRootCssValue("--show-from", upScroll ? "-30px" : "60px");
            });


            this.$bus.$on(EventBus.MouseLeftClick, (e) => {
                if (this.searchTypeSelectActive && !Util.checkEventSourceClass(e, "search-type")) {
                    this.searchTypeSelectActive = false;
                }

                // 点击删除按钮或者是点击批量编辑菜单项时，不需要隐藏删除按钮，其他情况则隐藏
                if (!(Util.checkEventSourceClassOnce(e, "menu-item") || Util.checkEventSourceClassOnce(e, "del-btn"))) {
                    this.isShowDelBtn = false;
                }
            });

            this.$bus.$on(EventBus.MenuEditApp, (data) => {

                // console.log(data, this.isShowDelBtn);
                if (data !== null) {
                    if (data.type === 'batch') {
                        this.isShowDelBtn = true;
                    } else if (data.type === 'single') {
                        if (data.item) {
                            if (data.item.type === 'icon') {
                                // console.log('open', data.item.icon)
                                this.$bus.$emit(EventBus.OpenDrawIcon, {iconOptType: 'set', item: data.item});
                            }
                            else if (data.item.type === 'card') {
                                this.$bus.$emit(EventBus.OpenDrawCard, {cardOptType: 'set', item: data.item});
                            }
                        }
                    }
                }

            });

            this.$bus.$on(EventBus.RefreshCategory, () => {
                this.getAppList();
            });

            this.$bus.$on(EventBus.RefreshApp, () => {
                this.getAppList();
            });

            this.$bus.$on(EventBus.RefreshSearchSetting, () => {
                this.getSetting();
            });

            this.$bus.$on(EventBus.ActiveCategory, (data) => {
                this.activeCategory = data;
            });

            this.$bus.$on(EventBus.ClickClock, (data) => {
                this.showApplication = !data.miniMode;
            });
        },
        methods: {
            // 获取应用数据
            async getAppList() {
                let result = await IndexedDb.getApplication().catch(e=>{console.log(e)});
                console.log(result);
                if (result && result.success) {
                    this.apps = result.data;
                } else {
                    this.$message({type: 'error', message: '获取应用列表失败!'});
                }

                let resultCategory = await IndexedDb.getCategory().catch(e=>{console.log(e)});
                if (resultCategory.success) {
                    this.categoryList = resultCategory.data;
                } else {
                    this.$message({type: 'error', message: '获取分类列表失败!'});
                }
            },

            // 获取设置数据
            async getSetting() {
                let result = await IndexedDb.getSetting().catch(e=>{console.log(e)});
                if (result && result.success && result.data && result.data.length > 0) {
                    this.setting = result.data[0];
                }
            },


            // 视觉效果-卡片悬浮
            cardHover: function (e) {
                // console.log(e);
                // console.log("x=", e.pageX, ";y=", e.pageY);
                let root = document.querySelector(":root");

                const offsetX = e.offsetX;
                const offsetY = e.offsetY;
                const maxRotate = 15;

                const centerX = 170 / 2;
                const centerY = 190 / 2;

                // 将和原点的距离线性折算成旋转角度
                // X 方向移动旋转 Y 轴，Y 方向移动旋转 X 轴
                let rotateX = (maxRotate * (offsetY - centerY)) / (centerY) * -1;
                let rotateY = (maxRotate * (offsetX - centerX)) / (centerX);

                // root.style.setProperty("--roate-x", rotateX);
                // root.style.setProperty("--roate-y", rotateY);

                // console.log(rotateX, rotateY);

                // let a = getComputedStyle(root).getPropertyValue("--mouse-x-deg");
                // console.log(a);
            },

            // 图标点击打开新窗口
            openUrl: function (icon = {}) {
                if (this.isShowDelBtn) {
                    return;
                }
                
                const {url, type} = icon;
                const isIcon = type === "icon";
                const newTabKey = isIcon ? "openNewTabIcon" : "openNewTabCard";
                const newTab = this.setting === undefined ? true : this.setting[newTabKey];
                
                newTab ? window.top.open(url) : window.location.href= url;
            },

            // 数据交互：删除应用：卡片or图标
            delToolItem(item) {
                IndexedDb.delApplication(item).then((result) => {
                    if (result && result.success) {
                        this.getAppList();
                    } else {
                        this.$message({type: 'error', message: '保存应用列表失败!'});
                    }
                })
            },

            // 右键应用
            rightClickItem(item) {
                // 把当前右键的数据，传送给菜单组件，保存起来等待下一步操作
                this.$bus.$emit(EventBus.RecordEditItem, item);
            },

        }
    }
</script>

<style scoped>
@media screen and (max-width: 1100px) {
    .apps {
        width: 100% !important;
    }
}
@media screen and (max-width: 600px) {
    .apps {
        padding: 0 !important;
        display: flex;
        justify-content: center;
    }
}
@media screen and (max-width: 450px) {
    .app-box {
        flex-direction: column;
        flex-wrap: nowrap !important;
    }
}

    /*应用区*/
    .apps {
        padding: 0 150px;
        height: 100%;
        max-height: 100%;
        width: 70%;
        min-width: 250px;
        margin-top: 50px;
        overflow-y: auto;
        filter: blur(--app-blur);
    }

    .app-box {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: flex-start;
    }

    .hide-app {
        /*display: none;*/
        animation-name: hide;
        animation-duration: 0.2s;
    }

    .show-app {
        /*display: inline;*/
        animation-name: show;
        animation-duration: 0.5s;
    }




    .icon_wrap {
        width: var(--icon-size);
        height: var(--icon-size);
        border-radius: var(--icon-radius);
        opacity: calc(var(--icon-opacity) / 100);
        margin: var(--icon-margin);
        cursor: pointer;
        text-align: center;
        /*background: rgba(255, 255, 255, 0.27);*/
        background: var(--theme-background-app, rgba(255, 255, 255, 0.27));
        backdrop-filter: blur(8px);
    }

    .icon_wrap:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        filter: drop-shadow(0px 2px 7px var(--theme-shodow, rgba(0, 0, 0, .4)));
    }
    .icon_box {
        width: var(--icon-size);
        height: var(--icon-size);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.5);
    }

    .icon-text {
        text-align: center;
        margin-top: calc(var(--icon-size) + 5px);
        color: #f7f7f7;
        filter: drop-shadow(0px 2px 7px var(--theme-shodow, rgba(0, 0, 0, .8)));
        /* 80 ：16 = 40 : 8 */
        font-size: calc(var(--icon-size) *16 / 80);
        line-height: calc(var(--icon-size) *16 / 80);
        transition: font-weight,transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 0.5);
    }
    .icon_wrap:hover .icon_box {
        transform: scale(1.03);
    }

    .icon_wrap:hover .icon-text {
        font-weight: bolder;
        transform: translateY(2px);
    }


    .icon-del {
        position: relative;
        bottom: calc(var(--icon-size) + var(--icon-size) *16 / 80 + 15px);
        left: calc(var(--icon-size) / 2);
        color: #d8d8d8;
    }


    .card-item {
        display: block;
        min-height: 22px;
        box-sizing: border-box;
        margin: 0 0 5px 0;
        /* transition: transform 0.2s ease-in-out; */
    }

    .card-item:hover {
        cursor: pointer;
        /* filter: drop-shadow(0px 2px 7px var(--theme-shodow, rgba(0,0,0,.8))); */
        color: var(--theme-text-hover, #5891ff);
        /* text-decoration: underline; */
        /* font-style: italic; */
        transform: translateX(-2px);
    }

    .card-del {
        position: relative;
        top: calc(0px - var(--card-height) - 16px);
        right: calc(0px - var(--card-width));
        color: #d8d8d8;
    }

    .card-del:hover, .icon-del:hover {
        color: #ffffff;
    }
</style>
