<template>

    <div class="menu-box">
        <!--<div class="menu-mask"  @contextmenu.prevent="rightClick"></div>-->
        <!-- 右键菜单 -->
        <div id="rightKeyTab" v-show="showMenuTab">
            <!--<div class="menu-item" @click="downPic">-->
                <!--<i class="el-icon-download"></i>下载壁纸-->
            <!--</div>-->
            <template v-if="isSearchInput">
                <div class="menu-item" @click="clickMenuItem('eventPasteSearchText', {})">
                    <i class="el-icon-document-copy"></i> 粘贴并搜索
                </div>
            </template>

            <template v-else-if="isApp">
                <div class="menu-item" @click="clickMenuItem('eventMenuEditApp', {item: editItem, type: 'single'})">
                    <i class="el-icon-edit"></i> 编辑
                </div>
                <div class="menu-item" @click="clickMenuItem('eventMenuEditApp', {item: editItem, type: 'batch'})">
                    <i class="el-icon-delete"></i> 批量删除
                </div>
            </template>
            <template v-else-if="isEngine ">
                <div class="menu-item" @click="clickMenuItem('eventMenuEditEngine', {item: editItem, type: 'single'})">
                    <i class="el-icon-edit"></i> 编辑
                </div>
                <!--<div class="menu-item">-->
                    <!--<el-popconfirm-->
                            <!--confirm-button-text='好的'-->
                            <!--cancel-button-text='不用了'-->
                            <!--confirm-button-type="danger"-->
                            <!--icon="el-icon-info"-->
                            <!--icon-color="red"-->
                            <!--title="确定删除吗？"-->
                            <!--@confirm="clickMenuItem('eventMenuEditEngine', {item: editItem, type: 'batch'})">-->
                        <!--<span slot="reference" class="text-button" style="color: red"><i class="el-icon-delete"></i>删除</span>-->
                    <!--</el-popconfirm>-->
                <!--</div>-->
                <div class="menu-item" @click="clickMenuItem('eventMenuEditEngine', {item: editItem, type: 'batch'})">
                    <i class="el-icon-delete"></i> 删除
                </div>
            </template>
            <template v-else-if="isCategory ">
                <div class="menu-item" @click="clickMenuItem('eventMenuEditCategory', {item: editItem, type: 'single'})">
                    <i class="el-icon-edit"></i> 编辑
                </div>
                <div class="menu-item" @click="clickMenuItem('eventMenuEditCategory', {item: editItem, type: 'batch'})">
                    <i class="el-icon-delete"></i> 批量删除
                </div>
            </template>

            <template v-else>

                <div class="menu-item" @click="clickMenuItem('eventOpenBackground', {})">
                    <i class="el-icon-picture-outline-round"></i> 壁纸
                    <i @click.stop="downPic" class="icon-hover el-icon-download" title="下载壁纸"></i>
                    <i @click.stop="collectPic" class="icon-hover el-icon-collection-tag" title="收藏壁纸"></i>
                    </div>
                <div class="menu-item" @click="clickMenuItem('eventOpenDrawCategory', {categoryOptType: 'add'})">
                    <i class="el-icon-folder-add"></i> 新增分类
                </div>
                <div class="menu-item" v-if="activeCategory.type==='icon'" @click="clickMenuItem('eventOpenDrawIcon', {iconOptType: 'add'})">
                    <i class="el-icon-plus"></i> 新增图标
                </div>
                <div class="menu-item" v-if="activeCategory.type==='card'" @click="clickMenuItem('eventOpenDrawCard', {cardOptType: 'add'})">
                    <i class="el-icon-circle-plus-outline"></i> 新增卡片
                </div>
                <div class="menu-item" @click="clickMenuItem('eventOpenDrawSetting', {})">
                   <i class="el-icon-setting"></i> 设置
                </div>
            </template>
        </div>
    </div>

</template>

