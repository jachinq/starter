<template>
    <div>
        <!-- 设置图标：新增、编辑 -->
        <el-drawer :visible.sync="openIconDraw" size="500px" :wrapper-closable="false" :with-header="false">

            <div class="header">
                <i class="el-icon-edit"></i>
                <span>{{ iconOptType === 'add' ? '添加图标' : '编辑图标' }}</span>
            </div>

            <div class="container">

                <el-form ref="setIconForm" :model="setIconForm" label-width="100px">

                    <el-form-item label="名称">
                        <cus-input type="text" v-model="setIconForm.name" :clearable="true"></cus-input>
                    </el-form-item>

                    <el-form-item label="网站">
                        <cus-input type="text" v-model="setIconForm.url" :clearable="true" @input="searchIcon()"></cus-input>
                    </el-form-item>

                    <el-form-item label="图标类型">
                        <cus-radio v-model="setIconForm.iconType" :options="[
                            { label: '图片地址', value: 1 },
                            { label: 'SVG代码', value: 2 }
                        ]" @click="searchIcon"></cus-radio>
                        <cus-input type="text" v-model="setIconForm.icon"
                            :placeholder="setIconForm.iconType === 2 ? '输入 SVG 代码' : '域名加上 favicon.ico 便可获取到图标'"
                            :clearable="true"></cus-input>
                    </el-form-item>

                    <!--<el-form-item label="名称">-->
                    <!--<el-input type="text" v-model="setIconForm.name">-->
                    <!--<el-button slot="append" icon="el-icon-search" @click="searchIcon()"></el-button>-->
                    <!--</el-input>-->
                    <!--</el-form-item>-->

                    <!--<el-form-item label="网址">-->
                    <!--<el-input type="text" v-model="setIconForm.url"></el-input>-->
                    <!--</el-form-item>-->

                    <!--<el-form-item label="图标类型">-->
                    <!--<el-radio-group v-model="setIconForm.iconType">-->
                    <!--<el-radio :label="1">图片地址</el-radio>-->
                    <!--<el-radio :label="2">svg代码</el-radio>-->
                    <!--</el-radio-group>-->
                    <!--</el-form-item>-->

                    <!--<el-form-item label="图标">-->
                    <!--<el-input type="text" v-model="setIconForm.icon"></el-input>-->
                    <!--</el-form-item>-->

                    <el-form-item label="图标预览">
                        <template v-if="setIconForm.iconType === 1">
                            <el-image v-if="setIconForm.icon && setIconForm.icon !== ''" :src="setIconForm.icon"
                                style="width: 80px;height: auto" fit="cover"></el-image>
                        </template>
                        <template v-else>
                            <div v-if="setIconForm.icon && setIconForm.icon !== ''"
                                style="width: var(--icon-size);height: var(--icon-size)" v-html="setIconForm.icon"></div>
                        </template>
                    </el-form-item>

                    <el-form-item label="背景颜色">
                        <el-color-picker v-model="setIconForm.color" show-alpha :predefine="predefineColors">
                        </el-color-picker>
                    </el-form-item>

                    <el-form-item style="text-align: center">
                        <el-button type="primary" @click="setIcon">提交</el-button>
                        <el-button type="info" @click="openIconDraw = false">取消</el-button>
                    </el-form-item>
                </el-form>

                <div v-if="iconOptType === 'add'" style="max-height: 600px;overflow-y: scroll;">
                    <div v-for="item in searchIcons" class="icon-search-box">
                        <div class="icon icon-search" :style="`background-image: url(${item.src});`"
                            @click="clickSearchIcon(item)"></div>
                        <div class="icon-search-text">
                            <strong>{{ item.name }}</strong>
                            <p>{{ item.description }}</p>
                        </div>
                    </div>
                </div>

            </div>
        </el-drawer>
    </div>
</template>

<script>
import IndexedDb from '@/utils/IndexedDb';
import Util from '@/utils/Util';
import EventBus from "../../data/EventBus";
import DefaultData from "../../data/DefaultData";
import { Icon } from "../../data/Entity";
import CusInput from "../formItem/cus-input";
import CusRadio from "../formItem/cus-radio";
import CusSelect from "../formItem/cus-select";

