<template>
    <div class="setting">
        <!-- 搜索方式设置 -->
        <EngineForm/>

        <!-- 分类设置 -->
        <CategoryForm/>

        <!-- 图标设置 -->
        <IconForm/>

        <!-- 卡片设置 -->
        <CardForm/>

        <!-- 设置 -->
        <el-drawer
                title="设置"
                :visible.sync="showSettingTab"
                size="500px"
                :wrapper-closable="false"
                :with-header="false"

        >
            <div style="padding: 5px 20px 0 20px">

                <el-tabs stretch v-model="activeSettingTabName" @tab-click="activeSettingTab">
                    <el-tab-pane name="close"><span slot="label"><i class="el-icon-close"></i>关闭</span></el-tab-pane>
                    <el-tab-pane name="search"><span slot="label"><i class="el-icon-search"></i>搜索</span></el-tab-pane>
                    <el-tab-pane name="category"><span slot="label"><i class="el-icon-document-copy"></i>分类</span></el-tab-pane>
                    <el-tab-pane name="application"><span slot="label"><i class="el-icon-mobile-phone"></i>应用</span></el-tab-pane>
                    <el-tab-pane name="ui"><span slot="label"><i class="el-icon-setting"></i>设置</span></el-tab-pane>
                    <el-tab-pane name="data"><span slot="label"><i class="el-icon-s-data"></i>数据</span></el-tab-pane>
                </el-tabs>

                <div v-if="activeSettingTabName==='ui'">
                    <el-form ref="uiForm" :model="uiForm" label-width="100px">
                        <div class="ui-set-module-box">
                            <div class="ui-set-module-box-title" @click="uiFormStyle.showBackgroundSetting=!uiFormStyle.showBackgroundSetting">背景样式设置</div>
                            <div class="ui-set-module-box-content" v-if="uiFormStyle.showBackgroundSetting">
                                <el-form-item label="背景模糊">
                                    <!--<el-slider v-model="uiForm.bgBlur" :max="50" @input="changeUI('bgBlur')" show-input :show-tooltip="false"></el-slider>-->
                                    <cus-slider v-model="uiForm.bgBlur" :max="50" @input="changeUI('bgBlur')" show-input :show-tooltip="false"></cus-slider>
                                </el-form-item>
                                <el-form-item label="背景遮罩">
                                    <!--<el-slider v-model="uiForm.bgMaskRgba" :step="0.01" :min="0.1" :max="1" @input="changeUI('bgMaskRgba')" show-input></el-slider>-->
                                    <cus-slider v-model="uiForm.bgMaskRgba" :step="0.01" :max="1" @change="changeUI('bgMaskRgba')" show-input :show-tooltip="false"></cus-slider>
                                </el-form-item>
                                <el-form-item label="背景来源">
                                    <!--<el-select v-model="uiForm.bgSource" size="small" style="width: 180px" @change="changeBgSource">-->
                                        <!--<el-option v-for="item in backgroundSourceList" :label="item.name" :value="item.name"></el-option>-->
                                    <!--</el-select>-->
                                    <cus-select v-model="uiForm.bgSource" @change="changeBgSource"
                                        :options="backgroundSourceList" label-key="name" value-key="name"></cus-select>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="ui-set-module-box">
                            <div class="ui-set-module-box-title" @click="uiFormStyle.showIconSetting=!uiFormStyle.showIconSetting">图标样式设置</div>
                            <div class="ui-set-module-box-content" v-if="uiFormStyle.showIconSetting">
                                <el-form-item label="图标圆角">
                                    <!--<el-slider v-model="uiForm.iconRadius" :max="uiForm.iconSize/2" @input="changeUI('iconRadius')" show-input :show-tooltip="false"></el-slider>-->
                                    <cus-slider v-model="uiForm.iconRadius" :max="uiForm.iconSize/2" @input="changeUI('iconRadius')" show-input :show-tooltip="false"></cus-slider>
                                </el-form-item>
                                <el-form-item label="图标大小">
                                    <!--<el-slider v-model="uiForm.iconSize" :min="50" :max="180" @input="changeUI('iconSize')" show-input :show-tooltip="false"></el-slider>-->
                                    <cus-slider v-model="uiForm.iconSize" :min="50" :max="180" @input="changeUI('iconSize')" show-input :show-tooltip="false"></cus-slider>
                                </el-form-item>
                                <el-form-item label="图标间距">
                                    <!--<el-slider v-model="uiForm.iconMargin" :min="10" :max="100" @input="changeUI('iconMargin')" show-input :show-tooltip="false"></el-slider>-->
                                    <cus-slider v-model="uiForm.iconMargin" :min="10" :max="100" @input="changeUI('iconMargin')" show-input :show-tooltip="false"></cus-slider>
                                </el-form-item>
                                <el-form-item label="图标透明度">
                                    <!--<el-slider v-model="uiForm.iconOpacity" :min="20" :max="100" @input="changeUI('iconOpacity')" show-input :show-tooltip="false"></el-slider>-->
                                    <cus-slider v-model="uiForm.iconOpacity" :min="20" :max="100" @input="changeUI('iconOpacity')" show-input :show-tooltip="false"></cus-slider>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="ui-set-module-box">
                            <div class="ui-set-module-box-title" @click="uiFormStyle.showCardSetting=!uiFormStyle.showCardSetting">卡片样式设置</div>
                            <div class="ui-set-module-box-content" v-if="uiFormStyle.showCardSetting">
                                <el-form-item label="卡片大小">
                                    <!--<el-slider v-model="uiForm.cardHeight" :min="100" :max="300" @input="changeUI('cardHeight')" show-input :show-tooltip="false"></el-slider>-->
                                    <cus-slider v-model="uiForm.cardHeight" :min="100" :max="300" @input="changeUI('cardHeight')" show-input :show-tooltip="false"></cus-slider>
                                </el-form-item>
                                <el-form-item label="卡片间距">
                                    <!--<el-slider v-model="uiForm.cardMargin" :min="10" :max="100" @input="changeUI('cardMargin')" show-input :show-tooltip="false"></el-slider>-->
                                    <cus-slider v-model="uiForm.cardMargin" :min="10" :max="100" @input="changeUI('cardMargin')" show-input :show-tooltip="false"></cus-slider>
                                </el-form-item>
                                <el-form-item label="卡片透明度">
                                    <!--<el-slider v-model="uiForm.cardOpacity" :min="20" :max="100" @input="changeUI('cardOpacity')" show-input :show-tooltip="false"></el-slider>-->
                                    <cus-slider v-model="uiForm.cardOpacity" :min="20" :max="100" @input="changeUI('cardOpacity')" show-input :show-tooltip="false"></cus-slider>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="ui-set-module-box">
                            <div class="ui-set-module-box-title" @click="uiFormStyle.showDateTimeSetting=!uiFormStyle.showDateTimeSetting">时间日期设置</div>
                            <div class="ui-set-module-box-content" v-if="uiFormStyle.showDateTimeSetting">

                                <el-form-item label="时间格式">
                                    <!--<el-select v-model="uiForm.formatTime" size="small" style="width: 180px" @change="changeDateTimeFormat">-->
                                        <!--<el-option v-for="item in timeFormatList" :label="item" :value="item"></el-option>-->
                                    <!--</el-select>-->
                                    <cus-select v-model="uiForm.formatTime" @change="changeDateTimeFormat"
                                        :options="timeFormatList"></cus-select>
                                </el-form-item>

                                <el-form-item label="日期格式">
                                    <cus-select v-model="dateFormatForm.date1" @change="changeDateTimeFormat('date1')"
                                                :options="dateFormatList"></cus-select>

                                </el-form-item>
                                <el-form-item>
                                    <cus-select v-model="dateFormatForm.date2" @change="changeDateTimeFormat('date2')"
                                                :options="dateFormatYearList"></cus-select>
                                </el-form-item>
                                <el-form-item>
                                    <cus-select v-model="dateFormatForm.date3" @change="changeDateTimeFormat('date3')"
                                                :options="dateFormatWeekList"></cus-select>
                                </el-form-item>

                                <!--<el-form-item label="日期格式">
                                    <el-cascader
                                            style="width: 280px"
                                            popper-class="date-panel"
                                            size="small"
                                            v-model="uiForm.formatDateList"
                                            :options="dateFormatCascaderList"
                                            @change="changeDateTimeFormat('date')">
                                    </el-cascader>
                                </el-form-item>-->

                            </div>
                        </div>
                        <div class="ui-set-module-box">
                            <div class="ui-set-module-box-title" @click="uiFormStyle.showSearchSetting=!uiFormStyle.showSearchSetting">搜索设置</div>
                            <div class="ui-set-module-box-content" v-if="uiFormStyle.showSearchSetting">
                                <el-form-item label="搜索历史">
                                    <!--<el-switch v-model="uiForm.openHistory" active-text="开启" inactive-text="关闭" @change="changeSearch"></el-switch>-->
                                    <cus-switch v-model="uiForm.openHistory" active-text="开启" inactive-text="关闭" @change="changeSearch"></cus-switch>
                                </el-form-item>
                                <el-form-item label="搜索建议">
                                    <!--<el-switch v-model="uiForm.openSuggest" active-text="开启" inactive-text="关闭" @change="changeSearch"></el-switch>-->
                                    <cus-switch v-model="uiForm.openSuggest" active-text="开启" inactive-text="关闭" @change="changeSearch"></cus-switch>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="ui-set-module-box">
                            <div class="ui-set-module-box-title" @click="uiFormStyle.showOpenSetting=!uiFormStyle.showOpenSetting">跳转方式设置</div>
                            <div class="ui-set-module-box-content" v-if="uiFormStyle.showOpenSetting">
                                <el-form-item label="新页面打开图标链接" label-width="140px">
                                    <cus-switch v-model="uiForm.openNewTabIcon" active-text="开启" inactive-text="关闭" @change="changeSearch"></cus-switch>
                                </el-form-item>
                                <el-form-item label="新页面打开卡片链接" label-width="140px">
                                    <cus-switch v-model="uiForm.openNewTabCard" active-text="开启" inactive-text="关闭" @change="changeSearch"></cus-switch>
                                </el-form-item>
                            </div>
                        </div>
                    </el-form>
                </div>

                <div v-else-if="activeSettingTabName==='data'">
                    <Backup/>
                </div>

                <div v-else>
                    <div v-if="activeSettingTabName==='application'" style="margin-bottom: 15px;display: flex;">
                        <span style="margin-top: 0">切换分类：</span>
                        <cus-radio v-model="activeCategory.category" :options="categoryList" label-key="category" value-key="category">
                        </cus-radio>
                        <!--<el-radio-group v-model="activeCategory.category" size="mini">-->
                            <!--<el-radio-button v-for="item in categoryList" :label="item.category"></el-radio-button>-->
                        <!--</el-radio-group>-->
                    </div>

                    <p style="margin-top: 0">拖拽可排序</p>

                    <cus-list :data="settingTableData" draggable @sort="sortItem">
                        <cus-list-item slot-scope="scope">
                            <template v-if="activeSettingTabName==='search'">
                                <div slot="avatar" class="avatar">
                                    <cus-avatar :type="scope.item.iconType" :content="scope.item.icon" :name="scope.item.name"></cus-avatar>
                                </div>
                                <div slot="title">{{scope.item.name}}</div>
                                <div slot="content">{{scope.item.url}}</div>
                            </template>
                            <template v-else-if="activeSettingTabName==='category'">
                                <div slot="title">{{scope.item.category}}</div>
                                <div slot="content">
                                    <el-tag size="mini" v-if="scope.item.type === 'icon'" color="#cbffff" effect="plain">图标</el-tag>
                                    <el-tag size="mini" v-else-if="scope.item.type === 'card'" color="#dedefd" effect="plain">卡片</el-tag>
                                </div>
                            </template>
                            <template v-else-if="activeSettingTabName==='application'">
                                <template v-if="activeCategory.type==='icon'">
                                    <div slot="avatar" class="avatar">
                                        <cus-avatar :type="scope.item.iconType" :content="scope.item.icon" :name="scope.item.name"></cus-avatar>
                                    </div>
                                    <div slot="title">
                                        <span>图标：</span>
                                        <span>{{scope.item.name}}</span>
                                    </div>
                                    <div slot="content">{{scope.item.url}}</div>
                                </template>
                                <template v-if="activeCategory.type==='card'">
                                    <div slot="title">
                                        <span>卡片：</span>
                                        <span>{{scope.item.name}}</span>
                                    </div>
                                    <div slot="content">
                                     <div v-for="cont in scope.item.list">
                                         <span>{{cont.name}}: </span>
                                         <span style="cursor: default">{{cont.url}}</span>
                                    </div>
                                    </div>
                                </template>
                            </template>
                        </cus-list-item>
                    </cus-list>
                </div>

                <!--<div v-else>
                    <div v-if="activeSettingTabName==='application'" style="margin-bottom: 15px">
                        <el-radio-group v-model="activeCategory.category" size="mini">
                            <el-radio-button v-for="item in categoryList" :label="item.category"></el-radio-button>
                        </el-radio-group>
                    </div>

                    <el-table
                            :data="settingTableData"
                            size="small"
                            border
                            stripe
                    >
                        <el-table-column type="expand" prop="id" label="展开">
                            <template slot-scope="props">
                                <ul v-if="props.row.list">
                                    <li v-for="(item, index) in props.row.list"
                                         :key="index"
                                    >{{item.name}} : <a class='aLink' :href="item.url" target="_blank">{{item.url}}</a></li>
                                </ul>
                            </template>
                        </el-table-column>

                        <el-table-column v-for="item in settingTableColumns" :prop="item.key" :label="item.name">
                            <template slot-scope="props">
                                <span v-if="item.key === 'type'">
                                    <el-tag size="mini" v-if="props.row[item.key] === 'icon'" color="#cbffff" effect="plain">图标</el-tag>
                                    <el-tag size="mini" v-else-if="props.row[item.key] === 'card'" color="#dedefd" effect="plain">卡片</el-tag>
                                    <template v-else>{{props.row[item.key]}}</template>
                                </span>
                                <span v-else>
                                    {{props.row[item.key]}}
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column prop="sort" label="排序">
                            <template slot-scope="scope">
                                <span class="text-button" @click="changeSort(scope.$index, 'up')">上移</span>
                                <span class="text-button" style="color: #86c021" @click="changeSort(scope.$index, 'down')">下移</span>
                            </template>
                        </el-table-column>

                        <el-table-column prop="operate" label="操作">
                            <template slot-scope="scope">
                                <span class="text-button" @click="operateItem('set', scope.row)">编辑</span>
                                <el-popconfirm
                                        confirm-button-text='好的'
                                        cancel-button-text='不用了'
                                        confirm-button-type="danger"
                                        icon="el-icon-info"
                                        icon-color="red"
                                        title="确定删除吗？"
                                        @confirm="operateItem('del', scope.row)">
                                    <span slot="reference" class="text-button" style="color: red">删除</span>
                                </el-popconfirm>
                            </template>
                        </el-table-column>

                    </el-table>
                </div>-->
            </div>
        </el-drawer>
    </div>
