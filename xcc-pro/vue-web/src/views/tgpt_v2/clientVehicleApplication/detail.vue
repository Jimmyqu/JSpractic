<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="详情" name="1" >
                <div class="flex-panel detail-box">
					<div class="detail-item">
						<label class="control-label">申请单号</label>
						<div class="input-group">
							<span>{{detailForm.applicationNo}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">所属组织</label>
						<div class="input-group">
							<span>{{detailForm.organizationName}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">用车类型</label>
						<div class="input-group">
							<span>{{detailForm.typeText}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">用车人</label>
						<div class="input-group">
							<span>{{detailForm.user}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">用车人手机号</label>
						<div class="input-group">
							<span>{{detailForm.phone}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">同行人员</label>
						<div class="input-group">
							<span>{{detailForm.peerUser}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">座位数</label>
						<div class="input-group">
							<span>{{detailForm.seateNum}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">用车开始时间</label>
						<div class="input-group">
							<span>{{detailForm.useTimeStart}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">用车结束时间</label>
						<div class="input-group">
							<span>{{detailForm.useTimeEnd}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">用车事由</label>
						<div class="input-group">
							<span>{{detailForm.reason}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">出发地址</label>
						<div class="input-group">
							<span>{{detailForm.depAddress}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">抵达地址</label>
						<div class="input-group">
							<span>{{detailForm.arrAddress}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">备注</label>
						<div class="input-group">
							<span>{{detailForm.remark}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">是否需要审批人</label>
						<div class="input-group">
							<span>{{detailForm.needApprover == 0 ? '否':'是'}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">审批状态</label>
						<div class="input-group">
							<span>{{detailForm.approvalStatusText}}</span>
						</div>
					</div>

                </div>
            </el-collapse-item>
            <el-collapse-item title="审批详信息" name="2" v-show="detailForm.needApprover == 1 && detailForm.approvalStatus != 1">
               <!-- <div class="approval-flow steps-panel">
                    <el-steps direction="vertical"   style="width:100%;">
                        <el-step :title="bean.approvalStatusText" :status="getStatus(bean.approvalStatus)" v-for="(bean,i) in detailForm.approves" :key="i">
                            <i class="el-icon-check" slot="icon"></i>
                            <div class="step-box" slot="description">
                                <div class="row" >
                                    <label>审批人</label>
                                    <span>{{bean.userName}}</span>
                                </div>
                                <div class="row">
                                    <label>审批状态</label>
                                    <span>{{bean.approvalStatusText}}</span>
                                </div>
                                <div class="row">
                                    <label>审批时间</label>
                                    <span>{{bean.approvalTime}}</span>
                                </div>
                                <div class="row" v-if="bean.approvalStatus = 4">
                                    <label>审批时间</label>
                                    <span>{{bean.rejectReason}}</span>
                                </div>
                            </div>
                        </el-step>
                    </el-steps>
                </div>-->
                <template>
                    <el-table
                        border
                        :data="detailForm.approves"
                        style="width: 100%">
                        <el-table-column prop="userName" label="审批人" min-width="180"></el-table-column>
                        <el-table-column prop="approvalTime" label="审批时间" min-width="180"></el-table-column>
                        <el-table-column prop="approvalStatusText" label="审批状态" min-width="180"></el-table-column>
                        <el-table-column prop="rejectReason" label="审批意见" min-width="180"></el-table-column>
                    </el-table>
                </template>
            </el-collapse-item>
            <el-collapse-item title="作废信息" name="3" v-show="detailForm.approvalStatus == 5">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">操作人</label>
                        <div class="input-group">
                            <span>{{detailForm.updater}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">操作时间</label>
                        <div class="input-group">
                            <span>{{detailForm.updateTime}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'

    export default {
        name: "clientVehicleApplicationDetail",
        components:{ ApprovalFlow },
        data() {
            return {
                openCollapse: ["1" , "2","3"],
                show: true,
                detailForm: {
                },
                id: this.$route.params.id
            }
        },
        methods: {
            open() {
                this.show = true;
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
        ,
        mounted() {
            ajax.get('core/clientVehicleApplication/detail/' + this.id,).then(rs => {
                this.detailForm = rs.data;
            });


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
