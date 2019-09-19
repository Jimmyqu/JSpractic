<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="事故信息" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">订单号</label>
                        <div class="input-group">
                            <span>{{accident.code}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">事故车辆</label>
                        <div class="input-group">
                            <span>{{accident.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车型</label>
                        <div class="input-group">
                            <span>{{accident.vehicleModelInfoName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">事故经手人</label>
                        <div class="input-group">
                            <span>{{accident.handUser==null?'/':accident.handUser}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">事故发生时间</label>
                        <div class="input-group">
                            <span>{{accident.accidentTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">事故地点</label>
                        <div class="input-group">
                            <span>{{accident.accidentPlace}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">事故等级</label>
                        <div class="input-group">
                            <template v-if="accident.accidentGrade==1">
                                <span>小事故</span>
                            </template>
                            <template v-else-if="accident.accidentGrade==2">
                                <span>中事故</span>
                            </template>
                            <template v-else-if="accident.accidentGrade==3">
                                <span>大事故</span>
                            </template>
                            <template v-else-if="accident.accidentGrade==4">
                                <span>特大事故</span>
                            </template>
                            <template v-else>
                                <span>/</span>
                            </template>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">事故方</label>
                        <div class="input-group">
                            <template v-if="accident.accidentSquare==1">
                                <span>单方</span>
                            </template>
                            <template v-else-if="accident.accidentSquare==2">
                                <span>双方</span>
                            </template>
                            <template v-else-if="accident.accidentSquare==3">
                                <span>多方</span>
                            </template>
                            <template v-else>
                                <span>/</span>
                            </template>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">事故责任</label>
                        <div class="input-group">
                            <template v-if="accident.accidentResponsibility==1">
                                <span>全责</span>
                            </template>
                            <template v-else-if="accident.accidentResponsibility==2">
                                <span>主责</span>
                            </template>
                            <template v-else-if="accident.accidentResponsibility==3">
                                <span>次责</span>
                            </template>
                            <template v-else-if="accident.accidentResponsibility==4">
                                <span>对等</span>
                            </template>
                            <template v-else-if="accident.accidentResponsibility==5">
                                <span>无责</span>
                            </template>
                            <template v-else>
                                <span>/</span>
                            </template>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">事故起因</label>
                        <div class="input-group">
                            <template v-if="accident.accidentCause==1">
                                <span>碰撞</span>
                            </template>
                            <template v-else-if="accident.accidentCause==2">
                                <span>停放被破坏</span>
                            </template>
                            <template v-else-if="accident.accidentCause==3">
                                <span>盗窃</span>
                            </template>
                            <template v-else>
                                <span>/</span>
                            </template>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">事故具体起因</label>
                        <div class="input-group">
                            <span>{{accident.accidentSpecificCauseText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">事故总金额(元)</label>
                        <div class="input-group">
                            <span>{{accident.accidentAmount==null?'/':numberFormat(accident.accidentAmount)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务组织</label>
                        <div class="input-group">
                            <span>{{accident.companyName}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="事故描述" name="2" >
                <div class="flex-panel detail-box">
                    <div class="detail-item big">
                        <label class="control-label">事故描述</label>
                        <div class="input-group">
                            <span>{{accident.accidentDescription==null?'/':accident.accidentDescription}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="事故图片" name="3" >
                <upload-panel :size="1"  disabled :file-list.sync="imgs" :show-img="true"></upload-panel>
                <!--<div class="flex-panel">
                    <el-table border :data="imgs" style="width: 100%" max-height="300">
                        <el-table-column prop="1" label="序号">
                        </el-table-column>
                        <el-table-column prop="2" label="事故图片">
                        </el-table-column>
                        <el-table-column prop="3" label="操作" id="addImg">
                        </el-table-column>
                    </el-table>
                </div>-->
            </el-collapse-item>
            <el-collapse-item title="公司关联信息" name="4" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">责任人类型</label>
                        <div class="input-group">
                            <template v-if="accident.accidentType==1">
                                <span>企业客户</span>
                            </template>
                            <template v-else-if="accident.accidentType==2">
                                <span>司机</span>
                            </template>
                            <template v-else-if="accident.accidentType==3">
                                <span>公司员工</span>
                            </template>
                            <template v-else-if="accident.accidentType==4">
                                <span>个人客户</span>
                            </template>
                            <template v-else>
                                <span>/</span>
                            </template>
                        </div>
                    </div>
                    <div class="detail-item">
                        <template v-if="accident.accidentType==1">
                            <label class="control-label">企业客户</label>
                            <div class="input-group">
                                <span>{{accident.accidentUser==null?'/':accident.accidentUser}}</span>
                            </div>
                        </template>
                        <template v-else-if="accident.accidentType==2">
                            <label class="control-label">司机</label>
                            <div class="input-group">
                                <span>{{accident.accidentUser==null?'/':accident.accidentUser}}</span>
                            </div>
                        </template>
                        <template v-else-if="accident.accidentType==3">
                            <label class="control-label">公司员工</label>
                            <div class="input-group">
                                <span>{{accident.accidentUser==null?'/':accident.accidentUser}}</span>
                            </div>
                        </template>
                        <template v-if="accident.accidentType==4">
                            <label class="control-label">个人客户</label>
                            <div class="input-group">
                                <span>{{accident.accidentUser==null?'/':accident.accidentUser}}</span>
                            </div>
                        </template>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">单据类型</label>
                        <div class="input-group">
                            <template v-if="accident.orderType==1">
                                <span>项目订单</span>
                            </template>
                            <template v-else-if="accident.orderType==2">
                                <span>加油单</span>
                            </template>
                            <template v-else-if="accident.orderType==3">
                                <span>维修单</span>
                            </template>
                            <template v-else-if="accident.orderType==4">
                                <span>调拨过程单</span>
                            </template>
                            <template v-else>
                                <span>/</span>
                            </template>
                        </div>
                    </div>

                    <template v-if="accident.orderType==1">
                        <div class="detail-item">
                            <label class="control-label">项目订单</label>
                            <div class="input-group">
                                <span>{{accident.orderNo==null?'/':accident.orderNo}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">项目合同编号</label>
                            <div class="input-group">
                                <span>{{accident.contractNo==null?'/':accident.contractNo}}</span>
                            </div>
                        </div>
                    </template>
                    <template v-else-if="accident.orderType==2">
                        <div class="detail-item">
                            <label class="control-label">加油单</label>
                            <div class="input-group">
                                <span>{{accident.orderNo==null?'/':accident.orderNo}}</span>
                            </div>
                        </div>
                    </template>
                    <template v-else-if="accident.orderType==3">
                        <div class="detail-item">
                            <label class="control-label">维修单</label>
                            <div class="input-group">
                                <span>{{accident.orderNo==null?'/':accident.orderNo}}</span>
                            </div>
                        </div>
                    </template>
                    <template v-else-if="accident.orderType==4">
                        <div class="detail-item">
                            <label class="control-label">调拨过程单</label>
                            <div class="input-group">
                                <span>{{accident.orderNo==null?'/':accident.orderNo}}</span>
                            </div>
                        </div>
                    </template>
                    <div class="detail-item">
                        <label class="control-label">事故就近城市</label>
                        <div class="input-group">
                            <span>{{accident.cityName==null?'/':accident.cityName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">加速折旧费(元)</label>
                        <div class="input-group">
                            <span>{{accident.acceleratedDepreciation==null?'/':numberFormat(accident.acceleratedDepreciation)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">司机处罚费(元)</label>
                        <div class="input-group">
                            <span>{{accident.driverPenalty==null?'/':numberFormat(accident.driverPenalty)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">处置方式</label>
                        <div class="input-group">
                            <template v-if="accident.disposalMethod==1">
                                <span>维修</span>
                            </template>
                            <template v-else-if="accident.disposalMethod==2">
                                <span>不维修</span>
                            </template>
                            <template v-else-if="accident.disposalMethod==3">
                                <span>报废</span>
                            </template>
                            <template v-else>
                                <span>/</span>
                            </template>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">信息资料</label>
                        <div class="input-group">
                            <span>{{accident.driverInformation}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">司机扣安全奖情况</label>
                        <div class="input-group">
                            <span>{{accident.driverSafetyAward}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="保险信息" name="5" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">交强险保单</label>
                        <div class="input-group">
                            <span>{{insurance.trafficNo==null?'/':insurance.trafficNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">交强险到期</label>
                        <div class="input-group">
                            <span>{{insurance.trafficExpireDate==null?'/':insurance.trafficExpireDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">交强险承保公司</label>
                        <div class="input-group">
                            <span>{{insurance.trafficCompany==null?'/':insurance.trafficCompany}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">交强险赔付金额(元)</label>
                        <div class="input-group">
                            <span>{{accident.strongPayoutAmount==null?'/':numberFormat(accident.strongPayoutAmount)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">商业险保单</label>
                        <div class="input-group">
                            <span>{{insurance.businessNo==null?'/':insurance.businessNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">商业险到期</label>
                        <div class="input-group">
                            <span>{{insurance.businessExpireDate==null?'/':insurance.businessExpireDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">商业险承保公司</label>
                        <div class="input-group">
                            <span>{{insurance.businessCompany==null?'/':insurance.businessCompany}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">商业险赔付金额(元)</label>
                        <div class="input-group">
                            <span>{{accident.businessPayoutAmount==null?'/':numberFormat(accident.businessPayoutAmount)}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">上传定损清单</label>
                        <div class="input-group">
                            <upload-panel :size="5" :file-list.sync="lossimgs" accept=".png,.jpg" :show-img="true" disabled></upload-panel>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="费用信息" name="6" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">标的车费用</label>
                        <div class="input-group">
                            <span>{{accident.targetCarAmount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">三者车费用</label>
                        <div class="input-group">
                            <span>{{accident.threeCarAmount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">定损金额(元)</label>
                        <div class="input-group">
                            <span>{{accident.fixedLossAmount==null?'/':numberFormat(accident.fixedLossAmount)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">公司支付金额(元)</label>
                        <div class="input-group">
                            <span>{{accident.companyPaymentAmount==null?'/':numberFormat(accident.companyPaymentAmount)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">驾驶员支付金额(元)</label>
                        <div class="input-group">
                            <span>{{accident.driverPaymentAmount==null?'/':numberFormat(accident.driverPaymentAmount)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">客户支付金额(元)</label>
                        <div class="input-group">
                            <span>{{accident.customerPaymentAmount==null?'/':numberFormat(accident.customerPaymentAmount)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">对方支付金额(元)</label>
                        <div class="input-group">
                            <span>{{accident.otherParty==null?'/':numberFormat(accident.otherParty)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">第三方支付金额(元)</label>
                        <div class="input-group">
                            <span>{{accident.thirdPaymentAmount==null?'/':numberFormat(accident.thirdPaymentAmount)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">总维修金额(元)</label>
                        <div class="input-group">
                            <span>{{accident.totalAmount==null?'/':numberFormat(accident.totalAmount)}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="审批进程" name="7" >
                <approval-flow :id="refundDetail.serviceId"></approval-flow>
                <!--<div class="flex-panel">
                    <div style="width: 95%;margin-left: 5%;">
                        <el-steps direction="vertical" :active="3" space="auto">
                            <el-step title="新增" height="auto">
                                <div slot="description">
                                    <div>管理员</div>
                                    <div>同意</div>
                                    <div>2018-08-20 23:17:38</div>
                                </div>
                            </el-step>
                            <el-step title="提交审批">
                                <div slot="description">
                                    <div>管理员</div>
                                    <div>同意</div>
                                    <div>2018-08-20 23:17:38</div>
                                </div>
                            </el-step>

                            <el-step title="所属组织审批">
                                <div slot="description">
                                    <div>管理员</div>
                                    <div>同意</div>
                                    <div>2018-08-20 23:17:38</div>
                                </div>
                            </el-step>
                            <el-step title="运营管理中心审批">
                                <div slot="description">
                                    <div>管理员</div>
                                    <div>2018-08-20 23:17:38</div>
                                </div>
                            </el-step>
                            <el-step title="财务中心管理审批">
                                <div slot="description">
                                    <div>管理员</div>
                                    <div>2018-08-20 23:17:38</div>
                                </div>
                            </el-step>
                        </el-steps>
                    </div>
                </div>-->
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'

    export default {
        name: "trafficAccidentDetail",
        components:{ ApprovalFlow, FileDetail,UploadPanel },
        data: function () {
            return {
                activeNames: ['1','2','3','4','5','6','7'],
                imgs:[],
                lossimgs:[],
                insurance:{},
                accident:{},
                refundDetail:{
                    serviceId:""
                },
            }
        },
        mounted: function () {//载入后
            debugger
            this.initData();
        },
        methods: {
            numberFormat(number){
                return number_format(number, 2, '.', ',');
            },
            initData() {
                var id = this.$route.params.id;
                var $this = this;
                $this.refundDetail.serviceId=id;

                ajax.get("core/vehicleaccident/detail/"+id).then(result=>{
                    if(result.status==0){
                        $this.accident=result.data;
                        if(result.data && result.data.accidentPic && result.data.accidentPic.length>0)//转换图片
                            $this.imgs=JSON.parse(result.data.accidentPic);
                        if(result.data && result.data.lossPic && result.data.lossPic.length>0)//转换图片
                            $this.lossimgs=JSON.parse(result.data.lossPic);

                        $this.vehicleInsurance($this.accident.vehicleId);

                    }else{
                        console.log(result.message);
                    }
                });
            },
            vehicleInsurance(id){
                var $this=this;
                ajax.get("core/vehicleaccident/vehicleinsurance/"+id).then(result=>{
                    if(result.status==0){
                        $this.insurance=result.data;
                    }else{
                        console.log("no userList data!");
                    }
                })
            },
        }

    }
</script>
