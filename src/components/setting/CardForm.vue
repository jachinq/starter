<template>
    <div>
        <!-- 设置卡片：新增、编辑 -->
        <el-drawer
                :visible.sync="openCardDraw"
                size="500px"
                :wrapper-closable="false"
                :with-header="false">

            <div class="header">
                <i class="el-icon-edit"></i>
                <span>{{cardOptType === 'add' ? '添加卡片' : '编辑卡片'}}</span>
            </div>

            <div class="container">
                <el-form ref="setCardForm" :model="setCardForm" label-width="70px">
                    <el-form-item label="卡片名称">
                        <!--<el-input v-model="setCardForm.name"></el-input>-->
                        <cus-input v-model="setCardForm.name"></cus-input>
                    </el-form-item>

                    <el-form-item label="背景颜色">
                        <el-color-picker
                                v-model="setCardForm.color"
                                show-alpha
                                :predefine="predefineColors">
                        </el-color-picker>
                    </el-form-item>

                    <div v-for="(item, index) in setCardForm.list" :key="index" style="border-top: var(--bg-mask) solid 1px;padding-top: 10px">
                        <el-form-item label="名称" label-width="70px" style="margin-bottom: 10px">
                            <cus-input v-model="item.name">
                                <el-button icon="el-icon-minus" size="small"
                                           v-if="index>0 || setCardForm.list.length > 1"
                                           @click="delCardItem(index)"
                                           style="color: #ff4a46"></el-button>
                            </cus-input>
                        </el-form-item>
                        <el-form-item label="链接" label-width="70px" style="margin-bottom: 10px">
                            <cus-input v-model="item.url">
                                <el-button icon="el-icon-plus" size="small" @click="addCardItem(index)"></el-button>
                            </cus-input>
                        </el-form-item>
                    </div>
                    <el-form-item style="text-align: right">
                        <el-button type="primary" @click="setCard">提交</el-button>
                        <el-button type="info" @click="openCardDraw=false">取消</el-button>
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
    import {Card} from "../../data/Entity";
    import DefaultData from "../../data/DefaultData";
    import CusInput from "../formItem/cus-input";

    export default {
        name: "CardForm",
        components: {CusInput},
        data() {
            return {
                cardOptType: 'add', // add、set
                appSetItem: {}, // 应用设置临时变量
                openCardDraw: false,
                setCardForm: {},
                predefineColors: DefaultData.COLOR,
                fromSetting: false,

                apps: [],
                activeCategory: {},
            }
        },
        mounted() {
            this.$bus.$on(EventBus.OpenDrawCard, (data) => {
                this.fromSetting = data.fromSetting || false;
                this.cardOptType = data.cardOptType;
                this.setCardForm = {list: [{ name: "", url: "" }]};

                if (this.cardOptType === 'set') {
                    this.setCardForm = data.item;
                }
                this.getAppList();
            });


            this.$bus.$on(EventBus.ActiveCategory, (data) => {
                this.activeCategory = data;
            });
        },
        methods: {
            async getAppList() {
                let result = await IndexedDb.getApplication().catch(e=>{console.log(e)});
                if (result && result.success) {
                    this.openCardDraw = true;
                } else {
                    this.$message({type: 'error',message: '获取应用列表失败!'});
                }
            },

            // 卡片内单个项目的添加
            addCardItem(index) {
                this.setCardForm.list.splice(index + 1, 0, {
                    name: '',
                    url: ''
                })
                // console.log(this.setCardForm.list);
            },
            // 卡片内单个项目的删除
            delCardItem(index) {
                this.setCardForm.list.splice(index, 1);
            },

            // 数据交互-设置卡片：添加、编辑
            async setCard() {

                let newCard = new Card(this.activeCategory.category, this.activeCategory.type
                    , this.setCardForm.name, this.setCardForm.list);

                if (!this.activeCategory && !this.activeCategory.category && !this.activeCategory.type) {
                    this.$message("参数错误，activeCategory:" + JSON.stringify(this.activeCategory));
                    return;
                }

                if (newCard.category === undefined || newCard.type === undefined) {
                    this.$message("参数错误，请刷新页面重试。activeCategory:" + JSON.stringify(this.activeCategory));
                    return;
                }

                if (newCard.name === undefined || newCard.name === '') {
                    this.$notify({title: '提示',message: '请填写卡片名称',type: 'warning',position: 'top-left'});
                    return;
                }
                if (newCard.list === undefined || newCard.list.length === 0) {
                    this.$notify({title: '提示',message: '请填写至少一个链接',type: 'warning',position: 'top-left'});
                    return;
                }

                if (this.setCardForm.color) {
                    newCard.color = this.setCardForm.color;
                }

                let result = {success: true};
                if (this.cardOptType === 'add') {
                    result = await IndexedDb.addApplication(newCard).catch(e=>{console.log(e)});
                }
                else if (this.cardOptType === 'set') {
                    newCard.id = this.setCardForm.id;
                    result = await IndexedDb.setApplication(newCard).catch(e=>{console.log(e)});
                    if (this.fromSetting) this.$bus.$emit(EventBus.RefreshSetting); // 刷新设置页数据
                }

                if (result && !result.success) {
                    console.log(result);
                    this.$message({type: 'error',message: '操作卡片失败!'});
                    return;
                }

                console.log(newCard);
                console.log(result);
                this.openCardDraw = false;
                this.$bus.$emit(EventBus.RefreshApp, {});
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
        margin-bottom: 15px;
    }

    .container {
        max-width: var(--draw-box-width);
        margin: auto;
    }
</style>
