<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="设备入库明细" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">产品型号</label>
                        <div class="input-group">
                            <span>{{detailForm.equipmentName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">产品类型</label>
                        <div class="input-group">
                            <span>{{detailForm.equipmentType}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">供应商</label>
                        <div class="input-group">
                            <span>{{detailForm.supplierName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">订单号</label>
                        <div class="input-group">
                            <span>{{detailForm.code}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">数量</label>
                        <div class="input-group">
                            <span>{{detailForm.quantity}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同编号</label>
                        <div class="input-group">
                            <span>{{detailForm.contractCode}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同开始日期</label>
                        <div class="input-group">
                            <span>{{detailForm.contractStartdate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同结束日期</label>
                        <div class="input-group">
                            <span>{{detailForm.contractEnddate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">入库时间</label>
                        <div class="input-group">
                            <span>{{detailForm.createTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">入库人</label>
                        <div class="input-group">
                            <span>{{detailForm.creater}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
        <div class="app-container white-bg list-panel detail" v-cloak>
            <div class="search-box">
                <div class="form-box">
                    <div class="form-group">
                        <label class="control-label">IMSI</label>
                        <div class="input-group">
                            <el-input v-model="searchParam.imsi" clearable placeholder="请输入IMSI"></el-input>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">手机号</label>
                        <div class="input-group">
                            <el-input v-model="searchParam.phone" clearable placeholder="请输入手机号"></el-input>
                        </div>
                    </div>
                </div>
                <div class="search-btn-list">

                </div>
            </div>
            <div class="tool-box">
                <div class="operation">
                    <el-button type="primary" size="mini" @click="getList()">查询</el-button>
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
                <el-table border :data="list" style="width: 100%">
                    <el-table-column min-width="140" label="IMSI" prop="imsi" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="手机号" prop="phone" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="ICCID" prop="iccid" sortable show-overflow-tooltip></el-table-column>
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
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'

    export default {
        name: "equipmentStorageInDetailSim",
        mixins: [tool],
        data() {
            return {
                openCollapse: ["1"],
                show: true,
                showSearch: false,
                detailForm: {
                },
                id: this.$route.params.id,
                listUrl: 'base/baseEquipmentToStore/simList?equipmentStorageId='+this.$route.params.id,
            }
        },
        methods: {
            open() {
                this.show = true;
            }
        }
        ,
        mounted() {
            this.getList();
            this.inintData();

        },
        methods: {
            inintData(){
                ajax.get('base/baseEquipmentToStore/detail/' + this.id,).then(rs => {
                    this.detailForm = rs.data;
                });
            }
        }

    }
</script>

<style lang="scss" scoped>
    .detail{
        min-height: calc(100vh - 255px);
    .tool-box{
        display: flex;
        justify-content: space-between;
    }
    }
</style>
