<template>
    <div class="app-container white-bg form-panel" v-cloak>
        <el-form :model="exportForm" :rules="rules" label-position="top" ref="exportForm" label-width="80px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="添加导出任务" name="0">
                    <el-form-item label="任务名称" prop="taskName">
                        <el-input v-model.trim="exportForm.taskName" placeholder="任务名称" clearable style="width:320px;" maxlength="18"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="导出车辆" prop="vehiclePlate">-->
                    <p>导出车辆<i style="color: red"> *</i></p>
                        <el-select
                            style="margin-right: 10px;width:320px;"
                            v-model="exportForm.vehiclePlate"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="车牌号"
                            :remote-method="remoteFindPlateInfo"
                            :no-data-text="dataText"
                            :loading="plateLoading">
                            <el-option
                                v-for="item in vehiclePlateOptions"
                                :key="item.id"
                                :label="item.plate"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <el-button v-show="showAddVehiclePlateBtn" type="primary" size="mini" @click="addVehiclePlate()">添加</el-button>
                    <!--</el-form-item>-->
                    <el-form-item :label="'已选车辆('+vehiclePlateList.length+'辆)'" size="large">
                        <el-tag
                            v-for="tag in vehiclePlateList"
                            :key="tag.id"
                            closable
                            @close="deletePlate(tag)"
                            :type="tag.type">
                            {{tag.plate}}
                        </el-tag>
                    </el-form-item>

                    <el-form-item label="时间段" prop="dateTime">
                        <el-date-picker
                            style="margin-right: 10px;width:500px;"
                            v-model="exportForm.dateTime"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="时间间隔" prop="timeInterval">
                        <el-select
                            style="margin-right: 10px;width:320px;"
                            v-model="exportForm.timeInterval" placeholder="请选择">
                            <el-option
                                v-for="item in timeIntervals"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="星期筛选" prop="weekList">

                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="exportForm.weekList" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="week in weeks" :label="week.value" :key="week.value">{{week.label}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="exportData('exportForm')">确定</el-button>
                <el-button @click="destroy()">取消</el-button>
            </div>
        </el-form>
    </div>



</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    const timeIntervalOptions = [
        {value: '10', label: '10秒'},
        {value: '30',label: '30秒'},
        {value: '60',label: '1分钟'},
        {value: '300',label: '5分钟'},
        {value: '600',label: '10分钟'},
        {value: '1800',label: '30分钟'},
        {value: '3600',label: '1小时'}];
    const weekOptions = [
        {label:"星期一", value:"1"},
        {label:"星期二", value:"2"},
        {label:"星期三", value:"3"},
        {label:"星期四", value:"4"},
        {label:"星期五", value:"5"},
        {label:"星期六", value:"6"},
        {label:"星期日", value:"7"}
    ];
    export default {
        name: 'vehicleTrackExportAdd',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            var _this = this;
            return {
                activeNames: ['0'],
                showExportBtn: this.getCurrentUserAuthority('vehicleTrack/export'),
                showAddVehiclePlateBtn: true,
                exportForm: {taskName:"",timeInterval:"300",weekList:["1","2","3","4","5","6","7"],dateTime:[]},
                plateLoading:false,
                vehiclePlateOptions:[],
                vehiclePlateList:[],
                choiceDate: '',
                rules:{
                    taskName:[{required: true, message: '请输入任务名称', trigger: 'change'}],
                    dateTime: [{required: true, message: '请选择时间段', trigger: 'change'},],
                    timeInterval:[{required: true, message: '请选时间间隔', trigger: 'change'}],
                    weekList:[{required: true, message: '请选择星期', trigger: 'change'}]
                },
                //时间段快捷选项
                pickerOptions: {
                    onPick: ({ maxDate, minDate }) => {
                        _this.choiceDate = minDate.getTime()
                        if (maxDate) {
                            _this.choiceDate = ''
                        }
                    },
                    disabledDate(time) {
                        const oneYear = 12*31*24*3600*1000;
                        if (_this.choiceDate != '') {
                            let minTime,maxTime;
                            //多辆车到处一个月
                            if(_this.vehiclePlateList.length>1){
                                const oneMonth = 31 * 24 * 3600 * 1000
                                minTime = _this.choiceDate - oneMonth
                                maxTime = _this.choiceDate + oneMonth
                                //return time.getTime() < minTime || time.getTime() > maxTime ||  time.getTime() > Date.now()
                                //单辆车到处一年
                            }else if(_this.vehiclePlateList.length==1){
                                minTime = _this.choiceDate - oneYear
                                maxTime = _this.choiceDate + oneYear
                            }
                            return time.getTime() < minTime || time.getTime() > maxTime ||  time.getTime() > Date.now()
                        }
                        return time.getTime() > Date.now()|| time.getTime()<Date.now()-oneYear;
                    },
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                timeIntervals:timeIntervalOptions,
                weeks: weekOptions,
                isIndeterminate: false,
                checkAll: true,
                dataText:'无数据'
            }
        },
        activated: function () {

        },
        mounted: function () {
        },
        methods: {
            handleCheckAllChange(val) {
                this.$set(this.exportForm,'weekList',val ? weekOptions.map((week)=>{return week.value;}) : [])
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.weeks.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.weeks.length;
            },
            /*根据车牌查找车辆信息*/
            remoteFindPlateInfo(plateKeyWord) {
                if (plateKeyWord !== '' && plateKeyWord.length >= 3) {
                    this.plateLoading = true;
                    ajax.get('obd/obdVehicleStatus/findPlateListByKeyword', {plate: plateKeyWord}).then(rs => {
                        if (rs && rs.data.length > 0) {
                            setTimeout(() => {
                                this.plateLoading = false;
                                this.vehiclePlateOptions = rs.data;
                            }, 200);
                        }else{
                            this.dataText = '无数据'
                            this.vehiclePlateOptions = [];
                            this.plateLoading = false;
                        }
                    })
                } else if(plateKeyWord !== '' && plateKeyWord.length < 3){
                    this.dataText = '请输入至少3位'
                    this.vehiclePlateOptions = [];
                }else{
                    this.vehiclePlateOptions = [];
                }
            },
            /*添加车辆*/
            addVehiclePlate() {
                if (this.exportForm.vehiclePlate == "") {
                    this.$message.error("请输入车辆！");
                    return false;
                }
                if(!this.checkSelectedPlate()){
                    this.$message.error("车牌号已存在！");
                    return false;
                }
                let vehicle = {};
                vehicle = this.vehiclePlateOptions.find((item)=>{//这里的selectList就是上面遍历的数据源
                    return item.id === this.exportForm.vehiclePlate;//筛选出匹配数据
                });
                vehicle.type = '';
                /*根据车辆id查询*/
                this.vehiclePlateList.push(vehicle);
                if(this.vehiclePlateList.length>=30){
                    this.showAddVehiclePlateBtn=false;
                }
                this.$set(this.exportForm,'vehiclePlate','');
                this.$set(this.exportForm,'dateTime', []);
            },
            checkSelectedPlate(){
                let vehicle = {};
                vehicle = this.vehiclePlateList.find((item)=>{//这里的selectList就是上面遍历的数据源
                    return item.id === this.exportForm.vehiclePlate;//筛选出匹配数据
                });
                return vehicle==null||Object.keys(vehicle).length === 0;
            },
            /*删除车牌*/
            deletePlate(tag) {
                this.vehiclePlateList.splice(this.vehiclePlateList.indexOf(tag), 1);
            },
            destroy() {
              this.close();
            },
            reset(){
                this.exportForm = {taskName:"",timeInterval:"300",weekList:["1","2","3","4","5","6","7"]};
                this.vehiclePlateList = [];
            },
            exportData(exportForm) {

                if(this.exportForm.taskName == "") {
                    this.$message.error('输入任务名称');
                    return;
                }
                if(this.vehiclePlateList.length===0){
                    this.$message.error('请选择车辆');
                    return;
                }
                this.$refs[exportForm].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }
                    let vehicleIds = this.vehiclePlateList.map((vehicle)=>{return vehicle.id;});
                    let taskParam = {
                        vehicleIds: vehicleIds.join(","),
                        startTime: this.exportForm['dateTime'][0] + ' 00:00:00',
                        endTime: this.exportForm['dateTime'][1] + ' 23:59:59',
                        timeInterval:this.exportForm.timeInterval,
                        weeks: this.exportForm.weekList.join(","),
                    };
                    let param = {
                        taskName: this.exportForm.taskName,
                        taskParam:JSON.stringify(taskParam)
                    };
                    const loading = this.$loading({fullscreen: false, lock: true, text: '正在创建任务...', spinner: 'el-icon-loading', background: 'rgba(255, 255, 255, 0.5)', target: document.querySelector('.form-panel') });
                    ajax.post("obd/obdVehicleTrackExport/task/add",param).then(rs => {
                        loading.close();
                        if (rs.status == 0) {
                            this.showMessage("创建导出任务成功","success");
                            this.close();
                        } else {
                            this.showMessage(rs.msg,"error");
                        }
                    }).catch(_ => {
                        loading.close();
                    });
                });
            }
        }
    }
</script>
<style>
    .el-tag + .el-tag {
        margin-left: 10px;
    }
</style>

