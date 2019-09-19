<template>
    <div class="detail-panel form-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="任务信息" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{transfer.companyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">任务时间</label>
                        <div class="input-group">
                            <span>{{transfer.assignmentTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">任务起点</label>
                        <div class="input-group">
                            <span>{{transfer.depAddress}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">任务终点</label>
                        <div class="input-group">
                            <span>{{transfer.desAddress}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">乘车人数</label>
                        <div class="input-group">
                            <span>{{transfer.passengerNum}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">联系人</label>
                        <div class="input-group">
                            <span>{{transfer.contacterName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">联系电话</label>
                        <div class="input-group">
                            <span>{{transfer.contacterPhone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{transfer.remark}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="服务司机" name="2">
                <el-form :model="transfer" :rules="rules" label-position="top" ref="transfer" label-width="100px">
                    <div class="flex-panel">
                        <el-form-item label="司机" prop="newDriverName">
                            <el-input v-model="transfer.newDriverName" @click.native="showDialogDriver()" readonly>
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="车牌">
                            <el-input clearable maxlength="50" v-model="transfer.plate" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="车型">
                            <el-input clearable maxlength="50" v-model="transfer.modelName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="颜色">
                            <el-input clearable maxlength="50" v-model="transfer.color" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </el-collapse-item>
        </el-collapse>
         <div class="left-row">
            <el-button type="primary" @click="submitForm('transfer')" :loading="addLoading">保存</el-button>
            <el-button @click="close()">返回</el-button>
        </div>

        <!-- 司机弹框 dialogDriverVisible----------------------->
        <el-dialog title="选择司机" :visible.sync="dialogDriverVisible" :append-to-body="true" width="70%" >
            <div class="wrapper wrapper-content fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">司机</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.driver" placeholder="请输入司机姓名/手机号" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">绑定状态</label>
                            <div class="input-group">
                                <el-select v-model="searchParam.bindStatus" placeholder="全部" clearable>
                                    <el-option label="已绑定" value="1"></el-option>
                                    <el-option label="未绑定" value="2"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table :data="list" style="width: 100%;" border max-width="300px">
                        <el-table-column fixed="left" label="操作" min-width="50">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.bindStatus == 2 && (scope.row.taskStatus == 1 || scope.row.taskStatus == 2) && (scope.row.serviceStatus == 1 || scope.row.serviceStatus == 4)"
                                           @click="chooseDriver(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="driverName" label="司机姓名"  min-width="120" ></el-table-column>
                        <el-table-column prop="driverPhone" label="手机号" min-width="120"></el-table-column>
                        <el-table-column prop="companyName" label="所属组织" min-width="200"></el-table-column>
                        <el-table-column prop="taskStatusText" label="任务状态" min-width="80"></el-table-column>
                        <el-table-column prop="address" label="最后位置" show-overflow-tooltip min-width="200"></el-table-column>
                        <el-table-column prop="time" label="最后定位时间" min-width="200"></el-table-column>
                        <el-table-column prop="bindStatusText" label="绑定状态" min-width="120"></el-table-column>
                        <el-table-column prop="plate" label="绑定车辆" min-width="120"></el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="pageSizeSetting"
                        :page-size="pageSize"
                        :layout="pageLayout"
                        :total="listCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { number_format } from '@/utils'
    import { tool, ruleTool, formRule } from '@/utils/common'

    export default {
        name: "assignmentManagementHandOut",
        mixins: [tool],
        data(){
            return {
                activeNames: ['1', '2'],
                transfer:{},
                allocate:{},
                searchParam:{},
                dialogDriverVisible : false,
                addLoading:false,
                list:[],
                rules: {
                    newDriverName: [
                        { required: true, message: '请选择司机', trigger: 'change' }
                    ]
                }
            }
        },
        mounted: function () {
            this.getDetail();
        },
        methods: {
            getDetail() {
                var id = this.$route.params.id;
                ajax.get("/operation_core/assignment/detail/" + id).then(result =>{
                    if(result.status == 0) {
                        this.transfer = result.data;
                    } else {
                        this.showMessage(result.message,"error");
                    }
                });
            },
            showDialogDriver(){
                const url = `/operation_core/assignment/driver/list?id=${this.$route.params.id}`;
                this.dialogDriverVisible = true;
                this.getListByUrl(url);
            },
            chooseDriver(param){
                debugger
                this.$set(this.transfer,'plate',param.plate);
                this.$set(this.transfer,'color',param.color);
                this.$set(this.transfer,'modelName',param.modelName);
                this.$set(this.transfer,'newDriverName',param.driverName);

                this.$set(this.allocate,'driverId',param.driverId);
                this.$set(this.allocate,'vehicleId',param.vehicleId);
                this.$set(this.allocate,'id',this.$route.params.id);

                this.dialogDriverVisible = false;
            },
            submitForm(schedultForm) {
                var $this = this;
                this.addLoading = true;
                $this.$refs[schedultForm].validate((valid) => {
                    if (valid) {
                        var url = "/operation_core/assignment/allocate";
                        ajax.post(url, $this.allocate).then(
                            res => {
                                if(res.status == 0){
                                    $this.showMessage("操作成功","success");
                                    $this.close();
                                    window.setTimeout(()=>{
                                        this.addLoading = false;
                                    },2000)
                                }else {
                                    $this.$message.error(res.message);
                                    this.addLoading = false;
                                }
                            },()=>{
                            this.addLoading = false;
                        }
                        )
                    } else {
                        this.addLoading = false;
                        return false;
                    }
                });
            },
        },


    }
</script>
