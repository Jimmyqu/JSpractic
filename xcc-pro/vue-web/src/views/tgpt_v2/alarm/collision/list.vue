<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one" clearable
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">报警日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="updateDate"
                            @change="updateDateChange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="车牌" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">驾驶员</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.name" placeholder="驾驶员" clearable></el-input>
                    </div>
                </div>


            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>

        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">


                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">事故报告</a>
                        <a size="mini" @click="toDetailTrip(scope.row)">查看行程</a>
                    </template>
                </el-table-column>

				<el-table-column min-width="140" label="车牌" prop="plate" sortable show-overflow-tooltip>					<template slot-scope="scope">
						<a size="mini" @click="toDetail(scope.row)">{{scope.row.plate}}</a>
					</template></el-table-column>
                <el-table-column min-width="140" label="车型" prop="carModel" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服务组织" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="资产属性" prop="assetsTypeName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="报警时间" prop="alarmTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="碰撞力" prop="collisionForce" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="报警地点" prop="address" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="驾驶员" prop="name" sortable show-overflow-tooltip></el-table-column>



            </el-table>
        </div>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'collision',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                searchParam: {
                },
                updateDate:[],
                organization:[],
                listUrl: 'obd//obdAlarmCollision'
            }
        },


        activated(){
            this.getList();
        },
        mounted() {
            this.getCreateDate();
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            resetList(){
                this.searchParam={};
                this.organization=[];
                this.updateDate=[];
                this.getCreateDate();
                this.getList();
            },
            getListBefore(params) {
                if(this.updateDate && this.updateDate.length>0){
                    let updateDate = this.updateDate;
                    params.startUpdateTime = updateDate[0] + ' 00:00:00';
                    params.endUpdateTime = updateDate[1] + ' 23:59:59';
                }else{
                    params.startUpdateTime="";
                    params.endUpdateTime="";
                }
            },
            exportExcel() {
                if(this.updateDate && this.updateDate.length>0){
                    let updateDate = this.updateDate;
                    this.searchParam.startUpdateTime = updateDate[0] + ' 00:00:00';
                    this.searchParam.endUpdateTime = updateDate[1] + ' 23:59:59';
                }else{
                    this.searchParam.startUpdateTime="";
                    this.searchParam.endUpdateTime="";
                }
                window.location = this.exportUrl("obd//obdAlarmCollision//excel?" + $.param(this.searchParam));
            },
            updateDateChange() {
                if(this.updateDate && this.updateDate.length>0){
                    let updateDate = this.updateDate;
                    this.searchParam.startUpdateTime = updateDate[0] + ' 00:00:00';
                    this.searchParam.endUpdateTime = updateDate[1] + ' 23:59:59';
                }else{
                    this.searchParam.startUpdateTime="";
                    this.searchParam.endUpdateTime="";
                }
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1)
                    this.searchParam.organizationId=this.organization[0];
            },
            toDetailTrip(row) {
                if(~this.$route.fullPath.indexOf("/detailtrip/")){
                    return;
                }
                let url = this.$route.fullPath + '/detailtrip/' + row.id;
                this.$router.push({path:url});
            }, getCreateDate(){
                let eDate = new Date();
                let strEdate = eDate.format("yyyy-MM-dd")
                let strSdate;
                let sDate = new Date();
                sDate.setDate(eDate.getDate()-7);
                let yy1 = sDate.getFullYear();
                let mm1 = sDate.getMonth()+1;
                let dd1 = sDate.getDate();
                if(dd1 == '00'){
                    mm1 = parseInt(mm1)-1;
                    let new_date = new Date(yy1,mm1,1);
                    dd1 = (new Date(new_date.getTime()-1000*60*60*24)).getDate()
                }
                if (mm1 < 10 ) {
                    mm1 = '0' + mm1;
                }
                if (dd1 < 10) {
                    dd1 = '0' + dd1;
                }
                strSdate = yy1 + '-' + mm1 + '-' + dd1;
                this.searchParam.startUpdateTime = strSdate;
                this.searchParam.endUpdateTime = strEdate;
                this.updateDate = [strSdate, strEdate];
            }

        }
    }
</script>

