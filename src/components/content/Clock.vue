<template>
    <!-- 时钟 -->
    <div id='clock' class="cent-box"
        style="animation-name: showLine"
         title="点击显示/隐藏应用"
    >
        <div
        :style="moveBoxHeight"
        style="transition: all 1s ease-in-out 0s"
        ></div>
        <!--:style="moveClock? 'animation-name: showLine': 'opacity: 1'"-->
        <!--style="animation-name: showLine;animation-duration: 0.5s;">-->
        <!--:style="moveClock? 'animation-name: show;animation-duration: 0.5s;' : 'animation-name: hide;animation-duration: 0.5s;'">-->
        <!--:style="moveClock? 'margin-top: -160px': 'margin-top: 40px'">-->
        <div class="clock" @click="clickClock">
            <div class="time">{{clock}}</div>
            <!--<div class="time">-->
                <!--<div class="time-item">{{hour}}</div>-->
                <!--<span>:</span>-->
                <!--<div class="time-item">{{minute}}</div>-->
                <!--<span>:</span>-->
                <!--<div class="time-item">{{second}}</div>-->
            <!--</div>-->
            <p class="date">{{date}}</p>
        </div>
    </div>
</template>

<script>
    import Date from '@/utils/OriginExpand';
    import EventBus from "../../data/EventBus";
    import IndexedDb from "../../utils/IndexedDb";

    export default {
        name: "Clock",
        data() {
            return {
                moveClock: false,
                moveBoxHeight: '',
                clock: '',
                hour: '',
                minute: '',
                second: '',

                date: '',

                timeFormat: "hh:mm",
                dateFormat: "MM-dd EEE",
            }
        },
        async created() {
            await this.getClock().catch(e=>{console.log(e)});
            this.initMoveBoxHeight();
            // console.log('时钟组件加载完毕', new Date());
        },
        mounted() {
            this.$bus.$on(EventBus.RefreshClockFormat, (data) => {
                if (data.timeFormat) {
                    this.timeFormat = data.timeFormat;
                }
                if (data.dateFormat) {
                    this.dateFormat = data.dateFormat;
                }
            });
        },
        methods: {
            async getClock() {
                let that = this;
                let date = new Date();

                // 从设置中加载格式，如果没有就走默认了
                let result = await IndexedDb.getSetting().catch(e=>{console.log(e)});
                if (result && result.success) {
                    if (result.data && result.data.length > 0) {
                        let setting = result.data[0];
                        if (setting && setting.formatDate) {
                            this.dateFormat = setting.formatDate;
                        }
                        if (setting && setting.formatTime) {
                            this.timeFormat = setting.formatTime;
                        }

                        if (setting && setting.miniMode != null) {
                            this.moveClock = setting.miniMode;
                        }
                    }
                }


                // let timeFormat = that.timeFormat;
                // let dateFormat = that.dateFormat;
                // let weeks = ["日", "一", "二", "三", "四", "五", "六"];

                that.clock = date.format(that.timeFormat);
                that.date = date.pattern(that.dateFormat);
                //
                // let list = this.clock.split(":");
                // if (list.length === 3) {
                //     this.hour = list[0];
                //     this.minute = list[1];
                //     this.second = list[2];
                // }
                // else if (list.length === 2) {
                //     this.hour = list[0];
                //     this.minute = list[1];
                // }

                setInterval(function () {
                    let date = new Date();
                    that.clock = date.format(that.timeFormat);
                    // that.date = date.format(dateFormat) + " 周" + weeks[date.getDay() % 7];
                    that.date = date.pattern(that.dateFormat);

                    // let list = that.clock.split(":");
                    // if (list.length >= 2) {
                    //     that.hour = list[0];
                    //     that.minute = list[1];
                    // }
                    // if (list.length === 3) {
                    //     that.second = list[2];
                    // }

                }, 1000);
            },

            async clickClock() {
                this.moveClock = !this.moveClock;
                this.initMoveBoxHeight();

                // 设置模式
                let result = await IndexedDb.getSetting().catch(e=>{console.log(e)});
                if (result && result.success) {
                    if (result.data && result.data.length > 0) {
                        let setting = result.data[0];
                        if (setting) {
                            setting.miniMode = this.moveClock;
                            await IndexedDb.setSetting(setting).catch(e=>{console.log(e)});
                        }
                    }
                }

            },
            initMoveBoxHeight() {
                // moveClock? 'height: 50%': 'height: 40px'
                this.moveBoxHeight = 'height: 150px';
                this.$bus.$emit(EventBus.ClickClock, {miniMode: this.moveClock});
                if (this.moveClock) {
                    let innerHeight = window.innerHeight;
                    // console.log(innerHeight);
                    let finalHeight = innerHeight / 2 - 150;
                    if (finalHeight <= 150) {
                        finalHeight = 150;
                    }
                    this.moveBoxHeight = 'height: ' + finalHeight + 'px';
                }

            },
        }
    }
</script>

<style scoped>
    #clock {
        transition: all 1s;
        animation-duration: 1s;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    #clock:hover {
        cursor: pointer;
    }

    .clock {
        /*font-weight: bold;*/
        color: #ffffff;
        /*font-family: fantasy;*/
        /*font-family: auto,serif;*/
        /*width: 180px;*/
        filter: drop-shadow(0px 2px 7px rgba(0,0,0,.8));
        /*margin: 40px 0;*/
        user-select: none;
        /*width: 100%;*/
    }
    .time {
        font-size: 70px;
        margin-bottom: -20px;
        /*min-width: 170px;*/
        /*text-align: center;*/
        /*width: 100%;*/
        text-align: center;
    }
    .time-item {
        text-align: left;
        display: inline-block;
        /*min-width: 60px;*/
    }
    /*.time-item:before {*/
        /*content: " : ";*/
    /*}*/
    /*.time-item:nth-child(1):before {*/
        /*content: "";*/
    /*}*/
    .date{
        text-align: center;
    }
</style>
