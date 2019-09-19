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
                            <el-option label="休眠" value="2"></el-option>
                            <el-option label="故障" value="3"></el-option>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="190">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn" type="text" @click="editWorkType(scope.row)">工作模式</el-button>
                        <el-button v-show="showEditBtn" type="text" @click="commandLoglist(scope.row.imei)">指令日志</el-button>
                    </template>
                </el-table-column>

                <el-table-column min-width="120" label="车牌" prop="plate" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!--<a size="mini" @click="toDetail(scope.row)">{{scope.row.plate}}</a>-->
                        {{scope.row.plate}}
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label="客户" prop="serviceRegionName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="服务组织" prop="attributionRegionName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="IMEI" prop="imei" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.imei}}
                    </template>
                </el-table-column>
                <el-table-column min-width="120" label="产品型号" prop="equipmentModalName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="手机号码" prop="phone" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="费用到期时间" prop="validity" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="设备状态" prop="workStatusText" sortable show-overflow-tooltip></el-table-column>

                <!-- <el-table-column min-width="142" label="离线时间" prop="localtionTime" sortable show-overflow-tooltip></el-table-column>
                 <el-table-column min-width="140" label="离线时长" prop="offlineTimeSpan" sortable show-overflow-tooltip></el-table-column>-->
                <el-table-column min-width="140" label="位置" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a v-show="showEditBtn" @click="toLocation(scope.row)" class="buttonText">{{scope.row.address}}</a>
                    </template>
                </el-table-column>

                <el-table-column min-width="140" label="最后上传定位时间" prop="localtionTime" sortable show-overflow-tooltip></el-table-column>
            </el-table>
        </div>

        <!-- 手机卡变更弹窗 -->
       <!-- <el-dialog  class="import-box" :visible.sync="editVisible" :append-to-body="true" width="440px" :close-on-click-modal="false">
            <div class="form-panel">
                <el-form :model="editSimForm" :rules="rules" label-position="top" ref="editSimForm">
                    <div class="flex-panel">
                        <el-form-item label="原手机号" prop="oldPhone" style="width: 400px;">
                            <el-input v-model="editSimForm.oldPhone" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="变更为:" prop="simId" style="width: 400px;" :rules="rules.required('请选择')">
                            &lt;!&ndash;<el-form-item label="变更为:" prop="simId" style="width: 400px;">&ndash;&gt;
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
        </el-dialog>-->

        <!-- 工作模式弹窗 -->
        <el-dialog width="800px" class="full-input" :visible.sync="workPatternDialog" title="工作模式设置">
            <el-form label-position="top">
                <div class="form-box" style="max-height: initial" v-loading="saveLoading">
                    <div class="form-group">
                        <el-col :span="12">
                            <label class="control-label" :span="2">车牌:  {{plate}}</label>
                        </el-col>
                        <el-col>
                            <label class="control-label">设备IMEI:  {{imei}} </label>
                        </el-col>
                    </div>
                    <el-col :span="24">
                        <el-form-item label="模式：">
                            <template>
                                <div>
                                    <label><input @click="getRadioVal" type="radio" name="type" value="0" checked>闹钟模式</label>
                                    <label><input @click="getRadioVal" type="radio" name="type" value="1">星期模式</label>
                                    <label><input @click="getRadioVal" type="radio" name="type" value="2">定时模式</label>
                                </div>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-form-item v-if="weekShow" label="星期模式">
                        <template>
                            <el-radio-group v-model="saveParam.weekModeSwitch">
                                <el-radio :label="1">开</el-radio>
                                <el-radio :label="0">关</el-radio>
                            </el-radio-group>
                            <el-checkbox-group v-model="checkedWeekdays" @change="handleCheckedCitiesChange">
                                <el-checkbox v-for="weekday in weekdays" :label="weekday" :key="weekday">{{weekday}}</el-checkbox>
                            </el-checkbox-group>
                            <div class="form-group">
                                <el-col :span="4">
                                    <label class="control-label">上报时间 :</label>
                                </el-col>
                                <el-col :span="18">
                                    <div class="input-group">
                                        <div class="block">
                                            <span class="demonstration"></span>
                                            <el-time-picker
                                                v-model="saveParam.reportTime"
                                                value-format="HH:mm"
                                                :picker-options="{
                                                          format: 'HH:mm'
                                                        }"
                                                placeholder="任意时间点">
                                            </el-time-picker>
                                        </div>
                                    </div>
                                </el-col>
                            </div>
                        </template>
                    </el-form-item>

                    <el-form-item :span="4" v-if="alarmShow" label="闹钟模式：">

                        <div  class="form-group">
                            <el-col :span="6">
                                <div class="block">
                                    <span class="demonstration">第一组</span>
                                    <el-time-picker
                                        v-model="saveParam.value1"
                                        value-format="HH:mm"
                                        :picker-options="{
                                          format: 'HH:mm'
                                        }"
                                        placeholder="任意时间点">
                                    </el-time-picker>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="block">
                                    <span class="demonstration">第二组</span>
                                    <el-time-picker
                                        v-model="saveParam.value2"
                                        value-format="HH:mm"
                                        :picker-options="{
                                          format: 'HH:mm'
                                        }"
                                        placeholder="任意时间点">
                                    </el-time-picker>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="block">
                                    <span class="demonstration">第三组</span>
                                    <el-time-picker
                                        v-model="saveParam.value3"
                                        value-format="HH:mm"
                                        :picker-options="{
                                                format: 'HH:mm'
                                             }"
                                        placeholder="任意时间点">
                                    </el-time-picker>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="block">
                                    <span class="demonstration">第四组</span>
                                    <el-time-picker
                                        v-model="saveParam.value4"
                                        value-format="HH:mm"
                                        :picker-options="{
                                                format: 'HH:mm'
                                             }"
                                        placeholder="任意时间点">
                                    </el-time-picker>
                                </div>
                            </el-col>
                        </div>
                    </el-form-item>

                    <div v-if="fixTimeShow">
                        <p>上报间隔，单位分钟，只能输入0-999的正整数，0为关闭该功能</P>
                        <div class="form-group">
                            <label class="control-label">上报间隔(分钟)</label>
                            <div class="input-group">
                                <el-input v-model="saveParam.timingMode">{{saveParam.timingMode}}</el-input>
                            </div>
                        </div>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveWorkPattern(saveParam)" :loading="saveLoading">保存</el-button>
                <el-button @click="close">返回</el-button>
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


    const weekdayOptions = ['周一', '周二', '周三', '周四','周五','周六','周日'];
    export default {
        name: 'wirelessEquipmentWorkStatus',
        mixins: [tool,ruleTool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                showExportExcelBtn: this.getCurrentUserAuthority('equipmentWorkStatus/export'),
                showEditBtn: this.getCurrentUserAuthority('equipmentWorkStatus/edit'),
                showSimDetailBtn: this.getCurrentUserAuthority('equipmentWorkStatus/simdetail'),
                listUrl: 'base/equipmentWorkStatus/wirelessList',
                equipmentModalIdList: [],
                phoneList: [],
                editVisible: false,
                workPatternDialog:false,
                editSimForm:{},
                createDate: '',
                organization:[],
                checkedWeekdays: [],
                weekdays: weekdayOptions,
                time: '',
                plate:'',
                imei:'',
                saveParam: {
                    weekModeSwitch: 1
                },
                addWeekday:'',
                alarmShow:true,
                weekShow:false,
                fixTimeShow:false,
                timingMode:'',
                reportTime:"12:00:00",
                saveLoading:false
            }
        },
        activated(){
            this.initialize();
            this.getList();
        },
        mounted() {
            // window.initialize = this.initialize;
            // var script = document.createElement("script");
            // script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
            // document.body.appendChild(script);
            this.$nextTick(()=>{
                this.initialize();
            })
            this.getList();
        },
        methods: {
            getRadioVal(event){ //event当前事件对象
                var radioVal = event.target.value;
                if(radioVal == 0){
                    this.weekShow = false
                    this.fixTimeShow = false
                    this.alarmShow = true
                }else if(radioVal == 1){
                    this.alarmShow = false
                    this.fixTimeShow = false
                    this.weekShow = true
                }else if(radioVal == 2){
                    this.alarmShow = false
                    this.weekShow = false
                    this.fixTimeShow = true
                }
            },
            close(){
                this.workPatternDialog = false;
                this.saveParam = {};
            },
            /*初始化*/
            initialize(){
                this.selectModalId();
                if(!this.$store.state.isInit){
                    this.$store.state.isInit = true;
                    this.getList();
                }
            },

            getListAfter(){
                let convertor = new BMap.Convertor();
                let geoc = new BMap.Geocoder();
                let i = 0;
                this.getAddess(this.list ,convertor , geoc , i );
            },

            /*查看指令详情*/
            commandLoglist(deviceId){
                let url='./equipment/commandLoglist/'+deviceId;
                this.$router.push({path:url});
            },

            /*位置*/
            toLocation(row){
                let url='/tgpt_v2/obd/vehicleLocation';
                this.$router.push({path:url, query:{id:row.vehicleId,plate:row.plate,activeName:'2'}});
            },

            /*获取设备地址信息*/
            getAddess(records , convertor , geoc , i ){
                if(i<records.length){
                    let item = records[i];
                    let pointArr = [];
                    pointArr.push(new BMap.Point(item.longitude ,item.latitude));
                    convertor.translate(pointArr, 1, 5, (data)=>{
                        if(data.status == 0){
                            geoc.getLocation(data.points[0], (rs)=>{
                                // item.address = rs.address;
                                this.$set(item,"address",rs.address);
                                i++;
                                this.getAddess(records , convertor , geoc , i);
                            });
                        }
                    })
                }
            },

            /*编辑工作模式*/
            editWorkType(row){
                this.title = "工作模式";
                this.workPatternDialog = true;
                this.plate = row.plate
                this.imei = row.imei
            },

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
            selectModalId() {
                var $this = this;
                ajax.get("base/baseEquipmentModal/type?type=4&time=" + new Date().getTime()).then(result => {
                    if (result.status  == 0) {
                        $this.equipmentModalIdList = result.data;
                    } else {
                        $this.equipmentModalIdList = [];
                    }
                });
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
            saveWorkPattern(saveParam) {
                var $this = this;
                if(null == saveParam.value1 &&
                    null == saveParam.value2 &&
                    null == saveParam.value3 &&
                    null == saveParam.value4 &&
                    null == saveParam.timingMode &&
                    null == saveParam.addWeekday){
                    $this.$message.error("请选择工作模式并输入相关参数！");
                    return false;
                }

                if(saveParam.timingMode){
                    if(0 > saveParam.timingMode || 999 < saveParam.timingMode){
                        $this.$message.error("上报间隔输入格式有误！");
                        return false;
                    }
                }

                if(saveParam.addWeekday){
                    if(null == saveParam.reportTime){
                        $this.$message.error("上报时间不能为空！");
                        return false;
                    }

                    saveParam.addWeekday.forEach(item =>{
                        let weekdayStr = item;
                        if(weekdayStr=="周一"){
                            saveParam.weekday1 ="1"
                        }else if(weekdayStr=="周二"){
                            this.saveParam.weekday2 ="2"
                        }else if(weekdayStr=="周三"){
                            this.saveParam.weekday3 ="3"
                        }else if(weekdayStr=="周四"){
                            this.saveParam.weekday4 ="4"
                        }else if(weekdayStr=="周五"){
                            this.saveParam.weekday5 ="5"
                        }else if(weekdayStr=="周六"){
                            this.saveParam.weekday6 ="6"
                        }else if(weekdayStr=="周日"){
                            this.saveParam.weekday7 ="7"
                        }
                    })
                    saveParam.addWeekday ="";
                }
                // $this.$refs[saveParam].validate((valid) => {
                if (saveParam) {
                    var url = "obd/obdWorkPattern";
                    this.saveParam.deviceId = this.imei;
                    this.saveLoading = true;
                    ajax.post(url, $.param(this.saveParam)).then(res => {
                        this.saveLoading = false;
                        if(res.status == 0){
                            $this.$message({message: '保存成功',type: 'success'});
                            this.workPatternDialog = false;
                            this.saveParam = {weekModeSwitch: 1};
                            this.getList();
                        }else {
                            $this.$message.error(res.message);
                        }
                    });
                } else {
                    return false;
                }
                // });
            },
            // 设备指令详情
            imeiDetail(imei) {
                this.$router.push({path:"/tgpt_v2/base/equipmentWorkStatus/imeidetail/"+imei});
            },
            exportExcel() {
                window.location = this.exportUrl("base/equipmentWorkStatus/excelw?" + $.param(this.searchParam));
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.saveParam.addWeekday = value
            },

        }
    }
</script>


