<template>
    <el-drawer title="壁纸" :visible.sync="showBackground" :size="drawSize" :close-on-click-modal="false" center
        :with-header="false" :direction="drawDirection">
        <div style="text-align: center;padding: 5px 20px 0 20px">
            <el-tabs v-model="activeTabName" stretch tab-position="top" @tab-click="changeTab">
                <el-tab-pane name="close">
                    <span slot="label"><i class="el-icon-close"></i>关闭</span>
                </el-tab-pane>

                <!-- 随机壁纸 -->
                <el-tab-pane name="random">
                    <span slot="label"><i class="el-icon-refresh"></i>随机</span>
                    <div class="box">
                        <div class="formBox">
                            <el-form ref="bgForm" :model="bgForm" :inline="true">
                                <el-form-item label="背景来源">
                                    <cus-select :options="backgroundSourceList" v-model="bgForm.bgSource" label-key="name"
                                        value-key="name" style="width: 120px" @change="changeBgSource"></cus-select>
                                    <!--<el-select v-model="bgForm.bgSource" style="width: 80px" @change="changeBgSource">-->
                                    <!--<el-option v-for="item in backgroundSourceList" :label="item.name" :value="item.name"></el-option>-->
                                    <!--</el-select>-->
                                </el-form-item>

                                <el-form-item v-if="bgForm.bgSourceCategoryList && bgForm.bgSourceCategoryList.length > 0">
                                    <cus-select :options="bgForm.bgSourceCategoryList" v-model="bgForm.bgSourceCategory"
                                        style="width: 120px"></cus-select>
                                    <!--<el-select v-model="bgForm.bgSourceCategory" style="width: 80px">-->
                                    <!--<el-option v-for="item in bgForm.bgSourceCategoryList" :label="item.label" :value="item.value"></el-option>-->
                                    <!--</el-select>-->
                                </el-form-item>

                                <el-form-item label="背景数">
                                    <cus-input v-model="bgForm.limit" style="width: 60px"></cus-input>
                                </el-form-item>

                                <el-form-item>
                                    <el-button type="primary" @click="refreshBackground">刷新</el-button>
                                </el-form-item>

                                <el-form-item label="模式">
                                    <cus-radio v-model="bgForm.preview"
                                        :options="[{ label: '预览', value: 1 }, { label: '设置', value: 2 }, { label: '收藏', value: 3 }]"
                                        @change="switchPreview"></cus-radio>
                                    <!--<el-radio-group v-model="bgForm.preview" @change="switchPreview">-->
                                    <!--<el-radio-button :label="1">预览</el-radio-button>-->
                                    <!--<el-radio-button :label="2">设置</el-radio-button>-->
                                    <!--<el-radio-button :label="3">收藏</el-radio-button>-->
                                    <!--</el-radio-group>-->
                                </el-form-item>
                                <el-form-item>
                                    <el-tooltip class="item" effect="dark" placement="top-start">
                                        <div slot="content">
                                            预览：点击图片查看大图<br>设置：点击图片设置壁纸<br>收藏：点击图片收藏
                                        </div>
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="randomImgBox">
                            <el-image @click="openImg(item)" class="randomImg" :src="item.thumb"
                                style="width: 250px;height: 140px" lazy fit="cover" :preview-src-list="bgForm.previewBgList"
                                v-for="item in bgForm.bgList">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                                <div slot="placeholder" class="image-slot">
                                    <span class="dot">加载中...</span>
                                </div>
                            </el-image>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- 收藏壁纸 -->
                <el-tab-pane name="collect">
                    <span slot="label"><i class="el-icon-collection-tag"></i>喜欢</span>

                    <div class="box">
                        <div class="formBox">
                            <el-form ref="collectForm" :model="collectForm" :inline="true">
                                <el-form-item label="模式">

                                    <cus-radio v-model="collectForm.type"
                                        :options="[{ label: '预览', value: 1 }, { label: '设置', value: 2 }, { label: '删除', value: 3 }]"></cus-radio>
                                    <!--<el-radio-group v-model="collectForm.type" size="small">-->
                                    <!--<el-radio-button :label="1">预览</el-radio-button>-->
                                    <!--<el-radio-button :label="2">设置</el-radio-button>-->
                                    <!--<el-radio-button :label="3">删除</el-radio-button>-->
                                    <!--</el-radio-group>-->
                                </el-form-item>
                                <el-form-item>
                                    <el-tooltip class="item" effect="dark" placement="top-start">
                                        <div slot="content">
                                            预览：点击图片查看大图<br>设置：点击图片设置壁纸<br>删除：点击图片删除收藏
                                        </div>
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="randomImgBox">
                            <el-image @click="collectClick(item, index)" class="randomImg" :src="item.thumb"
                                style="width: 250px;height: 140px" lazy fit="cover"
                                :preview-src-list="collectForm.previewCollectList"
                                v-for="(item, index) in collectForm.collectImgs">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                                <div slot="placeholder" class="image-slot">
                                    <span class="dot">加载中...</span>
                                </div>
                            </el-image>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- 自定义壁纸 -->
                <el-tab-pane name="customer">
                    <span slot="label"><i class="el-icon-setting"></i>自定义</span>

                    <div class="box">
                        <div class="formBox">
                            <el-form :inline="true" size="small" ref="customForm" :model="customForm">
                                <el-form-item>
                                    <cus-input placeholder="请输入自定义图片地址" v-model="customForm.src"
                                        :clearable="true"></cus-input>
                                </el-form-item>

                                <el-form-item>
                                    <el-button type="primary" @click="setBgImg(customForm.src, 'customer')"
                                        title="点击设置为壁纸">设置</el-button>
                                    <el-button type="danger" @click="delBgImg" title="点击还原为默认壁纸">删除</el-button>
                                </el-form-item>
                            </el-form>
                        </div>

                        <div class="randomImgBox">
                            <span>免费壁纸：</span>
                            <a class="pictureLink" target="_blank" href="http://simpledesktops.com/browse/">Simple
                                Desktops</a>
                            <a class="pictureLink" target="_blank" href="https://wallpaperscraft.com/">WallpapersCraft</a>
                            <a class="pictureLink" target="_blank" href="https://www.gamewallpapers.com/">GameWallpapers</a>
                            <a class="pictureLink" target="_blank" href="https://bz.zzzmh.cn/index">极简壁纸</a>
                            <a class="pictureLink" target="_blank" href="https://www.imgtp.com/">图床</a>
                        </div>


                        <div class="randomImgBox">
                            <el-image v-if="customForm.src" class="randomImg" :src="customForm.src" style="width: 100%;"
                                lazy fit="cover">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                                <div slot="placeholder" class="image-slot">
                                    <span class="dot">加载中...</span>
                                </div>
                            </el-image>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-drawer>
