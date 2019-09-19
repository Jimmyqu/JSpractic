<template>
        <el-dialog :visible.sync="enterpriseShow" title="选择企业客户" width="70%"
                   :append-to-body="true">
            <div id="app" class="wrapper wrapper-content animated fadeInRight list-panel" v-cloak>
                <div class="search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">客户名称</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.name" clearable autocomplete="off" placeholder="请输入客户名称"></el-input>
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
                            <el-table-column fixed prop="name" sortable label="客户名称" min-width="150"></el-table-column>
                            <el-table-column prop="nature" sortable label="企业性质" min-width="150"></el-table-column>
                            <el-table-column prop="scale" sortable label="企业规模" min-width="120"></el-table-column>
                            <el-table-column prop="cityName" sortable label="城市名称" min-width="120"></el-table-column>
                            <el-table-column prop="organizationName" sortable label="所属组织" min-width="120"></el-table-column>
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
        name: "enterpriseDialog",
        mixins: [tool],
        components:{CitySelectPanel},
        data(){
            return {
                enterpriseShow:false,
                listUrl:"core/personal/selectEnterprise",
            }
        },
        methods:{
            open(organizationId){
                this.enterpriseShow = true;
                this.searchParam.organizationId=organizationId;
                this.getList();
            },
            choose(row){
                this.enterpriseShow = false;
                this.$emit('load',row);
            },
        },
        mounted(){

        }
    }
</script>
