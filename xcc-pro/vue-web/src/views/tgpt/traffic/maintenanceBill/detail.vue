<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <!--车辆基本信息-->
            <el-collapse-item title="基础资料" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">服务组织</label>
                        <div class="input-group">
                            <span>{{maintenanceBill.companyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车辆</label>
                        <div class="input-group">
                            <span>{{maintenanceBill.vehiclePlate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车型</label>
                        <div class="input-group">
                            <span>{{maintenanceBill.vehicleModel}}</span>
                        </div>
                    </div>
                    <!--<div class="detail-item">
                        <label class="control-label">车辆所在城市</label>
                        <div class="input-group">
                            <span>{{maintenanceBill.runCity}}</span>
                        </div>
                    </div>-->
                    <div class="detail-item">
                        <label class="control-label">维保类型</label>
                        <div class="input-group">
                            <span>{{maintenanceBill.typeName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">事故单</label>
                        <div class="input-group">
                            <span v-if="maintenanceBill.accidentCode != null && maintenanceBill.accidentCode != ''">{{maintenanceBill.accidentCode}}</span>
                            <span v-else>/</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">保养参考公里数（km）</label>
                        <div class="input-group">
                            <span>{{maintenanceBill.mileage}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>

            <!--送修信息-->
            <el-collapse-item title="送修信息" name="2">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">维修厂</label>
                        <div class="input-group">
                            <span>{{maintenanceBill.repairerName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">修理单号</label>
                        <div class="input-group">
                            <span>{{maintenanceBill.maintenanceNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">维修时间</label>
                        <div class="input-group">
                            <span>{{maintenanceBill.arriveRepairTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">送车人</label>
                        <div class="input-group">
                            <span v-if="maintenanceBill.sendCarPeople != null && maintenanceBill.sendCarPeople != ''">{{maintenanceBill.sendCarPeople}}</span>
                            <span v-else>/</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">送修公里数</label>
                        <div class="input-group">
                            <span v-if="maintenanceBill.repairMileage != null && maintenanceBill.repairMileage != ''">{{maintenanceBill.repairMileage}}</span>
                            <span v-else>/</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">送车用时</label>
                        <div class="input-group">
                            <span v-if="maintenanceBill.sendCarHours != null && maintenanceBill.sendCarHours != ''">{{maintenanceBill.sendCarHours}}</span>
                            <span v-else>/</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">是否4S店司机</label>
                        <div class="input-group">
                            <span v-if="maintenanceBill.is4sShopsDriver == true">是</span>
                            <span v-if="maintenanceBill.is4sShopsDriver == false">否</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <!--报价信息-->
            <el-collapse-item title="报价信息" name="3">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">报价总额（元）</label>
                        <div class="input-group">
                            <span>{{maintenanceBill.totalPrice}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">费用类型</label>
                        <div class="input-group">
                            <span v-if="maintenanceBill.costType==1">公司费用</span>
                            <span v-else-if="maintenanceBill.costType==2">代垫费用</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">结算日期</label>
                        <div class="input-group">
                            <span>{{maintenanceBill.settlementDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">经手人</label>
                        <div class="input-group">
                            <span>{{maintenanceBill.brokerage}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">核价说明</label>
                        <div class="input-group">
                            <span v-if="maintenanceBill.nuclearPriceRemark != null && maintenanceBill.nuclearPriceRemark != ''">{{maintenanceBill.nuclearPriceRemark}}</span>
                            <span v-else>/</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">诊断维修项目及报价描述</label>
                        <div class="input-group">
                            <span v-if="maintenanceBill.nuclearPriceDescription != null && maintenanceBill.nuclearPriceDescription != ''">{{maintenanceBill.nuclearPriceDescription}}</span>
                            <span v-else>/</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">报价单</label>
                        <upload-panel :size="5"  disabled :file-list.sync="nuclearPricePic" :show-img="true"></upload-panel>
                    </div>
                </div>
            </el-collapse-item>

            <!--配件项目-->
            <el-collapse-item title="配件明细" name="4">
                <el-table border :data="tableData4" style="width: 100%" >
                    <el-table-column prop="code" label="配件编号" min-width="120"></el-table-column>
                    <el-table-column prop="name" label="配件项目名称" min-width="100"></el-table-column>
                    <el-table-column prop="typeName" label="项目分类" min-width="150"></el-table-column>
                    <el-table-column prop="model" label="型号" min-width="100"></el-table-column>
                    <el-table-column prop="brand" label="品牌" min-width="100"></el-table-column>
                    <el-table-column prop="price" label="价格（元）" min-width="150"></el-table-column>
                    <el-table-column prop="referencePrice" label="参考价格（元）" min-width="120"></el-table-column>
                    <el-table-column prop="amount" label="数量" min-width="120"></el-table-column>
                    <el-table-column prop="totalPrice" label="小计（元）" min-width="120"></el-table-column>
                    <el-table-column prop="premiumPercentage" label="溢价百分比" min-width="120"></el-table-column>
                </el-table>
            </el-collapse-item>
            <!--工时项目-->
            <el-collapse-item title="工时明细" name="5">
                <el-table border :data="tableData5" style="width: 100%" >
                    <el-table-column prop="code" label="工时编号" min-width="120"></el-table-column>
                    <el-table-column prop="name" label="工时项目名称" min-width="100"></el-table-column>
                    <el-table-column prop="typeName" label="项目分类" min-width="150"></el-table-column>
                    <el-table-column prop="price" label="价格（元）" min-width="150"></el-table-column>
                    <el-table-column prop="referencePrice" label="参考价格（元）" min-width="120"></el-table-column>
                    <el-table-column prop="premiumPercentage" label="溢价百分比" min-width="120"></el-table-column>
                </el-table>
            </el-collapse-item>

            <!--提车信息-->
            <el-collapse-item title="提车信息" name="6">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">提车时间</label>
                        <div class="input-group">
                            <span v-if="maintenanceBill.fetchCarTime != null && maintenanceBill.fetchCarTime != ''">{{maintenanceBill.fetchCarTime}}</span>
                            <span v-else>/</span>
                        </div>
                    </div>
                    <div class="detail-item small">
                        <label class="control-label">提车人</label>
                        <div class="input-group">
                            <span v-if="maintenanceBill.fetchCarPeople != null && maintenanceBill.fetchCarPeople != ''">{{maintenanceBill.fetchCarPeople}}</span>
                            <span v-else>/</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>

            <el-collapse-item title="审批进程" name="7">
                <approval-flow :id="maintenanceBill.id"></approval-flow>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'
    import ajax from '@/utils/request'
    import { tool } from '@/utils/common'

    export default {
        name: "trafficMaintenanceBillDetail",
        mixins:[tool],
        components:{ ApprovalFlow, FileDetail,UploadPanel },
        data:function () {
            return {
                activeNames:["1","2","3","4","5","6","7"],
                maintenanceBill:{},
                tableData4:[],
                tableData5:[],
                nuclearPricePic:[]
            }
        },
        mounted() {
            this.initData();
        },
        methods:{
            initData(){
                let id = this.$route.params.id;
                ajax.get('/core/maintenanceBill/detail/' + id).then(result => {
                    if(result.status == 0){
                        this.maintenanceBill = result.data;
                        if(null != result.data.accessoriesList && result.data.accessoriesList.length > 0){
                            for(var i = 0 ; i < result.data.accessoriesList.length ; i++) {
                                result.data.accessoriesList[i].totalPrice = parseFloat(result.data.accessoriesList[i].price)
                                    *parseFloat(result.data.accessoriesList[i].amount);
                            }
                        }
                        this.tableData4 = result.data.accessoriesList;
                        this.tableData5 = result.data.manhourList;
                        if(null != result.data.nuclearPricePic && result.data.nuclearPricePic.length > 0){
                            this.nuclearPricePic=JSON.parse(result.data.nuclearPricePic);
                        }
                    }

                });
            }
        }

    }
</script>
