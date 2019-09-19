<template>
        <el-dialog :visible.sync="show" title="历史版本" width="60%"
                   :append-to-body="true">
            <div id="app" class="wrapper wrapper-content animated fadeInRight list-panel" v-cloak>
                <div class="row">
                    <template>
                        <el-table :data="list" style="width: 100%" border>
                            <el-table-column fixed sortable label="序号" min-width="150">
                                <template slot-scope="{row,$index}">
                                     {{$index+1}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="version" sortable label="版本" min-width="150">
                                <template slot-scope="scope">
                                    <a size="mini" style="color: #409EFF;" @click="toContractExecutionVersionDetail(scope.row)">V{{scope.row.version}}.0</a>
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
            }
        },
        methods:{
            open(id){
                this.show = true;
                this.getListByUrl("core/serviceHostingContractExecution/versionList?value="+id);
            },
            toContractExecutionVersionDetail(row){
                let url=this.$route.fullPath;
                this.show = false;
                this.$router.push({path:url+"/detail/"+row.id});
            }
        },
        mounted(){

        }
    }
</script>

