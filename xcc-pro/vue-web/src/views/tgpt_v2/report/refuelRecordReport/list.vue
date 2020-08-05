<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <!-- 查询 -->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">月份</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="createDate"
                            @change="chooseTime"
                            type="monthrange"
                            range-separator="至"
                            start-placeholder="开始月份"
                            end-placeholder="结束月份"
                            value-format="yyyy-MM">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆属性</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.assetsType" placeholder="不限" clearable>
                            <el-option label="自有车辆" value="1"></el-option>
                            <el-option label="租赁车辆" value="2"></el-option>
                            <el-option label="挂靠车辆" value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organizations" placeholder="请选择所属组织" type="one" clearable
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <!--<el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.companyId">子组织</el-checkbox>-->
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">油费承担</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.oilFeePaymenModel" placeholder="不限" clearable>
                            <el-option label="包油" value="1"></el-option>
                            <el-option label="里程内包油" value="2"></el-option>
                            <el-option label="不包" value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="请输入车牌" clearable />
                    </div>
                </div>
               <!-- <div class="form-group">
                    <label class="control-label">品牌</label>
                    <div class="input-group">
                        <el-input placeholder="请输入品牌" clearable v-model="searchParam.brand" />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车系</label>
                    <div class="input-group">
                        <el-input placeholder="请输入系列名称" clearable v-model="searchParam.name" />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆里程</label>
                    <el-input placeholder="请输入内容" v-model="searchParam.statrtMileage">
                    </el-input>
                    <label class="control-label">到</label>
                    <el-input placeholder="请输入内容" v-model="searchParam.endMileage">
                    </el-input>
                    <label class="control-label">(km)</label>
                </div>-->

                <!--&lt;!&ndash;<div class="form-group">-->
                    <!--<label class="control-label "></label>-->
                        <!--<div class="input-group date-picker input-daterange">-->
                            <!--<input type="text" class="form-control " name="txtStartOilMass" id="txtStartOilMass" disabled="disabled">-->
                            <!--<span class="input-group-addon">至</span>-->
                            <!--<input type="text" class="form-control" name="txtEndOilMass" id="txtEndOilMass" disabled="disabled" />-->
                        <!--</div>-->
                <!--</div>&ndash;&gt;-->
                <!--<div class="form-group">-->
                    <!--<label class="control-label ">加油总金额</label>-->
                        <!--<el-input placeholder="请输入内容" v-model="searchParam.txtStartTolMoney">-->
                        <!--</el-input>-->
                        <!--<label class="control-label">到</label>-->
                        <!--<el-input placeholder="请输入内容" v-model="searchParam.txtEndTolMoney">-->
                        <!--</el-input>-->
                        <!--<label class="control-label">（元）</label>-->
                <!--</div>-->

                </div>

             <div class="search-btn-list">
                <i class="el-icon-d-arrow-right" @click="showSearch=!showSearch"></i>
                <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>
        </div>
        <!-- 按钮 -->
        <div class="tool-box">
            <el-button size="mini" v-show="exportBtnShow" @click="exportExcel()">导出</el-button>
        </div>
        <!-- 表格 table -->
        <div class="table-box">
            <el-table v-loading="listLoading" :data="list" style="width: 100%" border>
                <el-table-column prop="plate" sortable label="车牌" min-width="120"></el-table-column>
                <el-table-column prop="assetsType" sortable label="车辆所属" min-width="120"></el-table-column>
                <el-table-column prop="company" sortable label="所属组织" min-width="120"></el-table-column>
                <el-table-column prop="vehicleModelInfoName" sortable label="车型" min-width="120"></el-table-column>
                <el-table-column prop="oilFeePaymenModel" sortable label="油费承担" min-width="120"></el-table-column>
                <el-table-column prop="fuelType" sortable label="燃油类型" min-width="120"></el-table-column>
                <el-table-column prop="obdOil" sortable label="OBD耗油量" min-width="120"></el-table-column>
                <el-table-column prop="oilCapacity" sortable label="登记加油量" min-width="120"></el-table-column>
                <el-table-column prop="gapValue" sortable label="误差值" min-width="120"></el-table-column>
                <el-table-column prop="oilCost" sortable label="加油总金额" min-width="120"></el-table-column>
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
        </div>
    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import TreeSelect from '@/components/TreeSelect/index'
    import {startProcessAsync, number_format} from '@/utils/index'
    import $ from 'jquery-slim'
    import MoneyInput from '@/components/MoneyInput/index'

    export default {
        name: "refuelRecordReport",
        mixins: [tool],
        components: {TreeSelect, MoneyInput},
        data: function () {
            //let searchParam = {};
            return {
                showSearch:false,
                exportBtnShow: this.getCurrentUserAuthority("refuelRecordReport/export"),
                currentUserInfo: this.getCurrentUserInfo().organizationList,
                listUrl: "report/refuelRecordReport/list",
                companyIds: "",
                dialogForm: {},
                createDate:[],
                searchParam: {
                    organization: '',
                    /*txtStartTolMoney:{},
                    txtEndTolMoney:{},
                    oilFeePaymenModel:[],
                    plate:[],
                    brand:[],
                    name:[],
                    statrtMileage:[],
                    endMileage:[],
                    assetsType:[],*/
                },
                organizations: '',
            }
        },
        activated() {
            this.getList();
        },
        mounted: function () {
            this.getCreateDate();
            if (!this.$store.state.isInit) {
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            resetList() {
                this.searchParam = {};
                this.companyIds = "";
                this.getCreateDate();
                this.organizations = "";
                this.txtStartTolMoney="";
                this.txtEndTolMoney="";
                this.oilFeePaymenModel="";
                this.plate="";
                this.brand= "";
                this.name="";
                this.statrtMileage="";
                this.endMileage="";
                this.assetsType="";

                this.getList();
            },
            changeOrganization(data) {
                if (this.organizations && this.organizations.length == 1) {
                    this.searchParam.organizationId = this.organizations[0];
                }
            },
            getCreateDate() {
                let eDate = new Date();
                let strEdate = eDate.format("yyyy-MM")
                let sDate = new Date();
                sDate.setMonth(eDate.getMonth()-1)-1;
                let yy1 = sDate.getFullYear();
                let mm1 = sDate.getMonth()+1;
                let strSdate;
                strSdate=yy1 + '-' + mm1;
                strEdate=strSdate;
                this.searchParam.startTime = strSdate;
                this.searchParam.endTime = strEdate;
                this.createDate = [strSdate, strEdate];
             },
            chooseTime(){
                if(this.createDate.length > 0){
                    this.searchParam.startTime = this.createDate[0] ;
                    this.searchParam.endTime = this.createDate[1];
                }else{
                    this.searchParam.startTime = '';
                    this.searchParam.endTime = '';
                }
            },
            exportExcel() {
                window.location = this.exportUrl("report/refuelRecordReport/export?" + $.param(this.searchParam));
            },


        }
    }
</script>

<style scoped>

</style>
