<template>
    <div class="form">
        <div class="input_group" ref="input_group">
            <input ref="cusInput" class="input" :class="{ 'input_show__suffix': showSuffix }"
                :type="showPassword ? (passwordVisible ? 'text' : 'password') : type" v-model="defaultValue"
                @blur="blur" :placeholder="placeholder" required="">

            <div class="extra_wrap">
                <span class="input-border"></span>

                <span class="input__suffix" v-if="showSuffix">
                    <i class="el-icon-close" v-if="clearable && this.defaultValue !== '' && !showPassword"
                        @click="clear"></i>
                    <i class="el-icon-view" :class="{ 'view-pwd-active': passwordVisible }" v-if="showPassword"
                        @click="handlepwd"></i>
                </span>
            </div>
        </div>

        <div class="search-button">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "cus-input",
    props: {
        placeholder: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            default: "",
        },
        value: {
            type: String,
            default: "",
        },
        clearable: {
            type: Boolean,
            default: false,
        },
        showPassword: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            defaultValue: undefined,
            passwordVisible: false,
            showSearchButton: false,
            slots: [],
            buttonSlot: {},
        }
    },
    mounted() {
        let slots = this.$slots.default;
        this.slots = slots;
        if (slots && slots.length > 0) {
            let buttonSlot = slots[0];
            console.log(buttonSlot);
            // if (buttonSlot.tag === "vue-component-28-ElButton") {
            this.showSearchButton = true;
            this.buttonSlot = buttonSlot;
            // }
        }

        if (this.showSearchButton) {
            let input_group = this.$refs.input_group;
            console.log(input_group);
            if (input_group && input_group.style) {
                if (this.buttonSlot) {
                    let elm = this.buttonSlot.elm;
                    if (elm) {
                        let width = elm.offsetWidth;
                        width = width <= 0 ? 60 : width;
                        input_group.style.setProperty('width', 'calc(100% - ' + width + 'px)');
                    }
                }
            }
        }
    },
    watch: {
        value: {
            handler(val) {
                this.defaultValue = val;
            },
            deep: true,
            immediate: true,
        },
        defaultValue: {
            handler(val) {
                this.$emit("input", val);
            },
            deep: true,
            immediate: true,
        },

    },
    methods: {
        blur(event) {
            this.$emit("blur");
        },
        clear() {
            let cusInput = this.$refs.cusInput;
            if (cusInput) {
                cusInput.focus(); // 重新获得焦点
            }
            this.$emit("input", ""); // 清空文本
        },
        handlepwd() {
            this.passwordVisible = !this.passwordVisible;
        },
    },
    computed: {
        //有清空/显示密码，添加类名、显示span
        showSuffix() {
            return this.clearable || this.showPassword;
        },
    },

}
</script>

<style scoped>
.input__suffix .el-icon-close,
.input__suffix .el-icon-view {
    position: absolute;
    right: 5px;
    bottom: 10px;
    cursor: pointer;
    padding: 2px;
    border-radius: 50%;
}

.input__suffix .el-icon-close:hover {
    background-color: #8b8b8b;
    color: white;
}


.el-button {
    background-color: var(--theme-background, #FFF);
    color: var(--theme-text, #606266);
    border-color: var(--cus-border-before-color, #DCDFE6);
}

.el-button:focus,
.el-button:hover {
    background-color: var(--cus-background-color-hover, #FFF);
    color: var(--theme-text, #409EFF);
    border-color: var(--cus-border-after-color, #c6e2ff);
}


.form {
    position: relative;
}

.input_group {
    width: 100%;
}

/* styling of Input */
.input {
    color: var(--theme-text);
    font-size: 0.9rem;
    background-color: transparent;
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    border: none;
    border-bottom: var(--cus-border-height) solid var(--cus-border-before-color);
    outline: none;
    margin-right: 100px;
}

.input_show__suffix {
    padding-right: 35px;
}

.extra_wrap {
    position: relative;
}

/* styling of animated border */
.input-border {
    position: absolute;
    background: var(--cus-border-after-color);
    width: 0%;
    height: 2px;
    bottom: 0;
    left: 0;
    transition: 0.3s;
}

/* Hover on Input */
.input:hover,
.input:focus {
    background: var(--cus-input-hovered-color);
}

/* here is code of animated border */
.input:focus~.extra_wrap .input-border {
    width: 100%;
}

/* === if you want to do animated border on typing === */
/* remove input:focus code and uncomment below code */
/*input:valid ~ .input-border{*/
/*width: 100%;*/
/*}*/

.search-button {
    position: absolute;
    bottom: 0;
    right: 0;
}
</style>
