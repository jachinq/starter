<template>
    <div>
        <!-- 设置图标：新增、编辑 -->
        <el-drawer :visible.sync="openSearchTypeDraw" size="500px" :wrapper-closable="false" :with-header="false">

            <div class="header">
                <i class="el-icon-edit"></i>
                <span>{{ searchTypeOptType === 'add' ? '添加搜索方式' : '编辑搜索方式' }}</span>
            </div>

            <div class="container">
                <el-form ref="setSearchTypeForm" :model="setSearchTypeForm" label-width="100px">
                    <el-form-item label="名称">
                        <!--<el-input type="text" v-model="setSearchTypeForm.name"></el-input>-->
                        <cus-input type="text" v-model="setSearchTypeForm.name" :clearable="true"></cus-input>
                    </el-form-item>

                    <el-form-item label="网址">
                        <!--<el-input type="text" v-model="setSearchTypeForm.url"></el-input>-->
                        <cus-input type="text" v-model="setSearchTypeForm.url" :clearable="true"></cus-input>
                    </el-form-item>

                    <el-form-item label="图标类型">
                        <cus-radio :options="[{ value: 1, label: '图片' }, { value: 2, label: 'SVG' }]" @change="changeIconType"
                            v-model="setSearchTypeForm.iconType"></cus-radio>
                        <!--<el-radio-group v-model="setSearchTypeForm.iconType">-->
                        <!--<el-radio :label="1">图片</el-radio>-->
                        <!--<el-radio :label="2">SVG</el-radio>-->
                        <!--</el-radio-group>-->

                        <template v-if='setSearchTypeForm.iconType === 1'>
                            <cus-input type="text" v-model="setSearchTypeForm.icon" placeholder="请输入图标地址" :clearable="true">
                                <!--<div class="cus-button" @click="searchIcon"><i class="el-icon-search"></i></div>-->
                            </cus-input>
                        </template>
                        <template v-if='setSearchTypeForm.iconType === 2'>
                            <cus-input type="text" v-model="setSearchTypeForm.icon" @change="resizeSvg"
                                placeholder="请输入 SVG 代码" :clearable="true"></cus-input>
                        </template>

                        <!--<el-form-item label="实时预览">-->
                        <!--<div style="display: flex;align-items: center;min-height: 40px"-->
                        <!--ref="svgBox"-->
                        <!--v-if="setSearchTypeForm.icon && setSearchTypeForm.icon!==''"-->
                        <!--v-html="setSearchTypeForm.icon"></div>-->
                        <!--</el-form-item>-->
                    </el-form-item>


                    <el-form-item label="图标预览">
                        <template v-if="setSearchTypeForm.iconType === 1">
                            <el-image v-if="setSearchTypeForm.icon && setSearchTypeForm.icon !== ''"
                                :src="setSearchTypeForm.icon" style="width: 80px;height: auto" fit="cover"></el-image>
                        </template>
                        <template v-else>
                            <div v-if="setSearchTypeForm.icon && setSearchTypeForm.icon !== ''"
                                style="width: var(--icon-size);height: var(--icon-size)" v-html="setSearchTypeForm.icon">
                            </div>
                        </template>
                    </el-form-item>


                    <el-form-item style="text-align: center">
                        <el-button type="primary" @click="setSearchType">提交</el-button>
                        <el-button type="info" @click="openSearchTypeDraw = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import EventBus from "../../data/EventBus";
import { SearchType } from "../../data/Entity";
import IndexedDb from "../../utils/IndexedDb";
import CusInput from "../formItem/cus-input";
import CusRadio from "../formItem/cus-radio";
import Util from "../../utils/Util";

