<template>
    <div class="page-common wrapper-content" v-cloak>

        <div class="trip-box">
            <div class="remind-box task">
                <div class="top-box border">
                    <div class="left-box">
                        <i></i>
                        <span class="title">任务</span>
                    </div>
                </div>
                <div class="list">
                    <div class="empty-box" v-if="remindCount1==0">暂无数据</div>
                    <div class="full-width">
                        <div class="item" v-for="bean in remindList1"
                             @click="toPage('/tgpt/todoFlow')">
                            <div class="title-item">
                <span class="title" :title="bean.title">
                  <i class="el-icon-document"></i>
                  {{bean.modelName}} {{bean.positionName}}审批
                </span>
                                <span class="time pull-right">{{bean.createTimeStr}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <el-pagination layout="total, prev, pager, next" :page-size="10" :current-page="remindPage1"
                               @current-change="getRemindList1" :total="remindCount1">
                </el-pagination>
            </div>
            <div class="remind-box">
                <div class="top-box border">
                    <div class="left-box">
                        <i></i>
                        <span class="title">提醒</span>
                        <span class="info"><em>{{remindCount}}</em>条未读</span>
                    </div>
                    <div class="right-box">
                        <el-button type="text" @click="readAll()">全部标记已读</el-button>
                    </div>
                </div>
                <div class="list">
                    <div class="empty-box" v-if="remindCount2==0">暂无数据</div>
                    <div class="full-width">
                        <div class="item" v-for="bean in remindList2" :class="{'active':bean.readStatus!=1}"
                             @click="openDetail(bean)">
                            <div class="title-item">
                <span class="title" :title="bean.title">
                  <i class="el-icon-bell"></i>
                  {{bean.title}}
                </span>
                                <span class="time pull-right">{{bean.createTimeStr}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <el-pagination layout="total, prev, pager, next" :page-size="10" :current-page="remindPage2"
                               @current-change="getRemindList2" :total="remindCount2">
                </el-pagination>
            </div>
        </div>

        <div class="stat-panel" >
            <template v-for="bean in statList">
                <div class="stat-item border" v-if="bean.type == 1 && getCurrentUserAuthority(bean.url)">
                    <div class="title">
                        <span>{{bean.title}}</span>
                    </div>
                    <div class="body">
                        <div class="stat chart half first">
                            <div class="child-title">{{bean.title1}}</div>
                            <div class="count">{{bean.count1}}</div>
                            <div class="count-prev">{{bean.countPrev1}}</div>
                            <div class="vs">vs<span>上月</span></div>
                        </div>
                        <div class="stat chart half">
                            <div class="child-title">{{bean.title2}}</div>
                            <div class="pie-info" v-if="bean.chartData">
                                <div>
                                <span :style="{color:chartExtend.color[i]}" v-for="(pie,i) in bean.chartData.rows">
                                    {{pie.count}}
                                </span>
                                </div>
                                <div>
                                <span :style="{color:chartExtend.color[i]}" v-for="(pie,i) in bean.chartData.rows">
                                    {{pie.name}}
                                </span>
                                </div>
                            </div>
                            <ve-pie height="100%" :data="bean.chartData" :extend="chartExtend"></ve-pie>
                        </div>
                    </div>
                </div>
                <div class="stat-item border" v-if="bean.type == 2 && getCurrentUserAuthority(bean.url)">
                    <div class="title">
                        <span>{{bean.title}}</span>
                    </div>
                    <div class="body">
                        <div class="stat first">
                            <div class="child-title">{{bean.title1}}</div>
                            <div class="count" v-html="bean.count1"></div>
                            <div class="count-prev" :class="bean.class">
                                <span v-html="bean.countPrev1"></span>
                                <span class="info" v-if="bean.countInfo">{{bean.countInfo}}</span>
                            </div>
                            <div class="vs">vs<span>上月</span></div>
                        </div>
                    </div>
                </div>
                <div class="stat-item border" v-if="bean.type == 3 && getCurrentUserAuthority(bean.url)">
                    <div class="title">
                        <span>{{bean.title}}</span>
                    </div>
                    <div class="body">
                        <div class="stat half first">
                            <div class="child-title">{{bean.title1}}</div>
                            <div class="count" v-html="bean.count1"></div>
                            <div class="count-prev" v-html="bean.countPrev1"></div>
                            <div class="vs">vs<span>上月</span></div>
                        </div>
                        <div class="stat half">
                            <div class="child-title">{{bean.title2}}</div>
                            <div class="count" v-html="bean.count2"></div>
                            <div class="count-prev" v-html="bean.countPrev2"></div>
                            <div class="vs">vs<span>上月</span></div>
                        </div>
                    </div>
                </div>
                <div class="stat-item border" v-if="bean.type == 4 && getCurrentUserAuthority(bean.url)">
                    <div class="title">
                        <span>{{bean.title}}</span>
                    </div>
                    <div class="body type4">
                        <div class="child-title static">{{bean.title1}}</div>
                        <div class="count" v-html="bean.count1"></div>
                        <div class="child-title static">{{bean.title2}}</div>
                        <div class="count" v-html="bean.count2"></div>
                    </div>
                </div>
            </template>

        </div>


    </div>
</template>

<script>
    import {VePie} from 'v-charts'
    import ajax from '@/utils/request'
    import {tool, statConfig} from '@/utils/common'
    import {isFunction, formatAmount} from '@/utils'

    export default {
        mixins: [tool, statConfig],
        components: {
            VePie
        },
        data() {
            return {
                remindPage1: 1,
                remindList1: [],
                remindCount1: 0,
                remindPage2: 1,
                remindList2: [],
                remindCount2: 0,
                // pageSize:1,
                chartExtend: this.getChartPieOption(),
                statList: [
                    {
                        title: "分公司项目评审指标",
                        title1: "项目数",
                        title2: "评审状态",
                        url: "base/workbench/companyProjectReviewKPI",
                        type: 1
                    },
                    {
                        title: "分公司合同评审指标",
                        title1: "合同数",
                        title2: "评审状态",
                        url: "base/workbench/companyContractKPI",
                        type: 1
                    },
                    {
                        title: "分公司合同金额指标",
                        url: "base/workbench/companyContractAmountKPI",
                        type: 2
                    },
                    {
                        title: "分公司应收指标",
                        url: "base/workbench/contractSettlementAmount",
                        type: 2
                    },
                    {
                        title: "分公司合同新增车台数及司机数",
                        title1: "车台数",
                        title2: "司机数",
                        url: "base/workbench/newDriversAndDrivers",
                        type: 3
                    },
                    {
                        title: "分公司合同到期指标",
                        title1: "到期数",
                        title2: "待确认项",
                        url: "base/workbench/contractExpirationIndex",
                        type: 1
                    },
                    {
                        title: "分公司合同结算金额",
                        url: "base/workbench/companySettleKPI",
                        type: 2
                    },
                    {
                        title: "分公司车台数",
                        title1: "车台数",
                        title2: "车辆状态",
                        url: "base/workbench/branchCompanyNumber",
                        type: 1
                    },
                    {
                        title: "分公司采购指标",
                        title1: "采购计划待采购车台数",
                        title2: "采购车台数",
                        url: "base/workbench/procurementIndex",
                        type: 3
                    },
                    {
                        title: "分公司采购阶段指标",
                        title1: "采购车台数",
                        title2: "阶段数",
                        url: "base/workbench/procurementPhaseIndex",
                        type: 1
                    },
                    {
                        title: "分公司企业客户指标",
                        title1: "企业数",
                        title2: "新增企业数",
                        url: "base/workbench/enterpriseIndex",
                        type: 3
                    },
                    {
                        title: "分公司收退款待冲销金额指标",
                        title1: "收款待冲销",
                        title2: "退款待冲销",
                        url: "base/workbench/toOffsetIndex",
                        type: 4
                    },
                    {
                        title: "分公司加油卡指标",
                        title1: "油卡数量",
                        title2: "油卡余额",
                        url: "base/workbench/oilCardQuota",
                        type: 3
                    },
                    {
                        title: "分公司加油指标",
                        title1: "加油单数",
                        title2: "加油油费",
                        url: "base/workbench/fuelOilQuota",
                        type: 3
                    },
                    {
                        title: "分公司事故指标",
                        title1: "事故单数",
                        title2: "事故等级",
                        url: "base/workbench/accidentQuota",
                        type: 1
                    },
                    {
                        title: "分公司维修保养指标",
                        title1: "维修保养单数",
                        title2: "维修保养状态",
                        url: "base/workbench/maintenanceQuota",
                        type: 1
                    },
                    {
                        title: "分公司保险指标",
                        title1: "本月到期保单",
                        title2: "本月保费",
                        url: "base/workbench/insuranceQuota",
                        type: 3
                    },
                    {
                        title: "分公司司机指标",
                        title1: "本月司机数",
                        title2: "本月新增司机数",
                        url: "base/workbench/driverQuota",
                        type: 3
                    },

                ],
                remindCount: 0,
                form: {},
            }
        },

        methods: {
            formatAmount(num) {
                if (num && parseInt(num).toString().length >= 7) {
                    return formatAmount(num / 10000, 0) + "<span>万元</span>";
                } else {
                    return formatAmount(num, 0) + "<span>元</span>";
                }
            },
            remindInit() {
                this.remindPage1 = 1;
                this.remindList1 = [];
                this.remindCount1 = 1;
                this.getRemindList1();
            },
            getRemindList1(page = 1) {
                this.listUrl = "workflow/workflow/todoList?taskType=1";
                this.page = page;
                this.getList(res => {
                    this.remindList1 = res.rows;
                    this.remindCount1 = res.records;
                    this.remindPage1 = res.page;
                })
            },
            remindInit2() {
                this.remindPage2 = 1;
                this.remindList2 = [];
                this.remindCount2 = 1;
                this.getRemindList2();
                this.getRemindCount();
            },
            getRemindList2(page = 1) {
                this.listUrl = "base/message/getMessageList";
                this.page = page;
                this.getList(res => {
                    this.remindList2 = res.rows;
                    this.remindCount2 = res.records;
                    this.remindPage2 = res.page;
                })
            },
            getRemindCount() {
                ajax.get("base/message/getUnreadMessageCount").then(res => {
                    if (this.checkResponse(res)) {
                        this.remindCount = res.data;
                    }
                });
            },
            readAll() {
                ajax.post("base/message/setAllRead").then(res => {
                    if (this.checkResponse(res)) {
                        this.remindInit2();
                    }
                });
            },
            openDetail(bean) {
                ajax.get("base/message/setRead/"+ bean.id).then(res => {
                    if (this.checkResponse(res)) {
                        if (bean.readStatus == 0) {
                            this.getRemindCount();
                        }
                        this.$set(bean, "readStatus", 1);
                        this.$router.push({path:bean.jumpUrl});
                        // this.openPage(bean.jumpUrl, bean.jumpTitle);
                    }
                });
            },
            getStatList() {
                for (let i = 0; i < this.statList.length; i++) {
                    let bean = this.statList[i];
                    if (bean.url && this.getCurrentUserAuthority(bean.url)) {
                        ajax.get(bean.url).then(res => {
                            if (this.checkResponse(res)) {
                                let fun = this["getStatList" + (i + 1)];
                                isFunction(fun) && fun(i, res.data);
                            }
                        });
                    }
                }
            },
            //分公司项目评审指标
            getStatList1(i, data) {
                let bean = this.statList[i];
                bean.count1 = data.currentMonth;
                bean.countPrev1 = data.prevMonth;
                if (data.pie) {
                    bean.chartData = {
                        columns: ["name", "count"],
                        rows: data.pie
                    };
                }
                this.$set(this.statList, i, bean);
            },
            //分公司合同评审指标
            getStatList2(i, data) {
                this.getStatList1(i, data);
            },
            //分公司合同金额指标
            getStatList3(i, data) {
                let bean = this.statList[i];
                bean.count1 = this.formatAmount(data.currentMonth.toString());
                bean.countPrev1 = this.formatAmount(data.prevMonth.toString());
                this.$set(this.statList, i, bean);
            },
            //分公司应收指标
            getStatList4(i, data) {
                let bean = this.statList[i];
                bean.count1 = this.formatAmount(data.totalAmount.toString());
                bean.countPrev1 = this.formatAmount(data.lastTotalAmount.toString());
                if (data.total) {
                    bean.countInfo = data.total + "单";
                } else {
                    bean.countInfo = "0单";
                }
                this.$set(this.statList, i, bean);

            },
            //分公司合同新增车台数及司机数
            getStatList5(i, data) {
                let bean = this.statList[i];
                bean.count1 = data.thisVehicle;
                bean.countPrev1 = data.lastVehicle;
                bean.count2 = data.thisDriver;
                bean.countPrev2 = data.lastDriver;
                this.$set(this.statList, i, bean);

            },
            //分公司合同到期指标
            getStatList6(i, data) {
                let bean = this.statList[i];
                bean.count1 = data.total;
                bean.countPrev1 = data.lastTotal;
                bean.chartData = {
                    columns: ["name", "count"],
                    rows: [
                        {name: "待资产调拨", count: data.assetAllocationDisposalConfirm},
                        {name: "车况待确定", count: data.carConditionExplainConfirm},
                        {name: "违章待确认", count: data.peccancyConfirm},
                        {name: "车险待确认", count: data.insuranceConfirm},
                        {name: "司机待确认", count: data.driverArrangementConfirm},
                        {name: "费用待确认", count: data.chargedConfirm},
                    ]
                };
                this.$set(this.statList, i, bean);
            },
            //分公司合同结算金额
            getStatList7(i, data) {
                let bean = this.statList[i];
                bean.count1 = this.formatAmount(data.currentMonthAmount.toString());
                bean.countPrev1 = this.formatAmount(data.prevMonthAmount.toString());
                if (data.currentMonthCount) {
                    bean.countInfo = data.currentMonthCount + "单";
                } else {
                    bean.countInfo = "0单";
                }
                this.$set(this.statList, i, bean);
            },
            //分公司车台数
            getStatList8(i, data) {
                let bean = this.statList[i];
                bean.count1 = data.total;
                bean.countPrev1 = data.lastTotal;
                bean.chartData = {
                    columns: ["name", "count"],
                    rows: [
                        {name: "已租", count: data.rent},
                        {name: "待租", count: data.rented},
                        {name: "维修保养", count: data.maintain},
                        {name: "未投入运营", count: data.noRun},
                        {name: "退出运营", count: data.exit},
                    ]
                };
                this.$set(this.statList, i, bean);
            },
            //分公司采购指标
            getStatList9(i, data) {
                let bean = this.statList[i];
                bean.count1 = data.currentPlanNumber;
                bean.countPrev1 = data.lastPlanNumber;
                bean.count2 = data.currentBuyNumber;
                bean.countPrev2 = data.lastBuyNumber;
                this.$set(this.statList, i, bean);
            },
            //分公司采购阶段指标
            getStatList10(i, data) {
                let bean = this.statList[i];
                bean.count1 = data.enterpriseSum;
                bean.countPrev1 = data.lastMonthSum;
                bean.chartData = {
                    columns: ["name", "count"],
                    rows: [
                        {name: "待派车", count: data.dispatching},
                        {name: "待提车", count: data.lift},
                        {name: "待上牌", count: data.playingCards},
                        {name: "完成", count: data.complete},
                        {name: "终止", count: data.termination},

                    ]
                };
                this.$set(this.statList, i, bean);
            },
            //分公司企业客户指标
            getStatList11(i, data) {
                let bean = this.statList[i];
                bean.count1 = data.enterpriseSum;
                bean.countPrev1 = data.currentMonthSum;
                bean.count2 = data.lastMonthEnterpriseSum;
                bean.countPrev2 = data.lastMonthSum;
                this.$set(this.statList, i, bean);
            },
            //分公司收退款待冲销金额指标
            getStatList12(i, data) {
                let bean = this.statList[i];
                bean.count1 = this.formatAmount(data.collectionToOffset.toString());
                bean.count2 = this.formatAmount(data.refundToOffset.toString());
                this.$set(this.statList, i, bean);
            },
            //分公司加油卡指标
            getStatList13(i, data) {
                let bean = this.statList[i];
                bean.count1 = data.currentCount;
                bean.countPrev1 = data.lastCount;
                bean.count2 = this.formatAmount(data.currentBalanceAmount.toString());
                bean.countPrev2 = this.formatAmount(data.lastBalanceAmount.toString());
                this.$set(this.statList, i, bean);
            },
            //分公司加油指标
            getStatList14(i, data) {
                let bean = this.statList[i];
                bean.count1 = data.currentCount;
                bean.countPrev1 = data.lastCount;
                bean.count2 = this.formatAmount(data.currentTotalAmount.toString());
                bean.countPrev2 = this.formatAmount(data.lastTotalAmount.toString());
                this.$set(this.statList, i, bean);
            },
            //分公司事故指标
            getStatList15(i, data) {
                let bean = this.statList[i];
                bean.count1 = data.currentMonthCount;
                bean.countPrev1 = data.lastMonthCount;
                bean.chartData = {
                    columns: ["name","count"],
                    rows:[
                        { name:"待提交审批",count: data.waitSubmitApprove },
                        { name:"审批中",count: data.approving },
                        { name:"审批不通过",count: data.approveFail },
                        /*{ name:"审批通过",count: data.approved },*/
                        { name:"完成",count: data.finish },
                    ]
                };
                this.$set(this.statList, i, bean);

            },
            //分公司维修保养指标
            getStatList16(i, data) {
                let bean = this.statList[i];
                bean.count1 = data.currentMonthCount;
                bean.countPrev1 = data.lastMonthCount;
                bean.chartData = {
                    columns: ["name","count"],
                    rows:[
                        { name:"待提交审批",count: data.waitSubmitApprove },
                        { name:"审批中",count: data.approving },
                        { name:"审批不通过",count: data.approveFail },
                        { name:"完成",count: data.finish },
                    ]
                };
                this.$set(this.statList, i, bean);
            },
            //分公司保险指标
            getStatList17(i, data) {
                let bean = this.statList[i];
                bean.count1 = data.currentExpiredCount;
                bean.countPrev1 = data.lastExpiredCount;
                bean.count2 = this.formatAmount(data.currentInsuranceCostTotal.toString());
                bean.countPrev2 = this.formatAmount(data.lastInsuranceCostTotal.toString());
                this.$set(this.statList, i, bean);
            },
            //分公司司机指标
            getStatList18(i, data) {
                let bean = this.statList[i];
                bean.count1 = data.currentMonthCount;
                bean.countPrev1 = data.lastMonthCount;
                bean.count2 = data.currentMonthAddCount;
                bean.countPrev2 = data.lastMonthAddCount;
                this.$set(this.statList, i, bean);
            },
            init() {
                this.getStatList();
                this.remindInit();
                this.remindInit2();

            }
        },
        mounted() {

            this.init();
        }
    }
</script>

<style scoped lang="scss">
    @import "src/styles/workbench.scss"

</style>
