<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="合同信息" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">合同编号</label>
                        <div class="input-group">
                            <span>{{detailForm.contractNumber}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同类型</label>
                        <div class="input-group">
                            <span>{{detailForm.contractTypeText}}</span>
                        </div>
                    </div>
					<div class="detail-item">
						<label class="control-label">所属组织</label>
						<div class="input-group">
							<span>{{detailForm.organizationName}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">承租人</label>
						<div class="input-group">
							<span>{{detailForm.renter}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">承租人手机号</label>
						<div class="input-group">
							<span>{{detailForm.phone}}</span>
						</div>
					</div>
                    <div class="detail-item">
                        <label class="control-label">合同开始日期</label>
                        <div class="input-group">
                            <span>{{detailForm.contractStartDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同结束日期</label>
                        <div class="input-group">
                            <span>{{detailForm.contractEndDate}}</span>
                        </div>
                     </div>
                    <div class="detail-item">
                        <label class="control-label">所需车辆台数</label>
                        <div class="input-group">
                            <span>{{detailForm.vehicleNum}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同总金额(元)</label>
                        <div class="input-group">
                            <span>{{detailForm.contractAmount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">业务员</label>
                        <div class="input-group">
                            <span>{{detailForm.salesman}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">担保人身份证</label>
                        <div class="input-group">
                            <span>{{detailForm.assurePersonIdcard}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">担保人手机号</label>
                        <div class="input-group">
                            <span>{{detailForm.assurePersonPhone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{detailForm.remark}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">附件</label>
                        <div class="input-group">
                            <upload-panel :size="1"  disabled :file-list.sync="imgs"></upload-panel>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同状态</label>
                        <div class="input-group">
                            <span>{{detailForm.contractStatusText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">创建人</label>
                        <div class="input-group">
                            <span>{{detailForm.creater}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">创建时间</label>
                        <div class="input-group">
                            <span>{{detailForm.createTime}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
             <el-collapse-item title="合同款项" name="2" >
                <ul class="form-table">
                    <li class="table-tr header">
                        <div class="table-td " style="min-width:100px">款项类型</div>
                        <div class="ul">
                            <div class="table-td" style="min-width:100px">期数</div>
                            <div class="table-td " style="min-width:100px">金额（元）</div>
                            <div class="table-td " style="min-width:150px">支付日期</div>
                            <div class="table-td " style="min-width:290px">临期提醒</div>
                        </div>
                    </li>
                    <li class="table-tr" :style="{'margin-right': rentList.length > 7?'-8px':''}" v-for="(row,i) in detailForm.detailList" :key="i">
                        <template v-if="row.paymentType && row.paymentType != 4">
                            <div class="table-td" style="min-width:100px">
                                {{paymentType[row.paymentType]}}
                            </div>
                            <div class="ul">
                                <div class="table-td" style="min-width:100px">
                                    {{row.period || '--'}}
                                </div>
                                <div class="table-td" style="min-width:100px">
                                    {{row.amount}}
                                </div>
                                <div class="table-td" style="min-width:150px">
                                    {{row.paymentDate}}
                                </div>
                                <div class="table-td remind" style="min-width:290px">
                                    <span>在到期前<b> {{row.remindDays}} </b>天提醒（0不提醒）</span>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                                <div class="table-td" style="min-width:100px">
                                    {{paymentType[row.paymentType]}}
                                </div>
                                <ul class="form-rent-table" :style="{'margin-right': rentList.length > 7?'-8px':''}">
                                    <li class="rent-table-tr" v-for="(props,k) in rentList" :key="k">
                                        <div class="form-rent">
                                            <div class="rent-table-td " style="min-width:100px">
                                                第{{props.period}}期
                                            </div>
                                            <div class="rent-table-td" style="min-width:100px">
                                                {{props.amount}}
                                            </div>
                                            <div class="rent-table-td" style="min-width:150px">
                                                {{props.paymentDate}}
                                            </div>
                                            <div class="rent-table-td remind detail" style="min-width:290px">
                                                <span>在到期前<b> {{props.remindDays}} </b>天提醒（0不提醒）</span> 
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                        </template>
                    </li>
                </ul>
            </el-collapse-item>
             <el-collapse-item title="审批进度" name="3" >
                <approval-flow :id="id"></approval-flow>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import UploadPanel from '@/components/UploadPanel/index'

    export default {
        name: "repairCwDetail",
        components:{ ApprovalFlow,FileDetail,UploadPanel },
        data() {
            return {
                openCollapse: ["1","2","3"],
                show: true,
                paymentType:{
                    1:'定金',
                    2:'首付款',
                    3:'押金',
                    4:'租金',
                },
                rentList:[],
                detailForm: {
                    detailList:[]
                },
                imgs:[],
                id: this.$route.params.id,
            }
        },
        methods: {
            open() {
                this.show = true;
            },
            photoHandle(object,num) {
                var $this = this;
                var result;
                if (object) {
                    var object1 = JSON.parse(object);
                    result = object1.filedomain + object1.path;
                    if (num == 1) {
                        $this.detailForm.maintenanceImg = result;
                    }
                }
            },
            getData(){
                this.imgs = [];
                if(this.id){
                    ajax.get('traffic/trafficContract/detail/' + this.id).then(res=>{
                        if(res.status == 0){
                            this.detailForm = res.data;
                            if(res.data.attachment){
                                this.imgs=JSON.parse(res.data.attachment);
                            }
                            const detailList = res.data.detailList.filter(item=>item.paymentType != 4);
                            const children = res.data.detailList.filter(item=>item.paymentType == 4);
                            this.rentList = children;
                            this.detailForm.detailList = detailList;
                            if(children.length){
                                this.detailForm.detailList.push({paymentType:4});
                            }
                        }
                    })
                }
            },
        }
        ,
        mounted() {
            this.getData();
        }

    }
</script>
