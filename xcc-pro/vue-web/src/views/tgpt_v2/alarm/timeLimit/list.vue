<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group">
                        <tree-select v-model="organization" placeholder="请选择服务组织" type="one" clearable
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="creatDate"
                            @change="creatDateChange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">时长范围</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.duration" clearable placeholder="请选择时长范围">
                            <el-option label="5分钟以下" :value="1"></el-option>
                            <el-option label="5到10分钟" :value="2"></el-option>
                            <el-option label="10分钟以上" :value="3"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">越界</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.violationMileage" clearable placeholder="请选择越界范围">
                            <el-option label="十公里以下" :value="1"></el-option>
                            <el-option label="十到三十公里" :value="2"></el-option>
                            <el-option label="三十公里以上" :value="3"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">驾驶员姓名</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.driveName" placeholder="驾驶员姓名" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="车牌" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">处理状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.dealerStatus" clearable placeholder="请选择处理状态">
                            <el-option label="已处理" :value="1"></el-option>
                            <el-option label="未处理" :value="0"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">车辆状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.vehicleStatus" clearable placeholder="请选择车辆状态">
                            <el-option label="未投入运营" :value="1"></el-option>
                            <el-option label="待租" :value="2"></el-option>
                            <el-option label="已租" :value="3"></el-option>
                            <el-option label="待处置" :value="7"></el-option>
                        </el-select>
                    </div>
                </div>

            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>

        <!-- 按钮 -->
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" size="mini"    @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button size="mini" v-show="exportBtnShow" @click="exportExcel()">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button v-show="showDetailBtn" type="text" @click="detail(scope.row.id)">行驶轨迹</el-button>
                        <el-button v-show="showDealBtn" v-if="scope.row.dealerStatus=='未处理'" type="text" @click="deal(scope.row.id)">处理</el-button>
                        <el-button v-if="scope.row.dealerStatus=='已处理'" type="text" @click="dealDetail(scope.row)">处理详情</el-button>
                       <!-- <el-button v-show="showDetailBtn" type="text" @click="detail2(scope.row.id)">查看行程</el-button>-->
                    </template>
                </el-table-column>

                <el-table-column  prop="vehicleStatusStr" sortable label="车辆状态" min-width="120"></el-table-column>
                <el-table-column min-width="140" label="车牌号" prop="plate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车型" prop="vehicleModelInfoName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="处理状态" prop="dealerStatus" sortable show-overflow-tooltip>
                    <!--<template slot-scope="scope">-->
                        <!--<a size="mini" v-if="scope.row.dealerStatus=='已处理'" @click="dealDetail(scope.row)">{{scope.row.dealerStatus}}</a>-->
                        <!--<span v-if="scope.row.dealerStatus=='未处理'">{{scope.row.dealerStatus}}</span>-->
                    <!--</template>-->
                </el-table-column>
                <el-table-column min-width="150" label="处理时间" prop="dealTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服务组织" prop="organizationId" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="资产属性" prop="typeAssets" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="开始时间" prop="startTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="结束时间" prop="endTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="违规时长" prop="timeduration" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="越界里程(km)" prop="mileage" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="驾驶员姓名" prop="driveName" sortable show-overflow-tooltip></el-table-column>

            </el-table>
        </div>

        <el-dialog title="时间栅栏处理" :visible.sync="dialogFormVisible">
            <el-form :model="dialogForm" ref="dialogForm" :rules="rules" >
                <el-form-item label="原因" prop="reason">
                    <el-input v-model="dialogForm.reason" maxlength="200" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="核实人姓名">
                    <el-input v-model="dialogForm.checker" maxlength="20" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="核实人电话">
                    <el-input v-model="dialogForm.checkerPhone" maxlength="20" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="核实人部门" >
                    <div class="input-group">
                        <tree-select v-model="checkerDept" placeholder="请选择部门" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                    </div>
                </el-form-item>
                <el-form-item label="备注信息"  >
                    <el-input v-model="dialogForm.remark" maxlength="100" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('dialogForm')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="处理详情" :visible.sync="dialogDealDetail">
            <div class="detail-panel" style="min-height: 0px; padding-top: 10px;">
                <div class="flex-panel detail-box">
                    <div class="detail-item" style="width: 50%">
                        <label class="control-label">原因</label>
                        <div class="input-group">
                            <span>{{dialogDealDetailData.reason}}</span>
                        </div>
                    </div>
                    <div class="detail-item" style="width: 50%">
                        <label class="control-label">核实人姓名</label>
                        <div class="input-group">
                            <span>{{dialogDealDetailData.checker}}</span>
                        </div>
                    </div>
                    <div class="detail-item" style="width: 50%">
                        <label class="control-label">核实人电话</label>
                        <div class="input-group">
                            <span>{{dialogDealDetailData.checkerPhone}}</span>
                        </div>
                    </div>
                    <div class="detail-item" style="width: 50%">
                        <label class="control-label">核实人部门</label>
                        <div class="input-group">
                            <span>{{dialogDealDetailData.checkerDept}}</span>
                        </div>
                    </div>
                    <div class="detail-item" style="width: 50%">
                        <label class="control-label">处理时间</label>
                        <div class="input-group">
                            <span>{{dialogDealDetailData.dealTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item" style="width: 50%">
                        <label class="control-label">处理人</label>
                        <div class="input-group">
                            <span>{{dialogDealDetailData.dealer}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
                <el-button type="primary" @click="dialogDealDetail = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'timeLimit',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                exportBtnShow: this.getCurrentUserAuthority("obdAlarmTimeLimit/exportExcel"),
                showDealBtn: this.getCurrentUserAuthority("obdAlarmTimeLimit/showDealBtn"),
                showDetailBtn: true,
                showSearch: false,
                organization:[],
                creatDate:[],
                searchParam: {
                },
                //    showExportExcelBtn: true,
                listUrl: 'obd//obdAlarmTimeLimit',

                dialogFormVisible: false,
                dialogForm: {
                    reason: "",
                    checker:  "",
                    checkerDept:  "",
                    checkerPhone:  "",
                },
                rules: {
                    reason: [{required: true, message: '请输入原因', trigger: 'change'}],
                    //checker: [{required: true, message: '请输入核实人姓名', trigger: 'change'}],
                    //checkerDept: [{required: true, message: '请选择核实人部门', trigger: 'change'}],
                    //checkerPhone: [{required: true, message: '请输入核实人电话', trigger: 'change'}],
                },
                checkerDept:[],
                dialogDealDetail: false,
                dialogDealDetailData: {}
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            var date = this.$route.query.date;
            var vehicleStatus = this.$route.query.vehicleStatus;
            var dealerStatus = this.$route.query.dealerStatus;
            if(dealerStatus){
                this.searchParam.dealerStatus = parseInt(dealerStatus);
            }
            if(vehicleStatus){
                this.searchParam.vehicleStatus = parseInt(vehicleStatus);
            }
            if(date){
                this.creatDate = [date,date];
                this.searchParam.startTime = date;
                this.searchParam.endTime = date;
            }
            this.searchParam = Object.assign({},this.searchParam);
            //this.getCreateDate();
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            resetList(){
                this.searchParam={};
                this.organization=[];
                this.creatDate=[];
                this.getList();
            },
            getListBefore(params) {
                if(this.creatDate && this.creatDate.length>0){
                    let creatDate = this.creatDate;
                    params.startTime = creatDate[0] + ' 00:00:00';
                    params.endTime = creatDate[1] + ' 23:59:59';
                }else{
                    params.startTime=null;
                    params.endTime=null;
                }
            },
            deal(id){
                this.dialogForm = {
                    reason: "",
                    checker:  "",
                    checkerDept:  "",
                    checkerPhone:  "",
                };
                if(this.$refs["dialogForm"]){
                    this.$refs["dialogForm"].clearValidate();
                }
                this.dialogFormVisible=true;
                this.dialogForm.id = id;
            },
            changeOrganization(data){
                if(this.checkerDept && this.checkerDept.length==1){
                    this.dialogForm.checkerDept = this.checkerDept[0];
                }else{
                    this.dialogForm.checkerDept = "";
                }
            },
            submitForm(form) {
                this.dialogForm.checkerDept = this.checkerDept[0];
                var data = this.dialogForm;
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }
                    ajax.post('obd/obdAlarmTimeLimit/deal', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.dialogFormVisible = false;
                            this.getList();
                        } else {
                            this.$message.error(rs.msg);
                        }
                    });
                });
            },
            dealDetail(data){
                this.dialogDealDetail = true;
                this.dialogDealDetailData = data;
            },
            exportExcel(){
                this.creatDateChange();
                window.location = this.exportUrl("obd/obdAlarmTimeLimit/excel?" + $.param(this.searchParam));
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organizationId=this.organization[0];
                }
            },
            creatDateChange() {

                if(this.creatDate && this.creatDate.length>0){
                    let creatDate = this.creatDate;
                    this.searchParam.startTime = creatDate[0] + ' 00:00:00';
                    this.searchParam.endTime = creatDate[1] + ' 23:59:59';
                }else{
                    delete this.searchParam.startTime;
                    delete this.searchParam.endTime;
                }
            },
            detail(id){
                let url=this.$route.fullPath;
                if (url.indexOf('?') > -1){
                    let nUrl = url.split('?');
                    this.$router.push({path:nUrl[0]+"/detail/"+id});
                }else{
                    this.$router.push({path:url+"/detail/"+id});
                }
            },
            detail2(id){
                let url=this.$route.fullPath;
                this.$router.push({path:url+"/detailRoute/"+id});
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
                this.searchParam.startTime = strSdate;
                this.searchParam.endTime = strEdate;
                this.creatDate = [strSdate, strEdate];
            }
        }
    }
</script>

