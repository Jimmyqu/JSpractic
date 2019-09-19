<template>
    <div class="form-panel detail-panel">
        <el-form :model="confirm" :rules="rules" label-position="top" ref="confirm" label-width="100px">
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
                                <upload-panel  :size="1" style="width: 60px;height: 60px;overflow: hidden;"  disabled :file-list.sync="invoiceImg" :show-img="true"></upload-panel>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">其他照片</label>
                            <div class="input-group">
                                <!--<img :src="customerInfo.idCardFrontPhoto" @click="showBigImg($event)">-->
                                <upload-panel :flex="1" :size="1" style="overflow: hidden;height: 60px;"  disabled :file-list.sync="otherImg" :show-img="true"></upload-panel>
                            </div>
                        </div>

                    </div>
                </el-collapse-item>

                <el-collapse-item title="加油确认" name="2">
                    <div class="flex-panel">
                        <el-form-item label="确认状态" prop="confirmStatus">
                            <el-select v-model="confirm.confirmStatus" placeholder="全部" clearable>
                                <el-option label="未确认" value="0"></el-option>
                                <el-option label="已确认" value="1"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="加油前油量(%)" prop="capacityBefore">
                            <el-input v-model="confirm.capacityBefore" placeholder="请输入加油前油量" clearable></el-input>
                        </el-form-item>

                        <el-form-item label="加油后油量(%)" prop="capacityAfter">
                            <el-input v-model="confirm.capacityAfter" placeholder="请输入加油后油量" clearable></el-input>
                        </el-form-item>

                        <el-form-item label="加油里程" prop="oilMileage">
                            <el-input v-model="confirm.oilMileage" placeholder="请输入加油里程" clearable></el-input>
                        </el-form-item>

                        <el-form-item label="油号" >
                            <el-select v-model="confirm.oilModel" placeholder="全部" clearable>
                                <el-option label="90号车用汽油" value="1"></el-option>
                                <el-option label="92号车用汽油" value="2"></el-option>
                                <el-option label="93号车用汽油" value="3"></el-option>
                                <el-option label="95号车用汽油" value="4"></el-option>
                                <el-option label="97号车用汽油" value="5"></el-option>
                            </el-select>
                        </el-form-item>


                        <el-form-item label="单价(元/V)" prop="oilUnitPrice">
                            <el-input v-model="confirm.oilUnitPrice" placeholder="请输入单价" clearable></el-input>
                        </el-form-item>

                        <el-form-item label="加油量(V)" prop="oilCapacity">
                            <el-input v-model="confirm.oilCapacity" placeholder="请输入加油量"  clearable></el-input>
                        </el-form-item>

                        <el-form-item label="加油金额(元)" prop="oilCost">
                            <el-input v-model="confirm.oilCost" placeholder="请输入加油金额" clearable></el-input>
                        </el-form-item>

                    </div>

                </el-collapse-item>
            </el-collapse>
            <el-form-item class="left-row">
                <el-button type="primary" @click="submitFormOp('confirm')">保存</el-button>
                <el-button @click="close()">关闭</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import {calculator} from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import {formRule, ruleTool, tool} from '@/utils/common'

    export default {
        mixins: [ tool, ruleTool, formRule ],
        name: "appOilManageConfirm",
        components:{ ApprovalFlow,FileDetail,UploadPanel },
        data() {
            return {
                openCollapse: ["1","2"],
                show: true,
                detailForm: {
                },
                formRule,
                id: this.$route.params.id,
                dashboardImgAfter:[],
                dashboardImgBefore:[],
                invoiceImg:[],
                otherImg:[],
                confirm:{},
                rules: {
                    confirmStatus:[
                        { required: true, message: '请选择确认状态', trigger: 'change' }
                    ],
                    capacityBefore:[
                        {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'change'}
                    ],
                    capacityAfter:[
                        {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'change'}
                    ],
                    oilMileage:[
                        {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'change'}
                    ],
                    oilUnitPrice:[
                        {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'change'}
                    ],
                    oilCapacity:[
                        {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'change'}
                    ],
                    oilCost:[
                        {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'change'}
                    ]

                }
            }
        },
        methods: {
            open() {
                this.show = true;
            },
            submitFormOp(confirm) {
                this.$refs[confirm].validate((valid) => {
                    if (valid) {
                        var url = "operation_traffic/oilManage/confirm";
                        this.confirm.id  = this.id;
                        ajax.post(url, this.confirm).then(
                            (res) => {
                                if(res.status == 0){
                                    this.$message({message: '保存成功！',type: 'success'});
                                    this.close();
                                }else {
                                    this.$message.error(res.message);
                                }
                            }
                        )
                    } else {
                        return false;
                    }
                });
            },

        },

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
                    console.log(this.invoiceImg)
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
        },


    }
</script>

