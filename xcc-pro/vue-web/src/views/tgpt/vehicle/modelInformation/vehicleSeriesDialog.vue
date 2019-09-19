<template>
        <el-dialog :visible.sync="vehicleSeriesShow" title="选择企业客户" width="70%"
                   :append-to-body="true">
            <div id="app" class="wrapper wrapper-content animated fadeInRight list-panel" v-cloak>
                <div class="search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">系列名称</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.name" clearable autocomplete="off" placeholder="请输入系列名称"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">品牌名称</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.brand" clearable autocomplete="off" placeholder="请输入品牌名称"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button size="small" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
                    </div>
                </div>
                <div class="table-box">
                    <template>
                        <el-table :data="list" style="width: 100%" border>
                            <el-table-column fixed label="操作" width="80">
                                <template slot-scope="scope">
                                    <el-button @click.native.prevent="choose(scope.row)" type="text" size="small">
                                        选择
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column fixed prop="name" sortable label="系列名称" min-width="150"></el-table-column>
                            <el-table-column prop="brandName" sortable label="品牌名称" min-width="150"></el-table-column>
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
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import CitySelectPanel from '@/components/CitySelect/index'
    export default {
        name: "vehicleSeriesDialog",
        mixins: [tool],
        data(){
            return {
                vehicleSeriesShow:false,
                listUrl:"base/vehicleModel/list",
            }
        },
        methods:{
            open(id){
                this.vehicleSeriesShow = true;
                this.getListByUrl("base/vehicleModel/list?brandId="+id);
            },
            choose(row){
                this.vehicleSeriesShow = false;
                this.$emit('load',row);
            },
        },
        mounted(){

        }
    }
</script>
