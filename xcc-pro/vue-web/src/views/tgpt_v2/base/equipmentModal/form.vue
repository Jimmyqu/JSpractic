<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="产品型号" name="1">
				<div class="flex-panel">

					<el-form-item label="产品类型" prop="type">
                        <el-select v-model="addForm.type" placeholder="请选择类型">
                            <el-option label="OBD" :value="1" ></el-option>
                            <el-option label="GPS" :value="2" ></el-option>
                            <el-option label="SIM" :value="3" ></el-option>
                            <el-option label="无线设备" :value="4"></el-option>
                        </el-select>
					</el-form-item>
					<el-form-item label="供应商" prop="supplierId">
                        <el-select v-model="addForm.supplierId" filterable clearable placeholder="请选择供应商">
                            <el-option
                                v-for="item in suppliers"
                                :key="item.value"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
					</el-form-item>
                    <el-form-item label="产品型号名称" prop="name">
                        <el-input v-model="addForm.name"  maxlength=20 placeholder="请输入" clearable></el-input>
                    </el-form-item>
					<el-form-item label="产品型号描述" prop="summary">
						<el-input v-model="addForm.summary"  maxlength=200 placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="升级方式" prop="autoUpdate" v-show="false">
                        <el-select v-model="addForm.autoUpdate" placeholder="请选择类型">
                            <el-option label="自动" :value="1"></el-option>
                            <el-option label="手动" :value="2"></el-option>
                        </el-select>
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
    import {tool, ruleTool} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "baseEquipmentModalForm",
        components: {TreeSelect, CitySelect, MoneyInput},
        data() {
            return {
                activeNames: ['0', '1'],
                addressList: [{id: 1, name: 1}, {id: 2, name: 2}],
                suppliers:[],
                addForm: {},
                rules:{
                    name: [
                        { required: true, message: '请输入型号名称', trigger: 'blur' },
                    ],
                    type: [
                        {  required: true, message: '请选择类型', trigger: 'change' }
                    ],
                    supplierId: [
                        {  required: true, message: '请选择供应商', trigger: 'change' }
                    ],
                    summary: [
                        { required: true, message: '请输入型号描述', trigger: 'blur' }
                    ]
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
                    ajax.get('base//baseEquipmentModal/detail/' + this.$route.query.id).then(rs => {
                        this.addForm = rs.data;
                    });
                }else{
                    this.addForm.autoUpdate=2;
                };
                this.getSuppliers();
            },
            getSuppliers(){
                ajax.get('base//baseEquipmentModal/supplierList').then(rs => {
                    this.suppliers = rs;
                });
            },
            //保存提交
            submitForm: function (form) {
                var data = this.addForm;
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }

                    ajax.post('base//baseEquipmentModal/', data).then(rs => {
                        debugger
                        if (rs.status == 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.close();
                        }else{
                            this.$message.error(rs.msg);
                        }
                    });
                });
            }
        }
    }
</script>

