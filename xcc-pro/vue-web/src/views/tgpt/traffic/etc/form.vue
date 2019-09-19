<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="ETC" name="1">
				<div class="flex-panel">
					<el-form-item label="ETC编号" prop="etcNum">
						<el-input v-model="addForm.etcNum"  maxlength=20 placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="服务组织" prop="orgIds">
                        <tree-select v-model="orgIds" placeholder="服务组织" type="one"
                                     url="admin/organization/tree" @change="orgChange()"
                        ></tree-select>
					</el-form-item>
					<el-form-item label="车辆" prop="vehicleId">
                        <el-select
                            v-model="addForm.vehicleId"
                            filterable
                            clearable
                            remote
                            reserve-keyword
                            placeholder="车牌号"
                            :remote-method="remoteFindPlateInfo"
                            :no-data-text="dataText"
                            :loading="plateLoading"
                            >
                            <el-option
                                v-for="(item,i) in vehicleList"
                                :key="i"
                                :label="item.plate"
                                :value="item.id">
                            </el-option>
                        </el-select>
					</el-form-item>
					<el-form-item label="金额" prop="balance(元)">
						<money-input v-model="addForm.balance" :rules="[rules.money()]"  placeholder="请输入" clearable></money-input>
					</el-form-item>
				</div>
                </el-collapse-item>
            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import MoneyInput from '@/components/MoneyInput/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool, ruleTool} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "trafficVehicleEtcForm",
        components: {TreeSelect, MoneyInput},
        data() {
            return {
                activeNames: ['0', '1'],
                addressList: [{id: 1, name: 1}, {id: 2, name: 2}],
                addForm: {
                    type:1,
                },
                dataText:'无数据',
                vehicleList:[],
                plateLoading: false,
                orgIds: [],
                rules: {
                    etcNum: [
                        {required: true, message: '请输入ETC卡编号', trigger: 'change'},
                    ],
                    serviceRegionId: [
                        {required: true, message: '请选择组织', trigger: 'change'},
                    ],
                    vehicleId: [
                        {required: true, message: '请选择车辆', trigger: 'change'},
                    ],
                    balance: [
                        {required: true, message: '请输入金额', trigger: 'change'},
                    ],
                }
            }
        },
        mounted() {
            this.open();
        },
        methods: {
            open() {
                this.addForm = {};
                if (this.$route.query.id) {
                    ajax.get('traffic/trafficVehicleEtc/' + this.$route.query.id).then(rs => {
                        this.addForm = rs.data;
                    });
                }
            },

            /*组织改变*/
            orgChange(){
                if(this.orgIds && this.orgIds.length>0){
                    this.addForm.serviceRegionId = this.orgIds[0];
                }else{
                    this.addForm.serviceRegionId = '';
                }
            },

            /*查询车牌信息*/
            remoteFindPlateInfo(plateKeyWord) {
                if (plateKeyWord !== '' && plateKeyWord.length >= 3) {
                    this.plateLoading = true;
                    var companyId=''
                    if(this.orgIds && this.orgIds.length>0){
                        companyId=this.orgIds[0];
                    }
                    ajax.get('obd/obdVehicleStatus/findPlateListByKeyword', {plate: plateKeyWord,companyId: companyId}).then(rs => {
                        if(rs && rs.data.length > 0){
                            setTimeout(() => {
                                this.plateLoading = false;
                                this.vehicleList = rs.data;
                            }, 200);
                        }else{
                            this.dataText = '无数据'
                            this.vehicleList = [];
                            this.plateLoading = false;
                        }
                    })

                } else if(plateKeyWord !== '' && plateKeyWord.length < 3){
                    this.dataText = '请输入至少3位'
                    this.vehicleList = [];
                }else{
                    this.vehicleList = [];
                }
            },

            //保存提交
            submitForm: function (form) {
                var data = this.addForm;
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }
                    ajax.post('traffic/trafficVehicleEtc/', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.close();
                        }
                    });
                });
            }
        }
    }
</script>

