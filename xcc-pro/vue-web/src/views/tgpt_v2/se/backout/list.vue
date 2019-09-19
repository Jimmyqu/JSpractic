<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group">
                        <tree-select v-model="orgIds" placeholder="请选择" type="one"
                            @change="chooseOrgId" url="admin/organization/tree"></tree-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.code" placeholder="车牌、IMEI" clearable />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">拆机原因</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.reason" placeholder="请选择拆机原因">
                            <el-option label="正常拆机" :value="1"></el-option>
                            <el-option label="非法拆机" :value="2"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">核实状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.dealStatus" placeholder="请选择核实状态">
                            <el-option label="未核实" :value="1"></el-option>
                            <el-option label="已核实" :value="2"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">核实人</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.operator" placeholder="核实人" clearable />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group" style="width: 300px;">
                        <el-date-picker
                            v-model="createDate"
                            @change="chooseTime"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
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
                <el-table-column fixed="left" label="操作" min-width="200">
                    <template slot-scope="scope">
                        <el-button v-show="!scope.row.reason" @click="verify(scope.row.id)" type="text" size="small">核实</el-button>
                        <el-button @click="toDetail(scope.row)" type="text" size="small">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="产生时间" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column prop="imei" label="IMEI" min-width="120" ></el-table-column>
                <el-table-column prop="plate" label="车牌" min-width="100"></el-table-column>
                <el-table-column prop="organization" label="服务组织" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="modeName" label="车型" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="power" label="电池电量(%)" min-width="105" ></el-table-column>
                <!--<el-table-column prop="networkSignal" label="通讯信号" min-width="80"></el-table-column>-->
                <el-table-column prop="phone" label="通讯卡号" min-width="120" ></el-table-column>
                <el-table-column prop="dealStatus" label="核实状态" min-width="80"></el-table-column>
                <el-table-column prop="operator" label="核实人" min-width="80"></el-table-column>
                <el-table-column prop="operatorDept" label="核实人部门" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="operaTtime" label="核实时间" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="reason" label="拆机原因" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="localtion" label="位置" min-width="100" show-overflow-tooltip></el-table-column>
            </el-table>
        </div>


        <!-- 核实弹窗 -->
        <el-dialog title="拆机报警核实" class="import-box" :visible.sync="editVisible" width="400px">
            <el-form :model="saveBackout" :rules="rules" label-position="left" ref="saveBackout">
                <div class="flex-panel  el-dialog-div">
                    <el-form-item label="核实人" prop="operator" style="width: 400px;">
                        <el-input v-model="saveBackout.operator" clearable placeholder="核实人"></el-input>
                    </el-form-item>
                    <el-form-item label="核实人部门" prop="operatorDept" style="width: 400px;">
                        <div class="input-group">
                            <tree-select v-model="operatorDept" placeholder="请选择部门" type="one"
                                         url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="拆机原因" prop="reason" style="width: 400px;">
                        <el-select v-model="saveBackout.reason" placeholder="请选择拆机原因">
                            <el-option label="正常拆机" value="1"></el-option>
                            <el-option label="非法拆机" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注信息" prop="remark" style="width: 400px;">
                        <el-input type="textarea" v-model="saveBackout.remarks" placeholder="备注信息在200字以内" maxlength="150" clearable></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" @click="editVisible = false">关闭</el-button>
                <el-button size="medium" type="primary" @click="submitForm('saveBackout')">保存</el-button>
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
        name: 'backout',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                searchParam: {equipmentModal:[]},
                showEditBtn: true,
                showAddBtn: false,
                showExportExcelBtn: this.getCurrentUserAuthority('backout/export'),
                options: [],
                listUrl: 'obd/obdAlarmBackout/list',
                editVisible: false,
                saveBackout: {
                    id: '',
                    operatorDept:''
                },
                returnForm: {},
                options4: [],
                orgIds: [],
                createDate:[],
                operatorDept:[],
                rules: {
                    reason: [
                        { required: true, message: '请选择拆机原因', trigger: 'change' }
                    ],
                    operatorDept: [{required: true, message: '请选择核实人部门', trigger: 'change'}],
                    operator: [{required: true, message: '请输入核实人姓名', trigger: 'change'}],
                }
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            let dealStatus=this.$route.query.dealStatus;
            if(dealStatus){
                this.searchParam.dealStatus=parseInt(dealStatus);
            }else{
                this.getCreateDate();
            }
            this.getList();
            ajax.get('obd/obdAlarmPower/getEquipmentModal').then(rs => {
                if(rs && rs.length > 0){
                    this.options = rs;
                }
            });
        },
        methods: {
            verify(id) {
                this.saveBackout.id = id;
                this.editVisible = true;
            },
            remoteMethod(plateKeyWord) {
                if (plateKeyWord !== '') {
                    ajax.get('obd/obdAlarmBackout/getUser?name=' + plateKeyWord).then(rs => {
                        if(rs && rs.length > 0){
                            setTimeout(() => {
                                this.options4 = rs;
                            }, 200);
                        }
                    })

                } else {
                    this.options4 = [];
                }
            },
            submitForm(saveBackout){
                var $this = this;
                $this.$refs[saveBackout].validate((valid) => {
                    if (valid) {
                        var url = "obd/obdAlarmBackout/verify";
                        ajax.post(url, $this.saveBackout).then(res => {
                            debugger
                            if(res && res.data > 0){
                                $this.$message({message: '保存成功',type: 'success'});
                                this.editVisible = false;
                                this.getList();
                            }else {
                                $this.$message.error('保存失败');
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            getListBefore(params) {
                if(this.createDate && this.createDate.length > 0){
                    params.startTime = this.createDate[0] + ' 00:00:00';
                    params.endTime = this.createDate[1] + ' 23:59:59';
                }else{
                    params.startTime = '';
                    params.endTime = '';
                }
            },
            changeOrganization(data){
                if(this.operatorDept && this.operatorDept.length==1){
                    this.saveBackout.operatorDept = this.operatorDept[0];
                }else{
                    this.saveBackout.operatorDept = "";
                }
                console.log( this.saveBackout.operatorDept);
            },

             /*选择用户组织*/
            chooseOrgId(){
                if(this.orgIds && this.orgIds.length > 0){
                    this.searchParam.organizationId = this.orgIds[0];
                }else{
                    this.searchParam.organizationId = null;
                }
            },
            /*选择时间*/
            chooseTime(){
                if(this.createDate && this.createDate.length > 0){
                    this.searchParam.startTime = this.createDate[0] + ' 00:00:00';
                    this.searchParam.endTime = this.createDate[1] + ' 23:59:59';
                }else{
                    this.searchParam.startTime = '';
                    this.searchParam.endTime = '';
                }
            },
            /*重置*/
            resetList(){
                this.orgIds = [];
                this.createDate = [];
                this.searchParam = {};
                this.getCreateDate();
                this.getList();
                this.handleCurrentChange(1);
            },
            getCreateDate(){
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
                this.createDate = [strSdate, strEdate];
            },
            exportExcel() {
                var params= this.searchParam;
                if (this.orgIds && this.orgIds.length>=1){
                    params.organizationId = this.orgIds[0];
                }
                if(this.createDate && this.createDate.length > 1){
                    params.startTime = this.createDate[0];
                    params.endTime = this.createDate[1];
                }
                window.location = this.exportUrl("obd/obdAlarmBackout/excel?" + $.param(this.searchParam));
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-dialog-div{
        height: 45vh;
        overflow: auto;
    }

</style>


