<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="沉默鹰设备状态" name="1">
				<div class="flex-panel">

					<el-form-item label="车辆id" prop="vehicleId">
						<el-input v-model="addForm.vehicleId"  maxlength=36 placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="设备id" prop="equipmentId">
						<el-input v-model="addForm.equipmentId"  maxlength=36 placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="纬度" prop="latitude(元)">
						<money-input v-model="addForm.latitude" :rules="[rules.money()]"  placeholder="请输入" clearable></money-input>
					</el-form-item>
					<el-form-item label="经度" prop="longitude(元)">
						<money-input v-model="addForm.longitude" :rules="[rules.money()]"  placeholder="请输入" clearable></money-input>
					</el-form-item>
					<el-form-item label="纠偏后纬度" prop="corlat(元)">
						<money-input v-model="addForm.corlat" :rules="[rules.money()]"  placeholder="请输入" clearable></money-input>
					</el-form-item>
					<el-form-item label="纠偏后经度" prop="corlong(元)">
						<money-input v-model="addForm.corlong" :rules="[rules.money()]"  placeholder="请输入" clearable></money-input>
					</el-form-item>
					<el-form-item label="定位地址" prop="localtion">
						<el-input v-model="addForm.localtion"  maxlength=500 placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="定位时间" prop="localtionTime">
						<el-date-picker type="date" v-model="addForm.localtionTime"  maxlength=19 placeholder="请选择" value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
					</el-form-item>
					<el-form-item label="速度km/h" prop="speed(元)">
						<money-input v-model="addForm.speed" :rules="[rules.money()]"  placeholder="请输入" clearable></money-input>
					</el-form-item>
					<el-form-item label="方向" prop="direction(元)">
						<money-input v-model="addForm.direction" :rules="[rules.money()]"  placeholder="请输入" clearable></money-input>
					</el-form-item>
					<el-form-item label="无线通信网络信号强度" prop="networkSignal(元)">
						<money-input v-model="addForm.networkSignal" :rules="[rules.money()]"  placeholder="请输入" clearable></money-input>
					</el-form-item>
					<el-form-item label="电量" prop="power(元)">
						<money-input v-model="addForm.power" :rules="[rules.money()]"  placeholder="请输入" clearable></money-input>
					</el-form-item>
					<el-form-item label="设备状态" prop="onlineStatus">
						<el-input v-model="addForm.onlineStatus" :rules="[rules.int()]" maxlength=10 placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="数据类型" prop="type">
						<el-input v-model="addForm.type" :rules="[rules.int()]" maxlength=10 placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="ACC开关" prop="acc">
						<el-input v-model="addForm.acc" :rules="[rules.int()]" maxlength=10 placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="是否定位" prop="pos">
						<el-input v-model="addForm.pos" :rules="[rules.int()]" maxlength=10 placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="0：未使用GPS卫星进行定位；1：使用GPS卫星进行定位" prop="gps">
						<el-input v-model="addForm.gps" :rules="[rules.int()]" maxlength=10 placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="0：未使用北斗卫星进行定位；1：使用北斗卫星进行定位" prop="bd">
						<el-input v-model="addForm.bd" :rules="[rules.int()]" maxlength=10 placeholder="请输入" clearable></el-input>
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
        name: "seEquipmentStatusForm",
        components: {TreeSelect, CitySelect, MoneyInput},
        data() {
            return {
                activeNames: ['0', '1'],
                addressList: [{id: 1, name: 1}, {id: 2, name: 2}],
                addForm: {}
            }
        },
        mounted() {
            this.open();
        },
        methods: {
            open() {
                this.addForm = {};
                if (this.$route.query.id) {
                    ajax.get('se//seEquipmentStatus/' + this.$route.query.id).then(rs => {
                        this.addForm = rs.data;
                    });
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

                    ajax.post('se//seEquipmentStatus/', data).then(rs => {
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

