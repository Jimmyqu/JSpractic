<template>
        <el-dialog :visible.sync="show" title="选择所有车辆" width="90%"
                   :append-to-body="true">
            <div id="app" class="wrapper wrapper-content animated fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.plate" clearable autocomplete="off" placeholder="请输入车牌"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">车型</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.vehicleModelInfoName" clearable autocomplete="off" placeholder="请输入车型"></el-input>
                            </div>
                        </div>
                        <!--<div class="form-group">
                            <label class="control-label">经营城市</label>
                            <div class="input-group">
                                <city-select-panel :value.sync="nearCity4" @change="changeCity()" ref="citySelect" placeholder="请选择经营城市"></city-select-panel>
                            </div>
                        </div>-->
                        <div class="form-group">
                            <label class="control-label">车辆状态</label>
                            <div class="input-group">
                                <el-select v-model="searchParam.vehicleStatus" clearable placeholder="请选择车辆状态">
                                    <el-option label="未投入运营" value="1"></el-option>
                                    <el-option label="待租" value="2"></el-option>
                                    <el-option label="已租" value="3"></el-option>
                                    <el-option label="待出车" value="4"></el-option>
                                    <el-option label="维修保养" value="5"></el-option>
                                    <el-option label="待处置" value="7"></el-option>
                                    <el-option label="申请出售中" value="8"></el-option>
                                    <el-option label="出售确认中" value="9"></el-option>
                                    <el-option label="申请处置中" value="10"></el-option>
                                    <el-option label="申请使用中" value="11"></el-option>
                                    <el-option label="已出售" value="12"></el-option>
                                </el-select>
                            </div>
                        </div>
                        <!--<div class="form-group">
                            <label class="control-label">在库状态</label>
                            <div class="input-group">
                                <el-select v-model="searchParam.vehicleStatus" clearable placeholder="请选择在库状态">
                                    <el-option label="不限" value=""></el-option>
                                    <el-option label="未出库" value="1"></el-option>
                                    <el-option label="已出库" value="2"></el-option>
                                </el-select>
                            </div>
                        </div>-->
                    </div>
                    <div class="search-btn-list">
                        <el-button size="small" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
                    </div>
                </div>
                <div class="row">
                    <template>
                        <el-table :data="list" style="width: 100%" border>
                            <el-table-column fixed label="操作" width="80">
                                <template slot-scope="scope">
                                    <el-button @click.native.prevent="selectVehicle(scope.row)" type="text" size="small">
                                        选择
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column prop="company" fixed sortable label="服务组织" min-width="180"></el-table-column>
                            <el-table-column prop="plate" sortable label="车牌" min-width="150"></el-table-column>
                            <el-table-column prop="vehicleModelInfoName" sortable label="车型" show-overflow-tooltip min-width="200"></el-table-column>
                            <el-table-column prop="color" sortable label="颜色" min-width="100"></el-table-column>
                            <!--<el-table-column prop="registerCity" sortable label="注册城市" min-width="100"></el-table-column>-->
                           <!-- <el-table-column prop="runCity" sortable label="经营城市" min-width="100"></el-table-column>-->
                            <el-table-column prop="vehicleStatus" sortable label="车辆状态" min-width="120"></el-table-column>
                            <!--<el-table-column prop="stockStatus" sortable label="在库状态" min-width="120"></el-table-column>-->
                            <el-table-column prop="registerDate" sortable label="上牌日期" min-width="100"></el-table-column>
                           <!-- <el-table-column prop="assetType" sortable label="资产属性" min-width="120"></el-table-column>-->
                            <el-table-column prop="plateType" sortable label="车辆来源" min-width="120"></el-table-column>
                           <!-- <el-table-column prop="useNature" sortable label="经营属性" min-width="120"></el-table-column>-->
                            <el-table-column prop="fuelType" sortable label="燃油类型" min-width="120"></el-table-column>
                            <el-table-column prop="fuelCapacity" sortable label="油箱容量" min-width="120"></el-table-column>
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
                    </template>
                </div>
            </div>
        </el-dialog>
</template>
<script>
    import CitySelectPanel from '@/components/CitySelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    export default {
        name: "vehicleListPanel",
        mixins: [tool],
        components:{CitySelectPanel},
        data(){
            return {
                show:false,
                nearCity4:[],
                companyId:"",
                listUrl:"core/vehicleaccident/vehiclelist?companyId="+this.companyId,
            }
        },
        methods:{
            open(companyId){
                this.show = true;
                if(companyId && companyId != ''){
                    this.getListByUrl("core/vehicleaccident/vehiclelist?companyId="+companyId)
                }else{
                    this.getListByUrl("core/vehicleaccident/vehiclelist")
                }

            },
            selectVehicle(row){
                this.show = false;
                this.$emit('load',row);
            },
            changeCity(){
                if(this.nearCity4 && this.nearCity4.length>=2)
                    this.searchParam.runCity=this.nearCity4[1];
            }
        },
        mounted(){

        }
    }
</script>
<style>
    .user-edit-panel {

    }
    .user-edit-panel .el-dialog__header {
        display: none;
    }
    .user-edit-panel .el-dialog__body {
        height: auto;
        padding: 0 20px;
    }
    .user-edit-panel .el-dialog__footer {
        text-align: left;
        padding-left: 20px;
        padding-top: 0;
    }
    .user-edit-panel .el-dialog {
        background-color: #f0f0f0;
    }
</style>
