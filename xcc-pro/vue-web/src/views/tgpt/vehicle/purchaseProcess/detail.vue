<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames" @change="handleChange">
            <!--车辆采购信息-->
            <el-collapse-item title="车辆采购信息" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.originateName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">采购过程编号</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.purchaseProcessNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">状态</label>
                        <div v-if="purchaseProcess.purchaseMethod==1" class="input-group">
                            <span v-if="purchaseProcess.state==1">待提车</span>
                            <span v-if="purchaseProcess.state==2">待上牌</span>
                            <span v-if="purchaseProcess.state==3">完成</span>
                        </div>

                        <div v-if="purchaseProcess.purchaseMethod==2 || purchaseProcess.purchaseMethod==3"
                             class="input-group">
                            <span v-if="purchaseProcess.state==1">待派车</span>
                            <span v-if="purchaseProcess.state==3">完成</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">采购订单编号</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.orderNumber}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">合同编号</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.contractNo}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">服务客户</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.enterpriseName}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">车型</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.vehicleModelInfoName}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">颜色</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.colorName}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">购车价格（元）</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.tradeAmount}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">计划到车日期</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.deliveryDate}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">车辆新旧</label>
                        <div class="input-group">
                            <span v-if="purchaseProcess.newOrOldCar==0">旧</span>
                            <span v-if="purchaseProcess.newOrOldCar==1">新</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">车龄（月）</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.carAge}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">服务城市</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.serviceCityName}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">采购方式</label>
                        <div class="input-group">
                            <span v-if="purchaseProcess.purchaseMethod==1">新购</span>
                            <span v-if="purchaseProcess.purchaseMethod==2">租赁</span>
                            <span v-if="purchaseProcess.purchaseMethod==3">现有车辆安排</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">加装需求</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.retrofitRequirementOptionsLabel}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">采购说明</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.explanation}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">其他加装需求</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.retrofitRequirement}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">申请采购人</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.reqPurchaser}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">申请时间</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.reqDate}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <!--提车-->
            <el-collapse-item title="提车" name="4" v-if="purchaseProcess.purchaseMethod==1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">车型</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.vehicleModelInfoName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">颜色</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.carColor}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车架号</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.vin}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">发动机号</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.engineNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">机动车登记证</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.certificate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">登记证状态</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.certificateStatus}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">行驶证号</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.licenseNumber}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">行驶证所有人</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.licenseName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">注册城市</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.registerCityName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">提车时间</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.pickingTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">实际提车人</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.actualPickingPerson}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">提车油费</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.pickingOilFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">洗车费</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.carWashExpenses}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">其他费用</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.otherExpenses}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">行驶证图片</label>
                        <div class="input-group">
                            <upload-panel :size="1" :file-list.sync="xsFileList"></upload-panel>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">登记证图片</label>
                        <div class="input-group">
                            <upload-panel :size="1" :file-list.sync="djFileList"></upload-panel>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <!--上牌-->
            <el-collapse-item title="上牌" name="5">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">车牌</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">号牌来源</label>
                        <div class="input-group">
                            <span v-if="purchaseProcess.plateType==1">自有</span>
                            <span v-if="purchaseProcess.plateType==2">租赁</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">上牌日期</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.registrationDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">上牌费用</label>
                        <div class="input-group">
                            <span>{{purchaseProcess.plateCost}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'
    import UploadPanel from '@/components/UploadPanel/index'

    export default {
        name: "vehiclePurchaseProcessDetail",
        components:{ ApprovalFlow, FileDetail ,UploadPanel},
        data() {
            return {
                activeNames: ['1', '2', '3', '4', '5', '6'],
                purchaseProcess: {},
                djFileList: [],
                xsFileList: []
            }
        },
        mounted: function () {
            ajax.get('/core/purchaseProcess/findById?id=' + this.$route.params.id).then(rs => {
                this.purchaseProcess = rs.data;
                let p = this.purchaseProcess;

                //附件
                if (p.certificatePic)
                    this.djFileList = [JSON.parse(p.certificatePic)];
                if (p.licensePic)
                    this.xsFileList = [JSON.parse(p.licensePic)];


                //转换加装要求 detailForm.retrofitRequirementOptionsLabel
                ajax.get('admin/dict/type/加装要求选项').then(rs => {
                    let map = {};
                    rs.forEach(obj =>{
                        map[obj.value] = obj.text;
                    });

                    let arr = this.purchaseProcess.retrofitRequirementOptions.split(',');
                    let label = '';

                    arr.forEach(str => {
                        label += (map[str] + ',');
                    });

                    this.$set(this.purchaseProcess, 'retrofitRequirementOptionsLabel', label);
                });
            });
        },
        watch: {},
        methods: {
            handleChange(val) {
                console.log(val);
            },
            downloadFile: function (url, fileName) {
                downloadFile(url, fileName);
            }

        },

    }
</script>
