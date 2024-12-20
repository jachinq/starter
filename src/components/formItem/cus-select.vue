<template>
    <div class="cus_select" v-clickoutside="clickCom">
        <div class="select-wrapper" ref="selectWrapperRef" :class="{'select-wrapper__disable': disabled}" @click="triggerOption">
            <div class="select-content">{{selectContent.label}}</div>
            <div class="triangle-wrapper" ref="triangleWrapperRef">
                <!--<div id="triangle-down"></div>-->
                <i class="triangle-down el-icon-arrow-down"></i>
            </div>
        </div>
        <div class="option-wrapper" ref="optionWrapperRef">
            <div class="option-item-scroll">
                <!-- 渲染父组件传来的值 -->
                <div class="option-item" v-for="(item,index) in options"
                     :class="{'selected-option-item': isStringArray(item) ? selectContent.value === item : selectContent.value === item[valueKey]}"
                     :key="index"
                     @mouseout="out($event)"
                     @mouseover="move($event)"
                     @click.prevent="choose(item)">{{isStringArray(item) ? item : item[labelKey]}}
                </div>
            </div>
            <!--<div class="popper__arrow"></div>-->
        </div>
    </div>
</template>

<script>
    import clickoutside from "../../utils/clickoutside";
    import Util from "../../utils/Util";

    export default {
        name: "cus-select",
        directives: { clickoutside },
        props: {
            //   接受父组件传过来的值
            options: {
                type: Array,
                default: []
            },
            placeholder: {
                type: String,
                default: '请选择',
            },
            value: undefined,
            disabled: {
                type: Boolean,
                default: false,
            },
            labelKey: {
                type: String,
                default: 'label'
            },
            valueKey: {
                type: String,
                default: 'value'
            },
            size: {
                type: String,
                default: 'middle'
            }
        },
        data() {
            return {
                showOption: false,
                selectContent: {value: undefined, label: this.placeholder},
            }
        },
        mounted() {
            // document.addEventListener('scroll', (e)=>{
            //     console.log(e);
            // })
        },
        computed: {
            selectWrapper() {
                return this.$refs.selectWrapperRef;
            },
            optionWrapper() {
                return this.$refs.optionWrapperRef;
            },
            optionItemList() {
                return document.getElementsByClassName("option-item");
            },
        },
        watch: {
            selectContent: {
                handler(val) {
                    this.$emit('input', val.value);
                },
                deep: true,
                immediate: true
            },
            value: {
                handler(val) {
                    // console.log('名', 'v=', this.value, 'l=', this.options);
                    for(let item of this.options) {
                        if (this.isStringArray(item)) {
                            if (item === this.value) {
                                this.selectContent.value = item;
                                this.selectContent.label = item;
                            }
                        } else {
                            if (item[this.valueKey] === this.value) {
                                this.selectContent.value = item[this.valueKey];
                                this.selectContent.label = item[this.labelKey];
                            }
                        }
                    }
                    // console.log(this.value, JSON.stringify(this.selectContent));
                },
                deep: true,
                immediate: true,
            },
        },
        methods: {
            isStringArray(item) {
                return typeof item === 'string';
            },
            move(event) {
                for (let item of this.optionItemList) {
                    item.classList.remove("hover");
                }
                event.currentTarget.classList.add("hover");
            },
            out(event) {
                event.currentTarget.classList.remove("hover");
            },
            triggerOption() {
                // console.log('triggerOption', this.options);
                if (this.disabled) {
                    return;
                }
                this.openOrCloseOption();
                this.reverseTriangle(true);

                for (let item of this.optionItemList) {
                    if (item.innerHTML === this.selectContent.label) {
                        item.classList.add("hover");
                    } else {
                        item.classList.remove("hover");
                    }
                }
            },
            choose(item) {
                let val = undefined;
                if (this.isStringArray(item)) {
                    val = item;
                } else {
                    val = item[this.valueKey];
                }
                this.$emit("input", val);
                this.$emit("change", val);
                this.openOrCloseOption();
                this.reverseTriangle();
            },
            clickCom() {
                this.optionWrapper.style.display = "none";
                // console.log('clickCom');
                // this.openOrCloseOption();

            },

            // 样式控制
            openOrCloseOption() {
                // console.log();
                let style = this.optionWrapper.style;
                this.showOption = style.display === "block";
                if (this.showOption) {
                    style.display = "none";
                } else {
                    // let pos = Util.getPosition(this.selectWrapper);
                    let pos = this.selectWrapper.getBoundingClientRect();
                    // console.log(pos);

                    let width = this.selectWrapper.offsetWidth;
                    let height = this.selectWrapper.offsetHeight;

                    style.display = "block";
                    style.width = width + 'px';
                    style.left = (pos.left || 0) + 'px';
                    style.top = height + (pos.top || 0) + 10 + 'px';
                    // console.log(
                    //     'w=' +style.width,
                    //     'x=' + style.left,
                    //     'y=' + style.top,
                    // );

                }
            },
            reverseTriangle() {
                let triangleWrapper = this.$refs.triangleWrapperRef;
                if (triangleWrapper) {
                    if (this.showOption) {
                        triangleWrapper.classList.remove("is-reverse")
                    } else {
                        triangleWrapper.classList.add("is-reverse")
                    }
                }
            }
        },
    }
