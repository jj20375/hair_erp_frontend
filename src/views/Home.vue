<template>
    <div class="container-fluid">
        <div class="row mt-2">
            <div class="col-md-4">
                <div class="card bg-gradient-warning border-0 shadow-lg">
                    <div class="card-body px-2 py-3">
                        <h3 class="card-title d-inline-block mb-0 text-white">今日業績</h3>
                        <h1 style="font-size:30px;"
                            class="d-inline-block font-weight-bold mb-0 ml-3 text-white">{{ performance.nowPerformance | formatCurrency }}</h1>
                        <div class="float-right icon icon-shape hot-color rounded-circle shadow bg-gradient-secondary">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="clearfix"></div>
                        <div class="mt-2">
                            <span :class="{'text-success' : performanceSum.checkTrue, 'text-danger' : !performanceSum.checkTrue}"
                                  class="mr-2 bg-white borderRadius10 p-1 px-2">
                                <i v-if="!performanceSum.checkTrue"
                                   class="ni ni-fat-delete"></i>
                                <i v-if="performanceSum.checkTrue"
                                   class="ni ni-fat-add"></i>
                                {{performanceSum.value}}%
                            </span>
                            <span class="text-nowrap text-white font-sm">今日業績與昨日業績比較</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-gradient-info border-0 shadow-lg">
                    <div class="card-body px-2 py-3">
                        <h3 class="card-title d-inline-block mb-0 text-white">今日入金</h3>
                        <h1 style="font-size:30px;"
                            class="d-inline-block font-weight-bold mb-0 ml-3 text-white">{{ point.nowPoint | formatCurrency }}</h1>
                        <div class="float-right icon icon-shape hot-color rounded-circle shadow bg-gradient-secondary">
                            <i class="fas fa-sack-dollar"></i>
                        </div>
                        <div class="clearfix"></div>
                        <div class="mt-2">
                            <span :class="{'text-success': pointSum.checkTrue, 'text-danger' : !pointSum.checkTrue}"
                                  class="mr-2 bg-white borderRadius10 p-1 px-2">
                                <i v-if="!pointSum.checkTrue"
                                   class="ni ni-fat-delete"></i>
                                <i v-if="pointSum.checkTrue"
                                   class="ni ni-fat-add"></i>
                                {{pointSum.value}}%
                            </span>
                            <span class="text-nowrap text-white font-sm">今日入金與昨日入金比較</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-gradient-success border-0 shadow-lg">
                    <div class="card-body px-2 py-3">
                        <h3 class="card-title d-inline-block mb-0 text-white">今日新客</h3>
                        <h1 style="font-size:30px;"
                            class="d-inline-block font-weight-bold mb-0 ml-3 text-white">{{ memberRegister.nowRegister | formatCurrency }}</h1>
                        <div class="float-right icon icon-shape hot-color rounded-circle shadow bg-gradient-secondary">
                            <i class="fad fa-users-medical"></i>
                        </div>
                        <div class="clearfix"></div>
                        <div class="mt-2">
                            <span :class="{'text-success': registerSum.checkTrue, 'text-danger' : !registerSum.checkTrue}"
                                  class="mr-2 bg-white borderRadius10 p-1 px-2">
                                <i v-if="!registerSum.checkTrue"
                                   class="ni ni-fat-delete"></i>
                                <i v-if="registerSum.checkTrue"
                                   class="ni ni-fat-add"></i>
                                {{registerSum.value}}%
                            </span>
                            <span class="text-nowrap text-white font-sm">今日新客與昨日新客比較</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <card header-classes="bg-transparent">
                    <div slot="header"
                         class="row align-items-center">
                        <div class="col">
                            <h6 class="text-uppercase text-muted ls-1 mb-1">業績比較</h6>
                            <h5 class="h3 mb-0">今日與昨日業績比較</h5>
                        </div>
                    </div>
                    <BarChart :height="350"
                              ref="barChart"
                              :options="nowAndYesterdayPerformance.options"
                              :chart-data="nowAndYesterdayPerformance.chartData"
                              :extra-options="nowAndYesterdayPerformance.extraOptions" />
                </card>
            </div>
            <div class="col-md-4">
                <card header-classes="bg-transparent">
                    <div slot="header"
                         class="row align-items-center">
                        <div class="col">
                            <h6 class="text-uppercase text-muted ls-1 mb-1">入金儲值比較</h6>
                            <h5 class="h3 mb-0">今日與昨日入金儲值比較</h5>
                        </div>
                    </div>
                    <BarChart :height="350"
                              ref="barChart"
                              :chart-data="nowAndYesterdayPoint.chartData"
                              :extra-options="nowAndYesterdayPoint.extraOptions" />
                </card>
            </div>
            <div class="col-md-4">
                <card header-classes="bg-transparent">
                    <div slot="header"
                         class="row align-items-center">
                        <div class="col">
                            <h6 class="text-uppercase text-muted ls-1 mb-1">新客比較</h6>
                            <h5 class="h3 mb-0">今日與昨日新客數比較</h5>
                        </div>
                    </div>
                    <BarChart :height="350"
                              ref="barChart"
                              :chart-data="nowAndYesterdayMemberRigster.chartData"
                              :extra-options="nowAndYesterdayMemberRigster.extraOptions" />
                </card>
            </div>
        </div>
        <div class="row">
            <div class="col-xl-8"
                 v-if="user.group.group_code !== 'SYSTEM'">
                <card type="default"
                      header-classes="bg-transparent">
                    <div slot="header"
                         class="row align-items-center">
                        <div class="col">
                            <h6 class="text-light ls-1 mb-1">當週業績</h6>
                            <h5 class="h3 text-white mb-0">設計師當週業績</h5>
                        </div>
                        <div class="col">
                            <div class="text-right">
                                <button class="secondBtn borderRadius10 py-2 px-3"
                                        @click.prevent="$router.push({name: 'reportControl_performance'})">
                                    <span class="d-none d-md-block">查詢業績</span>
                                    <span class="d-md-none">查詢</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <line-chart :height="350"
                                ref="bigChart"
                                :chart-data="weekPerformance.chartData"
                                :extra-options="weekPerformance.extraOptions">
                    </line-chart>
                </card>
            </div>
            <div class="col-xl-8"
                 v-if="user.group.group_code === 'SYSTEM'">
                <card type="default"
                      header-classes="bg-transparent">
                    <div slot="header"
                         class="row align-items-center">
                        <div class="col">
                            <h6 class="text-light ls-1 mb-1">本週與上週業績</h6>
                            <h5 class="h3 text-white mb-0">所有店家本週與上週業績統計</h5>
                        </div>
                        <div class="col">
                            <div class="text-right">
                                <button class="secondBtn borderRadius10 py-2 px-3"
                                        @click.prevent="$router.push({name: 'reportControl_performance'})">
                                    <span class="d-none d-md-block">查詢業績</span>
                                    <span class="d-md-none">查詢</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <HorizontalBarChart :height="350"
                                        ref="barChart"
                                        :chart-data="nowAndLastWeekPerformance.chartData"
                                        :extra-options="nowAndLastWeekPerformance.extraOptions" />
                </card>
            </div>
            <div class="col-xl-4">
                <card header-classes="bg-transparent">
                    <div slot="header"
                         class="row align-items-center">
                        <div class="col">
                            <h3 class="text-dark mb-0">今日壽星</h3>
                        </div>
                        <div class="col">
                            <div class="text-right">
                                <button class="secondBtn borderRadius10 py-2 px-3"
                                        @click.prevent="$router.push({name: 'accountControl_member'})">
                                    <span class="d-none d-md-block">更多</span>
                                    <span class="d-md-none">更多</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <ul class="list-group list-group-flush list my--3">
                        <li class="list-group-item px-0"
                            v-for="(member,index) in members"
                            :key="index">
                            <div class="row align-items-center">
                                <div class="col-auto">
                                    <i class="fad fa-birthday-cake fa-2x"></i>
                                </div>
                                <div class="col ml--2">
                                    <h4 class="mb-0 d-inline-block hot-color">
                                        {{member.name}}
                                    </h4>
                                    <small class="ml-2">{{member.phone}}</small>
                                    <small class="float-right">{{member.birthday}}</small>
                                    <div class="clearfix"></div>
                                </div>
                                <!-- <div class="col-auto">
                                    <base-button type="primary"
                                                 size="sm">Add</base-button>
                                </div> -->
                            </div>
                        </li>
                    </ul>
                </card>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
