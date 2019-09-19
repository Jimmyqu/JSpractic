<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="所属组织" name="0" v-if="null == addForm.id">
                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="orgId" :rules="rules.required('请选择所属组织')">
                            <!--<tree-select v-model="addForm.orgId" placeholder="请选择" type="one"
                                         url="admin/organization/tree"></tree-select>-->
                            <el-select v-model="addForm.orgId" filterable>
                                <el-option
                                    v-for="(item,i) in companys"
                                    :key="i"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="车务提醒" name="1">
                    <div class="flex-panel">
                        <el-form-item label="年检即将到期(天数)" prop="inspection" :rules="rules.required('请输入年检即将到期天数')">
                            <el-input-number v-model="addForm.inspection" placeholder="请输入年检即将到期天数"
                                             controls-position="right" :min="30" :max="240" :step="5"></el-input-number>
                        </el-form-item>
                        <el-form-item label="保单即将到期(天数)" prop="insurance" :rules="rules.required('请输入保单即将到期天数')">
                            <el-input-number v-model="addForm.insurance" placeholder="请输入保单即将到期天数"
                                             controls-position="right" :min="10" :max="45" :step="5"></el-input-number>
                        </el-form-item>
                        <el-form-item label="通行证即将到期(天数)" prop="insurance" :rules="rules.required('请输入通行证即将到期天数')">
                            <el-input-number v-model="addForm.passMaturity" placeholder="请输入保单即将到期天数"
                                             controls-position="right" :min="10" :max="45" :step="5"></el-input-number>
                        </el-form-item>
                        <el-form-item label="距下次保养里程(公里)" prop="maintenance" :rules="rules.required('请输入距下次保养里程')">
                            <el-input-number v-model="addForm.maintenance" placeholder="请输入距下次保养里程"
                                             controls-position="right" :min="10" :max="2400"
                                             :step="5"></el-input-number>
                        </el-form-item>
                        <el-form-item label="违章未处理(天数)" prop="violation" :rules="rules.required('请输入违章未处理天数')">
                            <el-input-number v-model="addForm.violation" placeholder="请输入违章未处理天数"
                                             controls-position="right" :min="10" :max="45" :step="5"></el-input-number>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="报警提示" name="2">
                    <div class="flex-panel">
                        <el-form-item label="疲劳驾驶里程(公里)" prop="fatigueMile" :rules="rules.required('请输入疲劳驾驶里程')">
                            <el-input-number v-model="addForm.fatigueMile" placeholder="请输入疲劳驾驶里程"
                                             controls-position="right" :min="0" :max="2400"
                                             :step="100"></el-input-number>
                        </el-form-item>
                        <el-form-item label="疲劳驾驶时长(小时)" prop="fatigueTime" :rules="rules.required('请输入疲劳驾驶时长')">
                            <el-input-number v-model="addForm.fatigueTime" placeholder="请输入疲劳驾驶时长"
                                             controls-position="right" :min="0" :max="24" :step="1"></el-input-number>
                        </el-form-item>
                        <el-form-item label="怠速阀值(分钟)" prop="idleSpeed" :rules="rules.required('请输入怠速阀值')">
                            <el-input-number v-model="addForm.idleSpeed" placeholder="请输入怠速阀值" controls-position="right"
                                             :min="0" :step="5"></el-input-number>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="违章查询" name="3">
                    <div class="flex-panel">
                        <el-form-item label="违章查询周期(天数)" prop="violationCycle" :rules="rules.required('请输入违章查询周期')">
                            <el-input-number v-model="addForm.violationCycle" placeholder="请输入疲劳驾驶里程"
                                             controls-position="right" :min="0" :max="2400"
                                             :step="100"></el-input-number>
                        </el-form-item>
                        <el-form-item label="违章最后查询时间" prop="violationTime" :rules="rules.required('请选择违章最后查询时间')">
                            <el-date-picker type="date" placeholder="请选择" v-model="addForm.violationTime"
                                            value-format="yyyy-MM-dd HH:mm:ss" :picker-options="addForm.violationTime"
                                            :editable="false"></el-date-picker>
                        </el-form-item>

                        <el-form-item label="违章查询状态" prop="isViolation">
                            <el-select v-model="addForm.isViolation" clearable placeholder="请选择违章查询状态">
                                <el-option label="开启" :value="1"></el-option>
                                <el-option label="关闭" :value="2"></el-option>
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
        name: "customParameterForm",
        components: {TreeSelect, CitySelect, MoneyInput},
        data() {
            return {
                activeNames: ["0", "1", "2", "3"],
                addForm: {},
                companys: []
            }
        },
        mounted() {
            this.open();
        },
        methods: {
            open() {
                this.addForm = {};
                let id = this.$route.query.id;
                if (id) {
                    ajax.get('base/baseParamSet/' + id).then(rs => {
                        this.addForm = rs.data;
                    });
                }

                ajax.get('admin/organization/managerCompany').then(result => {
                    if (this.checkResponse(result)) {
                        this.companys = result.data;
                    }
                })
            },
            //保存提交
            submitForm: function (form) {
                var data = this.addForm;
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }

                    if (Array.isArray(data.orgId))
                        data.orgId = data.orgId[0];
                    ajax.post('base/baseParamSet/', data).then(rs => {
                        if (rs.data > 0) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.close();
                            this.$emit('load');
                        }else if(rs.data ==-1){
                            this.$message.error('该管理公司已存在！');
                        } else {
                            this.$message.error('保存失败');
                        }
                    });
                });
            }
        }
    }
</script>