</template>

<script>
import EventBus from "../../data/EventBus";
import BackgroundSource from "../../utils/BackgroundSource";
import IndexedDb from "../../utils/IndexedDb";
import Util from "../../utils/Util";
import CusInput from "../formItem/cus-input";
import CusSelect from "../formItem/cus-select";
import CusRadio from "../formItem/cus-radio";

export default {
    name: "Background",
    components: { CusRadio, CusSelect, CusInput },
    data() {
        return {
            showBackground: false,
            drawDirection: 'rtl',
            drawSize: '55%',

            activeTabName: 'random',
            oldActiveTabName: '',

            backgroundSourceList: BackgroundSource.backgroundSourceList,
            setting: [],

            // 随机表单
            bgForm: {
                limit: "3",
                bgList: [],
                previewBgList: [],
                preview: 1,
                bgSource: '',
                bgSourceCategory: '',
                bgSourceCategoryList: [],
            },

            // 收藏表单
            collectForm: {
                type: 1,
                collectImgs: [],
                previewCollectList: [],
            },

            // 自定义表单
            customForm: {
                src: '',
            },
        }
    },
    created() {
        // console.log('背景组件加载完毕', new Date());
    },
    mounted() {
        this.$bus.$on(EventBus.OpenBackground, (e) => {
            this.openBackground();
        });
    },
    methods: {
        // 初始化设置数据
        async initSettingData() {
            try {
                // console.log("initSettingData");
                let that = this;
                await IndexedDb.getSetting().then(result => {
                    if (result && result.success) {
                        that.$set(that, 'setting', result.data);
                    }
                }).catch(e => { console.log(e) });
            } catch (e) {
                console.log('initSettingData err', e);
            }
        },

        // 打开壁纸抽屉
        async openBackground() {
            try {
                if (this.oldActiveTabName && this.oldActiveTabName !== '') {
                    this.activeTabName = this.oldActiveTabName;
                } else {
                    this.activeTabName = 'random';
                }

                if (window.innerWidth >= window.innerHeight) {
                    this.drawDirection = 'rtl';
                    this.drawSize = '30%';
                } else {
                    this.drawDirection = 'btt';
                    this.drawSize = '50%';
                }
                this.showBackground = true;


                await this.initSettingData().catch(e => { console.log(e) });
                if (this.setting && this.setting.length > 0) {
                    let set = this.setting[0];
                    if (set.bgSource) {
                        this.bgForm.bgSource = set.bgSource || '博天';
                        this.initBgSelect();
                    }
                }

                setTimeout(() => {
                    try {

                        // 计算并重置盒子宽高
                        let imgBoxRef = document.getElementsByClassName('randomImgBox');
                        let reduceHeight = document.getElementsByClassName('formBox')[0].offsetHeight + 60;
                        let boxHeight = document.getElementsByClassName('el-drawer__body')[0].offsetHeight;
                        console.log(document.getElementsByClassName('el-drawer__body')[0]);

                        let realHeight = boxHeight - reduceHeight;
                        realHeight = realHeight <= 0 ? 150 : realHeight;
                        console.log('boxHeight', boxHeight, 'real', realHeight, 'reduceHeight', reduceHeight);

                        // console.log('boxRef', document.getElementsByClassName('box')[0].offsetHeight);
                        for (let a of imgBoxRef) {
                            // console.log('boxRef', a);
                            a.style.maxHeight = realHeight + 'px';
                        }


                    } catch (e) {
                        console.log(e);
                    }
                }, 500);


            } catch (e) {
                console.log('openBackground error', e);
            }

        },

        // 初始化背景来源选择
        initBgSelect() {
            try {
                let source = BackgroundSource.getBackgroundSource(this.bgForm.bgSource);
                let bgSourceCategory = undefined;
                let bgSourceCategoryList = [];
                if (source && source.select) {
                    if (source.select.category) {
                        bgSourceCategoryList = source.select.category;
                    }
                    if (source.select.default) {
                        bgSourceCategory = source.select.default;
                    }
                }
                this.$set(this.bgForm, 'bgSourceCategoryList', bgSourceCategoryList);
                this.$set(this.bgForm, 'bgSourceCategory', bgSourceCategory);
            } catch (e) {
                console.log('initBgSelect err', e);
            }
        },

        // 切换tab
        async changeTab(event) {
            if (event.name === 'close') {
                this.showBackground = false;
                return;
            }
            if (event.name === 'collect') {
                if (this.setting == null) {
                    await this.initSettingData().catch(e => { console.log(e) });
                }
                if (this.setting && this.setting.length > 0) {
                    let set = this.setting[0];
                    if (set && set.bgSource && set.collectImgs) {
                        this.collectForm.collectImgs = set.collectImgs.map(p => {
                            p.thumb = this.getImgUrlByCache(p.src, 250);
                            return p;
                        });
                    }
                }
            }
            this.oldActiveTabName = event.name;
        },

        // 从缓存获取地址
        getImgUrlByCache(src, thumbWidth) {
            if (src == null) {
                return '';
            }
            let isUseCache = false;
            if (!isUseCache) {
                return src;
            }
            let url = 'https://wsrv.nl/?url=' + src;
            if (thumbWidth && thumbWidth > 0)
                url += '&w=250';
            return url;
        },

        // 切换壁纸源
        async changeBgSource() {
            try {
                if (this.bgForm.bgSource) {
                    if (this.setting && this.setting.length > 0) {
                        let set = this.setting[0];
                        set.bgSource = this.bgForm.bgSource;
                        await IndexedDb.setSetting(set).catch(e => { console.log(e) });
                    }

                    this.initBgSelect();
                }
            } catch (e) {
                console.log('changeBgSource err', e);
            }
        },

        // 随机刷新壁纸
        async refreshBackground() {
            try {
                let limit = Number.parseInt(this.bgForm.limit) || 9;
                if (limit > 20) {
                    this.$message({ type: 'warning', message: '一次查询数量不能超过20' });
                    return;
                }

                for (let i = 0; i < limit; i++) {
                    let imgSrc = await BackgroundSource.requestApi(this.bgForm.bgSource, this.bgForm.bgSourceCategory).catch(e => { console.log(e) });
                    console.log("imgSrc", imgSrc);
                    if (imgSrc != null && imgSrc !== '') {
                        this.bgForm.bgList.unshift({ src: imgSrc, thumb: this.getImgUrlByCache(imgSrc, 250) });
                    }
                }

                console.log(this.bgForm.bgList);
                this.switchPreview();
            } catch (e) {
                console.log("refreshBackground err", e);
            }
        },

        // 打开壁纸
        openImg(item) {
            try {
                // console.log("open img");
                if (this.bgForm.preview === 1) {
                    return
                }
                if (this.bgForm.preview === 2) {
                    this.setBgImg(item.src)
                }
                if (this.bgForm.preview === 3) {
                    this.collectPic(item.src)
                }
            } catch (e) {
                console.log('openImg err', e);
            }
        },

        // 切换预览
        switchPreview() {
            try {

                if (this.bgForm.preview === 1) {
                    this.bgForm.previewBgList = this.bgForm.bgList.map(p => { return p.src });
                } else {
                    this.bgForm.previewBgList = [];
                }
                // console.log(this.bgForm);
            } catch (e) {
                console.log('switchPreview err', e);
            }
        },

        // 收藏壁纸点击
        async collectClick(item, index) {
            try {
                // console.log(item, index);
                // 预览模式
                if (this.collectForm.type === 1) {
                    this.collectForm.previewCollectList = this.collectForm.collectImgs.map(p => { return p.src; });
                }
                else {
                    this.collectForm.previewCollectList = [];
                }

                // 设置模式
                if (this.collectForm.type === 2) {
                    this.setBgImg(item.src);
                }

                // 删除模式
                else if (this.collectForm.type === 3) {
                    this.collectForm.collectImgs.splice(index, 1);
                    await this.initSettingData().catch(e => { console.log(e) });
                    if (this.setting && this.setting.length > 0) {
                        let set = this.setting[0];
                        set.collectImgs = this.collectForm.collectImgs;
                        await IndexedDb.setSetting(set).catch(e => { console.log(e) });
                    }
                    if (Util.copyText(item.src)) {
                        this.$notify({
                            title: '成功',
                            message: '已删除图片的url已复制到剪贴板',
                            type: 'success'
                        });
                    } else {
                        this.$notify({
                            title: '失败',
                            message: '已删除图片的url复制到剪贴板失败',
                            type: 'error'
                        });
                    }
                }
            } catch (e) {
                console.log('collectClick err', e);
            }
        },

        // 设置背景
        async setBgImg(imgUrl, type) {
            try {
                if (!imgUrl || imgUrl === '') {
                    if (type === 'customer') {
                        this.$notify({
                            title: '提示',
                            dangerouslyUseHTMLString: true,
                            message: '1.请输入图片地址<br>2.本地图片可使用图床转换得到图片地址<br>3.输入地址后预览加载失败则说明该图片地址不可用',
                            type: 'warning',
                            duration: 8000,
                        });
                    }
                    return;
                }

                BackgroundSource.setBackground(imgUrl, function(){});

            } catch (e) {
                console.log('setBgImg err', e);
            }
        },

        // 收藏壁纸
        async collectPic(imgUrl) {
            try {
                if (imgUrl == null || imgUrl === '') {
                    return;
                }
                await this.initSettingData().catch(e => { console.log(e) });

                let uiData = this.setting[0];
                if (uiData) {
                    let collected = false;
                    if (uiData.collectImgs != null) {
                        for (let collectImgsKey in uiData.collectImgs) {
                            let collectImg = uiData.collectImgs[collectImgsKey];
                            if (collectImg && collectImg.src === imgUrl) {
                                collected = true;
                                break;
                            }
                        }
                        uiData.collectImgs.push({ src: imgUrl });
                    } else {
                        uiData.collectImgs = [{ src: imgUrl }];
                    }

                    if (collected) {
                        console.log("collected", uiData.collectImgs);

                        this.$message({ type: 'warning', message: '已经收藏过了~' });
                    } else {
                        let result = await IndexedDb.setSetting(uiData).catch(e => { console.log(e) });
                        if (result && result.success) {
                            this.$message({ type: 'success', message: '收藏成功!' });
                        } else {
                            this.$message({ type: 'error', message: '收藏失败!' });
                        }
                    }
                }
            } catch (e) {
                console.log('collectPic', e);
            }
        },

        // 删除壁纸
        delBgImg() {
            try {
                this.$confirm('确认还原为默认背景吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    if (this.setting[0].bgUrl) {
                        delete this.setting[0].bgUrl;
                        await IndexedDb.setSetting(this.setting[0]).catch(e => { console.log(e) });
                    }
                    BackgroundSource.setDefaultBackground()
                }).catch(e => { console.log(e) });
            } catch (e) {
                console.log('delBgImg err', e);
            }
        }

    }
}
</script>

<style scoped>
.box {
    /*height: 563px;*/
}

.randomImgBox {
    /*max-height: 500px;*/
    /*max-height: calc(100% - 240px);*/
    overflow-y: scroll;
}

.randomImg {
    margin: 5px;
    border: gray solid 1px;
    border-radius: 10px;
}

.randomImg:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transform: translateY(-2px);
    /*filter: contrast(1) brightness(100%) saturate(100%) hue-rotate(-30deg);*/
    /*transform: scale(1.05);*/
}

.randomImg:hover img {
    transform: scale(2);
}

.pictureLink {
    text-decoration: none;
    color: #409EFF;
    margin-bottom: 20px;
}

.pictureLink:after {
    content: " | ";
    color: gray;
}

.pictureLink:last-child:after {
    content: '';
}
</style>
