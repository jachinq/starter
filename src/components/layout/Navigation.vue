<template>
    <div class="left-category-dot cent-box" v-if="showNav">
        <div class="category-list">
            <div v-for="item in categoryList"
                 class="dot control-item-category" :class="{'dot-active': activeCategory.category === item.category}"
                 :title="item.category"
                 @contextmenu="rightClickItem(item)"
                 @click="activeNav(item.category)">
                <i v-if="isShowDelBtn" class="el-icon-close del-btn"
                   @mouseenter="activeNav(item.category)"
                   @click="deleteCategory(item)"></i>
            </div>
        </div>
    </div>

</template>

<script>
    import IndexedDb from '@/utils/IndexedDb';
    import Util from '@/utils/Util';
    import EventBus from "../../data/EventBus";

    export default {
        name: "Navigation",
        data() {
            return {
                showNav: true,
                showDot: false,
                categoryList: [],
                activeCategory: {},
                isShowDelBtn: false,
            }
        },
        created() {
            this.getCategoryList();
        },
        watch: {
            activeCategory(newVal) {
                this.$bus.$emit(EventBus.ActiveCategory, newVal); // 事件通知
            },
        },
        mounted() {
            this.$bus.$on(EventBus.MouseLeftClick, (e) => {
                // 点击删除按钮或者是点击批量编辑菜单项时，不需要隐藏删除按钮，其他情况则隐藏
                if (!(Util.checkEventSourceClassOnce(e, "menu-item") || Util.checkEventSourceClassOnce(e, "del-btn"))) {
                    this.isShowDelBtn = false;
                }
            });
            this.$bus.$on(EventBus.MouseScroll, (data) => {
                this.handleWheelActive(data);
            });
            this.$bus.$on(EventBus.ActiveNav, (category) => {
                this.activeNav(category);
            });
            this.$bus.$on(EventBus.RefreshCategory, () => {
                this.getCategoryList();
            });
            this.$bus.$on(EventBus.ClickClock, (data) => {
                this.showNav = !data.miniMode;
            });

            this.$bus.$on(EventBus.MenuEditCategory, (data) => {
                if (data !== null) {
                    if (data.type === 'batch') {
                        this.isShowDelBtn = true;
                    } else if (data.type === 'single') {
                        if (data.item) {
                            this.$bus.$emit(EventBus.OpenDrawCategory, {categoryOptType: 'set', item: data.item});
                        }
                    }
                }

            });

        },
        methods: {
            async getCategoryList() {
                let result = await IndexedDb.getCategory().catch(e=>{console.log(e)});
                console.log(result);
                if (result && result.success) {
                    this.categoryList = result.data;
                    if (this.categoryList && this.categoryList.length > 0) {
                        this.activeCategory = this.categoryList[0];
                    }
                } else {
                    this.$message({type: 'error',message: '获取分类列表失败!'});
                }
            },

            // 操作交互：鼠标滚动事件
            handleWheelActive: function (upScroll) {
                // console.log('全局鼠标滚动', e);
                // this.closeMenuTab();
                this.$bus.$emit(EventBus.CloseMenu, true);

                let that = this;

                let currentIndex = 0;
                if (this.categoryList) {
                    this.categoryList.forEach((element, index) => {
                        if (that.activeCategory.category === element.category) {
                            currentIndex = index;
                        }
                    });
                }

                let index = -1;
                if (upScroll) { // up
                    index = (this.categoryList.length + currentIndex - 1) % this.categoryList.length;
                } else {
                    index = (currentIndex + 1) % this.categoryList.length;
                }
                if (index > -1) {
                    this.activeCategory = this.categoryList[index];
                }
            },

            // 操作交互: 鼠标点击导航
            activeNav(category) {
                if (this.categoryList) {
                    for (let item of this.categoryList) {
                        if (item && item.category === category) {
                            this.activeCategory = item;
                            break;
                        }
                    }
                }
            },

            async deleteCategory(item) {
                console.log(item);
                let result = await IndexedDb.delCategory(item).catch(e=>{console.log(e)});
                if (result && result.success) this.$bus.$emit(EventBus.RefreshCategory);
            },

            // 右键分类
            rightClickItem(item) {
                // 把当前右键的数据，传送给菜单组件，保存起来等待下一步操作
                this.$bus.$emit(EventBus.RecordEditItem, item);
                this.activeNav(item.category);
            },

        },
    }
</script>

<style scoped>
    .left-category-dot {
        height: 100%;
        width: 65px;
        position: absolute;
        user-select: none;
    }

    .dot {
        margin: 15px 25px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: rgba(255, 255, 255, 0.3) solid 1px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .dot:hover{
        background: rgba(255, 255, 255, 0.1);
    }
    .dot-active {
        transform: scale(1.2);
        background: rgba(255, 255, 255, 0.3);
    }

    .category-list {
        width: 100%;
    }

    .del-btn {
        padding: 1px;
        border-radius: 50%;
        background: #909399;
        /*color: #F56C6C;*/
    }

    .del-btn:hover {
        background: #abafb6;
    }
</style>
