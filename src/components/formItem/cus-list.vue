<template>
    <div class="cus-list">
        <div v-for="(item, index) in data" ref="dragRefs" class="drag"
             :draggable="draggable"
             @dragstart="dragstart($event, item)"
             @dragenter="dragenter($event, item)"
             @dragend="dragend($event, item)"
             @dragover="dragover($event, item)">
            <slot :item="item" :index="index"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "cus-list",
        props: {
            data: {type: Array},
            draggable: {type: Boolean, default: false},
        },
        updated() {
            // console.log(this.data);
        },
        data() {
            return {
                clickItem: {},
                moveItem: {},
                moveMap: {},
            }
        },
        methods: {
            getIndex(item) {
                try {
                    return this.data.indexOf(item);
                } catch (e) {
                    return -1;
                }
            },
            getElement(index) {
                try {
                    return this.$refs.dragRefs[index];
                } catch (e) {
                    return null
                }
            },
            packItem(item) {
                let pack = {};
                pack.item = item;
                pack.index = this.getIndex(item);
                pack.element = this.getElement(pack.index);
                return pack;
            },


            dragstart(e, item) {
                this.clickItem = this.packItem(item);
            },

            dragenter(e, item) {
                this.moveItem = item;
                e.preventDefault();

                if (this.clickItem.item === item) {
                    return;
                }

                // 动画效果控制
                let index = this.data.indexOf(item);
                const element =  this.$refs.dragRefs[index]; // 拿到当前移动的元素
                if (this.moveMap[index + ""]) {
                    this.removeAnimation(element);
                    setTimeout(()=>{
                        this.moveMap[index + ""] = false;
                    }, 300)
                    // console.log(item.name, JSON.stringify(this.moveMap));
                } else {
                    this.addAnimation(element, this.clickItem.index < index);
                    setTimeout(()=>{
                        this.moveMap[index + ""] = true;
                    }, 300)
                    // console.log(item.name, JSON.stringify(this.moveMap));
                }
            },

            // 实现排序
            dragend(e, item) {
                let index = this.data.indexOf(this.clickItem.item);     //移动元素的当前位置
                let moveObj = this.moveItem;
                if (moveObj === null || moveObj === undefined) {
                    return
                }

                let addIndex = this.data.indexOf(moveObj);     //要移动后的位置

                this.data.splice(index, 1);
                this.data.splice(addIndex, 0, this.clickItem.item);
                this.$emit('sort', this.data);

                for (let item of this.$refs.dragRefs) {
                    this.removeAnimation(item, true);
                }
                this.moveMap = {};
                this.clickItem.element.style.removeProperty('opacity');
            },

            // 阻止原生事件
            dragover(e, item) {
                e.preventDefault();
            },

            // 实现动画效果
            addAnimation(sourceEl, moveDown) {
                // console.log(getComputedStyle(sourceEl).height);

                let count = getComputedStyle(this.clickItem.element).height || '0px'; // 偏移量，需动态获取
                if (moveDown) count = '-' + count;

                if (sourceEl === undefined) {
                    return
                }

                sourceEl.style.transform = `translateY(${count})`;
                sourceEl.style['transition-duration'] = `0.3s`;
                sourceEl.style['z-index'] = "1";
                this.clickItem.element.style.opacity = '0';
            },
            removeAnimation(sourceEl, removeTime) {
                // console.log('removeAnimation', sourceEl);
                if (!!removeTime) {
                    sourceEl.style['transition-duration'] = '0s';
                }
                sourceEl.style.removeProperty('transform');
                sourceEl.style.removeProperty('z-index');
            }
        }

    }
</script>

<style scoped>

    .drag {
        background-color: var(--cus-background-color);
        user-select: none;
        transition: all 0.3s ease-in-out;

    }
</style>