</script>


<style>

    .select-wrapper {
        display: flex;
        border-radius: 5px;
        /*position: relative;*/
        overflow: hidden;
        padding: 0 10px;
        min-width: 80px;
        width: 100%;
        /*height: 20px;*/
        line-height: 20px;
        border: 1px solid var(--cus-border-before-color);
        cursor: pointer;
        font-size: 13px;
    }

    .select-wrapper:checked ~.option-wrapper {
        display: none;
    }

    .select-wrapper__disable {
        background-color: var(--cus-disabled-background-color);
        color: var(--cus-disabled-text-color);
        cursor: not-allowed;
    }

    .select-content {
        /*text-align: left;*/
        padding: 0 10px;
        height: var(--cus-height);
        line-height: var(--cus-height);
        width: 100%;
        text-align: left;
    }

    /* 下拉框选择 */
    .triangle-wrapper {
        text-align: center;
        width: 25px;
        cursor: pointer;
        height: var(--cus-height);
        line-height: var(--cus-height);
        transition: transform .3s;
        /*padding: 0 15px;*/
    }
    .is-reverse {
        transform: rotate(180deg);
    }

    /* 下拉框图标 */
    .triangle-down {
        /*position: absolute;*/
        /*right: 0;*/
        /*top: 0;*/
    }

    .option-wrapper {
        position: fixed;
        /*top: calc(var(--cus-height) + 15px);*/
        display: none;
        z-index: 1;

        /*width: 100%;*/
        border-radius: 5px;
        overflow: hidden;
        border: 1px solid var(--cus-border-before-color);
        padding: 5px 0;
        background-color: var(--cus-background-color);
        transition: all 0.3s;
        /*opacity: 1;*/
    }

    .option-item-scroll {
        overflow-y: scroll;
        max-height: 300px;
    }

    .popper__arrow {
        left: 35px;
        top: -1px;
        /*left: 50%;*/
        margin-right: 3px;
        border-top-width: 0;
        border-bottom-color: #ebeef5;
        border-bottom-width: 6px;
        filter: drop-shadow(0 2px 12px rgba(0,0,0,.03));
        position: absolute;
        display: block;
        width: 10px;
        height: 0;
        border-style: solid;
        z-index: 1;
    }
    .popper__arrow:after {
        color: white;
        position: absolute;
        top: -6px;
        /*left: 20px;*/
        /* margin-left: -6px; */
        border-top-width: 0;
        border-bottom-color: #fff;
        content: " ";
        border-bottom-width: 6px;
        /* position: absolute; */
        display: block;
        width: 0;
        height: 0;
        /* border-color: transparent; */
        border-style: solid;
    }

    .option-item {
        padding: 0 20px;
        cursor: pointer;
        height: var(--cus-height);
        line-height: var(--cus-height);
        text-align: left;
    }

    .selected-option-item {
        color: var(--cus-active-color) !important;
        font-weight: bolder;
    }

    .hover {
        background-color: var(--cus-input-hovered-color);
        color: var(--theme-text-hover);
    }
</style>
