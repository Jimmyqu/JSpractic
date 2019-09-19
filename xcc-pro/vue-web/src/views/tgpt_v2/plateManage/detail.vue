<template>
    <div class="form-panel detail-panel">
        <el-form :model="detailForm" :rules="rules" label-position="top" ref="detailForm" label-width="100px">
            <el-collapse v-model="openCollapse">

                <el-collapse-item title="指标信息" name="1" >
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">指标编号</label>
                            <div class="input-group">
                                <span>{{detailForm.indicatorNumber}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">所属组织</label>
                            <div class="input-group">
                                <span>{{detailForm.companyId}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">所属城市</label>
                            <div class="input-group">
                                <span>{{detailForm.ownCity}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">指标所有人</label>
                            <div class="input-group">
                                <span>{{detailForm.holder}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">到期日</label>
                            <div class="input-group">
                                <span>{{detailForm.expiryDate}}</span>
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


                <el-collapse-item title="使用记录" name="2" >
                    <div class="table-box">
                        <el-table border :data="detailForm.listRecord" style="width: 100%">
                            <el-table-column min-width="140" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                            <el-table-column min-width="140" label="使用性质" prop="natureType" sortable show-overflow-tooltip></el-table-column>
                            <el-table-column min-width="140" label="使用机构" prop="useAgency" sortable show-overflow-tooltip></el-table-column>
                            <el-table-column min-width="140" label="起租日期" prop="rentDate" sortable show-overflow-tooltip></el-table-column>
                            <el-table-column min-width="140" label="截止日期" prop="endDate" sortable show-overflow-tooltip></el-table-column>
                            <el-table-column min-width="140" label="使用费用（元/月）" prop="useFee" sortable show-overflow-tooltip></el-table-column>
                            <el-table-column min-width="140" label="总费用" prop="totalFee" sortable show-overflow-tooltip></el-table-column>
                        </el-table>
                    </div>
                </el-collapse-item>

            </el-collapse>
        </el-form>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import $ from 'jquery-slim'
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'


    export default {
        mixins: [ tool, ruleTool ],
        name:"plateManageUse",
        components:{ TreeSelect, MoneyInput, UploadPanel ,CitySelect,ApprovalFlow},

        data(){
            var moneyRegex = /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/;
            let $this = this;
            return {
                openCollapse:["1","2"],
                show : false,
                nearCity4:[],
                listUrl:'base/plate/listDetail',
                detailForm : {},
                searchParam: {},
                rules: {
                    companyId:[
                        { required: true, message: '请选择所属组织', trigger: 'change' }
                    ],
                    serviceRegionId:[
                        { required: true, message: '请选择服务单位', trigger: 'change' }
                    ],
                    plate: [
                        { required: true, message: '请输入车牌', trigger: 'blur'},
                        { validator:formRule.validatePlate, message: '车牌号格式有误', trigger: 'blur' }
                    ],
                    modelName: [
                        { required: true, message: '请输入车型', trigger: 'change' }
                    ],
                    color: [
                        { required: true, message: '请选择颜色', trigger: 'change' }
                    ],
                    vin: [
                        { required: true, message: '请输入车架号', trigger: 'change' },
                        { max: 17, message: '最多输入 17 个字符', trigger: 'change' }
                    ],
                    engineNo: [
                        { required: true, message: '请输入发动机号', trigger: 'change' },
                        { max: 18, message: '最多输入 18 个字符', trigger: 'change' }
                    ],
                    certificate: [
                        { required: true, message: '请输入机动车登记证', trigger: 'change' },
                        { max: 18, message: '最多输入 18 个字符', trigger: 'change' }
                    ],
                    certificateStatus: [
                        { required: true, message: '请选择登记证状态', trigger: 'change' }
                    ],
                    licenseNumber: [
                        { required: true, message: '请输入行驶证号', trigger: 'change' },
                        { max: 18, message: '最多输入 18 个字符', trigger: 'change' }
                    ],
                    licenseName: [
                        { required: true, message: '请输入行驶证号', trigger: 'change' },
                        { max: 20, message: '最多输入 20 个字符', trigger: 'change' }
                    ],
                    nearCity4Id: [
                        { required: true, message: '请选择注册城市', trigger: 'change' }
                    ],
                    hongkongPlate: [
                        { max: 10, message: '最多输入 10 个字符', trigger: 'blur' }
                    ],
                    useNature: [
                        { required: true, message: '请选择使用性质', trigger: 'change' }
                    ],
                    plateType: [
                        { required: true, message: '请选择车牌属性', trigger: 'change' }
                    ],
                    assetsType: [
                        { required: true, message: '请选择资产属性', trigger: 'change' }
                    ],
                    vehicleStatus: [
                        { required: true, message: '请选择车辆状态', trigger: 'change' }
                    ],plateCost:[
                        {pattern: moneyRegex,required: false, message: '请输入正确的金额', trigger: 'change'}
                    ],price:[
                        {pattern: moneyRegex,required: false, message: '请输入正确的金额', trigger: 'change'}
                    ],
                }
            }
        },

        methods:{
            open(){
                let id = this.$route.params.id;
                this.detailForm = {};
                if (id){
                    this.initForm(id);
                }else{
                    this.clearValidate();
                }
                this.openCollapse = ["1","2"];
                this.show = true;
            },
            clearValidate(){
                if(this.$refs['detailForm'])
                    this.$nextTick(_ =>{
                        this.$refs['detailForm'].clearValidate();
                    })
            },
            initForm(id){
                ajax.get("base/plate/"+id).then(res => {
                    this.detailForm = res.data;

                })
            },

        },
        mounted(){
            this.open();
        }
    }
</script>

