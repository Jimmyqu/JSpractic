<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">设备状态</label>
                    <div class="input-group">
                        <template>
                            <el-select v-model="searchParam.status" placeholder="请选择" clearable>
                                <el-option label="在线" :value="1"></el-option>
                                <el-option label="断线" :value="2"></el-option>
                                <el-option label="离线" :value="3"></el-option>
                                <el-option label="未上线" :value="4"></el-option>
                            </el-select>
                        </template>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.keyWord" placeholder="车牌号/IMEI" clearable></el-input>
                    </div>
                </div>
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
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
                        <el-button v-show="showInstallBtn" type="text" @click="stopOilPower(scope.row.imei)">操作</el-button>
                        <el-button v-show="showHistoryBtn" type="text" @click="history(scope.row.imei)">语音控制记录</el-button>
                    </template>
                </el-table-column>
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
            </el-table>
        </div>


        <!--设置参数弹出框-->
        <el-dialog  :visible.sync="readFormVisible" width="40%" top="5%"  >
            <div slot="title">
                语音控制
            </div>
            <el-form ref="readForm" :model="readForm" label-width="80px" :rules="readFormRules" >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="IMEI">
                            {{readForm.imei}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="参数类型"  prop="selectParam">
                            <el-select v-model="readForm.selectParam" placeholder="请选择">
                                <el-option
                                    v-for="item in readForm.params"
                                    :key="item.name"
                                    :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12"  v-show="readForm.selectParam== 4">
                        <el-form-item label="电话号码" prop="phone">
                            <el-input :rules="rules.required('请输入手机号')" v-model="readForm.phone" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12"  v-show="readForm.selectParam== 88040 || readForm.selectParam== 88041">
                        <el-form-item label="录音时长" prop="recordTime">
                            <el-input v-model="readForm.recordTime" :rules="rules.int(true,[1,300],'请输入1-300的整数')" placeholder="请输入1-300的整数"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12"  v-show="readForm.selectParam== 88040 || readForm.selectParam== 88041">
                        <el-form-item label="录音质量" prop="quality">
                            <el-select v-model="readForm.quality" clearable placeholder="请选择录音质量">
                                <el-option label="一般" :value="1"></el-option>
                                <el-option label="高清" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="readFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitParam()">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import UploadSubmit from '@/components/UploadSubmit'
    import ajax from '@/utils/request'
    import {tool, ruleTool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'speechControl',
        mixins: [tool, ruleTool],
        components: { TreeSelect,UploadSubmit },
        data() {
            return {
                showSearch: false,
                organization:[],
                searchParam: {
                },
                showInstallBtn: this.getCurrentUserAuthority('speechControl/install'),
                showHistoryBtn: this.getCurrentUserAuthority('speechControl/history'),
                listUrl: 'obd/obdSpeechControl/list',
                eadFormVisible: false,
                readFormRules:{
                    selectParam : [{ required: true, message: '请选择参数类型', trigger: 'change' }]
                },
                readFormVisible:false,
                readForm:{}
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            this.getList();
        },
        methods: {
            resetList(){
                this.searchParam={};
                this.organization=[];
                this.handleCurrentChange(1);
            },
            changeOrganization(){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organizationId=this.organization[0];
                }else{
                    this.searchParam.organizationId='';
                }
            },
            /* 语音控制弹框 */
            stopOilPower(imei){
                //弹出选择框
                this.readForm = {
                    imei: imei,
                    modalName: "搏实结A5E-5",
                    params: [{name:68,text:"自动接听功能开启",id:68},
                            {name:69,text:"自动接听功能关闭",id:69},
                            {name:4,text:"电话回拨",id:4},
                            {name:88041,text:"开始录音",id:88041},
                            {name:88040,text:"停止录音",id:88040},
                           ],
                    data: []
                }
                this.readFormVisible = true;
            },
            history(id){
                this.$router.push({path:"/tgpt_v2/alarm/speechControl/history/"+id});
            },
            /*批量设置提交*/
            submitParam(){
                /*表单数据验证*/
                this.$refs['readForm'].validate((valid) => {
                    if(valid){
                        var submitForm={
                            imei:this.readForm.imei,
                            type:this.readForm.selectParam,
                            recordTime:this.readForm.recordTime,
                            quality:this.readForm.quality,
                            phone:this.readForm.phone
                        }
                        ajax.get(`obd/obdSpeechControl/speechControl`,submitForm).then(
                            res => {
                                if(res.status == 0) {
                                    this.readFormVisible = false;
                                    this.showMessage('设置参数成功', 'success');
                                }else {
                                    this.showMessage('设置参数失败');
                                }
                            },error =>{
                                this.showMessage('设置参数失败');
                            }
                        )

                    }
                });
            },
        }
    }
</script>