export default {
    name: "EngineForm",
    components: { CusRadio, CusInput },
    data() {
        return {
            searchTypeOptType: 'add',
            openSearchTypeDraw: false,
            setSearchTypeForm: {},
            fromSetting: false,
            tempSvgCode: '',
        }
    },
    mounted() {
        this.$bus.$on(EventBus.OpenDrawSearchType, (data) => {
            // console.log(data);
            this.fromSetting = data.fromSetting || false;
            this.searchTypeOptType = data.searchTypeOptType;
            this.setSearchTypeForm = {};

            if (this.searchTypeOptType === 'set') {
                this.setSearchTypeForm = data.item;
            }
            this.setSearchTypeForm.svgSize = 24;

            this.openSearchTypeDraw = true;
        });

        this.recordSvg();
    },
    methods: {
        // 设置搜索引擎
        async setSearchType() {

            let newSearchType = new SearchType(this.setSearchTypeForm.name, this.setSearchTypeForm.url, this.setSearchTypeForm.iconType, this.setSearchTypeForm.icon);

            if (newSearchType.name === undefined || newSearchType.name === '') {
                this.$notify({ title: '提示', message: '请填写名称', type: 'warning', position: 'top-left' });
                return
            }
            if (newSearchType.url === undefined || newSearchType.url === '') {
                this.$notify({ title: '提示', message: '请填写网址', type: 'warning', position: 'top-left' });
                return
            }

            let result = {};
            if (this.searchTypeOptType === 'add') {
                result = await IndexedDb.addSearchType(newSearchType).catch(e => { console.log(e) });
            }
            else if (this.searchTypeOptType === 'set') {
                newSearchType.id = this.setSearchTypeForm.id;
                if (this.setSearchTypeForm.sort) newSearchType.sort = this.setSearchTypeForm.sort;
                result = await IndexedDb.setSearchType(newSearchType).catch(e => { console.log(e) });
                if (this.fromSetting) this.$bus.$emit(EventBus.RefreshSetting); // 刷新设置页数据
            }

            if (result && !result.success) {
                this.$message({ type: 'error', message: '操作搜索方式失败!' });
                return;
            }

            this.openSearchTypeDraw = false;
            this.$bus.$emit(EventBus.RefreshSearchType, newSearchType);
        },

        // 重置 svg 图标大小
        resizeSvg() {
            // console.log('beg resizeSvg');
            let svgBoxElement = this.$refs.svgBox;
            // console.log(svgBoxElement);

            if (svgBoxElement) {
                let svgElement = svgBoxElement.firstChild
                // console.log(svgElement);
                if (svgElement) {
                    // console.log('resize svg');
                    svgElement.setAttribute('width', this.setSearchTypeForm.svgSize);
                    svgElement.setAttribute('height', this.setSearchTypeForm.svgSize);
                    this.setSearchTypeForm.icon = svgElement.outerHTML;
                }
            }
        },

        // 切换图标类型
        changeIconType(value) {
            if (value === 1) {
                this.searchIcon();
            }
            else if (value === 2) {
                if (this.tempSvgCode !== '') {
                    this.setSearchTypeForm.icon = this.tempSvgCode;
                }
            }
            this.recordSvg();
        },
        // 临时记录 svg
        recordSvg() {
            if (this.setSearchTypeForm.iconType === 2) {
                if (this.setSearchTypeForm.icon !== '') {
                    this.tempSvgCode = this.setSearchTypeForm.icon;
                }
            }
        },
        // 搜索图标
        searchIcon() {
            if (this.setSearchTypeForm.iconType !== 1) {
                return;
            }

            let url = this.setSearchTypeForm.url;
            if (url === null || url === undefined || url === '') {
                return
            }
            url = Util.getStrUrl(url);
            if (url == null) {
                this.$notify({ title: '提示', message: '获取不到正确网址，请手动输入图标地址', type: 'warning', position: 'top-left' });
                return
            }
            if (!url.endsWith("/")) url += "/"
            url += '/favicon.ico';
            this.$set(this.setSearchTypeForm, 'icon', url);
            // console.log("searchIcons", this.setIconForm.icon);
        },
    }
}
</script>

<style scoped>
.header {
    /*margin: 10px;*/
    text-align: center;
    padding: 15px 20px 15px 20px;
    border-bottom: 1px solid #DCDFE6;
    user-select: none;
}

.container {
    max-width: var(--draw-box-width);
    margin-top: 15px;
}
</style>
