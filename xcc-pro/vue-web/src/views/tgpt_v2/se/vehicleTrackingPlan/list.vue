<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group">
                        <el-date-picker
                            @change="choseTime()"
                            v-model="searchParam.time"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始时间起"
                            end-placeholder="开始时间止"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.keyword" placeholder="车牌 , IMEI"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">产品型号</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.equModalId" placeholder="请选择">
                            <el-option
                                v-for="item in equModals"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                                >
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-d-arrow-right" @click="showSearch=!showSearch"></i>
                <el-button type="primary" size="small" @click="getList()">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>
        </div>
        <div class="tool-box">
            <!--<el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">启用自动刷新</el-button>-->
            <el-button v-show="showAddBtn" type="warning" size="mini" @click="dialogVisible = true">添加跟踪计划</el-button>
        </div>

        <el-tabs v-model="searchParam.status" @tab-click="changeTable" >
            <el-tab-pane label="未完成" name="1">
                <div class="table-box">
                    <el-table v-loading="listLoading"border :data="list" style="width: 100%">
                        <el-table-column fixed="left" label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button v-show="showEditBtn" type="text" @click="exit(scope.row)">取消</el-button>
                                <el-button v-show="showEditBtn" type="text" @click="tailAfter(scope.row)" v-if="scope.row.operateStatus == 4">跟踪</el-button>
                                <el-button v-show="showEditBtn" type="text" @click="edit(scope.row)">延长</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="140" label="IMEI" prop="imei" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="车牌" sortable show-overflow-tooltip>
                            <template slot-scope="scope">
                                <el-tooltip  placement="top" effect="light">
                                    <div slot="content">
                                        <p>车牌：{{scope.row.plate}}</p>
                                        <p>
                                            <span v-show="scope.row.assetsType == 1">车辆属性：自有</span>
                                            <span v-show="scope.row.assetsType == 2">车辆属性：租赁</span>
                                            <span v-show="scope.row.assetsType == 3">车辆属性：挂靠</span>
                                            <span style="margin-left: 10px;">驾驶员：{{scope.row.driverName ? scope.row.driverName : '未绑定'}}</span>
                                        </p>
                                        <p>车型: {{scope.row.vehicleModelInfoName}}</p>
                                        <p>所属部门: {{scope.row.accessName}}</p>
                                        <el-button type="text" style="float: right">查看更多</el-button>
                                    </div>
                                    <el-button type="text">{{scope.row.plate}}</el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="140" label="车型" prop="vhModal" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="所属部门" prop="companyName" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="开始时间" prop="startTime" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="开始时刻" prop="startMoment" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="持续时长(分钟)" prop="duration" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="上报间隔(秒)" prop="reportingInterval" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="状态"  sortable show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="scope.row.operateStatus == 1">新增</span>
                                <span v-if="scope.row.operateStatus == 2">发送成功</span>
                                <span v-if="scope.row.operateStatus == 2">发送失败</span>
                                <span v-if="scope.row.operateStatus == 2">执行中</span>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="140" label="用户下发时间" prop="sendTime" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="下发人" prop="creater" sortable show-overflow-tooltip></el-table-column>
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
            </el-tab-pane>
            <el-tab-pane label="已完成" name="2">
                <div class="table-box">
                    <el-table v-loading="listLoading"border :data="list" style="width: 100%">
                        <el-table-column fixed="left" label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button v-show="showEditBtn" type="text" @click="check(scope.row)">查看</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="140" label="IMEI" prop="imei" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="车牌" sortable show-overflow-tooltip>
                            <template slot-scope="scope">
                                <el-tooltip  placement="top" effect="light">
                                    <div slot="content">
                                        <p>车牌：{{scope.row.plate}}</p>
                                        <p>
                                            <span v-show="scope.row.assetsType == 1">车辆属性：自有</span>
                                            <span v-show="scope.row.assetsType == 2">车辆属性：租赁</span>
                                            <span v-show="scope.row.assetsType == 3">车辆属性：挂靠</span>
                                            <span style="margin-left: 10px;">驾驶员：{{scope.row.driverName ? scope.row.driverName : '未绑定'}}</span>
                                        </p>
                                        <p>车型: {{scope.row.vehicleModelInfoName}}</p>
                                        <p>所属部门: {{scope.row.accessName}}</p>
                                        <el-button type="text" style="float: right">查看更多</el-button>
                                    </div>
                                    <el-button type="text">{{scope.row.plate}}</el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="140" label="车型" prop="vhModal" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="所属部门" prop="companyName" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="开始时间" prop="startTime" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="开始时刻" prop="startMoment" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="持续时长(分钟)" prop="duration" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="上报间隔(秒)" prop="reportingInterval" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="状态" prop="operateStatus" sortable show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="scope.row.operateStatus == 5">已完成</span>
                                <span v-if="scope.row.operateStatus == 6">已取消</span>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="140" label="用户下发时间" prop="sendTime" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="下发人" prop="creater" sortable show-overflow-tooltip></el-table-column>
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
            </el-tab-pane>
        </el-tabs>


        <el-dialog
            title="添加跟踪计划"
            :visible.sync="dialogVisible"
            width="30%"
            >
            <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                <el-form-item label="车牌/IMEI" required prop="imei">
                    <el-autocomplete style="width: 100%"
                        v-model="form.imei"
                        :fetch-suggestions="querySearchAsync"
                                     @select="selectPlate"
                        placeholder="请输入车牌"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="开始时刻" required prop="startMoment">
                    <el-time-select
                        v-model="form.startMoment"
                        format="HH:mm"
                        placeholder="选择开始时刻">
                    </el-time-select>
                </el-form-item>
                <el-form-item label="持续时长(分钟)" required  prop="duration">
                    <el-input v-model="form.duration"></el-input>
                </el-form-item>
                <el-form-item label="上报间隔（秒）" required prop="reportingInterval">
                    <el-input v-model="form.reportingInterval"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="subForm()">确 定</el-button>
          </span>
        </el-dialog>


    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {formRule} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'vehicleTrackingPlan',
        mixins: [tool],
        components: { TreeSelect,formRule},
        data() {
            return {
                showSearch: false,
                searchParam: {
                    status: "1"
                },
                showEditBtn: this.getCurrentUserAuthority('vehicleTrackingPlan/detail'),
                showAddBtn: this.getCurrentUserAuthority('vehicleTrackingPlan/add'),
                showExportExcelBtn: true,
                listUrl: 'se/seTrackingPlan',
                /*设备类型*/
                equModals: [],
                /*是否显示弹出框*/
                dialogVisible: false,
                /*新增提交的表单*/
                form:{duration: 5 , reportingInterval: 10},
                /*表单校验规则*/
                rules:{
                    imei : [{ required: true, message: '请选择imei', trigger: 'blur' }],
                    startMoment: [{ required: true, message: '请选择开始时刻', trigger: 'blur' }],
                    duration: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
                    reportingInterval: [{ required: true, message: '请选择上报间隔', trigger: 'blur' }]
                },
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            this.getList();
            this.getSeModalList();
        },
        methods: {
            /*选择时间*/
            choseTime(){
                const time = this.searchParam.time;
                if(time){
                    this.searchParam.startTimeBegin = time[0] + ' 00:00:00'
                    this.searchParam.startTimeEnd = time[1] + ' 59:59:59'
                }else{
                    this.searchParam.startTimeBegin = null;
                    this.searchParam.startTimeEnd = null;
                }
            },

            /*切换table*/
            changeTable(table){
                this.searchParam.status = table.name;
                this.getList();
            },

            /*获取沉默鹰设备类型*/
            getSeModalList(){
                //状态4表示为沉默鹰设备
                ajax.get('base/baseEquipmentModal/type?type=4').then(res => {
                    if(res.status == 0){
                        this.equModals = res.data;
                    }
                },error => {
                    this.showMessage('获取沉默鹰设备类型失败');
                });
            },

            /*远程搜索车牌显示*/
            querySearchAsync(queryString, cb){
                if(queryString && queryString.length > 3 && queryString.length< 15){
                    /*远程根据车牌或者imei搜索*/
                    ajax.get(`base/baseEquipment/plateorimei?keyword=${queryString}`).then(res => {
                        if(res && res.length > 0){
                            let result = [];
                            res.forEach(item => {
                                result.push({
                                    value: item.plate + "---"+item.imei,
                                    equModalId: item.equModalId,
                                    vehicleId: item.vehicle_id,
                                    id: item.id


                                 }
                                )
                            });
                            cb(result);
                        }
                    });
                }
            },

            /*选中车牌或imei以后触发*/
            selectPlate(item){
                /*首先检查该设备是否支持跟踪计划*/
                ajax.get(`se/seEquipmentSet/equModal/type?equModalId=${item.equModalId}&type=is_track`).then(res=>{
                    if(res.status != 0 || !res.data){
                        this.showMessage('该设备不支持跟踪计划');
                    }else{
                        this.form.equModalId = item.equModalId;
                        this.form.vehicleId = item.vehicleId;
                        this.form.equipmentId = item.id;

                    }
                })
            },

            /*提交跟踪计划*/
            subForm(){
                this.$refs['form'].validate((valid) => {
                   if(valid){
                        /*提交表单数据*/
                        ajax.post('se/seTrackingPlan' , this.form).then(
                            res =>{
                                if(res && res.status == 0){
                                    this.getList();
                                    this.dialogVisible = false;
                                    this.showMessage('添加跟踪计划成功','success');
                                }
                            }
                        )
                   }
                });
            },

            /*取消*/
            exit(row){
                this.$confirm('确认取消').then(() => {
                    ajax.get(`se/seTrackingPlan/${row.id}/sendRecord?sendRecordId=${row.sendRecordId}`).then(
                        res => {
                            if(res.status == 0){
                                this.showMessage('取消成功','success');
                                this.getList();
                            }else{
                                this.showMessage(res.msg);
                            }
                        }
                    ), error => {
                        this.showMessage('取消失败');
                    }
                });
            },

            /*延长*/
            edit(row){
                this.$prompt( '异常处理', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputErrorMessage: '请输入正确的时间',
                    inputType: 'number',
                    inputValue: row.duration,
                }).then(({ value }) => {
                    ajax.get(`se/seTrackingPlan/${row.id}/ycplan?duration=${value}`).then(res => {
                        if(res.status == 0){
                            this.showMessage('延长跟踪计划成功', 'success');
                            this.getList();
                        }else{
                            this.showMessage('延长跟踪计划失败');
                        }
                    },error => {
                        this.showMessage('延长跟踪计划失败');
                    })
                })
            },

            /*跟踪*/
            tailAfter(row){
                let url = '/tgpt_v2/se/vehicleTrack/add';
                this.$router.push({path:url , query:{id: row.vehicleId ,plate: row.plate , equipmentId: row.equipmentId}});
            },

            /*查看*/
            check(row){
                let url = '/tgpt_v2/se/vehicleTrack/add';
                this.$router.push({path:url , query:{id: row.vehicleId ,plate: row.plate , equipmentId: row.equipmentId , type: 'check'}});
            }
        }
    }
</script>

