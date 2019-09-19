<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="加油卡详情" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{oilCard.companyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">加油卡号</label>
                        <div class="input-group">
                            <span>{{oilCard.code}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">油卡类型</label>
                        <div class="input-group">
                            <span>{{oilCard.typeText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">绑定主卡</label>
                        <div class="input-group">
                            <span v-if="oilCard.masterCardCode != '' && oilCard.masterCardCode != null">{{oilCard.masterCardCode}}</span>
                            <span v-else>/</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">加油站</label>
                        <div class="input-group">
                            <span>{{oilCard.energyCompanyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">油卡余额（元）</label>
                        <div class="input-group">
                            <span>{{oilCard.balance}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">冻结余额（元）</label>
                        <div class="input-group">
                            <span>{{oilCard.frozenBalance}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">能源企业</label>
                        <div class="input-group">
                            <span>{{oilCard.energyCompanyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">到期日</label>
                        <div class="input-group">
                            <span>{{oilCard.validDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">到期后处理方式</label>
                        <div class="input-group">
                            <span>{{oilCard.expirationProcessName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">持卡人</label>
                        <div class="input-group">
                            <span>{{oilCard.cardholderUser}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务客户</label>
                        <div class="input-group">
                            <span>{{oilCard.enterpriseName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同编号</label>
                        <div class="input-group">
                            <span>{{oilCard.contractNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">项目订单</label>
                        <div class="input-group">
                            <span>{{oilCard.orderNo}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">绑定车辆</label>
                        <div class="input-group">
                            <span v-if="oilCard.plate != '' && oilCard.plate != null">{{oilCard.plate}}</span>
                            <span v-else>/</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">绑定车型</label>
                        <div class="input-group">
                            <span v-if="oilCard.vehicleModel != '' && oilCard.vehicleModel != null">{{oilCard.vehicleModel}}</span>
                            <span v-else>/</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">状态</label>
                        <div class="input-group">
                            <span>{{oilCard.oilCardStatusText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">操作人</label>
                        <div class="input-group">
                            <span>{{oilCard.creater}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">操作时间</label>
                        <div class="input-group">
                            <span>{{oilCard.createTime}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="审批进程" name="2">
                <approval-flow :id="oilCard.id"></approval-flow>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'

    export default {
        name: "trafficOilCardDetail",
        components:{ ApprovalFlow },
        data(){
            return {
                activeNames: ['1','2'],
                contractInfo:{},
                oilCard:{
                    id:"",
                    code:"",
                    supplierName:"",
                    balance:"",
                    cardholderUserName:"",
                    branchCompany:"",
                    enterpriseName:"",
                    masterCardCode:"",
                    plate:"",
                    vehicleModel:"",
                    validDate:"",
                    expirationProcess:"",
                    creater:"",
                    createTime:"",
                    oilCardStatus:""
                }
            }
        },
        mounted(){
            this.initData();
        },
        methods:{
            initData(){
                let id = this.$route.params.id;
                ajax.get('/base/oilCard/detail/' + id).then(result => {
                    if(result.status == 0){
                        this.oilCard = result.data;
                        if(this.oilCard.vehicleId)
                            this.getAssociateContractInfo(this.oilCard.vehicleId);
                    }
                });
            },
            /*getAssociateContractInfo(id){
                ajax.get('base/oilCard/contractInfo/'+id).then(rs => {
                    if (rs.status == 0) {
                        this.contractInfo = rs.data;
                    }else{
                        this.$message.error("查询合同信息有误");
                    }
                });
            },*/
        }

    }
</script>
