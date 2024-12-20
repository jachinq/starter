<template>
    <div class="cus-switch" ref="cusSwitch">
        <span v-if="showText" :class="{'cus-slider-text-active': !currentValue}">{{inactiveText}}</span>
        <span class="switch" @click="toggleSwitch">
            <span :class="sliderClass"></span>
        </span>
        <span v-if="showText" :class="{'cus-slider-text-active': currentValue}">{{activeText}}</span>
    </div>
</template>

<script>
    export default {
        name: "cus-switch",
        props: {
            value: {
                type: Boolean,
                default: false,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            width: {
                type: Number,
                default: 40,
            },
            showText: {
                type: Boolean,
                default: true,
            },
            activeText: {default: "开启"},
            inactiveText: {default: "关闭"},
        },
        data() {
            return {
                currentValue: false,
            }
        },
        computed: {
            sliderClass() {
                let prefixCls = 'cus-slider';
                let sliderClass = {};
                sliderClass['slider'] = true;
                sliderClass[prefixCls + "-checked"] = !!this.currentValue;
                sliderClass[prefixCls + "-disabled"] = !!this.disabled;
                return sliderClass;
            },
        },

        mounted() {
            let cusSwitch = this.$refs.cusSwitch;
            if (cusSwitch && cusSwitch.style) {
                cusSwitch.style.setProperty('--cus-switch-width', this.width + 'px');
            }
        },
        watch: {
            value: {
                handler(val) {
                    this.currentValue = val;
                },
                deep: true,
                immediate: true,
            }
        },
        methods: {
            toggleSwitch() {
                if (this.disabled) {
                    return
                }
                this.currentValue = !this.currentValue;
                this.$emit('input', this.currentValue);
                this.$emit('change', this.currentValue);
            }
        }
    }
</script>

<style scoped>
    .cus-switch {
        --cus-switch-width: 40px;
        display: flex;
        align-items: center;
    }
    /* The switch - the box around the slider */
    .switch {
        position: relative;
        display: inline-block;
        width: var(--cus-switch-width);
        height: 20px;
        margin: 0 10px;
    }


    /* The slider */
    .slider {
        position: absolute;
        cursor: pointer;
        inset: 0;
        background: var(--cus-border-before-color, #9fccfa);
        border-radius: 50px;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .slider:before {
        position: absolute;
        content: "";
        display: flex;
        align-items: center;
        justify-content: center;
        height: 20px;
        width: 20px;
        inset: 0;
        background-color: white;
        border-radius: 50px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.4);
        transform: scale(0.8);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .cus-slider-checked {
        background-color: var(--cus-border-after-color, #0974f1) !important;
    }

    .cus-slider-checked:before {
        transform: translateX(calc(var(--cus-switch-width) - 20px)) scale(1.1);;
    }

    .cus-slider-text-active {
        color: var(--cus-border-after-color, #0974f1) !important;
    }

    .cus-slider-disabled {
        background-color: var(--cus-disabled-background-color) !important;
        color: var(--cus-disabled-text-color) !important;
        cursor: not-allowed !important;
    }
    .cus-slider-disabled:before {
        background-color: var(--cus-disabled-text-color) !important;
    }
</style>
