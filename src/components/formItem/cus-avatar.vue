<template>
    <div class="cus-avatar" ref="cusAvatar"
         :style="`background-color: ${backgroundColor};`">
        <div v-if="content && content !== ''" class="cus-avatar-icon-wrap">
            <div v-if="type === 2" class="cus-avatar-icon" v-html="content"></div>
            <el-image v-else class="cus-avatar-icon" :src="content" fit="cover"></el-image>
        </div>
        <div v-else class="cus-avatar-icon-text">
            {{getText()}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "cus-avatar",
        props: {
            type: {type: Number},
            name: {type: String},
            content: {type: String},
            backgroundColor: {type: String},
            width: {type: Number, default: undefined},
        },
        mounted() {
            if (this.width !== undefined) this.$refs.cusAvatar.style.setProperty('--cus-icon-size', this.width + 'px');
        },
        methods: {
            getText() {
                if (this.name === undefined || this.name === '') return ""
                if (this.name.length <= 2) return this.name;
                return this.name.substr(0, 2);
            }
        },
        watch: {
            backgroundColor: {
                handler(val) {
                    if (val === undefined) {
                        let iconWrap = this.$refs.cusAvatar;
                        if (iconWrap && iconWrap.style) iconWrap.style.removeProperty('background-color')
                    }
                },
                deep: true,
                immediate: true,
            }
        }
    }
</script>

<style scoped>
    .cus-avatar {
        /*--search-icon-size: 24px;*/
        box-sizing: border-box;
        --cus-icon-size: var(--icon-size);
        width: var(--cus-icon-size);
        height: var(--cus-icon-size);
        border-radius: var(--icon-radius);
    }

    .cus-avatar-icon-wrap {
        display: flex;
        /*margin: 0 10px 0 14px;*/
        justify-content: center;
        align-items: center;
        /*width: 100%;*/
        /*height: 100%;*/

        width: var(--cus-icon-size);
        height: var(--cus-icon-size);
    }

    .cus-avatar-icon {
        overflow: hidden;
        border-radius: var(--icon-radius);
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--cus-text-color);
        font-size: calc(var(--cus-icon-size) / 3.5);
        font-weight: bolder;

        width: var(--cus-icon-size);
        height: var(--cus-icon-size);
    }

    .cus-avatar-icon-text {
        width: 100%;
        color: var(--cus-text-color);
        font-size: calc(var(--cus-icon-size) / 3.5);
        font-weight: 500;
        line-height: var(--cus-icon-size);
        text-align: center;
    }

</style>
