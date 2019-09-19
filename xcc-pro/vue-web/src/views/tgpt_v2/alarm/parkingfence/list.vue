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
                    <label class="control-label">车辆状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.vehicleStatus" placeholder="请选择车辆状态" clearable>
                            <el-option label="未投入运营" value="1"></el-option>
                            <el-option label="待租" value="2"></el-option>
                            <el-option label="已租" value="3"></el-option>
                            <el-option label="待处置" value="7"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">处理状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.dealerStatus" clearable placeholder="请选择处理状态">
                            <el-option label="已处理" value="1"></el-option>
                            <el-option label="未处理" value="0"></el-option>
                        </el-select>
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

                <el-table-column fixed="left" label="详细信息" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" @click="detail(scope.row.id)">报警详情</el-button>
                        <!--<a size="mini" @click="detail(scope.row.id)">报警详情</a>-->
                        <el-button v-if="scope.row.dealerStatus=='未处理'" v-show="showDealBtn" type="text" @click="deal(scope.row.id)">处理</el-button>
                        <el-button v-if="scope.row.dealerStatus=='已处理'"  type="text" @click="dealDetail(scope.row)">处理详情</el-button>
                       <!-- <a size="mini" @click="toDetailTrip(scope.row)">查看行程</a>-->
                    </template>
                </el-table-column>
				<!--<el-table-column min-width="140" label="车牌" prop="plate" sortable show-overflow-tooltip>					<template slot-scope="scope">
						<a size="mini" @click="toDetail(scope.row)">{{scope.row.plate}}</a>
					</template></el-table-column>-->
                <el-table-column min-width="140" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车型" prop="carModel" sortable show-overflow-tooltip></el-table-column>
                <!--<el-table-column min-width="140" label="车辆状态" prop="vehicleStatusName" sortable show-overflow-tooltip></el-table-column>-->
                <el-table-column min-width="140" label="处理状态" prop="dealerStatus" sortable show-overflow-tooltip>
                    <!--<template slot-scope="scope">-->
                    <!--<a size="mini" v-if="scope.row.dealerStatus=='已处理'" @click="dealDetail(scope.row)">{{scope.row.dealerStatus}}</a>-->
                    <!--<span v-if="scope.row.dealerStatus=='未处理'">{{scope.row.dealerStatus}}</span>-->
                    <!--</template>-->
                </el-table-column>
                <el-table-column min-width="150" label="处理时间" prop="dealTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服务组织" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="资产属性" prop="assetsTypeName" sortable show-overflow-tooltip></el-table-column>
                <!--<el-table-column min-width="140" label="电子围栏名称" prop="" sortable show-overflow-tooltip></el-table-column>-->
				<el-table-column min-width="140" label="时间" prop="time" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="报警地址" prop="address" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="驾驶员" prop="name" sortable show-overflow-tooltip></el-table-column>


            </el-table>
        </div>

        <el-dialog title="停车围栏处理" :visible.sync="dialogFormVisible">
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
        name: 'parkingfence',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                searchParam: {
                },
                updateDate:[],
                organization:[],
                listUrl: 'obd/obdAlarmParkingFence',

                showExportExcelBtn: this.getCurrentUserAuthority("obdAlarmParkingFence/excel"),
                showDealBtn: this.getCurrentUserAuthority("obdAlarmParkingFence/deal"),
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
            if(date){
                this.updateDate = [date,date];
                this.searchParam.startUpdateTime = date;
                this.searchParam.endUpdateTime = date;
            }
            var vehicleStatus = this.$route.query.vehicleStatus;
            if(vehicleStatus){
                this.searchParam.vehicleStatus = vehicleStatus;
            }
            var dealerStatus = this.$route.query.dealerStatus;
            if(dealerStatus){
                this.searchParam.dealerStatus = dealerStatus;
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
                this.updateDate=[];
                this.getList();
            },
            getListBefore(params) {
                if(this.updateDate && this.updateDate.length>0){
                    let updateDate = this.updateDate;
                    params.startUpdateTime = updateDate[0] + ' 00:00:00';
                    params.endUpdateTime = updateDate[1] + ' 23:59:59';
                }else{
                    params.startUpdateTime=null;
                    params.endUpdateTime=null;
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
            submitForm(form) {
                this.dialogForm.checkerDept = this.checkerDept[0];
                var data = this.dialogForm;
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }
                    ajax.post('obd/obdAlarmParkingFence/deal', data).then(rs => {
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
            exportExcel() {
                this.updateDateChange();
                window.location = this.exportUrl("obd/obdAlarmParkingFence/excel?" + $.param(this.searchParam));
            },
            updateDateChange() {
                if(this.updateDate && this.updateDate.length>0){
                    let updateDate = this.updateDate;
                    this.searchParam.startUpdateTime = updateDate[0] + ' 00:00:00';
                    this.searchParam.endUpdateTime = updateDate[1] + ' 23:59:59';
                }else{
                    delete this.searchParam.startUpdateTime;
                    delete this.searchParam.endUpdateTime;
                }
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1)
                    this.searchParam.organizationId=this.organization[0];
            },
            toDetailTrip(row) {
                let url = this.$route.fullPath + '/detailtrip/' + row.id;
                this.$router.push({path:url});
            },
            detail(id){
                let url=this.$route.fullPath;
                if (url.indexOf('?') > -1){
                    let nUrl = url.split('?');
                    this.$router.push({path:nUrl[0]+"/detail/"+id});
                }else{
                    this.$router.push({path:url+"/detail/"+id});
                }
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

