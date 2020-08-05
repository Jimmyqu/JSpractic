<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">围栏名称</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.name" placeholder="围栏名称" clearable></el-input>
                    </div>
                </div>
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
                        <el-button v-show="showEnabledBtn" type="text" @click="scope.row.fenceStatus == 1?_enable({id: scope.row.id, fenceStatus: 2}):_enable({id: scope.row.id, fenceStatus: 1})">
                            {{scope.row.fenceStatus == 1?'停用':'启用'}}
                        </el-button>
                        <el-button v-show="showFenceToVehicleBtn" type="text" @click="areaFenceToVehicle(scope.row.id)">分配车辆
                        </el-button>
                        <el-button v-show="showDetailBtn" type="text" @click="toDetail(scope.row)">详情</el-button>
                        <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">修改</el-button>
                        <el-button v-show="showDeleteBtn" type="text" @click="_delete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="fenceStatusText" label="栅栏状态" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column prop="name" label="围栏名称" min-width="140" show-overflow-tooltip
                                 sortablec></el-table-column>
                <el-table-column prop="companyName" label="所属公司" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column prop="vehicleCount" label="受控车辆" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column min-width="140" label="停车时间" prop="startTime" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>{{scope.row.startTime}}至{{scope.row.endTime}}</div>
                    </template>
                </el-table-column>

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
        name: 'parkingFence',
        mixins: [tool],
        components: {TreeSelect},
        data() {
            return {
                showSearch: false,
                searchParam: {},
                showEditBtn: this.getCurrentUserAuthority('baseParking/edit'),
                showAddBtn: this.getCurrentUserAuthority('baseParking/add'),
                showEnabledBtn: this.getCurrentUserAuthority('baseParking/enable'),
                showExportExcelBtn: true,
                showFenceToVehicleBtn: this.getCurrentUserAuthority('baseParking/areaFenceToVehicle'),
                showDetailBtn: this.getCurrentUserAuthority('baseParking/detail'),
                showDeleteBtn: this.getCurrentUserAuthority('baseParking/delete'),
                listUrl: '/base/baseParking'
            }
        },
        activated() {
            this.getList();
        },
        mounted() {
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
                let url = this.$route.fullPath + '/parkingFenceToVehicle?id=' + id;
                this.$router.push({path: url});
            },
            _delete(obj) {
                this.$confirm('确定要删除电子围栏【' + obj.name + '】?')
                    .then(() => {
                        ajax.delete('/base/baseParking/' + obj.id).then(res => {
                            this.$message({message: '操作成功', type: 'success'});
                            this.getList();
                        });
                    }).catch();
            },
            _enable(obj) {
                ajax.post('/base/baseParking/enable', obj).then(res => {
                    this.$message({message: '操作成功', type: 'success'});
                    this.getList();
                });
            }
        }
    }
</script>