export default {
    name: "IconForm",
    components: { CusSelect, CusRadio, CusInput },
    data() {
        return {
            iconOptType: 'add', // add、set
            setIconItem: {}, // 应用设置临时变量

            openIconDraw: false,
            searchIcons: [],
            setIconForm: {},

            apps: [],
            activeCategory: {},

            predefineColors: DefaultData.COLOR,

            imgUrl: '',
            fromSetting: false,
        }
    },
    mounted() {
        this.$bus.$on(EventBus.OpenDrawIcon, (data) => {
            this.fromSetting = data.fromSetting || false;
            this.iconOptType = data.iconOptType;
            this.setIconForm = {};

            if (this.iconOptType === 'set') {
                this.setIconForm = data.item;
            }
            this.getAppList();
        });


        this.$bus.$on(EventBus.ActiveCategory, (data) => {
            // console.log('icon active category', data);
            this.activeCategory = data;
        });
    },
    methods: {
        async getAppList() {
            let result = await IndexedDb.getApplication();
            if (result && result.success) {
                this.openIconDraw = true;
                this.apps = result.data;
                this.init = false;
            } else {
                this.$message({ type: 'error', message: '获取应用列表失败!' });
            }
        },

        // 搜索图标
        async searchIcon(item) {
            // （infinity源）废弃
            /*   let that = this;
               let url = "https://infinity-api.infinitynewtab.com/get-icons";
               let params = {
                   lang: 'zh-CN',
                   page: 0,
                   type: 'search',
                   keyword: that.setIconForm.name,
               };

               let result = await this.$http.get(url,{params:params},{emulateJSON:true});

               console.log(result);
               if (result.ok) {
                   this.searchIcons = result.data.icons;
               } else {
                   this.$message({type: 'error',message: '查询图标失败!'});
               }*/

            const iconType = item ? item.value : this.setIconForm.iconType;
            const tmp = this.setIconForm.icon || '';
            if (iconType === 2) {
                this.setIconForm.icon = this.setIconForm.svg || '';
            }
            else if (iconType === 1) {
                this.setIconForm.icon = '';
                let url = this.setIconForm.url;
                if (url === null || url === undefined || url === '') {
                    return
                }
                url = Util.getStrUrl(url);
                if (url == null) {
                    this.$notify({ title: '提示', message: '获取不到正确网址，请手动输入图标地址', type: 'warning', position: 'top-left' });
                    return
                }
                if (!url.endsWith("/")) url += "/"
                url += 'favicon.ico'
                this.$set(this.setIconForm, 'icon', url);
                // console.log("searchIcons", this.setIconForm.icon);
            }

            if (this.setIconForm.iconType === 2) this.setIconForm.svg = tmp;
        },

        // 点击搜索结果中的图标
        clickSearchIcon(item) {
            this.setIconForm = {
                name: item.name,
                icon: item.src,
                url: item.url,
            };
        },

        // 数据交互-添加图标
        async setIcon() {
            let newIcon = new Icon(this.activeCategory.category, this.activeCategory.type, this.setIconForm.name, this.setIconForm.url, this.setIconForm.icon, this.setIconForm.iconType);

            if (newIcon.category === undefined || newIcon.type === undefined) {
                this.$message("参数错误，activeCategory:" + JSON.stringify(this.activeCategory));
                return;
            }
            if (newIcon.name === undefined || newIcon.name === null || newIcon.name === '') {
                this.$notify({ title: '提示', message: '请填写名称', type: 'warning', position: 'top-left' });
                return;
            }
            if (newIcon.url === undefined || newIcon.url === null || newIcon.url === '') {
                this.$notify({ title: '提示', message: '请填写网址', type: 'warning', position: 'top-left' });
                return;
            }

            delete newIcon.svg;

            let result = { success: true };
            if (this.iconOptType === 'add') {
                result = await IndexedDb.addApplication(newIcon);
            }
            else if (this.iconOptType === 'set') {
                newIcon.id = this.setIconForm.id;
                if (this.setIconForm.sort) newIcon.sort = this.setIconForm.sort;
                if (this.setIconForm.color) newIcon.color = this.setIconForm.color;
                result = await IndexedDb.setApplication(newIcon);
                if (this.fromSetting) this.$bus.$emit(EventBus.RefreshSetting); // 刷新设置页数据
            }

            if (result && !result.success) {
                this.$message({ type: 'error', message: '操作图标失败!' });
                return;
            }

            this.$bus.$emit(EventBus.RefreshApp, {});
            this.openIconDraw = false;
        },
    }
}
</script>

<style scoped>
.header {
    text-align: center;
    padding: 15px 20px 15px 20px;
    border-bottom: 1px solid #DCDFE6;
    user-select: none;
}

.container {
    max-width: var(--draw-box-width);
    margin-top: 15px;
}

.icon {
    width: var(--icon-size);
    height: var(--icon-size);
    background-size: cover;
    border-radius: var(--icon-radius);
    cursor: pointer;
    display: inline-block;
    margin: var(--icon-margin);
    opacity: calc(var(--icon-opacity) / 100);
    /*transition: all 0.3s ease-in-out;*/
}

.icon-search-box {
    display: flex;
    background: var(--bg-mask);
    border-radius: 15px;
    margin: 10px;
    padding: 10px;
}

.icon-search {
    margin: 0 10px 0 0;
    float: left;
    min-width: var(--icon-size);
    min-height: var(--icon-size);
}

.icon-search-text {
    float: right;
    max-width: 330px;
}
</style>
