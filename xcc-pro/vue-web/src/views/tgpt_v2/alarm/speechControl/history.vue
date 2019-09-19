<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!-- 查询 -->
        <div class="search-box">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">设备号： {{searchParam.imei}} </label>
                </div>

                <!--<div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="请输入车牌号"></el-input>
                    </div>
                </div>-->
            </div>
            <div class="search-btn-list">
            </div>
        </div>
        <!-- 按钮 -->
        <div class="tool-box">
            <!--v-show="exportBtnShow"-->
            <div class="operation">
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
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
        <!-- 表格 table -->
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" :data="list" style="width: 100%" border>
                <el-table-column prop="imei" sortable label="设备IMEI号" min-width="140"></el-table-column>
                <el-table-column prop="plate" sortable label="车牌" min-width="100"></el-table-column>
                <el-table-column prop="vehicleModelInfoName" sortable label="车型" min-width="260"></el-table-column>
                <el-table-column prop="typeName" sortable label="操作类型" min-width="100"></el-table-column>
                <el-table-column prop="name" sortable label="参数名" min-width="200"></el-table-column>
                <el-table-column prop="data" sortable label="参数值" min-width="100"></el-table-column>
                <el-table-column prop="cmdName" sortable label="执行状态" min-width="120"></el-table-column>

                <el-table-column prop="responseTime" sortable label="响应时间" min-width="150"></el-table-column>
                <el-table-column prop="createTime" sortable label="创建时间" min-width="150"></el-table-column>
                <el-table-column prop="organizationName" sortable label="设备所属部门" min-width="120"></el-table-column>

            </el-table>

        </div>
    </div>
</template>


<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        name: "speechControlHistory",
        mixins: [tool],
        data() {
            return {
                show: true,
                showSearch: false,
                vehicleInfo: {},
                searchParam: {
                    imei:this.$route.params.id
                },
                id: this.$route.params.id,
                listUrl: 'obd/obdSpeechControl/history'
            }
        },
        methods: {
            resetList(){
                this.searchParam={
                    imei:this.id
                };
                this.handleCurrentChange(1);
            },
            getListAfter(){
                this.list.forEach((item) =>{
                    let name ='/'
                    let data ='/'
                    switch (item.type) {
                        case 68:
                        case 69:
                            break;
                        case 4:
                            name ="电话号码";
                            data = item.data;
                            break;
                        case 88041:
                        case 88040:
                            name ="录音时间,录音质量";
                            data = item.data;
                            console.log(data.lastIndexOf("&")+"*********"+data.length+"******"+data.substring(data.lastIndexOf("&"),data.length-1))
                            data=data.substr(6,data.length-1) ;
                            break;
                        default:
                    }
                    item.name=name;
                    item.data=data;
                })
            }
        },
        mounted() {
            this.getList();
        }

    }
</script>
