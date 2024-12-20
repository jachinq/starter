<template>
    <div class="radio-group">
        <template v-for="item in options">
            <label class="radio-item-wrap">
                <input type="radio"
                    :value="getValue(item)"
                    class="radio-button__input"
                    v-model="selectedValue"
                    :disabled="isDisable(item)"
                    @click="onClick(item)">
                <span class="radio-button__custom" :class="{'radio-button__disabled' : isDisable(item)}"></span>
                <span class="radio-button__label">{{getLabel(item)}}</span>
            </label>
        </template>
    </div>

</template>

<script>
    export default {
        name: "cus-radio",
        props: {
            value: undefined,
            options: {
                type: Array,
                default: []
            },
            labelKey: {default: "label"},
            valueKey: {default: "value"},
        },
        data() {
            return {
                selectedValue: undefined
            }
        },
        mounted() {
            this.selectedValue = this.value;
        },
        methods: {
            isDisable(item) {
                // console.log(item);
                if (typeof item === 'string') {
                    return false;
                }
                if (item === undefined) {
                    return false;
                }
                return !!item.disabled;
            },
            getValue(item) {
                if (item === undefined) {
                    return undefined;
                }
                if (typeof item === 'string') return item;
                return item[this.valueKey];
            },
            getLabel(item) {
                if (item === undefined) {
                    return undefined;
                }
                if (typeof item === 'string') return item;
                return item[this.labelKey];
            },
            onClick(item) {
                this.$emit('click', item);
            },
        },
        watch: {
            value: {
                handler(val) {
                    this.selectedValue = val;
                },
                deep: true,
                immediate: true,
            },
            selectedValue: {
                handler(newVal, oldVal) {
                    // console.log('old=', oldVal, 'new=', newVal);
                    this.$emit('input', newVal);
                    this.$emit('change', newVal);
                },
                deep: true,
                immediate: true,
            },
        },

    }
</script>

<style scoped>

    /* group 样式设置 */
    .radio-group {
        display: flex;
        align-items: center;
        /*gap: 5px;*/
        flex-wrap: wrap;
    }

    /* 原生 radio 样式设置隐藏 */
    .radio-button__input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }

    /* radio 框 + label 文案元素 */
    .radio-item-wrap {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        padding-left: 10px;
        color: var(--theme-text, black);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    /* label 显示样式 */
    .radio-button__label {
        padding-left: 5px;
    }

    /* 自定义 radio 样式 */
    .radio-button__custom {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid var(--cus-border-before-color);
        transition: all 0.3s ease;
    }

    /* radio 选中时，自定义 radio 样式显示 */
    .radio-button__input:checked~.radio-button__custom {
        background-color: var(--cus-border-after-color);
        border-color: transparent;
        transform: scale(0.9);
    }

    /* radio 选中时，label显示 */
    .radio-button__input:checked~.radio-button__label {
        color: var(--cus-border-after-color);
    }

    /* radio + label 元素 hover 时，自定义 radio 样式显示 */
    .radio-item-wrap:hover .radio-button__custom {
        transform: scale(1.1);
        border-color: var(--cus-border-after-color);
        box-shadow: 0 0 5px  var(--cus-border-after-color, #4c8bf580);
    }

    /* radio 不可用时显示样式 */
    .radio-button__disabled {
        background-color: var(--cus-disabled-background-color);
        color: var(--cus-disabled-text-color);
        border-color: transparent;
        transform: scale(0.9);
    }
    /* radio 不可用时显示样式 */
    .radio-item-wrap:hover .radio-button__disabled {
        transform: scale(0.9);
        border-color: var(--cus-border-before-color);
    }

</style>
