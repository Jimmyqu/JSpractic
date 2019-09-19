<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="加油信息" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">司机姓名</label>
                        <div class="input-group">
                            <span>{{detailForm.driverName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">司机手机号</label>
                        <div class="input-group">
                            <span>{{detailForm.phone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车牌号</label>
                        <div class="input-group">
                            <span>{{detailForm.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">加油时间</label>
                        <div class="input-group">
                            <span>{{detailForm.oilTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">加油地点</label>
                        <div class="input-group">
                            <span>{{detailForm.oilArea}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">加油前仪表盘照片</label>
                        <div class="input-group">
                            <!--<img :src="customerInfo.idCardFrontPhoto" @click="showBigImg($event)">-->
                            <upload-panel :size="1" style="width: 60px;height: 60px;overflow: hidden;"  disabled :file-list.sync="dashboardImgBefore" :show-img="true"></upload-panel>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">加油后仪表盘照片</label>
                        <div class="input-group">
                            <!--<img :src="customerInfo.idCardFrontPhoto" @click="showBigImg($event)">-->
                            <upload-panel :size="1" style="width: 60px;height: 60px;overflow: hidden;"  disabled :file-list.sync="dashboardImgAfter" :show-img="true"></upload-panel>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">加油票据照片</label>
                        <div class="input-group">
                            <!--<img :src="customerInfo.idCardFrontPhoto" @click="showBigImg($event)">-->
                            <upload-panel :size="1" style="width: 60px;height: 60px;overflow: hidden;"  disabled :file-list.sync="invoiceImg" :show-img="true"></upload-panel>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">其他照片</label>
                        <div class="input-group">
                            <!--<img :src="customerInfo.idCardFrontPhoto" @click="showBigImg($event)">-->
                            <upload-panel :flex="1" :size="1" style="height: 60px;overflow: hidden;"  disabled :file-list.sync="otherImg" :show-img="true"></upload-panel>
                        </div>
                    </div>

                </div>
            </el-collapse-item>

            <el-collapse-item title="确认信息" name="2">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">确认状态</label>
                        <div class="input-group">
                            <span>{{detailForm.confirmStatusText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">确认时间</label>
                        <div class="input-group">
                            <span>{{detailForm.confirmTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">确认人</label>
                        <div class="input-group">
                            <span>{{detailForm.confirmor}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">加油前油量(%)</label>
                        <div class="input-group">
                            <span>{{detailForm.capacityBefore}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">加油后油量(%)</label>
                        <div class="input-group">
                            <span>{{detailForm.capacityAfter}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">加油里程(公里)</label>
                        <div class="input-group">
                            <span>{{detailForm.oilMileage}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">油号</label>
                        <div class="input-group">
                            <span>{{detailForm.oilModelText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">单价(元/V)</label>
                        <div class="input-group">
                            <span>{{detailForm.oilUnitPrice}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">加油量(V)</label>
                        <div class="input-group">
                            <span>{{detailForm.oilCapacity}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">加油金额(元)</label>
                        <div class="input-group">
                            <span>{{detailForm.oilCost}}</span>
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
    import FileDetail from '@/components/FileDetail/index'
    import UploadPanel from '@/components/UploadPanel/index'

    export default {
        name: "appOilManageDetail",
        components:{ ApprovalFlow,FileDetail,UploadPanel },
        data() {
            return {
                openCollapse: ["1","2"],
                show: true,
                detailForm: {
                },
                id: this.$route.params.id,
                dashboardImgAfter:[],
                dashboardImgBefore:[],
                invoiceImg:[],
                otherImg:[],
            }
        },
        methods: {
            open() {
                this.show = true;
            }
        }
        ,
        mounted() {
            ajax.get('operation_traffic/oilManage/detail/' + this.id,).then(rs => {
                this.detailForm = rs.data;

                if( this.detailForm.dashboardImgBefore){
                    this.dashboardImgBefore = [JSON.parse(this.detailForm.dashboardImgBefore)];
                }else{
                    this.dashboardImgBefore = [];
                }

                if( this.detailForm.dashboardImgAfter){
                    this.dashboardImgAfter = [JSON.parse(this.detailForm.dashboardImgAfter)];
                }else{
                    this.dashboardImgAfter = [];
                }

                if( this.detailForm.invoiceImg){
                    this.invoiceImg = [JSON.parse(this.detailForm.invoiceImg)];
                }else{
                    this.invoiceImg = [];
                }

                if( this.detailForm.otherImg){
                    if (this.detailForm.otherImg.indexOf("[") != -1&&this.detailForm.otherImg.indexOf("]") != -1){
                        this.otherImg = JSON.parse(this.detailForm.otherImg);
                    }else {
                        this.otherImg = [JSON.parse(this.detailForm.otherImg)];
                    }
                }else{
                    this.otherImg = [];
                }
            });
        }

    }
</script>

