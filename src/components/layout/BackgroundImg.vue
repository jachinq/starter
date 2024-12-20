<!-- 背景图片 -->
<template>
    <div>
        <div class="random-img-button" @click="randomBackground" title="随机壁纸" @mouseenter="showBackground" @mouseleave="hideBackground">
            <i style="line-height: unset" :class="refresh ? 'el-icon-loading' : 'el-icon-refresh'"></i>
        </div>
        <div class="bg">
            <div class="bg-img" ref="bgImg"></div>
            <div class="bg-mask"></div>
        </div>
    </div>
</template>

<script>
    import Util from '@/utils/Util'
    import IndexedDb from '@/utils/IndexedDb'
    import BackgroundSource from "../../utils/BackgroundSource";

    export default {
        name: "BackgroundImg",
        data() {
            return {
                source: '',
                refresh: false,

                uiForm: {},
                timer: null,
            }
        },
        async created() {
            let bgUrl = '';
            // 查数据库看看有没有设置背景url
            let result = await IndexedDb.getSetting().catch(e=>{console.log(e)});
            if (result && result.success) {
                if (result.data && result.data.length > 0) {
                    let setting = result.data[0];
                    for (let key of Object.keys(setting)) {
                        if (key === 'bgUrl') {
                            bgUrl = setting[key];
                            break
                        }
                    }
                }
            }
            let noBg = bgUrl === undefined || bgUrl === null || bgUrl === '';
            if (noBg) {
                // 没背景，则加载默认背景
                let bgImgRef = this.$refs.bgImg;
                BackgroundSource.setDefaultBackground(bgImgRef);
            }
        },
        methods: {
            // 置顶壁纸
            showBackground() {
                // console.log("gad");
                let that = this;
                // Util.setRootCssValue('--bg-mask-rgba', 'rgba(0,0,0,' + this.uiForm.bgMaskRgba + ")");
                that.uiForm = {};

                this.timer = setTimeout(()=>{
                    try {
                        let bgBlur = Util.getRootCssValue('--bg-blur');
                        if (bgBlur && bgBlur !== '0px') {
                            that.uiForm['--bg-blur'] = bgBlur;
                            Util.setRootCssValue('--bg-blur', '0px');
                        }
                        let bgScale = Util.getRootCssValue('--bg-scale');
                        if (bgScale && bgScale !== '1') {
                            that.uiForm['--bg-scale'] = bgScale;
                            Util.setRootCssValue('--bg-scale', 1);
                        }
                        let bgMaskRgba = Util.getRootCssValue('--bg-mask-rgba');
                        if (bgMaskRgba && bgMaskRgba !== 'rgba(0,0,0,0)') {
                            that.uiForm['--bg-mask-rgba'] = bgMaskRgba;
                            Util.setRootCssValue('--bg-mask-rgba', 'rgba(0,0,0,0)');
                        }
                        Util.setRootCssValue('--bg-z-index', 1);
                    } catch (e) {
                        console.log(e);
                    }
                }, 1000);

            },
            // 置底壁纸
            hideBackground() {
                clearTimeout(this.timer);
                // console.log("gad1");
                Util.setRootCssValue('--bg-z-index', -100);
                for (let key of Object.keys(this.uiForm)) {
                    let value = this.uiForm[key];
                    console.log(key, value);
                    if (key && value) {
                        Util.setRootCssValue(key, value);
                    }
                }
            },

            // 更换随机背景
            async randomBackground() {
                if (this.refresh) {
                    return;
                }

                // 从设置中加载背景源，如果没有就走默认了
                let result = await IndexedDb.getSetting().catch(e=>{console.log(e)});
                if (result && result.success) {
                    if (result.data && result.data.length > 0) {
                        let setting = result.data[0];
                        if (setting && setting.bgSource) {
                            this.source = setting.bgSource;
                            console.log(this.source);
                        }
                    }
                }

                this.refresh = true;
                let that = this;
                try {
                    let imgUrl = await BackgroundSource.requestApi(this.source).catch(e=>{console.log(e)});
                    BackgroundSource.setBackground(imgUrl, function() {that.refresh = false});
                } catch (e) {
                    console.log(e);
                }

                // console.log("refresh", this.refresh);
                // this.refresh = false;
            },
        }
    }
</script>

<style scoped>
    .bg {
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: var(--bg-z-index);
    }
    .bg-img {
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: var(--bg-url);
        background-size: cover; /*覆盖填充*/
        background-position:center; /*居中*/
        z-index: var(--bg-z-index);
        filter: blur(var(--bg-blur));
        transform: scale(var(--bg-scale));
        transition: background-image 1.5s;
        /*transform: scale(1.2);*/
        /*
        0, 0
        25,0.1
        25, x
        50,0.2
        x = 25 * 0.2 / 50
        */
    }

    .bg-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: calc(var(--bg-z-index) + 1);
        background: var(--bg-mask-rgba);
        /*background:linear-gradient(to right, var(--bg-mask-rgba)0%, rgba(0,0,0,0)50%, var(--bg-mask-rgba)100%);*/
    }
    .random-img-button {
        top: 50px;
        right: 50px;
        position: absolute;
        height: 50px;
        width: 50px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        cursor: pointer;
        /*background-image: url("@/assets/img/favicon.");*/
        color: rgba(255, 255, 255, 0.5);
        line-height: 50px !important;
        text-align: center;
        box-sizing: border-box;
        font-size: 34px;
        transition: all 0.3s;
        user-select: none;
        z-index: 10;
    }
    .random-img-button:hover {
        background: rgba(255, 255, 255, 0.2);
    }
</style>
