<template>
    <div class="cus-input-number">
        <div class="button button-left" @click="stepNumber(false)"
            :class="{'disabled': this.min !== undefined && this.min === this.value}"
        >
            <i class="el-icon-minus"></i>
        </div>
        <input type="text"
               class="input-number"
               :placeholder="placeholder"
               ref="cusInputNumber"
               :value="value"
               @input="handleInput">
        <div class="button button-right" @click="stepNumber(true)"
             :class="{'disabled': this.max !== undefined && this.max === this.value}"
        >
            <i class="el-icon-plus"></i>
        </div>
    </div>
</template>

<script>
    import Decimal from "../../utils/decimal";

    export default {
        name: "cus-input-number",
        props: {
            placeholder: {
                type: String,
                default: "",
            },
            value: {
                type: Number,
                default: 0
            },
            min: {type: Number, default: undefined},
            max: {type: Number, default: undefined},
            step: {type: Number, default: 1},
        },
        methods: {
            handleInput(event) {
                let number = this.rangeNumber(Number(event.target.value));
                event.target.value = number;
                // console.log('input', number);
                this.$emit("input", number);
            },
            rangeNumber(number) {
                if (this.min !== undefined && number < this.min) {number = this.min}
                if (this.max !== undefined && number > this.max) {number = this.max}
                if (Number.isNaN(number)) {
                    number = this.min;
                }
                return number;
            },
            stepNumber(plus) {
                let number = Number(this.value);
                if (this.step !== undefined) {
                    if (plus) {
                        number = new Decimal(number).plus(new Decimal(this.step)).toNumber();
                    } else {
                        number = new Decimal(number).minus(new Decimal(this.step)).toNumber();
                    }
                }

                number = this.rangeNumber(number);
                // console.log('step', number);
                this.$emit("input", number);
            }
        },
    }
</script>

<style scoped>
    .cus-input-number {
        display: flex;
        border: 1px solid var(--cus-border-before-color);
        border-radius: 5px;
    }
    .cus-input-number:hover {
        border-color: var(--cus-border-after-color);
    }
    .input-number {
        width: 120px;
        height: var(--cus-height);
        line-height: var(--cus-height);
        outline: none;
        border: none;
        padding: 0;
        background-color: var(--cus-background-color);
        color: var(--cus-text-color);
    }
    .input-number:focus {
        outline: none;
    }

    .button {
        width: var(--cus-width);
        height: var(--cus-height);
        /*border: 1px solid var(--cus-border-before-color);*/
        /*border-radius: 5px;*/
        text-align: center;
    }
    .button:hover{
        cursor: pointer;
        border-color: var(--cus-border-after-color);
        color: var(--cus-border-after-color);
    }
    .button-left {
        border-right: 1px solid var(--cus-border-before-color);
    }
    .button-right {
        border-left: 1px solid var(--cus-border-before-color);
    }
    .disabled {
        cursor: not-allowed !important;
        border-color: var(--cus-disabled-background-color) !important;
        color: var(--cus-disabled-text-color) !important;
    }

    .input-number {
        text-align: center;
        width: var(--cus-width);
    }
</style>
