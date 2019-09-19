<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.publishStatus" clearable placeholder="请选择状态">
                            <el-option label="未发布" :value="0"></el-option>
                            <el-option label="待提交" :value="1"></el-option>
                            <el-option label="审批中" :value="2"></el-option>
                            <el-option label="驳回" :value="3"></el-option>
                            <el-option label="已发布" :value="4"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">创建时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="createDate"
                            @change="createDateChange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.title" clearable placeholder="请输入标题关键字查询"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
                <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <template v-if="scope.row.publishStatus==0">
                            <el-button v-show="showEditBtn" type="text" @click="publish(scope.row.id,scope.row.organizationId)">发布</el-button>
                            <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">编辑</el-button>
                        </template>
                        <template v-if="scope.row.publishStatus==1">
                            <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">编辑</el-button>
                            <el-button v-show="showEditBtn" type="text" @click="submitApproval(scope.row.id)">提交</el-button>
                        </template>
                        <template v-if="scope.row.publishStatus==3">
                            <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">编辑</el-button>
                        </template>
                        <template v-if="scope.row.publishStatus==4">
                            <el-button v-show="showEditBtn" type="text" @click="published(scope.row.id,scope.row.organizationId)">已发布司机</el-button>
                        </template>
                    </template>
                </el-table-column>

				<el-table-column min-width="140" label="标题" prop="title" sortable show-overflow-tooltip>
					<template slot-scope="scope">
						<a size="mini" @click="toDetail(scope.row)">{{scope.row.title}}</a>
					</template>
				</el-table-column>
                <el-table-column min-width="140" label="所属组织" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="创建人" prop="creater" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="创建时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="发布时间" prop="publishTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="阅读量" prop="pageViews" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="状态" prop="publishStatusName" sortable show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
        <driverListPanel ref="driverList" @load="loadList"></driverListPanel>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import driverListPanel from '@/views/tgpt_v2/appDriver/message/driverList'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'appDriverMessage',
        mixins: [tool],
        components: { TreeSelect,CitySelect,driverListPanel },
        data() {
            return {
                dialogDriver:false,
                createDate:[],
                searchParam: {},
                showEditBtn: this.getCurrentUserAuthority("appDriver/edit"),
                showAddBtn: this.getCurrentUserAuthority("appDriver/add"),
                showExportExcelBtn: this.getCurrentUserAuthority("appDriver/export"),
                listUrl: 'app/appDriverMessage/list'
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            loadList(){
              this.getList();
            },
            resetList(){
                this.searchParam={};
                this.createDate=[];
                this.getList();
            },
            createDateChange() {
                if(this.createDate && this.createDate.length>0){
                    let createDate = this.createDate;
                    this.searchParam.startCreateTime = createDate[0] + ' 00:00:00';
                    this.searchParam.endCreateTime = createDate[1] + ' 23:59:59';
                }else{
                    this.searchParam.startCreateTime="";
                    this.searchParam.endCreateTime="";
                }
            },
            publish(id,organizationId){//发布
                this.$refs.driverList.open(id,organizationId,true);
            },
            published(id,organizationId){//已发布司机
                this.$refs.driverList.open(id,organizationId,false);
            },
            submitApproval(id){
                let $this = this;
                $this.$confirm('是否确定提交审批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    startProcessAsync(id,'SJXX').then((message)=>{
                        this.getList();
                        if(message.status == 0){
                            this.showMessage(message.message,"success");
                        }else{
                            this.showMessage(message.message,"error");
                        }
                    });
                }).catch(() => {});
            },
            exportExcel() {
                window.location = this.exportUrl("app/appDriverMessage/export?" + $.param(this.searchParam));
            }
        }
    }
</script>

