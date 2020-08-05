<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="车牌"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <div class="search-btn-list">

                </div>
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
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
        <div class="summary">
            <el-tag type="success" v-if="detail.fenceStatus==1">已启用</el-tag>
            <el-tag type="info" v-else>未启用</el-tag>

            围栏名称：{{detail.name}} &nbsp;&nbsp;&nbsp;&nbsp;
            停车时间段: {{detail.startTime}}-{{detail.endTime}}
        </div>
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" border :data="list" style="width: 100%">
                <el-table-column prop="plate" label="车牌" min-width="100" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column prop="assetsTypeVal" label="车辆所属" min-width="100" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column prop="attributionRegionVal" label="服务组织" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column prop="vehicleModelInfo" label="车型" min-width="160" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column prop="createTime" label="添加时间" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column prop="createrName" label="添加人" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
            </el-table>
        </div>

        <vehicle-dialog ref="vehicleDialog" @reload="getList()"></vehicle-dialog>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'
    import VehicleDialog from "./vehicleDialog";

    export default {
        name: 'parkingFenceDetail',
        mixins: [tool],
        components: {VehicleDialog, TreeSelect},
        data() {
            return {
                deleteEditBtn: true,
                listUrl: '/base/baseParking/getVehicleByAreaId',
                searchParam: {},
                areaId: '',
                queryFlag: false,
                detail: {}
            }
        },
        activated() {
            this.getList();
        },
        mounted() {
            this.areaId = this.$route.params.id;
            if (!this.areaId)
                return;

            this.getList();

            //detail
            ajax.get('/base/baseParking', {id: this.areaId}).then(rs => {
                this.detail = rs.records[0];
            });
        },
        methods: {
            getListBefore(params) {
                params.areaId = this.areaId;
            },
            getListAfter() {
                this.queryFlag = false;
            },
            addVehicle() {
                this.$refs.vehicleDialog.open(this.areaId);
            },
            _delete(obj) {
                this.$confirm('确定将车辆（' + obj['plate'] + '）从当前停车栅栏中删除?')
                    .then(() => {
                        ajax.delete('/base/baseParking/vehicle/' + obj.afvId).then(res => {
                            this.$message({message: '操作成功', type: 'success'});
                            this.getList();
                        });
                    }).catch();
            }
        }
    }
</script>
<style>
    .info {
        position: relative;
        text-decoration: underline;
        color: #409eff;
        cursor: default;
    }

    .info:hover {
        color: #65adf7;
    }
</style>
