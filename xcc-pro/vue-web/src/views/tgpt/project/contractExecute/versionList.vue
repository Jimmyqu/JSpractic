<template>
        <el-dialog :visible.sync="show" title="历史版本" width="60%"
                   :append-to-body="true">
            <div id="app" class="wrapper wrapper-content animated fadeInRight list-panel" v-cloak>
                <!--<div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">司机姓名</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.name" clearable autocomplete="off" placeholder="请输入司机姓名"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">手机号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.phone" clearable autocomplete="off" placeholder="请输入手机号"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">服务城市</label>
                            <div class="input-group">
                                <city-select-panel :value.sync="nearCity3" @change="changeCity()" ref="citySelect" placeholder="请选择经营城市"></city-select-panel>
                            </div>
                        </div>

                    </div>
                    <div class="search-btn-list">
                        <el-button size="small" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
                    </div>
                </div>-->
                <div class="row">
                    <template>
                        <el-table :data="list" style="width: 100%" border>
                            <!--<el-table-column fixed label="操作" width="80">
                                <template slot-scope="scope">
                                    <el-button @click.native.prevent="selectDriver(scope.row)" type="text" size="small">
                                        选择
                                    </el-button>
                                </template>
                            </el-table-column>-->
                            <el-table-column fixed sortable label="序号" min-width="150">
                                <template slot-scope="{row,$index}">
                                     {{$index+1}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="version" sortable label="版本" min-width="150">
                                <template slot-scope="scope">
                                    <a size="mini" style="color: #409EFF;" @click="toContractExecuteVersionDetail(scope.row)">V{{scope.row.version}}.0</a>
                                </template>
                            </el-table-column>
                            <el-table-column prop="createTime" sortable label="创建时间" min-width="120"></el-table-column>
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
        name: "versionListPanel",
        mixins: [tool],
        data(){
            return {
                show:false,
               // listUrl:"core/coreProjectContractExecute/versionlist",
            }
        },
        methods:{
            open(id){
                this.show = true;
                this.getListByUrl("core/coreProjectContractExecute/versionlist?projectContractId="+id);
            },
            toContractExecuteVersionDetail(row){
                let url=this.$route.fullPath;
                this.show = false;
                this.$router.push({path:url+"/detail/"+row.id});
            }
        },
        mounted(){

        }
    }
</script>

