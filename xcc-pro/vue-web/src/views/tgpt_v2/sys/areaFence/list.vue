<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">栅栏名称</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.name" placeholder="栅栏名称" clearable></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>

            </div>
        </div>

        <div class="tool-box">
            <div class="operation">
                <el-button  v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>

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
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="240">
                    <template slot-scope="scope">
                        <el-button v-show="showEnabledBtn" type="text" @click="scope.row.fenceStatusText == '启用'?_enable({id: scope.row.id, fenceStatus: 2}):_enable({id: scope.row.id, fenceStatus: 1})">
                            {{scope.row.fenceStatusText == '启用'?'停用':'启用'}}
                        </el-button>
                        <el-button v-show="showFenceToVehicleBtn" type="text" @click="areaFenceToVehicle(scope.row.id)">
                            分配车辆
                        </el-button>
                        <el-button v-show="showDetailBtn" type="text" @click="toDetail(scope.row)">详情</el-button>
                        <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">编辑</el-button>
                        <el-button v-show="showDeleteBtn" type="text" @click="_delete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="fenceStatusText" label="栅栏状态" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column prop="name" label="栅栏名称" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column prop="companyName" label="服务组织" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column prop="vehicleCount" label="受控车数" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column prop="cityStr" label="允许运行城市" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
                <!--                <el-table-column prop="fenceStatus" label="状态" min-width="140" show-overflow-tooltip
                                                 sortable>
                                    <template slot-scope="scope">
                                        <el-checkbox v-model="scope.row.fenceStatus" true-label="1" false-label="0"
                                                     @change="_enable(scope.row)">启用
                                        </el-checkbox>
                                    </template>
                                </el-table-column>-->
                <el-table-column prop="updaterName" label="最后操作人" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column prop="updateTime" label="最后操作时间" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'areaFence',
        mixins: [tool],
        components: {TreeSelect},
        data() {
            return {
                showFenceToVehicleBtn: this.getCurrentUserAuthority('baseAreaFence/areaFenceToVehicle'),
                showSearch: false,
                searchParam: {},
                showEditBtn: this.getCurrentUserAuthority('baseAreaFence/edit'),
                showAddBtn: this.getCurrentUserAuthority('baseAreaFence/add'),
                showDetailBtn: this.getCurrentUserAuthority('baseAreaFence/detail'),
                showDeleteBtn: this.getCurrentUserAuthority('baseAreaFence/delete'),
                showEnabledBtn: this.getCurrentUserAuthority('baseAreaFence/enable'),
                listUrl: '/base/baseAreaFence'
            }
        },
        activated: function () {
            this.getList();
        },
        mounted: function () {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            getListBefore(params) {

            },
            getListAfter() {
                this.list.forEach(item => {
                    item.fenceStatus += '';
                });
            },
            exportExcel() {
                window.location = this.exportUrl("?" + $.param(this.searchParam));
            },
            //分配车辆
            areaFenceToVehicle(id) {
                let url = this.$route.fullPath + '/areaFenceToVehicle?id=' + id;
                this.$router.push({path: url});
            },
            _delete(obj) {
                this.$confirm('确定要删除区域栅栏【' + obj.name + '】?')
                    .then(() => {
                        ajax.delete('/base/baseAreaFence/' + obj.id).then(res => {
                            this.$message({message: '操作成功', type: 'success'});
                            this.getList();
                        });
                    }).catch();
            },
            _enable(obj) {
                console.log(213)
                ajax.post('/base/baseAreaFence/enable', obj).then(res => {
                    this.$message({message: '操作成功', type: 'success'});
                    this.getList();
                });
            }
        }
    }
</script>

