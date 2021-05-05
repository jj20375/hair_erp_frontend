<template>
    <el-date-picker v-model="dateValue"
                    popper-class="elementUiDateTimePicker"
                    class="w-100"
                    type="datetimerange"
                    align="center"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    @change="checkSelectDate"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
    </el-date-picker>
</template>
<script>
// 時間套件
import moment from "moment";
export default {
    data() {
        return {
            dateValue: null,
            pickerOptions: {
                shortcuts: [
                    {
                        text: "今日",
                        onClick(picker) {
                            const start = moment().hour(0).minute(0).second(0).format("YYYY-MM-DD HH:mm:ss");
                            const end = moment().hour(23).minute(59).second(59).format("YYYY-MM-DD HH:mm:ss");
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "昨日",
                        onClick(picker) {
                            const start = moment(new Date()).add(-1, "days").hour(0).minute(0).second(0).format("YYYY-MM-DD HH:mm:ss");
                            const end = moment(new Date()).add(-1, "days").hour(23).minute(59).second(59).format("YYYY-MM-DD HH:mm:ss");
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "本週",
                        onClick(picker) {
                            const start = moment().hour(0).minute(0).second(0).day(1).format("YYYY-MM-DD HH:mm:ss");
                            const end = moment().hour(23).minute(59).second(59).day(7).format("YYYY-MM-DD HH:mm:ss");
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "上週",
                        onClick(picker) {
                            const start = moment().hour(0).minute(0).second(0).day(-6).format("YYYY-MM-DD HH:mm:ss");
                            const end = moment().hour(23).minute(59).second(59).day(0).format("YYYY-MM-DD HH:mm:ss");
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "本月",
                        onClick(picker) {
                            const start = moment().startOf("month").hour(0).minute(0).second(0).format("YYYY-MM-DD HH:mm:ss");
                            const end = moment().endOf("month").endOf("month").hour(23).minute(59).second(59).format("YYYY-MM-DD HH:mm:ss");
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "上月",
                        onClick(picker) {
                            const start = moment().startOf("month").subtract("month", 1).hour(0).minute(0).second(0).format("YYYY-MM-DD HH:mm:ss");
                            const end = moment()
                                .endOf("month")
                                .subtract("month", 1)
                                .endOf("month")
                                .hour(23)
                                .minute(59)
                                .second(59)
                                .format("YYYY-MM-DD HH:mm:ss");
                            picker.$emit("pick", [start, end]);
                        },
                    },
                ],
            },
        };
    },
    methods: {
        checkSelectDate() {
            let self = this;
            self.$emit("onSelectDate", self.dateValue);
        },
        clearSelectedDate() {
            let self = this;
            self.dateValue = null;
            self.$emit("onClearDate", null);
        },
    },
    created() {
        let self = this;
    },
};
</script>

<style lang="scss">
@import "src/scss/var";
// .el-picker-panel *[slot="sidebar"],
// /deep/ .el-picker-panel__sidebar {
//     position: absolute !important;
//     bottom: 5px !important;
//     color: red !important;
//     z-index: 10 !important;
// }
.elementUiDateTimePicker {
    width: 100%;
    .el-picker-panel__sidebar {
        position: relative !important;
        // bottom: 5px !important;
        z-index: 10 !important;
        top: auto;
        width: auto;
        border-right: none;
        .el-picker-panel__shortcut {
            display: inline-block;
            width: auto;
            background-color: $hot-color;
            margin-left: 5px;
            color: #fff;
            border-radius: 5px;
            padding-left: 10px;
            padding-right: 10px;
        }
    }
    .el-picker-panel__body {
        margin-left: 0;
    }
}
@media screen and (max-width: 768px) {
    .has-sidebar {
        width: 100% !important;
        top: 0 !important;
    }

    .elementUiDateTimePicker {
        width: 100%;
        position: relative;
        margin-bottom: 50px;
        .el-picker-panel__sidebar {
            position: relative !important;
            // bottom: 5px !important;
            z-index: 10 !important;
            top: auto;
            width: auto;
            border-right: none;
            text-align: center;
            .el-picker-panel__shortcut {
                display: inline-block;
                width: auto;
                background-color: $hot-color;
                margin-left: 5px;
                color: #fff;
                border-radius: 5px;
                padding-left: 10px;
                padding-right: 10px;
            }
        }
        .el-picker-panel__body {
            margin-left: 0;
            width: 100%;
            min-width: auto;
            .el-date-range-picker__time-header {
                span {
                    display: block;
                }
                .el-date-range-picker__editors-wrap {
                    margin-top: 0.5rem;
                }
            }
            .el-icon-arrow-right {
                display: none !important;
            }
        }
        .el-date-range-picker__content {
            width: 100%;
        }
    }
}
</style>