// 長條狀圖組件
import BarChart from "../components/Charts/BarChart";
// 線性圖組件
import LineChart from "@/components/Charts/LineChart";
// 橫條狀圖組件
import HorizontalBarChart from "../components/Charts/HorizontalBarChart";
import * as chartConfigs from "../components/Charts/config";
/**
 * nowDayAndYesterDayPerformanceApi = 取得今日與昨日業績 api
 * nowDayAndYesterDayPointApi = 取得今日與昨日儲值額度 api
 * weekDesignerPerformanceApi = 本週設計師業績 api
 * nowAndLastWeekOperatorPerformanceApi = 取得本週與上週管理者總業績 api
 * nowDayAndYesterDayMemberRegisterTotaltApi = 今日與昨日會員註冊數 api
 * nowDayBirthdayMemberApi = 今日壽星 api
 */
import { nowDayAndYesterDayPerformanceApi, nowDayAndYesterDayPointApi, weekDesignerPerformanceApi, nowAndLastWeekOperatorPerformanceApi, nowDayAndYesterDayMemberRegisterTotaltApi, nowDayBirthdayMemberApi } from "../api/dashboardApi";
/**
 *
 */
export default {
    components: {
        BarChart,
        LineChart,
        HorizontalBarChart
    },
    computed: {
        ...mapGetters("userStore", ["getOperatorId"]),
        ...mapState("userStore", ["user"]),
        performanceSum() {
            let self = this;
            return self.sumMethod(self.performance.nowPerformance, self.performance.yesterdayPerformance);
        },
        pointSum() {
            let self = this;
            return self.sumMethod(self.point.nowPoint, self.point.yesterdayPoint);
        },
        registerSum() {
            let self = this;
            return self.sumMethod(self.memberRegister.nowRegister, self.memberRegister.yesterdayRegister);
        }
    },
    data() {
        return {
            // 業績
            performance: {
                // 今日業績
                nowPerformance: 0,
                // 昨日業績
                yesterdayPerformance: 0
            },
            // 儲值點數
            point: {
                // 今日儲值
                nowPoint: 0,
                // 昨日儲值
                yesterdayPoint: 0
            },
            // 會員註冊數
            memberRegister: {
                // 今日註冊數
                nowRegister: 0,
                // 昨日註冊數
                yesterdayRegister: 0
            },
            // 今日與昨日業績
            nowAndYesterdayPerformance: {
                chartData: {},
                extraOptions: {
                    scales: { xAxes: [{ ticks: { beginAtZero: true } }] }
                }
            },
            // 今日與昨日儲值額度
            nowAndYesterdayPoint: {
                chartData: {},
                extraOptions: {
                    scales: { xAxes: [{ ticks: { beginAtZero: true } }] }
                }
            },
            // 今日與昨日會員註冊數
            nowAndYesterdayMemberRigster: {
                chartData: {},
                extraOptions: {
                    scales: { xAxes: [{ ticks: { beginAtZero: true } }] }
                }
            },
            // 設計師當週業績
            weekPerformance: {
                activeIndex: 0,
                chartData: {},
                extraOptions: chartConfigs.blueChartOptions
            },
            // 今日與昨日儲值額度
            nowAndLastWeekPerformance: {
                chartData: {},
                extraOptions: {
                    scales: {
                        xAxes: [{ ticks: { beginAtZero: true } }]
                    }
                }
            },
            // 當日壽星
            members: []
        };
    },
    methods: {
        sumMethod(value, value2) {
            if (value === 0 && value2 === 0) {
                return { checkTrue: false, value: 0 };
            } else if (value === 0) {
                return { checkTrue: false, value: value - value2 };
            } else if (value2 === 0) {
                return {
                    checkTrue: true,
                    value: value - value2
                };
            } else if (value > value2) {
                return {
                    checkTrue: true,
                    value: (value / value2).toFixed(2)
                };
            } else if (value < value2) {
                return {
                    checkTrue: false,
                    value: (value2 / value).toFixed(2)
                };
            }
        },
        // 取得當日與昨日業績
        async getPerformance() {
            let self = this;
            try {
                let { data } = await nowDayAndYesterDayPerformanceApi(self.getOperatorId);
                self.performance.nowPerformance = data.data.todayTotal;
                self.performance.yesterdayPerformance = data.data.yesterdayTotal;
                let result = {
                    labels: ["業績"],
                    value: [],
                    value2: []
                };
                result.value.push(data.data.todayTotal);
                result.value2.push(data.data.yesterdayTotal);
                self.nowAndYesterdayPerformance.chartData = {
                    labels: [...result.labels],
                    legend: {
                        display: false,
                        labels: {
                            color: "rgb(255, 99, 132)"
                        }
                    },
                    datasets: [
                        {
                            backgroundColor: "#E9A5AB",
                            borderColor: "#CF515B",
                            barThickness: 15,
                            borderWidth: 2,
                            orderRadius: 1,
                            label: "今日",
                            data: [...result.value]
                        },
                        {
                            backgroundColor: "#98D7AA",
                            borderColor: "#3D9C58",
                            borderWidth: 2,
                            barThickness: 15,
                            orderRadius: 1,
                            label: "昨日",
                            data: [...result.value2]
                        }
                    ]
                };
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得今日與昨日業績失敗"
                });
            }
        },
        // 取得當日與昨日儲值額度
        async getPoint() {
            let self = this;
            try {
                let { data } = await nowDayAndYesterDayPointApi(self.getOperatorId);
                self.point.nowPoint = data.data.todayTotal;
                self.point.yesterdayPoint = data.data.yesterdayTotal;
                let result = {
                    labels: ["入金儲值"],
                    value: [],
                    value2: []
                };
                result.value.push(data.data.todayTotal);
                result.value2.push(data.data.yesterdayTotal);
                self.nowAndYesterdayPoint.chartData = {
                    labels: [...result.labels],
                    datasets: [
                        {
                            backgroundColor: "#2EFCFF",
                            borderColor: "#00A3DE",
                            barThickness: 15,
                            borderWidth: 2,
                            orderRadius: 1,
                            label: "今日",
                            data: [...result.value]
                        },
                        {
                            backgroundColor: "#FFD173",
                            borderColor: "#A26400",
                            borderWidth: 2,
                            barThickness: 15,
                            orderRadius: 1,
                            label: "昨日",
                            data: [...result.value2]
                        }
                    ]
                };
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得今日與昨日儲值額度失敗"
                });
            }
        },
        // 取得當日與昨日儲值額度
        async getMemberRegister() {
            let self = this;
            try {
                let { data } = await nowDayAndYesterDayMemberRegisterTotaltApi(self.getOperatorId);
                self.memberRegister.nowRegister = data.data.todayTotal;
                self.memberRegister.yesterdayRegister = data.data.yesterdayTotal;
                let result = {
                    labels: ["會員註冊數"],
                    value: [],
                    value2: []
                };
                result.value.push(data.data.todayTotal);
                result.value2.push(data.data.yesterdayTotal);
                self.nowAndYesterdayMemberRigster.chartData = {
                    labels: [...result.labels],
                    datasets: [
                        {
                            backgroundColor: "#FF00AB",
                            borderColor: "#730051",
                            barThickness: 15,
                            borderWidth: 2,
                            orderRadius: 1,
                            label: "今日",
                            data: [...result.value]
                        },
                        {
                            backgroundColor: "#FF6600",
                            borderColor: "#732B00",
                            borderWidth: 2,
                            barThickness: 15,
                            orderRadius: 1,
                            label: "昨日",
                            data: [...result.value2]
                        }
                    ]
                };
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得今日與昨日會員註冊數失敗"
                });
            }
        },
        async getWeekDesignerPerformance() {
            let self = this;
            let result = {
                datasets: [],
                // 日期
                labels: []
            };
            let color = ["rgba(107,176,191,0.5)", "rgba(166,40,28,0.5)", "rgba(217,137,119,0.5)", "rgba(255,237,46,0.5)", "rgba(4,157,191,0.5)", "rgba(217,88,13,0.5)", "rgba(242,148,34,0.5)", "rgba(41,115,115,0.5)", "rgba(30,145,217,0.5)"];
            try {
                let { data } = await weekDesignerPerformanceApi(self.getOperatorId);
                let datas = data.data;
                result.labels = data.data.day;
                Object.keys(datas).map((objKey, item) => {
                    if (objKey !== "day") {
                        result["datasets"].push({
                            pointBorderColor: "#2EFCFF",
                            pointBorderWidth: 4,
                            tension: 0.4,
                            borderWidth: 2,
                            borderColor: "#2EFCFF",
                            backgroundColor: color[item] === undefined ? color[0] : color[item],
                            label: datas[objKey].name,
                            data: datas[objKey].total
                        });
                    }
                });
                self.$set(self.weekPerformance, "chartData", result);
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得當週設計師業績失敗"
                });
            }
        },
        // 取得當週與上週管理者業績總計
        async getNowAndLastWeekPerformance() {
            let self = this;
            try {
                let { data } = await nowAndLastWeekOperatorPerformanceApi(self.getOperatorId);
                let result = {
                    labels: ["本週與上週業績"],
                    value: [],
                    value2: []
                };
                result.value.push(data.data.nowWeekOrdersTotal);
                result.value2.push(data.data.lastWeekOrdersTotal);
                self.nowAndLastWeekPerformance.chartData = {
                    labels: [...result.labels],
                    datasets: [
                        {
                            backgroundColor: "#2EFCFF",
                            borderColor: "#00A3DE",
                            barThickness: 15,
                            borderWidth: 2,
                            orderRadius: 1,
                            label: "本週",
                            data: [...result.value]
                        },
                        {
                            backgroundColor: "#FFD173",
                            borderColor: "#A26400",
                            borderWidth: 2,
                            barThickness: 15,
                            orderRadius: 1,
                            label: "上週",
                            data: [...result.value2]
                        }
                    ]
                };
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得本週與上週管理者業績失敗"
                });
            }
        },
        // 取得今日收星
        async getMember() {
            let self = this;
            try {
                let { data } = await nowDayBirthdayMemberApi(self.getOperatorId);
                self.members = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得今日壽星失敗"
                });
            }
        }
    },
    created() {
        let self = this;
        // 取得今日與昨日業績
        self.getPerformance();
        // 取得今日與昨日儲值額度
        self.getPoint();
        // 取得今日與昨日會員註冊數
        self.getMemberRegister();
        // 取得今日壽星
        self.getMember();
        // 判斷是否為系統身份
        if (self.user.group.group_code === "SYSTEM") {
            // 取得本週與上週管理者總業績
            self.getNowAndLastWeekPerformance();
        } else {
            // 取得當週設計師業績
            self.getWeekDesignerPerformance();
        }
    }
};
</script>