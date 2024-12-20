<template>
    <div class="cus-list-item">
        <slot></slot>
        <!--<div class="avatar">-->
            <slot name="avatar"></slot>
        <!--</div>-->
        <div class="title-wrap">
            <!--<div class="title">-->
                <slot name="title"></slot>
            <!--</div>-->
            <!--<div class="content">-->
                <slot name="content"></slot>
            <!--</div>-->
        </div>
    </div>
</template>

<script>
    export default {
        name: "cus-list-item",
        updated() {
            this.addClass();
        },
        mounted() {
            this.addClass();
        },
        methods: {
            addClass() {
                try {
                    for (let slotName of Object.keys(this.$slots)) {
                        let slot = this.$slots[slotName][0];
                        if (slot && slot.elm) {
                            slot.elm.classList.add(slotName);
                        }
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }
</script>

<style scoped>
    .cus-list-item {
        display: flex;
        border-bottom: 1px solid var(--cus-border-before-color);
        color: var(--cus-text-color);
        /*cursor: pointer;*/
    }
    .cus-list-item:hover {
        border-color: var(--cus-border-after-color);
        color: var(--cus-text-color-hover);
        background-color: var(--cus-background-color-hover);
    }

    .avatar {
        padding: 10px;
        flex: 2;
        display: flex;
        justify-content: center;
        /*flex-direction: column;*/
    }

    .title-wrap {
        flex: 8;
        display: flex;
        flex-direction: column;
    }

    .title {
        padding: 10px 10px 5px 10px;
        font-weight: bolder;
    }

    .content {
        padding: 5px 10px 10px 10px;
        word-break: break-all;
    }
</style>