</template>

<script>
    import IndexedDb from '@/utils/IndexedDb';
    import Util from '@/utils/Util';
    import DefaultData from '@/data/DefaultData';
    import EventBus from "../../data/EventBus";
    import {CategoryType} from "../../data/Entity";

    import CategoryForm from './CategoryForm'
    import IconForm from './IconForm'
    import CardForm from './CardForm'
    import EngineForm from "./EngineForm";
    import Backup from "./Backup";
    import SettingData from "../../data/SettingData";
    import BackgroundSource from "../../utils/BackgroundSource";
    import CusSlider from "../formItem/cus-slider";
    import CusSelect from "../formItem/cus-select";
    import CusSwitch from "../formItem/cus-switch";
    import CusList from "../formItem/cus-list";
    import CusListItem from "../formItem/cus-list-item";
    import CusAvatar from "../formItem/cus-avatar";
    import CusRadio from "../formItem/cus-radio";

    export default {
        name: "Setting",
        components: {
            CusRadio,
            CusAvatar,
            CusListItem,
            CusList,
            CusSwitch,
            CusSelect,
            CusSlider,
            CategoryForm,
            IconForm,
            CardForm,
            EngineForm,
            Backup,
        },
        data() {
            return {
                showSettingTab: false,
                activeSettingTabName: 'search',
                oldActiveSettingTabName: '',
                settingTableData: [],
                settingTableColumns: [],
                searchTypeList: [],
                categoryList: [],
                applicationList: [],
                settingList: [],
                activeCategory: {},

                uiForm: {},
                uiFormSet: "",
                uiFormStyle: {
                    showBackgroundSetting: false,
                    showIconSetting: false,
                    showCardSetting: false,
                    showDateTimeSetting: false,
                    showSearchSetting: false,
                    showOpenSetting: false,
                },
                dateFormatForm: {date1: '', date2: '', date3: ''},

                // 一些初始化设定
                backgroundSourceList: BackgroundSource.backgroundSourceList,
                timeFormatList: SettingData.timeFormatList,
                dateFormatList: SettingData.dateFormatCascaderList,
                dateFormatYearList: SettingData.dateFormatCascaderList,
                dateFormatWeekList: SettingData.dateFormatWeekList,

            }
        },
        mounted() {
            this.$bus.$on(EventBus.OpenDrawSetting, () => {
                this.openSetting();
            });
            this.$bus.$on(EventBus.RefreshSetting, () => {
                this.openSetting();
            });

            this.$bus.$on(EventBus.ActiveCategory, (data) => {
                this.activeCategory = Util.deepClone(data);
            });
        },
        watch: {
            "activeCategory.category": {
                handler(newVal) {
                    this.$bus.$emit(EventBus.ActiveNav, newVal);
                    this.activeSettingTab();
                },
                immediate: true
            }
        },
        async created() {
            let defaultSetting = Util.deepClone(DefaultData.SETTING[0]);
            // console.log(JSON.stringify(defaultSetting));

            let result = await IndexedDb.getSetting().catch(e=>{console.log(e)});
            if (result && result.success) {
                if (result.data && result.data.length > 0) {
                    // this.uiForm = result.data[0];
                    // console.log(this.uiForm);
                    let setting = result.data[0];
                    let fields = [];
                    for (let key of Object.keys(setting)) {
                        if (!key) {
                            continue;
                        }
                        if (key === 'bgBlur') {
                            fields.push(key);
                            continue;
                        }
                        if (defaultSetting[key] === setting[key]) {
                            continue;
                        }
                        fields.push(key);
                    }
                    // console.log(fields, defaultSetting, setting);
                    if (fields.length > 0) {
                        this.uiForm = Util.deepClone(setting);
                        delete this.uiForm.id;
                        for (let field of fields) {
                            let ignore = this.changeUI(field);
                        }

                    }
                }
            }

            // let ignore =this.initSettingData();
        },
        methods: {
            testCom() {
                console.log(this.uiForm.test);
            },
            sortItem(list) {
                console.log(list);

                let sort = 0;
                for (let item of list) {
                    if (item) {
                        item['sort'] = sort++;
                        if (this.activeSettingTabName === 'search') {
                            IndexedDb.setSearchType(item);
                            this.$bus.$emit(EventBus.RefreshSearchType, {from: 'Setting'});
                        }
                        else if (this.activeSettingTabName === 'category') {
                            IndexedDb.setCategory(item);
                            this.$bus.$emit(EventBus.RefreshCategory, {from: 'Setting'});
                        }
                        else if (this.activeSettingTabName === 'application') {
                            IndexedDb.setApplication(item);
                            this.$bus.$emit(EventBus.RefreshApp);
                            this.$bus.$emit(EventBus.RefreshSetting);
                        }
                    }
                }
            },

            async initSettingData() {
                // console.log("initSettingData");
                let that = this;
                await IndexedDb.getSearchType().then(result => {
                    if (result && result.success) {
                        that.$set(that, 'searchTypeList', result.data);
                    } else {
                        that.$message({type: 'error',message: '获取搜索方式失败!'});
                    }
                }).catch(e=>{console.log(e)});
                await IndexedDb.getCategory().then(result => {
                    if (result && result.success) {
                        that.$set(that, 'categoryList', result.data);
                        // result.data.forEach(item => that.categoryList.push(item));
                    } else {
                        that.$message({type: 'error',message: '获取分类列表失败!'});
                    }
                }).catch(e=>{console.log(e)});
                await IndexedDb.getApplication().then(result => {
                    if (result && result.success) {
                        that.$set(that, 'applicationList', result.data);
                    } else {
                        that.$message({type: 'error',message: '获取应用列表失败!'});
                    }
                }).catch(e=>{console.log(e)});
                await IndexedDb.getSetting().then(result => {
                    if (result && result.success) {
                        that.$set(that, 'settingList', result.data);
                    } else {
                        that.$message({type: 'error',message: '获取设置列表失败!'});
                    }
                }).catch(e=>{console.log(e)});
            },

            // 设置-打开设置面板
            async openSetting() {
                if (this.oldActiveSettingTabName && this.oldActiveSettingTabName !== '') {
                    this.activeSettingTabName = this.oldActiveSettingTabName;
                } else {
                    this.activeSettingTabName = 'search';
                }
                this.showSettingTab=true;
                await this.initSettingData().catch(e=>{console.log(e)});
                this.activeSettingTab();
            },
            // 设置-切换tab
            activeSettingTab() {
                if (this.activeSettingTabName === 'close') {
                    this.showSettingTab = false;
                    return;
                }
                this.oldActiveSettingTabName = this.activeSettingTabName;

                this.settingTableColumns = [];

                this.settingTableData = [];
                if (this.activeSettingTabName === 'search') {
                    this.settingTableData = this.searchTypeList;
                    this.settingTableColumns.push({key: 'name', name: '名称'});
                    this.settingTableColumns.push({key: 'url', name: 'url'});
                }
                if (this.activeSettingTabName === 'category') {
                    this.settingTableData = this.categoryList;
                    this.settingTableColumns.push({key: 'category', name: '名称'});
                    this.settingTableColumns.push({key: 'type', name: '类型'});
                }
                if (this.activeSettingTabName === 'application') {
                    let apps = [];
                    let category = this.activeCategory.category;
                    this.applicationList.forEach(item => {
                        if (item && item.category === category) {
                            apps.push(item);
                        }
                    });
                    this.settingTableData = apps.sort(Util.sortAsc);
                    this.settingTableColumns.push({key: 'name', name: '名称'});
                    this.settingTableColumns.push({key: 'type', name: '类型'});
                    this.settingTableColumns.push({key: 'category', name: '分类'});
                }
                if (this.activeSettingTabName === 'ui') {
                    if (this.settingList && this.settingList.length > 0) {
                        this.uiForm = this.settingList[0];
                        let dateList = this.uiForm.formatDateList;
                        if (dateList && dateList.length === 3) {
                            this.dateFormatForm.date1 = dateList[0];
                            this.dateFormatForm.date2 = dateList[1];
                            this.dateFormatForm.date3 = dateList[2];
                            for (let item of this.dateFormatList) {
                                if (this.dateFormatForm.date1 === item.value) {
                                    this.$set(this, 'dateFormatYearList', item.children);
                                    break;
                                }
                            }
                        }
                        // console.log('act', this.dateFormatForm);
                    }
                    this.settingTableColumns.push({key: 'name', name: '名称'});
                }


            },

            // 数据交互：调整顺序
            changeSort(index, type) {
                let list = this.settingTableData;

                if ('up' === type) {
                    let indexMove = (list.length + index - 1) % list.length;
                    let tempUser = list[indexMove];
                    this.$set(list, indexMove, list[index]);
                    this.$set(list, index, tempUser);
                }
                else if ('down' === type) {
                    let indexMove = (index + 1) % list.length;
                    let tempUser = list[indexMove];
                    this.$set(list, indexMove, list[index]);
                    this.$set(list, index, tempUser);
                }

                let sort = 0;
                for (let item of list) {
                    if (item) {
                        item['sort'] = sort++;
                        if (this.activeSettingTabName === 'search') {
                            IndexedDb.setSearchType(item);
                            this.$bus.$emit(EventBus.RefreshSearchType, {from: 'Setting'});
                        }
                        else if (this.activeSettingTabName === 'category') {
                            IndexedDb.setCategory(item);
                            this.$bus.$emit(EventBus.RefreshCategory, {from: 'Setting'});
                        }
                        else if (this.activeSettingTabName === 'application') {
                            IndexedDb.setApplication(item);
                            this.$bus.$emit(EventBus.RefreshApp);
                            this.$bus.$emit(EventBus.RefreshSetting);
                        }
                    }
                }
            },

            // 视觉效果-ui数据更新
            async changeUI(field) {
                if (!field) {
                    return;
                }

                if (field === 'bgBlur') { // 背景模糊度设置
                    Util.setRootCssValue('--bg-blur', this.uiForm.bgBlur + "px");
                    Util.setRootCssValue('--bg-scale', 1 + this.uiForm.bgBlur * 0.2 / 50);
                }
                if (field === 'bgMaskRgba') { // 遮罩设置
                    Util.setRootCssValue('--bg-mask-rgba', 'rgba(0,0,0,' + this.uiForm.bgMaskRgba + ")");
                }
                if (field === 'bgUrl') {
                    BackgroundSource.setBackground(this.uiForm.bgUrl);
                    // console.log('init bgUrl', this.uiForm.bgUrl);
                }

                if (field === 'iconSize') { // 图标大小
                    Util.setRootCssValue('--icon-size', this.uiForm.iconSize + "px");
                }
                if (field === 'iconRadius') { // 图标圆角大小
                    Util.setRootCssValue('--icon-radius', this.uiForm.iconRadius + "px");
                }
                if (field === 'iconOpacity') { // 图标透明度
                    Util.setRootCssValue('--icon-opacity', this.uiForm.iconOpacity);
                }
                if (field === 'iconMargin') { // 图标间距
                    Util.setRootCssValue('--icon-margin', this.uiForm.iconMargin + 'px');
                }

                if (field === 'cardOpacity') { // 卡片透明度
                    Util.setRootCssValue('--card-opacity', this.uiForm.cardOpacity);
                }
                if (field === 'cardMargin') { // 卡片间距
                    Util.setRootCssValue('--card-margin', this.uiForm.cardMargin + 'px');
                }
                if (field === 'cardHeight') { // 卡片设置
                    Util.setRootCssValue('--card-height', this.uiForm.cardHeight + "px");
                    // 固定宽高比 w : h = 17 : 19
                    let newCarWidth = this.uiForm.cardHeight * 17 / 19;
                    if (this.uiForm.cardWidth !== newCarWidth) {
                        this.uiForm.cardWidth = newCarWidth;
                        Util.setRootCssValue('--card-width', this.uiForm.cardWidth + "px");
                    }
                }

                if (this.uiForm && this.uiForm.id) {
                    let result = await IndexedDb.setSetting(Util.deepClone(this.uiForm)).catch(e=>{console.log(e)});
                    if (result && !result.success) {
                        this.$message({type: 'error', message: '保存UI设置失败!'});
                    }

                }
            },

            async operateItem(optType, item) {
                // console.log(this.activeSettingTabName, optType, item);

                if (optType === 'set') {
                    if (item.category) {
                        this.$bus.$emit(EventBus.ActiveNav, item.category);
                    }
                    item = Util.deepClone(item);

                    let eventParams = {
                        fromSetting: true,
                        item: item,
                    };

                    if (this.activeSettingTabName === 'application') {
                        if (item.type === CategoryType.ICON) {
                            eventParams.iconOptType = optType;
                            this.$bus.$emit(EventBus.OpenDrawIcon, eventParams);
                        }
                        else if (item.type === CategoryType.CARD) {
                            eventParams.cardOptType = optType;
                            this.$bus.$emit(EventBus.OpenDrawCard, eventParams);
                        }
                    }
                    else if (this.activeSettingTabName === 'category') {
                        eventParams.categoryOptType = optType;
                        this.$bus.$emit(EventBus.OpenDrawCategory, eventParams);
                    }
                    else if (this.activeSettingTabName === 'search') {
                        eventParams.searchTypeOptType = optType;
                        this.$bus.$emit(EventBus.OpenDrawSearchType, eventParams);
                    }
                }

                else if (optType === 'del' && item && item.id) {

                    let result = {success: true};
                    switch (this.activeSettingTabName) {
                        case 'application':
                            result = await IndexedDb.delApplication(item).catch(e=>{console.log(e)});
                            if (result && result.success) this.$bus.$emit(EventBus.RefreshApp);
                            break;
                        case 'category':
                            result = await IndexedDb.delCategory(item).catch(e=>{console.log(e)});
                            if (result && result.success) this.$bus.$emit(EventBus.RefreshCategory);
                            break;
                        case 'search':
                            result = await IndexedDb.delSearchType(item).catch(e=>{console.log(e)});
                            if (result && result.success) this.$bus.$emit(EventBus.RefreshSearchType);
                            break;
                    }

                    if (result && result.success) {
                        this.$bus.$emit(EventBus.RefreshSetting);
                    } else {
                        console.log(result);
                        this.$message({type: 'error', message: '删除失败!'});
                    }
                }
            },

            // 更改背景图片源
            async changeBgSource() {
                // console.log(this.uiForm.bgSource);
                if (this.uiForm && this.uiForm.bgSource) {
                    let result = await IndexedDb.setSetting(Util.deepClone(this.uiForm)).catch(e=>{console.log(e)});
                    if (result && !result.success) {
                        this.$message({type: 'error', message: '保存UI设置失败!'});
                    }

                }
            },
            // 设置时间日期格式
            async changeDateTimeFormat(type) {
                if (type === 'date1') {
                    for (let item of this.dateFormatList) {
                        if (this.dateFormatForm.date1 === item.value) {
                            this.$set(this, 'dateFormatYearList', item.children);
                            this.$set(this.dateFormatForm, 'date2', this.dateFormatYearList[0].value);
                            break;
                        }
                    }
                }

                if (type === 'date1' || type === 'date2' || type === 'date3') {
                    // console.log(JSON.stringify(this.dateFormatForm));
                    if (this.dateFormatForm.date1 === undefined || this.dateFormatForm.date1 === '') {
                        return
                    }
                    if (this.dateFormatForm.date2 === undefined || this.dateFormatForm.date2 === '') {
                        return
                    }
                    if (this.dateFormatForm.date3 === undefined) {
                        return
                    }
                    this.uiForm.formatDateList = [this.dateFormatForm.date1, this.dateFormatForm.date2, this.dateFormatForm.date3];
                    // console.log(this.uiForm.formatDateList);

                    let formatDateList = this.uiForm.formatDateList;
                    // console.log(formatDateList);
                    if (!formatDateList) {
                        return;
                    }
                    if (this.uiForm.formatDateList.length !== 3) {
                        return;
                    }
                    let date = formatDateList[1];
                    let week = formatDateList[2];
                    if (week !== "") {
                        if (week.startsWith(" ")) {
                            date = date + week;
                        }
                        else if (week.endsWith(" ")) {
                            date = week + date;
                        }
                    }
                    console.log(date);
                    this.uiForm.formatDate = date;
                }

                if (type === 'date') {
                    let formatDateList = this.uiForm.formatDateList;
                    // console.log(formatDateList);
                    if (!formatDateList) {
                        return;
                    }
                    if (this.uiForm.formatDateList.length !== 3) {
                        return;
                    }
                    let date = formatDateList[1];
                    let week = formatDateList[2];
                    if (week !== "") {
                        if (week.startsWith(" ")) {
                            date = date + week;
                        }
                        else if (week.endsWith(" ")) {
                            date = week + date;
                        }
                    }
                    console.log(date);
                    this.uiForm.formatDate = date;
                }


                // return;

                if (this.uiForm && (this.uiForm.formatTime || this.uiForm.formatDate)) {
                    let result = await IndexedDb.setSetting(Util.deepClone(this.uiForm)).catch(e=>{console.log(e)});
                    if (result && !result.success) {
                        this.$message({type: 'error', message: '保存时间日期设置失败!'});
                        return;
                    }
                }

                this.$bus.$emit(EventBus.RefreshClockFormat,
                    {
                        timeFormat: this.uiForm.formatTime,
                        dateFormat: this.uiForm.formatDate,
                    });
            },

            async changeSearch() {
                if (this.uiForm) {
                    let result = await IndexedDb.setSetting(Util.deepClone(this.uiForm)).catch(e=>{console.log(e)});
                    if (result && !result.success) {
                        this.$message({type: 'error', message: '保存UI设置失败!'});
                        return;
                    }
                }
                this.$bus.$emit(EventBus.RefreshSearchSetting, {});
            },
        }
    }
</script>

<style scoped>
    /*设置*/
    .app-set {
        padding: 5px;
        margin: 10px 0;
        border: #72767b dashed 1px;
        border-radius: 5px;
    }
    .app-set:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .ui-set-module-box {
        margin-bottom: 15px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
        /*padding: 0px 10px 1px 0;*/
        border-radius: 5px;
        border: var(--bg-mask) solid 1px;
    }
    .ui-set-module-box-title {
        border-radius: 5px 5px 0 0;
        background: var(--bg-mask);
        padding: 15px 0 13px 9px;
        border-bottom: var(--bg-mask) solid 1px;
        cursor: pointer;
        /*width: 100%;*/
        /*margin-bottom: 20px;*/
    }
    .ui-set-module-box-title:hover {
        color: #66b1ff;
    }

    .ui-set-module-box-content {
        padding: 0 10px;
        margin-top: 20px;
    }

    .aLink {
        text-decoration: none;
        color: #909399;
    }
    .aLink:hover {
        color: #409EFF;
    }
</style>
