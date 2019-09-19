<template>
    <div class="form-panel">
        <el-form :model="repairInfo" :rules="rules" label-position="top" ref="repairInfo" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="维修登记" name="1">
                    <div class="flex-panel">
                        <el-form-item label="服务组织" prop="serviceRegionId">
                            <tree-select  placeholder="请选择服务组织" type="one" v-model="companyId"
                                          url="admin/organization/tree?noManager=noManager" @change="getVehicleModalList"></tree-select>
                        </el-form-item>

                        <el-form-item label="车辆" prop="vehiclePlate">
                            <el-input :readonly = "true" v-model="repairInfo.vehiclePlate" clearable @focus="getVehicle()" placeholder="请选择车辆">
                                <el-button @click="getVehicle()" slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="维修类型" prop="maintenanceType">
                            <el-select v-model="repairInfo.maintenanceType" placeholder="请选择" clearable>
                                <el-option label="正常维修" :value="1"></el-option>
                                <el-option label="事故维修" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="维修人" prop="maintenancePeople" >
                            <el-input v-model="repairInfo.maintenancePeople" placeholder="请输入" maxlength="30"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="维修时里程(km)" prop="maintenanceMileage" :rules="[
                           { required: true, message: '请输入里程', trigger: 'change' },
                           {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'change'}
                        ]">
                            <el-input v-model="repairInfo.maintenanceMileage" placeholder="请输入"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="维修日期" prop="creatDate">
                            <el-date-picker
                                v-model="repairInfo.creatDate"
                                @change="creatDateChange"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="维修单位" prop="maintenanceSection" >
                            <el-input v-model="repairInfo.maintenanceSection" placeholder="请输入" maxlength="80"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="维修配件费用(元)" prop="partsCost" :rules="[
                           { required: true, message: '请输入价格', trigger: 'change' },
                           {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'change'}
                        ]">
                            <el-input v-model="repairInfo.partsCost" placeholder="请输入"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="维修工时费用(元)" prop="workCost" :rules="[
                           { required: true, message: '请输入价格', trigger: 'change' },
                           {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'change'}
                        ]">
                            <el-input v-model="repairInfo.workCost" placeholder="请输入"
                                      clearable></el-input>
                        </el-form-item>

                        <el-form-item label="其他项目/备注" >
                            <el-input type="textarea" v-model="repairInfo.otherProject" placeholder="请输入" maxlength="200"
                                      clearable></el-input>
                        </el-form-item>

                        <el-form-item label="维修附件">
                            <upload-panel :size="1" :file-list.sync="maintenanceImg" accept=".jpg,.jpeg,.png"
                                          :show-img="true"></upload-panel>
                        </el-form-item>
                    </div>
                    <el-form-item label="维修项目" >
                        <el-checkbox-group v-model="repairInfo.maintenanceProjectId">
                            <el-checkbox v-for="(project,i) in repairProjectList" :key="i" :label="project.value">{{project.text}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-collapse-item>


            </el-collapse>
            <div class="left-row">
                <el-button type="primary" @click="submitForm('repairInfo')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>


        <!-- 绑定车辆弹窗 -->
        <el-dialog
            class="demand-selector big-dialog"
            title="选择车辆"
            :visible.sync="vehicleShow"
            width="1000px"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.plate" placeholder="请输入车牌" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">车型</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.modelName" placeholder="请输入车型" clearable />
                            </div>
                        </div>

                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1);">查询</el-button>
                        <el-button type="small" @click="resetList();" size="small">重置</el-button>
                    </div>
                </div>
                <div class="table-box">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectVehicle(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="vin" label="车架号" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="plate" label="车牌" min-width="140"></el-table-column>
                        <el-table-column prop="vehicleModel" label="车型" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="vehicleColor" sortable label="颜色" min-width="80"></el-table-column>

                    </el-table>
                    <!-- 分页 -->
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
        </el-dialog>

    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import ajax from '@/utils/request'
    import {tool, formRule} from '@/utils/common'

    export default {
        mixins: [tool],
        name: "repairCwForm",
        components: {TreeSelect, CitySelect, MoneyInput, UploadPanel},
        data() {
            return {
                openCollapse: ["1"],
                show: false,
                repairInfo: {
                    maintenanceProjectId:[],
                    creatDate:[],
                },
                vehicleShow:false,
                maintenanceImg: [],
                formRule,
                companyId:[],
                rules: {
                    vehiclePlate: [
                        {required: true, message: '请选择', trigger: 'change'}
                    ],
                    maintenanceType: [
                        {required: true, message: '请选择', trigger: 'change'}
                    ],
                    maintenancePeople: [
                        {required: true, message: '请输入', trigger: 'change'}
                    ],
                    maintenanceMileage: [
                        {required: true, message: '请输入', trigger: 'change'}
                    ],
                    creatDate: [
                        {required: true, message: '请选择', trigger: 'change'}
                    ],
                    maintenanceSection: [
                        {required: true, message: '请输入', trigger: 'change'}
                    ],
                    serviceRegionId: [
                        {required: true, message: '请选择服务组织', trigger: 'change'}
                    ],
                    // partsCost: [
                    //     {required:true,validator: formRule.money, message: "请输入", trigger: "blur"}
                    // ],
                    // workCost: [
                    //     {required:true,validator: formRule.money, message: "请输入", trigger: "blur"}
                    // ],
                },
                repairProjectList: [],

            }
        },
        methods: {

            open() {
                console.log(this.rules)

                var $this = this;
                $this.openCollapse = ["1"];
                $this.show = true;
                let id = this.$route.query.id;
                $this.selectRepairProject();
                if (id) {
                    ajax.get("traffic/repairCw/edit/" + id + "?time=" + new Date().getTime()).then(result => {
                        if (result.status == 0) {
                            if (result.data.maintenanceProjectId) {
                                result.data.maintenanceProjectId = result.data.maintenanceProjectId.split(',');
                            }else{
                                result.data.maintenanceProjectId =[]
                            }
                            $this.repairInfo = result.data;
                            this.companyId[0]=result.data.serviceRegionId;
                            let creatDate =[];
                            creatDate[0]   =  result.data.startTime ;
                            creatDate[1]   =   result.data.endTime;
                            this.$set(this.repairInfo,'creatDate',creatDate)
                            $this.init();
                        }
                    });
                } else {

                }
            },

            init() {
                var $this = this;
                if ($this.repairInfo.id) {
                    if ($this.repairInfo.maintenanceImg) {
                        $this.maintenanceImg.push(JSON.parse($this.repairInfo.maintenanceImg));
                    }

                }
            },

            photoHandle(object1, object2) {
                var $this = this;
                var object = {};
                object['name'] = object1[0].name;
                object['path'] = object1[0].path;
                object['filedomain'] = object1[0].filedomain;
                if (object2 == 1) {
                    $this.repairInfo.maintenanceImg = JSON.stringify(object);
                }
            },

            //获取车辆信息
            getVehicleModalList(){
                this.repairInfo.vehicleId="";
                this.repairInfo.vehiclePlate="";
                if (this.companyId.length > 0) {
                    this.$set(this.repairInfo,"serviceRegionId",this.companyId[0]);
                }else{
                    this.$set(this.repairInfo,"serviceRegionId","");
                }
            },
            submitForm(repairInfo) {
                var $this = this;
                $this.$refs[repairInfo].validate((valid) => {
                    if (valid) {
                        if ($this.maintenanceImg != null && $this.maintenanceImg.length > 0) {
                            $this.photoHandle($this.maintenanceImg, 1);
                        } else {
                            $this.repairInfo.maintenanceImg = null;
                        }

                        var url ="";
                        if($this.repairInfo.id!=null){
                             url = "traffic/repairCw/edit";
                        }else {
                             url = "traffic/repairCw/save";
                        }
                        $this.repairInfo.maintenanceProjectId = $this.repairInfo.maintenanceProjectId.join(',');
                        ajax.post(url, $this.repairInfo).then(res => {
                            if (res.status == 0) {
                                $this.$message({message: '保存成功', type: 'success'});
                                $this.close();
                                $this.$emit('load');
                            } else {
                                $this.$message.error('保存失败');
                            }
                        });
                    } else {
                        return false;
                    }

                });
            },

            getVehicle(){
                if(this.companyId!=null && this.companyId!=undefined && this.companyId.length>0 && this.companyId[0] != ""){
                    this.listUrl = 'traffic/repairCw/vehicleList?companyId='+this.companyId[0];
                }else{
                    this.listUrl = 'traffic/repairCw/vehicleList';
                }
                this.resetList();
                this.vehicleShow = true;
            },

            selectVehicle(row){
                this.$set(this.repairInfo,"vehiclePlate",row.plate);
                this.$set(this.repairInfo,"vehicleId",row.id);
                if(this.companyId == null ||  this.companyId == undefined || this.companyId.length == 0 || this.companyId[0] == ""){
                    this.companyId.push(row.companyId);
                    this.$set(this.repairInfo,"serviceRegionId",this.companyId[0]);
                }
                this.$set(this.repairInfo,"serviceRegionId",this.companyId[0]);
                this.repairInfo=Object.assign({},this.repairInfo);
                this.vehicleShow = false;
            },

            creatDateChange() {

                if(this.repairInfo.creatDate && this.repairInfo.creatDate.length>0){
                    let creatDate = this.repairInfo.creatDate;
                    this.$set(this.repairInfo,'startTime',creatDate[0] + ' 00:00:00');
                    this.$set(this.repairInfo,'endTime',creatDate[1] + ' 23:59:59');
                }else{
                    this.$set(this.repairInfo,'startTime','');
                    this.$set(this.repairInfo,'endTime','');
                }
            },

            selectRepairProject() {
                var $this = this;
                ajax.get("admin/dict/type/维修项目?time=" + new Date().getTime()).then(result => {
                    console.log(result);
                    if (result.length > 0) {
                        $this.repairProjectList = result;
                    } else {
                        $this.repairProjectList = [];
                    }
                });
            }
        },
        mounted() {
            this.open();
        }
    }
</script>

