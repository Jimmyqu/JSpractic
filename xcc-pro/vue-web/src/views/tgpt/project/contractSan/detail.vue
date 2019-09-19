<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="合同基本信息" name="1" >
                <div class="flex-panel detail-box">
					<div class="detail-item">
						<label class="control-label">合同编号</label>
						<div class="input-group">
							<span>{{detailForm.contractNumber}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">合同状态</label>
						<div class="input-group">
							<span>{{detailForm.contractStatusText}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">所属组织</label>
						<div class="input-group">
							<span>{{detailForm.originateDeptName}}</span>
						</div>
					</div>
                    <div class="detail-item">
                        <label class="control-label">合同申请人</label>
                        <div class="input-group">
                            <span>{{detailForm.applicationPeopleName}}</span>
                        </div>
                    </div>
					<div class="detail-item">
						<label class="control-label">申请日期</label>
						<div class="input-group">
							<span>{{detailForm.applicationDate}}</span>
						</div>
					</div>
                    <div class="detail-item">
                        <label class="control-label">客户类型</label>
                        <div class="input-group">
                            <span>{{detailForm.customerType=='1'?'企业客户':(detailForm.customerType=='2'?'个人客户':'/')}}</span>
                        </div>
                    </div>
					<div class="detail-item">
						<label class="control-label">服务客户</label>
						<div class="input-group">
							<span>{{detailForm.enterpriseName}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">合同开始日期 </label>
						<div class="input-group">
							<span>{{detailForm.contractStartDate}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">合同结束日期 </label>
						<div class="input-group">
							<span>{{detailForm.contractEndDate}}</span>
						</div>
					</div>
                    <div class="detail-item">
                        <label class="control-label">合同负责人</label>
                        <div class="input-group">
                            <span>{{detailForm.contractLeaderName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">是否框架合同</label>
                        <div class="input-group">
                            <span>{{detailForm.frameContractName}}</span>
                        </div>
                    </div>
					<div class="detail-item">
						<label class="control-label">我方签约主体</label>
						<div class="input-group">
							<span>{{detailForm.ourContractSubjectName}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">对方签约主体</label>
						<div class="input-group">
							<span>{{detailForm.otherContractSubject}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">合同议定方</label>
						<div class="input-group">
							<span>{{detailForm.contractAgreedPartyName}}</span>
						</div>
					</div>
                    <div class="detail-item big">
                        <label class="control-label">合同附件</label>
                        <upload-panel :size="1"  disabled :file-list.sync="imgs"></upload-panel>
                    </div>
                </div>
            </el-collapse-item>

            <el-collapse-item title="合同费用信息" name="2" >
                <div class="flex-panel detail-box">
                    <!--<div class="detail-item">
                        <label class="control-label">合同金额</label>
                        <div class="input-group">
                            <span>{{detailForm.contractAmount}}</span>
                        </div>
                    </div>-->
                    <div class="detail-item">
                        <label class="control-label">是否含税</label>
                        <div class="input-group">
                            <span>{{detailForm.isContainTaxName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">是否开票</label>
                        <div class="input-group">
                            <span>{{detailForm.isOpenTicketName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">发票税率</label>
                        <div class="input-group">
                            <span>{{detailForm.invoiceTaxRate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">结算日</label>
                        <div class="input-group">
                            <span>{{detailForm.settlementDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">付款方式 </label>
                        <div class="input-group">
                            <span>{{detailForm.paymentModelName}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>

            <el-collapse-item title="服务车型" name="3">
                <ul class="list-box">
                    <li v-for="bean in vehicleModelInfoList">
                        <span>{{bean.name}}</span>;
                    </li>
                </ul>
            </el-collapse-item>

        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import UploadPanel from '@/components/UploadPanel/index'
    import ApprovalFlow from '@/components/ApprovalFlow/index'

    export default {
        name: "projectContractSanDetail",
        components:{ ApprovalFlow ,UploadPanel},
        data() {
            return {
                openCollapse: ["1","2","3"],
                show: true,
                detailForm: {
                },
                imgs:[],
                vehicleModelInfoList:[],
                id: this.$route.params.id
            }
        },
        methods: {
            open() {
                this.show = true;
            }
        }
        ,
        mounted() {
            ajax.get('core/coreProjectContractSan/' + this.id,).then(rs => {
                this.detailForm = rs.data;
                this.vehicleModelInfoList = rs.data.vehicleModelInfoList;
                if(rs.data.attachment){
                    this.imgs=JSON.parse(rs.data.attachment);
                }
            });
        }

    }
</script>
