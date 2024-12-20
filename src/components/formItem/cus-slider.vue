<template>
    <div class="cus-slider">
        <div ref="track" class="slider" @click="clickSlider">
            <div class="track"  :style="{ width: trackWidth }"></div>
            <div class="thumb" :style="{ left: thumbPosition }" @mousedown="startDrag"></div>
        </div>

        <div v-if="showInput">
            <cus-input-number v-model="numberValue" :max="max" :min="min" :step="step"></cus-input-number>
        </div>
    </div>
</template>

<script>
    import Util from "../../utils/Util";
    import CusInput from "./cus-input";
    import CusInputNumber from "./cus-input-number";

    export default {
        name: "cus-slider",
        components: {CusInputNumber, CusInput},
        props: {
            value: {type: Number, default: 0},
            min: {type: Number, default: 0},
            max: {type: Number, default: 100},
            step: {type: Number, default: 1},
            showInput: {type: Boolean, default: false},
        },
        data() {
            return {
                thumbPosition: '0%',
                trackWidth: '0%',
                isDragging: false,
                numberValue: 0,
            }
        },
        destroyed() {
            this.stopDrag();
        },
        watch: {
            value: {
                handler(val) {
                    if (this.numberValue !== val) this.numberValue = val;
                    this.draw();
                    this.$emit('change', val);
                },
                deep: true,
                immediate: true,
            },
            numberValue: {
                handler(val) {
                    this.$emit('input', val);
                },
                deep: true,
                immediate: true,
            }
        },
        methods: {
            // 禁止选中文本事件
            stopSelect(e) {
                e.preventDefault(); //阻止默认行为
            },
            startDrag() {
                this.isDragging = true;
                document.addEventListener('mousemove', this.handleDrag);
                document.addEventListener('mouseup', this.stopDrag);
                document.addEventListener('selectstart', this.stopSelect);
            },
            handleDrag(event) {
                if (event === undefined) {
                    return;
                }
                if (this.isDragging) {
                    let range = this.max - this.min;
                    let parentNode = this.$refs.track;
                    let parentPos = Util.getPosition(parentNode);
                    let step = this.step;

                    const sliderWidth = parentNode.offsetWidth;
                    const offsetX = event.pageX - parentPos.left;
                    const percentage = (offsetX / sliderWidth) * 100;
                    const value = (percentage * (range)) / 100 + this.min;
                    let snappedValue = Math.round(value / step) * step;
                    if (snappedValue < 1) {
                        snappedValue = Math.floor(snappedValue * 100) / 100;
                    }
                    const clampedValue = Math.max(this.min, Math.min(this.max, snappedValue));
                    if (snappedValue < this.min || snappedValue > this.max) {
                        return
                    }

                    this.$emit('input', clampedValue);
                }
            },
            stopDrag() {
                this.isDragging = false;
                document.removeEventListener('mousemove', this.handleDrag);
                document.removeEventListener('mouseup', this.stopDrag);
                document.removeEventListener('selectstart', this.stopSelect);
            },

            clickSlider(event) {
                // let number = this.numberValue;
                // this.$emit('input', number);
                this.isDragging = true;
                this.handleDrag(event);
                this.isDragging = false;
            },

            // 绘制滑块位置、激活条
            draw() {
                let ratio = this.value - this.min;
                let range = this.max - this.min;
                let proportion = (ratio / range) * 100;
                if (proportion < 0) proportion = 0;
                if (proportion > 100) proportion = 100;

                this.trackWidth = proportion + '%';
                this.thumbPosition = 'calc(' + proportion + '% - 10px)';
            },
        }
    }
</script>

<style scoped>
    .cus-slider {
        display: flex;
        justify-content: center;
        align-items: center;
        height: var(--cus-height);
    }

    .slider {
        position: relative;
        width: 100%;
        height: 10px;
        background-color: var(--cus-border-before-color);
        border-radius: 5px;
        cursor: pointer;
        margin: 0 15px;
    }
    .track {
        border-radius: 5px;
        position: absolute;
        top: 0;
        left: 0;
        height: 10px;
        background-color: var(--cus-border-after-color);
    }
    .thumb {
        position: absolute;
        top: -5px;
        left: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: var(--cus-border-before-color);
        border: 3px solid var(--cus-border-after-color);
        transition: transform 0.3s;
    }
    .thumb:hover {
        cursor: grab;
        transform: scale(1.1);
        /*box-shadow: 0 0 5px  var(--cus-border-after-color);*/
    }
</style>
