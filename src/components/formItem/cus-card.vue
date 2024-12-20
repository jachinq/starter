<template>
    <div class="cus-card">
        <div class="cus-card__header">
            <slot name="header"></slot>
        </div>
        <div class="cus-card__body">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "cus-card",
        props: {
            shadow: {type: Boolean, default: true}
        },
        mounted() {
            // console.log(this.$slots);
        }
    }
</script>

<style scoped>
    .cus-card {
        /*display: flex;*/
        /*border: 1px solid var(--cus-border-before-color);*/
        border-radius: 10px;
        /*padding: 10px 0;*/
        margin: var(--card-margin);

        width: var(--card-width);
        height: var(--card-height);
        /*margin: var(--card-margin);*/
        /*background: rgba(16, 0, 8, 0.21);*/
        background: var(--theme-background-app, rgba(254, 254, 254, 0.9));
        /*color: var(--cus-text-color, black);*/
        color: var(--cus-text-color, black);
        text-align: center;
        opacity: calc(var(--card-opacity) / 100);
        position: relative;
        backdrop-filter: blur(4px);
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.5);
    }
    .cus-card:hover {
        /*background: var(--theme-background-hover);*/
        box-shadow: 0 2px 12px 0 var(--theme-shodow);
        transform: scale(1.03);
    }


    .cus-card::before,
    .cus-card::after {
        position: absolute;
        content: "";
        width: 0;
        height: 0;
        background-color: var(--theme-background-app-hover);
        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: -1;
    }

    .cus-card::before {
        top: 0;
        right: 0;
        border-radius: 10px  10px 10px  100%;
    }

    .cus-card::after {
        bottom: 0;
        left: 0;
        border-radius: 10px 100% 10px 10px;
    }

    .cus-card:hover::before,
    .cus-card:hover:after {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        transition: all 0.5s;
    }


    .cus-card__header {
        /*font-weight: bolder;*/
        /*border-bottom: 1px solid var(--cus-border-before-color);*/
        /*padding: 0 10px;*/

        border-bottom: rgba(114, 118, 123, 0.3) solid 1px;
        padding: 12px;
        display: flex;
        justify-content: center;
    }
    .cus-card__body {
        /*padding: 0 10px;*/
        overflow-y: scroll;
        height: calc(var(--card-height) - 65px);
        width: 100%;
        margin: 10px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
