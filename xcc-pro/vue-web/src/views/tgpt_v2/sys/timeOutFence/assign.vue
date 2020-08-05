<template>
    <div class="detail-panel list-panel newList-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="受监控车辆列表" name="1" >
                <div class="search-box min">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.plate" placeholder="请输入车牌查询"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">

                    </div>
                </div>
                <div class="tool-box">
                    <div class="operation">
                        <el-button type="warning" size="mini" @click="openAdd()">添加车辆</el-button>
                        <el-button type="primary" size="mini" @click="getList()">查询</el-button>
                        <el-button size="mini" @click="resetList()">重置</el-button>
                        <el-button size="mini" @click="close()">返回</el-button>
                    </div>
                    <div class="pagination">
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
                <div class="flex-panel" style="justify-content: space-between;padding: 0 20px;margin-top: 15px;">
                    <div v-if="detailForm.fenceStatus == 1" style="background-color:#3cc051;color: #fff;">栅栏状态: 已启用</div>
                    <div v-else style="background-color: red;color: #fff;">栅栏状态: 已停用</div>
                    <div>栅栏名称: {{detailForm.name}}</div>
                    <div>允许运行时段: {{detailForm.startTime}}-{{detailForm.endTime}}</div>
                    <div>重复周期: {{detailForm.cycle}}</div>
                </div>
                <div class="table-box" style="width: 100%;padding: 0;">
                    <el-table :ref="getRefName" :max-height="tableHeight" border :data="list" style="width: 100%">
                        <el-table-column fixed="left" label="操作" width="80">
                            <template slot-scope="scope">
                                <el-button type="text" @click="deleteVehicle(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="140" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="车辆所属" prop="assetsType" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="服务组织" prop="attributionRegion" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="车型" prop="vehicleModel" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="添加时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="添加人" prop="creater" sortable show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </el-collapse-item>
        </el-collapse>
        <assignVehicle ref="assignVehicle" @reload="getList()" ></assignVehicle>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import {tool} from '@/utils/common'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import assignVehicle from './assignVehicle'

    export default {
        name: "baseTimeFenceAssign",
        mixins: [tool],
        components:{ ApprovalFlow,assignVehicle },
        data() {
            return {
                openCollapse: ["1"],
                show: true,
                detailForm: {
                },
                listUrl: 'base/baseTimeOutFence/selectVehicle?timeOutFenceId=' + this.$route.params.id,
                timeOutFenceId: this.$route.params.id,
                dialog: {
                    dialogVehicle: false
                }
            }
        },
        methods: {
            close(){
                this.$router.push({path:"/tgpt_v2/sys/timeOutFence"})
            },
            openAdd(){
                this.$refs.assignVehicle.open(this.timeOutFenceId,this.detailForm.companyId);
            },
            deleteVehicle(row){
                if(row){
                    this.$confirm('确定删除该车辆?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        var param = {
                            id: row.id,
                            timeOutFenceId: row.timeOutFenceId
                        };
                        ajax.post('base/baseTimeOutFence/deleteVehicle', param).then(rs => {
                            if (rs && rs.data == 1) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getList();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '保存失败!'
                                });
                            }
                        });

                    });
                }
            }
        },
        mounted() {
            ajax.get('base//baseTimeOutFence/' + this.timeOutFenceId).then(rs => {
                this.detailForm = rs.data;
            });
            this.getList();
        }

    }
</script>
