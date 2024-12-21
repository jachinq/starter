<template>
    <div id="app">
        <BackgroundImg/>
        <Page/>
        <Collect/>
    </div>
</template>

<script>

import Page from './components/Page'
import BackgroundImg from './components/layout/BackgroundImg'
import Collect from './popup/Collect';

export default {
    name: 'App',
    components: {
        BackgroundImg,
        Page,
        Collect
    },
    data() {
        return {
        }
    },
    created() {
        // console.log(this.$bus);
    },
    mounted() {
    },
    methods: {

    }
}
</script>




<style>

    .el-drawer__body {
        background: var(--theme-background);
        color: var(--theme-text);
    }
    .el-tabs .el-tabs__item, .el-form .el-form-item__label{
        color: var(--theme-text);
    }
    .el-table * {
        background: var(--theme-background);
        color: var(--theme-text);
    }

    #app {
        font-family: 'alimama', 'LXGW WenKai', Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /*text-align: center;*/
        /*color: #2c3e50;*/
        /*margin-top: 60px;*/
    }

    [v-cloak] {
        display: none;
    }

    :root {
        --beg-bg-color: #fff1fe;
        --end-bg-color: #ace0f9;
        --bg-mask: rgba(1, 1, 1, 0.1);
        --bg-white-mask: rgba(255, 255, 255, 0.4);
        --roate-x: -20;
        --roate-y: 20;
        --bg-url: '';
        --show-from: 60px;

        --bg-blur: 5px;
        --bg-scale: 1;
        --icon-size: 80px;
        --icon-radius: 50%;
        --icon-margin: 15px;
        --icon-opacity: 100;
        --card-width: 170px;
        --card-height: 190px;
        --card-margin: 10px;
        --card-opacity: 100;
        --font-size: 16px;
        --bg-mask-rgba: rgba(0,0,0,0.1);

        --draw-box-width: 460px;
        --app-blur: 0px;
        --bg-z-index: -100;
    }

    html, #app {
        height: 100%;
        width: 100%;
        overflow: hidden;
        font-size: var(--font-size);
    }

    body {
        height: 100%;
        padding: 0;
        margin: 0;
    }

    * {
        box-sizing: border-box;
    }

    /*滚动条样式*/
    ::-webkit-scrollbar {
        display: none; /*隐藏滚动条*/
        width: 6px;
        height: 6px;
        /*background-color: #f1f1f1;*/
        border-radius: 16px;
        background-color: var(--bg-white-mask);
    }

    /*滑块样式*/
    ::-webkit-scrollbar-thumb {
        /*background-color: #b2b2b2;*/
        background-color: rgba(1, 1, 1, 0.15);
        width: 16px;
        -webkit-border-radius: 16px;
        -moz-border-radius: 16px;
        border-radius: 16px;
    }


    /*公共组件*/
    .cent-box {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .text-hidden {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .hidden-text {
        max-width: 100px;
        overflow: hidden;
        text-overflow: unset;
        white-space: nowrap;
    }

    .text-button {
        cursor: pointer;
        padding: 0 5px 5px 0;
        color: #66b1ff;
        user-select: none;
    }

    .cus-button {
        border-radius: 5px;
        cursor: pointer;
        padding: 0 10px;
        user-select: none;
        /*border-bottom: 1px solid var(--theme-text, black);*/
        transition: 0.3;
    }
    .cus-button:hover {
        color: var(--theme-text-hover, #66b1ff);
        border-color: var(--theme-text-hover, #66b1ff);
        background-color: var(--theme-background-hover, rgba(102, 177, 255, 0.13));
    }

    .form_item {
        /*margin-bottom: 10px;*/
        padding: 10px 20px 0 20px;
    }


    /*关键帧*/
    @keyframes show {
        from {
            opacity: 0;
            /*position: relative;*/
            /*top: 100px;*/
            transform: translateY(var(--show-from));
        }

        to {
            /*position: unset;*/
            opacity: 1;
            /*transform:scale(1)*/
            transform: translateY(0);
        }
    }

    @keyframes hide {
        from {
            opacity: 1;
        }

        to {
            opacity: 0;
        }
    }

    @keyframes move {
        from {
            height: 0;
        }

        to {
            height: 100px;
        }
    }

    @keyframes moveDown {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(100px);
        }
    }

    @keyframes moveUp {
        from {
            transform: translateY(100px);
        }
        to {
            transform: translateY(0);
        }

    }
    @keyframes showLine {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }
</style>
