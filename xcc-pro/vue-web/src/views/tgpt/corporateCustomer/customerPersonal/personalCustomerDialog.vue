<template>
        <el-dialog :visible.sync="personalCustomerShow" title="选择个人客户" width="70%"
                   :append-to-body="true">
            <div id="app" class="wrapper wrapper-content animated fadeInRight list-panel" v-cloak>
                <div class="search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">姓名</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.name" clearable autocomplete="off" placeholder="请输入客户姓名"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">手机号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.phone" clearable autocomplete="off" placeholder="请输入手机号"></el-input>
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
                            <el-table-column fixed prop="name" sortable label="客户姓名" min-width="150"></el-table-column>
                            <el-table-column prop="phone" sortable label="手机号" min-width="150"></el-table-column>
                            <el-table-column prop="sex" sortable label="性别" min-width="120"></el-table-column>
                            <el-table-column prop="idCard" sortable label="身份证号" min-width="120"></el-table-column>
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
        name: "personalCustomerDialog",
        mixins: [tool],
        components:{CitySelectPanel},
        data(){
            return {
                personalCustomerShow:false,
                listUrl:"core/personal/selectPersonalCustomer",
            }
        },
        methods:{
            open(organizationId){
                this.personalCustomerShow = true;
                this.searchParam.organizationId=organizationId;
                this.getList();
            },
            choose(row){
                this.personalCustomerShow = false;
                this.$emit('load',row);
            },
        },
        mounted(){

        }
    }
</script>
