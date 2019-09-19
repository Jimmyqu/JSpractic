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
                    <el-table-column fixed="left" label="操作" width="150" v-show="detailForm.equipmentType!='SIM'" >
                        <template slot-scope="scope">
                            <el-button  type="text" @click="goDetail(scope.row)">指令日志</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="140" label="IMEI" prop="imei" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="设备号(SN)" prop="sn" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="状态" prop="stockStatus" sortable></el-table-column>
                </el-table>
            </div>
        </div>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'

    export default {
        name: "equipmentStorageInDetailObd",
        mixins: [tool],
        data() {
            return {
                openCollapse: ["1"],
                show: true,
                showSearch: false,
                detailForm: {
                },
                id: this.$route.params.id,
                listUrl: 'base/baseEquipmentToStore/equipmentList?equipmentStorageId='+this.$route.params.id,
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
            },
            goDetail(row){
                this.$router.push({path:"/tgpt_v2/base/equipment/commandLoglist/"+row.imei});
            },
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
