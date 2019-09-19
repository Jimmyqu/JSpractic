<template>
    <div class="detail-panel">
        <el-form label-position="top" label-width="100px" class="demo-ruleForm">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="1" >
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">所属组织</label>
                            <div class="input-group">
                                <span>{{scheduleForm.organizationName}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">调度单号</label>
                            <div class="input-group">
                                <span>{{scheduleForm.orderNo}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">状态</label>
                            <div class="input-group">
                                <span>{{scheduleForm.scheduleStatusText}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">合同编号</label>
                            <div class="input-group">
                                <span>{{scheduleForm.contractNo}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车人</label>
                            <div class="input-group">
                                <span>{{scheduleForm.user}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车人电话</label>
                            <div class="input-group">
                                <span>{{scheduleForm.phone}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">同行人员</label>
                            <div class="input-group">
                                <span>{{scheduleForm.peerUser}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">座位数</label>
                            <div class="input-group">
                                <span>{{scheduleForm.seateNum}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车时间</label>
                            <div class="input-group">
                                <span>{{scheduleForm.useTime}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车结束时间</label>
                            <div class="input-group">
                                <span>{{scheduleForm.useTimeEnd}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车事由</label>
                            <div class="input-group">
                                <span>{{scheduleForm.reason}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">出发地址</label>
                            <div class="input-group">
                                <span>{{scheduleForm.depAddress}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">抵达地址</label>
                            <div class="input-group">
                                <span>{{scheduleForm.arrAddress}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车类型</label>
                            <div class="input-group">
                                <span>{{scheduleForm.scheduleTypeText}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">备注</label>
                            <div class="input-group">
                                <span>{{scheduleForm.remark}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="服务车辆" name="2">
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">车辆</label>
                            <div class="input-group">
                                <span>{{scheduleForm.plate}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">驾驶员</label>
                            <div class="input-group">
                                <span>{{scheduleForm.driverName}}&nbsp;{{scheduleForm.driverPhone}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="服务信息" name="4" >
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">出车时间</label>
                            <div class="input-group">
                                <span>{{scheduleForm.depTime}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">还车时间</label>
                            <div class="input-group">
                                <span>{{scheduleForm.arrTime}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">本次服务时长</label>
                            <div class="input-group">
                                <span>{{scheduleForm.duration}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">出车里程(km)</label>
                            <div class="input-group">
                                <span>{{scheduleForm.depMile}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">还车里程(km)</label>
                            <div class="input-group">
                                <span>{{scheduleForm.arrMile}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">本次服务里程(km)</label>
                            <div class="input-group">
                                <span>{{scheduleForm.arrMile - scheduleForm.depMile}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="费用信息" name="4" v-if="scheduleForm.orderType == 2">
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">总费用</label>
                            <div class="input-group">
                                <span>{{scheduleForm.totalMoney}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">租金</label>
                            <div class="input-group">
                                <span>{{scheduleForm.rentMoney}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">路桥费</label>
                            <div class="input-group">
                                <span>{{scheduleForm.tollCharge}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">停车费</label>
                            <div class="input-group">
                                <span>{{scheduleForm.parkingFee}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">路桥费</label>
                            <div class="input-group">
                                <span>{{scheduleForm.tollCharge}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">加油费</label>
                            <div class="input-group">
                                <span>{{scheduleForm.oilFee}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">超时费</label>
                            <div class="input-group">
                                <span>{{scheduleForm.outtimeFee}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">超公里费</label>
                            <div class="input-group">
                                <span>{{scheduleForm.outmileFee}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">其他费用</label>
                            <div class="input-group">
                                <span>{{scheduleForm.otherFee}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">其他费用说明</label>
                            <div class="input-group">
                                <span>{{scheduleForm.otherFeeRemark}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <!--审批信息-->
                <el-collapse-item title="审批详情" name="5" >
                    <div class="approval-flow steps-panel">
                        <el-steps direction="vertical"   style="width:100%;">
                            <el-step :title="bean.approvalStatusText" :status="getStatus(bean.approvalStatus)" v-for="(bean,i) in approves" :key="i">
                                <i class="el-icon-check" slot="icon"></i>
                                <div class="step-box" slot="description">
                                    <div class="row" >
                                        <label>审批人</label>
                                        <span>{{bean.userName}}</span>
                                    </div>
                                    <div class="row">
                                        <label>操作时间</label>
                                        <span>{{bean.approvalTime}}</span>
                                    </div>
                                </div>
                            </el-step>
                        </el-steps>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="操作记录" name="6" >
                        <div class="approval-flow steps-panel">
                            <el-steps direction="vertical" :active="10"  style="width:100%;">
                                <el-step :title="bean.typeText" v-for="(bean,i) in details" :key="i">
                                    <i class="el-icon-check" slot="icon"></i>
                                    <div class="step-box" slot="description">
                                        <div class="row" >
                                            <label>操作人</label>
                                            <span>{{bean.creater}}</span>
                                        </div>
                                        <div class="row">
                                            <label>操作时间</label>
                                            <span>{{bean.createTime}}</span>
                                        </div>
                                    </div>
                                </el-step>
                            </el-steps>
                        </div>
                    </el-collapse-item>


            </el-collapse>
        </el-form>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'

    export default {
        name:'trafficVehicleScheduleDetail',
        components:{ ApprovalFlow, FileDetail },
        data: function () {
            return {
                id: this.$route.params.id,
                activeNames: ['1','2','3','4','5','6'],
                scheduleForm : {},
                details:[],
                approves:[],
            }

        },
        beforeMount: function () {//载入前
        },
        mounted: function () {//载入后
            this.open();
        },
        watch: {//它用于观察Vue实例上的数据变动。对应一个对象，键是观察表达式，值是对应回调。值也可以是方法名，或者是对象，包含选项。

        },
        methods: {
            open(){
                var $this = this;
                if(this.$route.params.id){
                    ajax.get('/core/clientVehicleSchedule/detail/' + this.$route.params.id).then(
                        res => {
                            if(res.status == 0 && res.data != null){
                                $this.scheduleForm = res.data.vehicleSchedule;
                                $this.details = res.data.detail;
                                $this.approves = res.data.approves;
                            }
                        }
                    )
                }
            },

            getStatus(status){
                if(status == 2){
                    return "process ";
                }
                if(status == 3){
                    return "success ";
                }
                if(status == 4){
                    return "error  ";
                }
            }
        }
    }
</script>
<style scoped>
    .el-steps {
        display: block;
    }
    .error-info {
        color: red;
    }
    .el-button--text {
        padding: 5px 0;
    }
    .hide-upload-btn .el-upload__tip,
    .hide-upload-btn .el-upload {
        display: none;
    }
    .el-upload__tip {
        line-height: 25px;
    }
    .el-upload-list__item {
        max-width: 300px;
    }
    .el-upload-list__item.is-success:focus .el-upload-list__item-status-label {
        display: block;
    }
    .el-upload-list__item.is-success:focus:hover .el-upload-list__item-status-label {
        display: none;
    }
    .el-table__header-wrapper th {
        background: #f5f6f8;
        color: #333;
    }

    .steps-panel {
        height: 100%;
        width: 100%;
        display: block;
    }
    .steps-panel .step-box {
        margin: 8px 0;
    }
    .steps-panel .close {
        float: none;
        opacity: 1;
        font-weight: initial;
        cursor: default;
    }
    .steps-panel .row {
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        padding: 3px 0;
        /*align-items: center;*/
    }
    .steps-panel .row > div {
        display: inline-block;
    }
    .steps-panel .steps-panel-title {
        font-size: 16px;
        font-weight: bold;
        color: #000;
    }
    .steps-panel .el-step.is-vertical .el-step__main {
        padding-left: 18px;
        color: #333;
        font-size: 16px;
    }
    .steps-panel .el-step.is-vertical .el-step__line {
        top: 2px;
    }
    .steps-panel .el-step {
        min-height: 60px;
    }
    .steps-panel .el-step__description.is-finish,
    .steps-panel .el-step__title.is-finish {
        color: inherit;
    }
    .steps-panel .el-step__description .row label {
        color: #444;
        font-weight: inherit;
        width: 90px;
        vertical-align: top;
        margin-bottom: 0;
    }
    .steps-panel .el-step__description .row > span {
        color: #000;
        width: calc(100% - 90px);
    }
    .steps-panel .el-step__description .upload-btn {
        margin-top: 5px;
    }
    .steps-panel .showBtn {
        font-size: 12px;
        color: #444;
        margin-left: 16px;
        cursor: pointer;
    }
    .steps-panel .showBtn:hover {
        color: #409EFF;
    }
    .steps-panel /deep/ .el-step .el-step__icon-inner{
        display: none;
    }
    .steps-panel /deep/ .is-process .el-step__icon.is-text  {
        border: 7px solid #ff9600;
    }
    .steps-panel /deep/ .is-process .el-icon-check {
        display: none;
    }
    .steps-panel /deep/ .el-step__line {
        background-color: #dcdfec;
    }
    .steps-panel /deep/ .el-step__head {
        border-color: #dcdfec;
    }
    .steps-panel /deep/ .el-step__head.is-finish {
        color: #fff;
        border-color: #afd5fa;
    }
    .steps-panel /deep/ .el-step__head.is-finish .el-step__icon.is-text {
        background-color: #60acf6;
        font-size: 18px;
        border: 0;
    }
    .steps-panel /deep/ .el-step__title.is-wait {
        color: #666;
    }

    .steps-panel .content-item ul {
        color: #2a78fd;
        margin-bottom: 5px;
    }
    .steps-panel .content-item ul li {

    }
    .steps-panel .file-item {
        display: flex;
        align-items: center;
    }
    .steps-panel .file-item .text{
        margin-right: 10px;
        margin-left: 10px;
        max-width: calc(100% - 65px);
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: top;
        text-align: left;
    }
    .steps-panel .file-item .icon-btn {
        background: #b9c0cb;
        color: #fff;
        font-size: 14px;
        border-radius: 50%;
        cursor: pointer;
        width: 20px;
        height: 20px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }
    .steps-panel .file-item .icon-btn:active {
        opacity: 0.7;
    }
    .steps-panel .file-item .el-icon-back:before {
        transform: rotate(-90deg);
        font-size: 12px;
    }
    .steps-panel .file-item .el-icon-back:hover {
        background: #ff9600;
    }
    .steps-panel .file-item .el-icon-close:hover {
        background: #ff5824;
    }


    .steps-panel .after-renting .row {
        display: block;
    }
    .text-btn {
        display: inline-block;
        color: #2a78fd;
        margin: 0 15px;
        font-size: 12px;
    }
</style>