<script>
    import IndexedDb from '@/utils/IndexedDb';
    import Util from '@/utils/Util';
    import EventBus from "../../data/EventBus";

    export default {
        name: "Menu",
        data() {
            return {
                showMenuTab: true,
                showAddCategoryTab: false,
                activeCategory: {},
                isSearchInput: false,
                isApp: false,
                isEngine: false,
                isCategory: false,
                editItem: {}, // 临时记录需要编辑的组件
            }
        },
        mounted() {
            this.$bus.$on(EventBus.MouseLeftClick, ()=> {
                this.closeMenuTab();
            });
            this.$bus.$on(EventBus.RecordEditItem, (data)=> {
                this.editItem = Util.deepClone(data);
                // console.log(this.editItem);
            });

            this.$bus.$on(EventBus.MouseRightClick, (data)=> {
                if (data.type === 'openMenu') {
                    let event = data.event;
                    this.resetMenuPosition(event);
                    this.initMenuItem(event);
                }
            });

            this.$bus.$on(EventBus.ActiveCategory, (data) => {
                this.activeCategory = data;
            });
        },
        methods: {
            // 重置菜单位置
            resetMenuPosition(event) {
                try {
                    // console.log("openMenu");
                    let tab = document.getElementById("rightKeyTab");
                    if (tab) {
                        tab.style.left = event.clientX + "px";
                        tab.style.top = event.clientY + "px";
                        tab.style.display = "block";
                        // console.log(tab)
                    } else {
                        console.log("no right tab");
                    }

                } catch (e) {
                    console.log(e);
                }
            },

            // 控制菜单显示项
            initMenuItem(event) {

                let isSearchInput = Util.checkEventSourceClassOnce(event, "search-input");
                this.isSearchInput = isSearchInput;
                if (isSearchInput) {
                    return;
                }

                let isApp = Util.checkEventSourceClass(event, "control-app-item");
                this.isApp = isApp;
                if (isApp) {
                    return;
                }

                let isEngine = Util.checkEventSourceClass(event, 'control-item-engine');
                this.isEngine = isEngine;
                if (isEngine) {
                    return;
                }

                let isCategory = Util.checkEventSourceClassOnce(event, "control-item-category");
                this.isCategory = isCategory;
                if (isCategory ) {
                    return;
                }
            },

            // 下载壁纸
            async downPic() {
                let getUIResult  = await IndexedDb.getSetting().catch(e=>{console.log(e)});
                if (getUIResult.success) {
                    if (getUIResult.data && getUIResult.data.length > 0) {
                        let uiData = getUIResult.data[0];
                        if (uiData && uiData.bgUrl) {
                            Util.downloadPicture(uiData.bgUrl);
                        }
                    }
                } else {
                    this.$message({type: 'error',message: '获取背景图失败!'});
                }
            },

            async collectPic() {
                let getUIResult  = await IndexedDb.getSetting().catch(e=>{console.log(e)});
                if (getUIResult.success) {
                    if (getUIResult.data && getUIResult.data.length > 0) {
                        let uiData = getUIResult.data[0];
                        if (uiData && uiData.bgUrl) {
                            let collected = false;
                            if (uiData.collectImgs != null) {
                                for (let collectImgsKey in uiData.collectImgs) {
                                    let collectImg = uiData.collectImgs[collectImgsKey];
                                    if (collectImg && collectImg.src === uiData.bgUrl) {
                                        collected = true;
                                        break;
                                    }
                                }
                                uiData.collectImgs.push({src: uiData.bgUrl});
                            } else {
                                uiData.collectImgs = [{src: uiData.bgUrl}];
                            }

                            // console.log('collected', collected);
                            if (collected) {
                                this.$message({type: 'warning',message: '已经收藏过了~'});
                            } else {
                                // console.log(uiData);
                                let result = await IndexedDb.setSetting(uiData).catch(e=>{console.log(e)});
                                if (result && result.success) {
                                    this.$message({type: 'success', message: '收藏成功!'});
                                } else {
                                    this.$message({type: 'error', message: '收藏失败!'});
                                }
                            }
                        }
                    }
                } else {
                    this.$message({type: 'error',message: '获取背景图失败!'});
                }
            },

            openSetting() {

            },

            // 关闭右键菜单
            closeMenuTab() {
                this.showMenuTab = false;
                let tab = document.getElementById("rightKeyTab");
                if (tab) {
                    tab.style.display = "none";
                }
            },

            // 点击菜单项
            clickMenuItem(event, data) {
                // console.log(event, data);
                this.$bus.$emit(event, data);
            },


            editCategory(type) {
                if (type === null || type === undefined) {
                    return;
                }

                console.log(type);
                if (type === 'del') {

                } else if (type === 'set') {
                    if (this.editItem) {
                        this.$bus.$emit(EventBus.OpenDrawCategory, {categoryOptType: 'set', item: this.editItem});
                    }
                }

            }
        }
    }
</script>

<style scoped>

    /*.menu-box, */
    .menu-mask {
        top: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        /*z-index: -1;*/
    }

    /*右键菜单*/
    #rightKeyTab {
        width: 125px;
        position: absolute;
        /*background: var(--bg-mask);*/
        background: rgba(1, 1, 1, 0.7);
        color: #cdcdcd;
        border-radius: 10px;
        padding: 12px 6px;
        backdrop-filter: blur(10px);
        left: 0;
        top: 0;
        display: none;
        z-index: 100;
    }

    .menu-item {
        cursor: pointer;
        padding: 5px;
        border-radius: 5px;
    }

    .menu-item:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .icon-hover {
        padding: 1px;
    }
    .icon-hover:hover {
        border-radius: 5px;
        background: gray;
    }
</style>
