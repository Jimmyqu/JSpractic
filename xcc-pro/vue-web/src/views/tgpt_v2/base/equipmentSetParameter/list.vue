<template xmlns:el="http://www.w3.org/1999/html">
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">产品型号</label>
                    <div class="input-group">
                        <template>
                            <el-select v-model="searchParam.equipmentModalId" placeholder="请选择" clearable>
                                <el-option
                                    v-for="item in equModals"
                                    :key="item.id"
                                    :label="item.supplierId + ' -- '+ item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">设备状态</label>
                    <div class="input-group">
                        <template>
                            <el-select v-model="searchParam.status" placeholder="请选择" clearable>
                                <el-option
                                    v-for="item in equStatus"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.keyWord" placeholder="车牌号 IMEI" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">网关地址</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.gatewayAddress" placeholder="网关地址" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">网关端口</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.gatewayPort" placeholder="网关端口" clearable></el-input>
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
                <el-button v-show="showAddBtn" type="primary" size="mini" @click="sendPlParam()">批量设置参数</el-button>
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
                <el-table-column min-width="140" label="设备IMEI号" prop="imei" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="产品类型"  sortable
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-show="scope.row.modalType == 1">OBD</span>
                        <span v-show="scope.row.modalType == 2">GPS</span>
                        <span v-show="scope.row.modalType == 3">SIM</span>
                        <span v-show="scope.row.modalType == 4">沉默鹰</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="120" label="供应商" prop="supplierName" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="产品型号" prop="modalName" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="客户" prop="companyName" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="车牌" sortable show-overflow-tooltip>
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
                                <el-button type="text" style="float: right" @click="toCarDeatil(scope.row.vehicleRelationId)">查看更多</el-button>
                            </div>
                            <el-button type="text">{{scope.row.plate}}</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label="SIM卡号" prop="phone" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="设备状态" prop="equStatusText" sortable show-overflow-tooltip>
                </el-table-column>
                <el-table-column min-width="140" label="网关地址" prop="gatewayAddress" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="网关端口" prop="gatewayPort" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column fixed="left" label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button v-show="showReadParamBtn" type="text" @click="readParam(scope.row , 1)">读取参数</el-button>
                        <el-button v-show="showSetParamBtn" type="text" @click="setParam(scope.row , 2)">设置参数</el-button>
                        <el-button v-show="showViewParamBtn" type="text" @click="toParameterRecord(scope.row.imei)">查看指令日志</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--读取和设置参数弹出框-->
        <el-dialog  :visible.sync="readFormVisible" width="40%" top="5%"  >
            <div slot="title">
                {{commandType == 1 ? '读取参数': '设置参数'}}
            </div>
            <el-form ref="readForm" :model="readForm" label-width="80px" :rules="readFormRules" >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="IMEI">
                            <el-input v-model="readForm.imei" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品类型">
                            <el-input  disabled v-model="readForm.typeName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品型号">
                            <el-input v-model="readForm.modalName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="参数类型"  prop="selectParam">
                            <el-select v-model="readForm.selectParam" placeholder="请选择" @change="showTextInput(readForm)">
                                <el-option
                                    v-for="item in readForm.params"
                                    :key="item.name"
                                    :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-show="readForm.data && readForm.data.length >= 1 && commandType == 2">
                        <el-form-item label=""    label-width="none"
                                      v-for="(bean,index) in readForm.data"
                                      :key="bean.name"
                                      :prop="'data.' + index + '.value'"
                                      :rules="{
                                             required: true, message: '该内容是必填的', trigger: 'blur'
                                        }"
                        >
                            <span slot="label">
                                {{bean.name}}
                            </span>
                            <el-input v-model="bean.value"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-show="readForm.remark && readForm.remark != '' && commandType == 2">
                        <el-form-item label="备注:">
                            <div style="line-height: 30px;color: red;">{{readForm.remark}}</div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="readFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitParam()">确 定</el-button>
            </div>
        </el-dialog>


        <!--批量读取和设置参数弹出框-->
        <el-dialog  :visible.sync="plFormVisible" width="40%" top="5%">
            <div slot="title">
                {{plCommandType == 1 ? '批量读取参数': '批量设置参数'}}
            </div>
            <el-form  ref="plForm" :model="plForm" label-width="80px" :rules="plFormRules" >
                <el-row>
                    <el-col :span="12" v-if="plCommandType == 2">
                        <el-form-item label="所属组织"  required="" prop="originateDeptId"
                                      :rules="{
                                             required: true, message: '请选择所属部门', trigger: 'change'
                                        }"
                        >
                            <tree-select v-model="plForm.originateDeptId" placeholder="所属部门" type="one"
                                         url="admin/organization/tree"
                            ></tree-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品型号" required="" prop="equipmentModalId">
                            <el-select v-model="plForm.equipmentModalId" placeholder="请选择" @change="getPlParams()" >
                                <el-option
                                    v-for="item in equModals"
                                    :key="item.id"
                                    :label="item.supplierId + ' -- '+ item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="参数类型" required="" prop="selectParam">
                            <el-select v-model="plForm.selectParam" placeholder="请选择" @change="showTextInput(plForm)">
                                <el-option
                                    v-for="item in plForm.params"
                                    :key="item.name"
                                    :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <div v-show="plForm.data && plForm.data.length >= 1">
                        <el-form-item label="" style="width: 40%"  v-for="(bean,index) in plForm.data"
                                      :key="bean.name"
                                      :prop="'data.' + index + '.value'"
                                      :rules="{
                                             required: true, message: '该内容是必填的', trigger: 'blur'
                                        }"
                                      label-width="120px">
                            <span slot="label">
                                {{bean.name}}
                            </span>
                            <el-input v-model="bean.value" ></el-input>
                        </el-form-item>
                    </div>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="plFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitPlParam()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog
            title="提示"
            :visible.sync="dialogVisibleMsg"
            width="30%"
            >
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisibleMsg = false">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'

    export default {
        name: 'equipmentSetParameter',
        mixins: [tool],
        components: {TreeSelect},
        data() {
            return {
                showSearch: false,
                searchParam: {},
                showEditBtn: true,
                showReadParamBtn: this.getCurrentUserAuthority('equipmentSetParameter/readParam'),
                showSetParamBtn: this.getCurrentUserAuthority('equipmentSetParameter/setParam'),
                showViewParamBtn: this.getCurrentUserAuthority('equipmentSetParameter/viewParam'),
                showAddBtn: this.getCurrentUserAuthority('equipmentSetParameter/add'),
                showExportExcelBtn: true,
                listUrl: 'base/baseEquipmentParam',
                /*产品类型*/
                equModals: [],
                /*设备状态*/
                equStatus: [
                    {name: '在线', value: 1},
                    {name: '断线', value: 2},
                    {name: '离线', value: 3}
                ],
                /*单例读取和设置*/
                readFormVisible: false,
                dialogVisibleMsg: false,
                readForm: {},
                commandType: '',
                readFormRules:{
                    selectParam : [{ required: true, message: '请选择参数类型', trigger: 'change' }]
                },
                /*批量读取和设置*/
                plCommandType: '',
                plFormVisible: false,
                plForm: {
                    equipmentModalId: '',
                    originateDeptId: '',
                    selectParam: '',
                    data: []
                },
                plFormRules:{
                    selectParam : [{ required: true, message: '请选择参数类型', trigger: 'change' }],
                   /* originateDeptId: [{ required: true, message: '请选择所属部门', trigger: 'change' }],*/
                    equipmentModalId: [{ required: true, message: '请选择产品型号', trigger: 'change' }]
                },
                plResultData :[]

            }
        },
        activated() {
            this.getList();
        },
        mounted() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.getEquModalInfo();
        },
        methods: {
            getListBefore(params) {

            },

            //获取产品类型
            getEquModalInfo() {
                ajax.get("base/baseEquipmentModal/type?type=1,2,4").then(
                    res => {
                        if (res.status == 0) {
                            this.equModals = res.data;
                        }
                    }
                )
            },

            // 设置参数
            setParam(row, type) {
                this.getModalConstInfo(row.equipmentModalId, type).then(res => {
                    this.commandType = 2;
                    this.getConstantData(row , type);
                })
            },

            // 逻辑处理
            getConstantData(row , type){
                    //  下发指令
                    this.getModalConstInfo(row.equipmentModalId, type).then(res => {
                        if (res && res.length > 0) {
                            //弹出选择框
                            this.readForm = {
                                imei: row.imei,
                                modalType: row.modalType,
                                modalName: row.modalName,
                                params: res,
                                vehicleId: row.vehicleId,
                                id: row.id,
                                data: []
                            }
                            if(row.modalType == 1){
                                this.readForm.typeName = 'OBD'
                            }else if(row.modalType == 2){
                                this.readForm.typeName = 'GPS'
                            }else if(row.modalType == 3){
                                this.readForm.typeName = 'SIM'
                            }else if(row.modalType == 4){
                                this.readForm.typeName = '沉默鹰'
                            }
                            this.readFormVisible = true;
                        } else {
                            //this.showMessage('没有获取到配置参数');
                            this.$message({message: '没有获取到配置参数',type: 'success'});
                        }
                    }, error => {
                        this.showMessage('读取参数失败');
                    })
            },

            //读取参数
            readParam(row, type) {
                if(row.modalName == 'CC600' || row.modalName == 'CC200' ){
                    this.commandType = 1;
                    this.getConstantData(row , type);
                }else{
                    ajax.get(`obd/obdParameterSetting/read?imei=${row.imei}`).then( res =>{
                       if(res.status == 0){
                           //this.showMessage('参数读取成功');
                           this.$message({message: '参数读取成功',type: 'success'});
                       }else {
                           this.$message({message: '参数读取失败',type: 'error'});
                       }
                    });
                }
            },

            /*下发指令请求后台*/
            sendParamData(subData){
                ajax.post('obd/obdParameterSetting',subData).then(
                    res => {
                        if(res.status == 0){
                            this.showMessage(this.commandType == 1 ? '参数读取成功': '参数设置成功','success');
                            this.readFormVisible = false;
                        }
                    }
                )
            },

            /*显示参数内容填写框*/
            showTextInput(form) {
                form.data = [];
                const paramId = form.selectParam;
                const param = form.params.find(item => item.id == paramId);
                if (param.inputLabel) {
                    let inputLabel = param.inputLabel.split('&');
                    let inputUnit;
                    if(param.inputUnit){
                        inputUnit = param.inputUnit.split('&');
                    }

                    inputLabel.forEach((item,index) => {
                        form.data.push(
                            {
                                name: item + (inputUnit ? `(${inputUnit[index]})`:'' ) ,
                                value: ''
                            }
                        )
                    });
                    form.remark=param.remark;
                }
            },

            /*查看指令日志*/
            toParameterRecord(id){
                this.$router.push({path: '/tgpt_v2/obd/sendRecord' , query : {id: id}});
            },

            /*提交选择*/
            submitParam() {
                if(this.readForm.selectParam){
                    const paramId = this.readForm.selectParam;
                    const param = this.readForm.params.find(item => item.id == paramId);
                    //组合填写内容
                    const subData = {
                        vehicleId: this.readForm.vehicleId,
                        equipmentId: this.readForm.imei,
                        commandType: param.commandType,
                        type: param.type,
                        name: param.name,
                        oriData: this.getParamData(this.readForm)
                    };
                    if(this.commandType == 1){
                        ajax.get(`obd/obdParameterSetting/read?imei=${this.readForm.imei}&name=${subData.name}`).then( res =>{
                            if(res.status == 0){
                                this.$message({message: '参数读取成功',type: 'success'});
                            }else {
                                this.$message({message: '参数读取失败',type: 'error'});
                            }
                            this.readFormVisible = false;
                        });
                    }else{
                        /*验证表单数据*/
                        this.$refs['readForm'].validate((valid) => {
                            if(valid){
                                this.sendParamData(subData);
                            }
                        });
                    }

                }else{
                    this.$message({message: '请选择参数',type: 'error'});
                }
            },

            //获取填入指令参数值
            getParamData(form){
                let values = [];
                form.data.forEach(item => {
                    values.push(item.value);
                });
                return values.join(',');
            },

            //获取设备参数信息
            getModalConstInfo(equipmentModalId, type) {
                const p = new Promise((resolve, reject) => {
                    const url = `obd/obdSendParameterContrast/type?equipmentModalId=${equipmentModalId}&type=${type}`
                    ajax.get(url).then(res => {
                        resolve(res);
                    }, error => {
                        reject(error);
                    })
                });
                return p;
            },

            /*跳转车辆详情页面*/
            toCarDeatil(vehicleRelationId){
                console.log(vehicleRelationId);
                if(~this.$route.fullPath.indexOf("/detail/")){
                    return;
                }
                let url='/tgpt/vehicle/vehicleInformation';
                this.$router.push({path:url+"/detail/"+vehicleRelationId});
            },

            /*批量设置提交*/
            submitPlParam(){
                /*表单数据验证*/
                this.$refs['plForm'].validate((valid) => {
                    if(valid){
                        /*构造提交数据*/
                        const paramId = this.plForm.selectParam;
                        const param = this.plForm.params.find(item => item.id == paramId);
                        const subData ={
                            commandType: this.plCommandType,
                            orgId: this.plForm.originateDeptId ,
                            equipmentModalId: this.plForm.equipmentModalId,
                            type: param.type,
                            name: param.name,
                            oriData: this.getParamData(this.plForm)
                        }
                        /*提交数据到后台*/
                        ajax.post(`obd/obdParameterSetting/bath?orgId=${subData.orgId}&equipmentModalId=${subData.equipmentModalId}`,subData).then(
                            res => {
                                this.plFormVisible = false;
                                this.showMessage(this.plCommandType == 1 ? '批量读取参数成功':'批量设置参数成功','success');
                            },error =>{
                                this.showMessage(this.plCommandType == 1 ? '批量读取参数失败':'批量设置参数失败');
                            }
                        )
                    }
                });
            },

            /*批量操作*/

            /*选择产品类型以后获取批量数据*/
            getPlParams(){
                if(this.plForm.equipmentModalId){
                    this.getModalConstInfo(this.plForm.equipmentModalId , this.plCommandType).then(
                        res => {
                            this.$set(this.plForm,"params",res)
                        }
                    )
                }
            },

            /*批量设置参数*/
            sendPlParam(){
                this.plFormVisible = true;
                this.plCommandType = 2;
            },
            /*批量读取参数*/
            readPlParam(){
                this.plFormVisible = true;
                this.plCommandType = 1;
            }


        },

    }
</script>

