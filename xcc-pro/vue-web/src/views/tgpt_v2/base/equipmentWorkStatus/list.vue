<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">产品型号</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.equipmentModalId" clearable placeholder="全部">
                            <el-option v-for="item in equipmentModalIdList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择服务组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.attributionRegionId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">设备状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.workStatus" clearable placeholder="全部">
                            <el-option label="在线" value="1"></el-option>
                            <el-option label="停止" value="2"></el-option>
                            <el-option label="离线" value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <!--<div class="form-group">
                    <label class="control-label">离线时长</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.offlineTimeStatus" clearable placeholder="全部">
                            <el-option label="小于1天" value="7"></el-option>
                            <el-option label="大于1天" value="8"></el-option>
                            <el-option label="大于2天" value="9"></el-option>
                            <el-option label="大于3天" value="10"></el-option>
                            <el-option label="大于4天" value="11"></el-option>
                            <el-option label="大于5天" value="12"></el-option>
                            <el-option label="大于6天" value="13"></el-option>
                            <el-option label="大于7天" value="14"></el-option>
                        </el-select>
                    </div>
                </div>-->
                <!--<div class="form-group">
                    <label class="control-label">服役状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.serviceStatus" clearable placeholder="全部">
                            <el-option label="未投入运营" value="1"></el-option>
                            <el-option label="待租" value="2"></el-option>
                            <el-option label="已租" value="3"></el-option>
                            <el-option label="保养" value="4"></el-option>
                            <el-option label="维修" value="5"></el-option>
                            <el-option label="退出运营" value="6"></el-option>
                        </el-select>
                    </div>
                </div>-->
                <!--<div class="form-group">
                    <label class="control-label">时间范围</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="createDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>-->
                <div class="form-group">
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.keyWord" clearable placeholder="车牌、IMEI"></el-input>
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
            <el-table  :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="190">
                    <template slot-scope="scope">
                        <!--<el-button v-show="showEditBtn" type="text" @click="editSim(scope.row)">手机卡变更</el-button>
                        <el-button v-show="showSimDetailBtn" type="text" @click="viewSimDetail(scope.row)">手机卡绑定记录</el-button>-->
                        <el-button v-show="showEditBtn" type="text" @click="commandLoglist(scope.row.imei)">指令日志</el-button>
                    </template>
                </el-table-column>

                <el-table-column min-width="120" label="车牌" prop="plate" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!--<a size="mini" @click="toDetail(scope.row)">{{scope.row.plate}}</a>-->
                        {{scope.row.plate}}
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label="服务组织" prop="serviceRegionName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="所属组织" prop="attributionRegionName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="IMEI" prop="imei" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.imei}}
                    </template>
                </el-table-column>
                <el-table-column min-width="120" label="产品型号" prop="equipmentModalName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="手机号码" prop="phone" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="费用到期时间" prop="validity" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="设备状态" prop="workStatusText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="142" label="离线时间" prop="localtionTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="离线时长" prop="offlineTimeSpan" sortable show-overflow-tooltip></el-table-column>
            </el-table>
        </div>

        <!-- 手机卡变更弹窗 -->
        <el-dialog title="手机卡变更" class="import-box" :visible.sync="editVisible" :append-to-body="true" width="440px" :close-on-click-modal="false">
            <div class="form-panel">
                <el-form :model="editSimForm" :rules="rules" label-position="top" ref="editSimForm">
                    <div class="flex-panel">
                        <el-form-item label="原手机号" prop="oldPhone" style="width: 400px;">
                            <el-input v-model="editSimForm.oldPhone" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="变更为:" prop="simId" style="width: 400px;" :rules="rules.required('请选择')">
                            <!--<el-form-item label="变更为:" prop="simId" style="width: 400px;">-->
                            <el-select v-model="editSimForm.simId" filterable clearable placeholder="请选择">
                                <el-option v-for="item in phoneList" :key="item.id"
                                           :label="item.phone" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="变更说明:" prop="summary" style="width: 400px;">
                            <el-input type="textarea" v-model="editSimForm.summary" placeholder="" maxlength="50" clearable></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('editSimForm')">保存</el-button>
                <el-button @click="editVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool,ruleTool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'equipmentWorkStatus',
        mixins: [tool,ruleTool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                showExportExcelBtn: this.getCurrentUserAuthority('equipmentWorkStatus/export'),
                showEditBtn: this.getCurrentUserAuthority('equipmentWorkStatus/edit'),
                showSimDetailBtn: this.getCurrentUserAuthority('equipmentWorkStatus/simdetail'),
                listUrl: 'base/equipmentWorkStatus/list',
                equipmentModalIdList: [],
                phoneList: [],
                editVisible: false,
                editSimForm:{},
                createDate: '',
                organization:[],
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            this.selectModalId();
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            getListBefore(params){
                if (this.createDate) {
                    params.startTime = this.createDate[0];
                    params.endTime = this.createDate[1];
                }
            },
            //重置筛选
            resetList() {
                this.searchParam = {};
                this.$set(this.searchParam,'organCascade',false);
                this.organization=[];
                this.createDate = "";
                this.handleCurrentChange(1);
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.attributionRegionId=this.organization[0];
                }else{
                    this.searchParam.attributionRegionId='';
                    this.$set(this.searchParam,'organCascade',false);
                }
            },
            //手机卡绑定记录
            viewSimDetail(row) {
                this.$router.push({path:"/tgpt_v2/base/equipmentWorkStatus/simdetail/"+row.id});
            },
            selectModalId() {
                var $this = this;
                ajax.get("base/baseEquipmentModal/type?type=1,2&time=" + new Date().getTime()).then(result => {
                    if (result.status  == 0) {
                        $this.equipmentModalIdList = result.data;
                    } else {
                        $this.equipmentModalIdList = [];
                    }
                });
            },
            /*查看指令详情*/
            commandLoglist(deviceId){
                let url='./equipment/commandLoglist/'+deviceId;
                this.$router.push({path:url});
            },

            selectPhones() {
                var $this = this;
                ajax.get("base/equipmentWorkStatus/simList?time=" + new Date().getTime()).then(result => {
                    if (result.length > 0) {
                        $this.phoneList = result;
                    } else {
                        $this.phoneList = [];
                    }
                });
            },
            editSim(row) {

                this.editVisible = true;
                this.editSimForm = {
                    oldPhone: row.phone,
                    equipmentId: row.id
                }
                // this.editSimForm.oldPhone = row.phone;
                // this.editSimForm.equipmentId = row.id;
                this.selectPhones();

                this.$nextTick(_=>{
                    if(this.$refs["editSimForm"]){
                        this.$refs["editSimForm"].clearValidate();
                    }
                });

            },
            submitForm(editSimForm) {
                var $this = this;
                $this.$refs[editSimForm].validate((valid) => {
                    if (valid) {
                        var url = "base/equipmentWorkStatus/eidtSim";
                        ajax.post(url, $this.editSimForm).then(res => {
                            if(res.status == 0){
                                $this.$message({message: '保存成功',type: 'success'});
                                this.editVisible = false;
                                this.getList();
                            }else {
                                $this.$message.error(res.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            // 设备指令详情
            imeiDetail(imei) {
                this.$router.push({path:"/tgpt_v2/base/equipmentWorkStatus/imeidetail/"+imei});
            },
            exportExcel() {
                window.location = this.exportUrl("base/equipmentWorkStatus/excel?" + $.param(this.searchParam));
            }
        }
    }
</script>

