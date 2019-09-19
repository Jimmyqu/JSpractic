<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="SIM卡表" name="1">
				<div class="flex-panel">
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model="addForm.phone"  maxlength=20 placeholder="请输入" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="IMSI" prop="imsi">
                        <el-input v-model="addForm.imsi"  maxlength=20 disabled></el-input>
                    </el-form-item>
                    <el-form-item label="ICCID" prop="iccid">
                        <el-input v-model="addForm.iccid"  maxlength=20 disabled></el-input>
                    </el-form-item>
                    <el-form-item label="IMEI" prop="imei">
                        <el-input v-model="addForm.imei"  maxlength=20 ></el-input>
                    </el-form-item>
                    <el-form-item label="供应商" prop="supName">
                        <el-input v-model="addForm.supName"  maxlength=20 disabled=""></el-input>
                    </el-form-item>
                    <el-form-item label="库存状态" prop="stockStatus">
                            <template>
                                <el-select v-model="addForm.stockStatus" placeholder="请选择">
                                    <el-option label="库存" :value="1"></el-option>
                                    <el-option label="已出库" :value="2"></el-option>
                                </el-select>
                            </template>
                    </el-form-item>
                    <el-form-item label="购买时间" prop="buyTime">
                        <el-input v-model="addForm.buyTime"  maxlength=20 disabled=""></el-input>
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
    import CitySelect from '@/components/CitySelect/index'
    import ajax from '@/utils/request'
    import {tool, ruleTool , formRule} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "baseSimForm",
        components: {TreeSelect, CitySelect, MoneyInput},
        data() {
            return {
                activeNames: ['0', '1'],
                addressList: [{id: 1, name: 1}, {id: 2, name: 2}],
                addForm: {},
                rules:{
                    phone : [{ required: true, message: '请输入手机号', trigger: 'blur' },
                    ],
                    imei: [{required: true, message: '请输入imei', trigger: 'blur'},
                    ],
                    stockStatus:[{required: true, message: '请选择库存状态', trigger: 'change'}]
                },
            }
        },
        mounted() {
            this.initData();
        },
        methods: {

            /*数据初始化*/
            initData(){
                this.addForm = this.$route.query;
            },
            //保存提交
            submitForm: function (form) {
                var data = this.addForm;
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        return;
                    }
                    ajax.post('base/baseSim/', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.close();
                        }else {
                            this.showMessage(rs.msg);
                        }
                    });
                });
            }
        }
    }
</script>

