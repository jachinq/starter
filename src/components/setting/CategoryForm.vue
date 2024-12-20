<template>
    <div>
        <el-drawer
                :visible.sync="openCategoryDraw"
                size="500px"
                :wrapper-closable="false"
                :with-header="false">

            <div class="header">
                <i class="el-icon-edit"></i>
                <span>{{categoryOptType === 'add' ? '添加分类' : '编辑分类'}}</span>
            </div>

            <div class="container">
                <el-form ref="setCategoryForm" :model="setCategoryForm" label-width="100px">
                    <el-form-item label="分类名称">
                        <!--<el-input v-model="setCategoryForm.category"></el-input>-->
                        <cus-input type="text" v-model="setCategoryForm.category"></cus-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <cus-select :disabled="categoryOptType==='set'" v-model="setCategoryForm.type"
                                    :options="[{label:'图标',value:'icon'},{label:'卡片',value:'card'},]">
                        </cus-select>
                        <!--<el-select :disabled="categoryOptType==='set'" v-model="setCategoryForm.type" placeholder="请选择" style="width: 360px;">
                            <el-option label="图标" value="icon"></el-option>
                            <el-option label="卡片" value="card"></el-option>
                        </el-select>-->
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="setCategory">提交</el-button>
                        <el-button @click="openCategoryDraw=false">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>

        </el-drawer>
    </div>
</template>

<script>
    import IndexedDb from '@/utils/IndexedDb';
    import Util from '@/utils/Util';
    import EventBus from "../../data/EventBus";
    import {Category} from "../../data/Entity";
    import CusInput from "../formItem/cus-input";
    import CusSelect from "../formItem/cus-select";

    export default {
        name: "CategoryForm",
        components: {CusSelect, CusInput},
        data() {
            return {
                openCategoryDraw: false,
                setCategoryForm: {},
                categoryList: [],
                categoryOptType: 'add',
                oldCategory: {},
                fromSetting: false,
            }
        },
        mounted() {
            this.$bus.$on(EventBus.OpenDrawCategory, (data) => {
                // console.log(data);
                this.fromSetting = data.fromSetting || false;
                this.categoryOptType = data.categoryOptType;
                this.setCategoryForm = {};
                if (this.categoryOptType === 'set') {
                    this.setCategoryForm = data.item;
                    this.oldCategory = Util.deepClone(this.setCategoryForm);
                }
                this.getCategoryList();
            });
        },
        methods: {
            async getCategoryList() {
                let result = await IndexedDb.getCategory().catch(e=>{console.log(e)});
                if (result && result.success) {
                    this.categoryList = result.data;
                    this.openCategoryDraw = true;
                } else {
                    this.$message({type: 'error',message: '获取分类列表失败!'});
                }
            },
            // 数据交互：添加、编辑分类
            async setCategory() {
                try {
                    let that = this;

                    let newCategory = new Category(this.setCategoryForm.category, this.setCategoryForm.type);
                    if (newCategory.category === undefined || newCategory.category === null || newCategory.category === '') {
                        that.$notify({title: '提示', message: '请填写分类名称', type: 'warning', position: 'top-left'});
                        return;
                    }
                    if (newCategory.type === undefined || newCategory.type === null || newCategory.type === '') {
                        that.$notify({title: '提示', message: '请选择类型', type: 'warning', position: 'top-left'});
                        return;
                    }

                    for (let item of this.categoryList) {
                        if (!item) {
                            continue;
                        }
                        if (newCategory.category === this.oldCategory.category) {
                            continue;
                        }
                        if (newCategory.category === item.category) {
                            that.$notify({title: '分类名错误',message: '已存在同名分类：' + newCategory.category,type: 'error',position: 'top-left',});
                            return;
                        }
                    }

                    let result = {success: true};
                    if (this.categoryOptType === 'add') {
                        result = await IndexedDb.addCategory(newCategory).catch(e=>{console.log(e)});
                    } else if (this.categoryOptType === 'set') {
                        newCategory.id = this.setCategoryForm.id;
                        if (this.setCategoryForm.sort) newCategory.sort = this.setCategoryForm.sort;

                        result = await IndexedDb.setCategory(newCategory).catch(e=>{console.log(e)});
                    }

                    if (result && !result.success) {
                        that.$notify({title: '添加失败', message: '分类添加失败', type: 'error', position: 'top-left',});
                        console.log(result);
                        return;
                    }

                    if (this.categoryOptType === 'set') {
                        let appResult = await IndexedDb.getApplication().catch(e=>{console.log(e)});
                        if (appResult.success) {
                            for (let item of appResult.data) {
                                if (item === undefined || item === null) {
                                    continue;
                                }
                                if (item.category !== this.oldCategory.category) {
                                    continue;
                                }
                                item.category = newCategory.category;
                                IndexedDb.setApplication(item).then(res => {
                                    if (!res.success) {
                                        console.log('分类修改，app分类失败', item);
                                    }
                                }).catch(e=>{console.log(e)});
                            }
                        }
                        if (this.fromSetting) this.$bus.$emit(EventBus.RefreshSetting); // 刷新设置页数据
                    }

                    that.openCategoryDraw = false;

                    // 发送事件，刷新分类
                    this.$bus.$emit(EventBus.RefreshCategory, newCategory);
                } catch (e) {
                    console.log(e);
                }
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
</style>
