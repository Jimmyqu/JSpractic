<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="设备出库明细" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">出库时间</label>
                        <div class="input-group">
                            <span>{{detailForm.createTime}}</span>
                        </div>
                    </div>
					<div class="detail-item">
						<label class="control-label">产品型号</label>
						<div class="input-group">
							<span>{{detailForm.equipmentName}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">产品类型</label>
						<div class="input-group">
                            <template v-if="detailForm.equipmentType==1"><span>OBD</span></template>
                            <template v-if="detailForm.equipmentType==2"><span>GPS</span></template>
                            <template v-if="detailForm.equipmentType==3"><span>SIM卡</span></template>
                            <template v-if="detailForm.equipmentType==4"><span>无线设备</span></template>
                        </div>
					</div>
					<div class="detail-item">
						<label class="control-label">数量</label>
						<div class="input-group">
							<span>{{detailForm.quantity}}</span>
						</div>
					</div>
                    <div class="detail-item">
                        <label class="control-label">订单号</label>
                        <div class="input-group">
                            <span>{{detailForm.code}}</span>
                        </div>
                    </div>
					<div class="detail-item">
						<label class="control-label">管理公司</label>
						<div class="input-group">
							<span>{{detailForm.organizationName}}</span>
						</div>
					</div>
                    <div class="detail-item">
                        <label class="control-label">收货人</label>
                        <div class="input-group">
                            <span>{{detailForm.receiver}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">联系电话</label>
                        <div class="input-group">
                            <span>{{detailForm.phone}}</span>
                        </div>
                    </div>

					<div class="detail-item">
						<label class="control-label">收货地址</label>
						<div class="input-group">
							<span>{{detailForm.address}}</span>
						</div>
					</div>
                    <div class="detail-item">
                        <label class="control-label">发货人</label>
                        <div class="input-group">
                            <span>{{detailForm.sender}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">操作人</label>
                        <div class="input-group">
                            <span>{{detailForm.creater}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">发货方式</label>
                        <div class="input-group">
                            <template v-if="detailForm.logisticsType==1"><span>供应商直发</span></template>
                            <template v-if="detailForm.logisticsType==2"><span>我司直发</span></template>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">物流公司</label>
                        <div class="input-group">
                            <span>{{detailForm.logisticsCompanyText}}</span>
                        </div>
                    </div>
					<div class="detail-item">
						<label class="control-label">物流单号</label>
						<div class="input-group">
							<span>{{detailForm.logisticsCode}}</span>
						</div>
					</div>
                </div>
            </el-collapse-item>
        </el-collapse>
        <div class="app-container white-bg list-panel detail" v-cloak>
            <div class="search-box">
                <div class="form-box">
                    <div class="form-group">
                        <label class="control-label">IMEI</label>
                        <div class="input-group">
                            <el-input v-model="searchParam.imei" clearable placeholder="请输入IMEI"></el-input>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">设备号</label>
                        <div class="input-group">
                            <el-input v-model="searchParam.sn" clearable placeholder="请输入设备号"></el-input>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">库存状态</label>
                        <div class="input-group">
                            <el-select v-model="searchParam.stockStatus" clearable placeholder="请选择库存状态">
                                <el-option label="库存" :value="1"></el-option>
                                <el-option label="已出库" :value="2"></el-option>
                                <el-option label="已安装" :value="3"></el-option>
                                <el-option label="已激活" :value="4"></el-option>
                                <el-option label="已拆除" :value="5"></el-option>
                            </el-select>
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
                    <el-table-column min-width="140" label="IMEI" prop="imei" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="设备号(SN)" prop="sn" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="状态" prop="stockStatus" sortable show-overflow-tooltip>
                        <template slot-scope="scope">
                            <template v-if="scope.row.stockStatus==1"><span>库存</span></template>
                            <template v-else-if="scope.row.stockStatus==2"><span>已出库</span></template>
                            <template v-else-if="scope.row.stockStatus==3"><span>已安装</span></template>
                            <template v-else-if="scope.row.stockStatus==4"><span>已激活</span></template>
                            <template v-else-if="scope.row.stockStatus==5"><span>已拆除</span></template>
                            <template v-else="scope.row.stockStatus==1"><span>/</span></template>
                        </template>
                    </el-table-column>
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
    import $ from 'jquery-slim'

    export default {
        name: "baseEquipmentOutputDetail",
        mixins: [tool],
        data() {
            return {
                openCollapse: ["1"],
                show: true,
                detailForm: {
                },
                id: this.$route.params.id,
                listUrl: 'base/baseEquipmentOutput/equipmentlist',
                searchParam:{
                    id:this.$route.params.id,
                },
            }
        },
        methods: {
            open() {
                this.show = true;
            },
            resetList(){
                this.searchParam={};
                this.searchParam={
                    id:this.$route.params.id
                }
                this.getList();

            },
        }
        ,
        mounted() {
            this.getList();
            ajax.get('base/baseEquipmentOutput/detail/' + this.id,).then(rs => {
                this.detailForm = rs.data;
            });
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
