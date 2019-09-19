<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="设备库存" name="1">
                    <div class="flex-panel">
                        <el-form-item label="产品型号" prop="equipmentModalId">
                            <el-select v-model="addForm.equipmentModalId" @change="changeModal" clearable filterable placeholder="请选择产品型号">
                                <el-option v-for="item in equipmentModalList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="产品类型" prop="equipmentType">
                            <el-select v-model="addForm.equipmentType" disabled>
                                <el-option label="OBD" :value="1" :key="1"></el-option>
                                <el-option label="GPS" :value="2" :key="2"></el-option>
                                <el-option label="SIM" :value="3" :key="3"></el-option>
                                <el-option label="无线设备" :value="4" :key="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数量" prop="quantity">
                            <el-input v-model="addForm.quantity"  maxlength=10 placeholder="请输入数量" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="金额（元）" prop="amount">
                            <money-input v-model="addForm.amount" :rules="[rules.money()]"  placeholder="请输入金额" clearable></money-input>
                        </el-form-item>
                        <el-form-item label="合同编号" prop="contractCode">
                            <el-input v-model="addForm.contractCode"  maxlength=20 placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="合同开始日期" prop="contractStartdate">
                            <el-date-picker type="date" v-model="addForm.contractStartdate"  maxlength=10 placeholder="请选择" value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="合同结束日期" prop="contractEnddate">
                            <el-date-picker type="date" v-model="addForm.contractEnddate"  maxlength=10 placeholder="请选择" value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
                        </el-form-item>

                        <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible"
                                   :append-to-body="true" width="600px">
                            <el-form label-position="top" >
                                <el-form-item prop="filePath" v-show="fileUpload">
                                    <UploadSubmit ref="uploadSubmit"
                                                  :url="'base/baseEquipmentToStore/import?type='+type"
                                                  name="file" @upload="returnData">
                        <span class="info-text">
                            提示：请确保文件的格式与 "导入模板" 的格式一致。
                            <a v-if="type == 1" href="static/excelTemplate/设备入库导入模板.xls" style="color: #5895fd;text-decoration: none !important;">下载设备导入模板</a>
                            <a  v-if="type == 2" href="static/excelTemplate/SIM卡入库导入模板.xls" style="color: #5895fd;text-decoration: none !important;">下载SIM卡导入模板</a>
                            <br>支持扩展名：.xls和.xlsx
                            <br>文件大小：20M以内
                        </span>
                                    </UploadSubmit>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="importVisible = false">取 消</el-button>
                            </div>
                        </el-dialog>
                    </div>
                </el-collapse-item>
            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="importEquipment()">导入设备</el-button>
                <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>

            <p class="summary" v-show="showTotal"><span style="margin-left: 20px;">设备数量:</span><span>{{totalQuantity}}</span></p>
            <el-table border :data="tableData" style="width: 100%">
                <template v-if="type==1">
                    <el-table-column min-width="140" label="IMEI" prop="imei" show-overflow-tooltip></el-table-column>
                </template>
                <template v-if="type==1">
                    <el-table-column min-width="140" label="设备SN" prop="sn" show-overflow-tooltip></el-table-column>
                </template>
                <template v-if="type==2">
                    <el-table-column min-width="140" label="IMSI" prop="imsi" show-overflow-tooltip></el-table-column>
                </template>
                <template v-if="type==2">
                    <el-table-column min-width="140" label="手机号" prop="phone" show-overflow-tooltip></el-table-column>
                </template>
                <template v-if="type==2">
                    <el-table-column min-width="140" label="ICCID" prop="iccid" show-overflow-tooltip></el-table-column>
                </template>
                <template v-if="type==2">
                    <el-table-column min-width="140" label="购买日期" prop="buyTime" ></el-table-column>
                </template>
                <template v-if="type==2">
                    <el-table-column min-width="140" label="购买金额" prop="buyAmount" ></el-table-column>
                </template>
                <template v-if="type==2">
                    <el-table-column min-width="140" label="激活时间" prop="activationTime" ></el-table-column>
                </template>
                <template v-if="type==2">
                    <el-table-column min-width="140" label="费用有效期" prop="validity" ></el-table-column>
                </template>
            </el-table>

        </el-form>
    </div>
</template>

<script>
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadSubmit from '@/components/UploadSubmit'
    import ajax from '@/utils/request'
    import {tool, ruleTool,formRule} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "baseEquipmentToStoreForm",
        components: {MoneyInput,UploadSubmit},
        data() {
            return {
                fileUpload : true,
                importVisible : false,
                importVisibleError : false,
                importVisibleErrorId : "",
                type:"",
                activeNames: ['0', '1'],
                showTotal:false,
                equipmentModalList:[],
                totalQuantity:"",
                tableData:[],
                addForm: {},
                rules: {
                    equipmentModalId: [
                        { required: true, message: '请选择产品型号', trigger:'change'},
                    ],
                    quantity: [
                        { required: true, message: '请输入数量', trigger: 'change' },
                        { validator: formRule.standardSize, message: "请输入整数", trigger: 'change' }
                    ],
                    amount: [
                        { required: true, message: '请输入金额', trigger: 'blur' },
                    ],
                },
            }
        },
        mounted() {
            this.getEquipmentModalList();

        },
        methods: {

            importEquipment(){
                if(this.type){
                    console.log(this.type);
                    this.importVisibleErrorId = "";
                    this.importVisible = true;
                    this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
                }else{
                    this.$message.error('请先选择产品型号');
                    return;
                }
            },
            returnData(result){
                this.showTotal=true;
                this.tableData=result.data;
                this.totalQuantity = result.importTotal;
            },
            changeModal(e){
                for(var m in this.equipmentModalList){
                    if(e==this.equipmentModalList[m].id){
                        this.addForm.equipmentType=this.equipmentModalList[m].type;
                        if(this.equipmentModalList[m].type && (this.equipmentModalList[m].type==1 || this.equipmentModalList[m].type==2 || this.equipmentModalList[m].type==4))
                            this.type='1';
                        else if(this.equipmentModalList[m].type && (this.equipmentModalList[m].type==3))
                            this.type='2';
                        else
                            this.type='';
                        break;
                    }
                }
            },
            //保存提交
            submitForm: function (form) {
                let data = this.addForm;
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }

                    if(this.tableData && this.tableData.length>0) {
                        if(this.type=='1'){
                            data.equipmentList = this.tableData;
                            if(this.addForm.quantity != data.equipmentList.length){
                                this.$message.error('导入设备数量必须和数量相等，请重新导入！');
                                return;
                            }
                        }
                        if(this.type=='2'){
                            data.simList = this.tableData;
                            if(this.addForm.quantity != data.simList.length){
                                this.$message.error('导入设备数量必须和数量相等，请重新导入！');
                                return;
                            }
                        }
                    }else{
                        this.$message.error('请导入设备');
                        return;
                    }

                    ajax.post('base/baseEquipmentToStore/add', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '入库成功',
                                type: 'success'
                            });
                            this.close();
                        }else{
                            this.$message({
                                message: rs.msg,
                                type: 'error'
                            });
                        }
                    });
                });
            },
            getEquipmentModalList(){
                ajax.get('base/baseEquipmentOutput/equipmentModalList').then(res=>{
                    this.equipmentModalList=res;
                });
                /*ajax.get('base/baseEquipmentModal/equipmentModalSelect').then(res=>{
                    this.equipmentModalList=res;
                });*/
            },

        }
    }
</script>

