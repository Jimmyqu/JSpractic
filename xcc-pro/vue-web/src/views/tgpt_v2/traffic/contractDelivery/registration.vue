<template>
    <div class="detail-panel form-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="合同信息" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">合同编号</label>
                        <div class="input-group">
                            <span>{{detailForm.contractNumber}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">承租人</label>
                        <div class="input-group">
                            <span>{{detailForm.renter}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">承租人手机号</label>
                        <div class="input-group">
                            <span>{{detailForm.phone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{detailForm.organizationName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所需车辆台数</label>
                        <div class="input-group">
                            <span>{{detailForm.vehicleNum}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同状态</label>
                        <div class="input-group">
                            <span>{{detailForm.contractStatusText}}</span>
                        </div>
                    </div>

                </div>
            </el-collapse-item>
            <el-collapse-item title="已交车辆" name="2" v-if="detailForm.deliveryRegistrationDetails && detailForm.deliveryRegistrationDetails.length > 0">
                <div class="table-box">
                    <el-table border :data="detailForm.deliveryRegistrationDetails"  style="width: 100%">
                        <el-table-column min-width="140" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="交车日期" prop="deliveryDate" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="交车人" prop="deliveryPerson" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="交车里程(km)" prop="deliveryMileage" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="备注" prop="remark" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="附件" sortable show-overflow-tooltip>
                            <template slot-scope="{row,$index}">
                                <upload-panel :size="9" disabled :file-list.sync="row.files"></upload-panel>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-collapse-item>
            <el-collapse-item title="交车登记" name="3" >
                <el-button class="float-btn" type="primary"  @click="addDeliveryRegistration">新增</el-button>
                <div class="table-box">
                <el-form :model="addForm" label-position="top" ref="addForm" label-width="100px">
                    <el-table border :data="addForm.deliveryRegistrations" style="width: 100%">
                        <el-table-column min-width="140" label="车牌" prop="plate" label-class-name="required">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'deliveryRegistrations.'+scope.$index+'.plate'"
                                    :rules="[
                                           { required: true, message: '请选择车辆', trigger: 'change' }
                                        ]">
                                    <el-input v-model="scope.row.plate" maxlength="50" size="small" @click.native="getVehicle(scope.$index)" ></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="140" label="交车日期" prop="deliveryDate" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'deliveryRegistrations.' + $index + '.deliveryDate'"  :rules="rules.required('请选择交车日期')">
                                    <el-date-picker type="date" placeholder="请选择" v-model="row.deliveryDate"
                                                    value-format="yyyy-MM-dd" :picker-options="row.deliveryDate"
                                                    :editable="false"></el-date-picker>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="140" label="交车人" prop="deliveryPerson" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'deliveryRegistrations.' + $index + '.deliveryPerson'" :rules="rules.required('请输入交车人')">
                                    <el-input v-model="row.deliveryPerson" clearable placeholder="请输入" maxlength="50"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="140" label="交车里程(km)" prop="deliveryMileage" >
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'deliveryRegistrations.' + $index + '.deliveryMileage'"
                                              :rules="[{validator: formRule.mileage, message: '整数最大9位，小数最大2位', trigger: 'change'}]">
                                    <el-input v-model="row.deliveryMileage" clearable placeholder="请输入" maxlength="14"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="140" label="备注" prop="remark" >
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'deliveryRegistrations.' + $index + '.remark'" >
                                    <el-input v-model="row.remark" clearable placeholder="请输入" maxlength="200"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="140" label="附件" >
                            <template slot-scope="{row,$index}">
                                <el-form-item class="big" >
                                    <upload-panel :size="9" accept=".jpg,.jpeg,.png,.gif,.bmp" :show-img="false" :file-list.sync="row.fileList"></upload-panel>
                                </el-form-item>

                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="150">
                            <template slot-scope="scope">
                                <el-form-item>
                                    <el-button type="text"
                                               @click="deleteItem(scope)"
                                               style="color:#F56C6C;font-size: 13px;">删除
                                    </el-button>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
                </div>
            </el-collapse-item>

        </el-collapse>
        <div class="left-row">
            <el-button type="primary" @click="save('addForm')" >保存</el-button>
            <el-button @click="close()">返回</el-button>
        </div>


        <!-- 选择车辆弹窗 -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="选择车辆"
            :visible.sync="vehicleShow"
            width="800"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.vehicle" placeholder="请输入车牌/车型" clearable />
                            </div>
                        </div>
                        <div class="form-group organization" >
                            <label class="control-label">服务组织</label>
                            <div class="input-group organ_wrap">
                                <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                             :url="'admin/organization/tree/'+detailForm.organizationId+'?noManager=noManager'" @change="changeOrganization"></tree-select>
                                <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.serviceOrganizationId">子组织</el-checkbox>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1);">查询</el-button>
                        <el-button type="small" @click="resetList();" size="small">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectVehicle(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="plate" label="车牌" min-width="140"></el-table-column>
                        <el-table-column prop="modelName" label="车型" min-width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="serviceRegionName" label="服务组织" min-width="140"></el-table-column>
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
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import { tool, ruleTool, formRule } from '@/utils/common'
    import TreeSelect from '@/components/TreeSelect/index'
    import UploadPanel from '@/components/UploadPanel/index'

    export default {
        name: "deliveryRegistration",
        mixins: [ tool, ruleTool,formRule ],
        components:{ UploadPanel ,TreeSelect},
        data() {
            return {
                openCollapse: ["1","2","3"],
                state:false,
                searchParam:{},
                show: true,
                formRule,
                detailForm: {
                    deliveryRegistrationDetails:[
                        {
                            plate:'',
                            deliveryDate:'',
                            deliveryPerson:'',
                            deliveryMileage:'',
                            remark:'',
                            files:[],
                        }
                    ]
                },
                addForm:{
                    deliveryRegistrations:[
                        {
                            plate:'',
                            deliveryDate:'',
                            deliveryPerson:'',
                            deliveryMileage:'',
                            remark:'',
                            fileList:[],
                        }
                    ]
                },
                id: this.$route.params.id,
                vehicleShow:false,
                clickTableIndex: 0,
                organization:[]
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData(){
                ajax.get('traffic/trafficDeliveryRegistration/' + this.id,).then(rs => {
                    for(var i=0;i<rs.data.deliveryRegistrationDetails.length;i++){
                        if(rs.data.deliveryRegistrationDetails[i].attachment){
                            rs.data.deliveryRegistrationDetails[i].files = JSON.parse(rs.data.deliveryRegistrationDetails[i].attachment);
                        }
                    }
                    this.detailForm = rs.data;
                    this.detailForm.deliveryRegistrationDetails = rs.data.deliveryRegistrationDetails;

                });
            },
            addDeliveryRegistration(){
                var deliveriedNum = this.detailForm.deliveryRegistrationDetails.length + this.addForm.deliveryRegistrations.length;
                console.log(deliveriedNum);
                if(deliveriedNum == this.detailForm.vehicleNum){
                    this.$message.error('交车登记不能超过所需车台数');
                    return;
                }else{
                    this.addForm.deliveryRegistrations.push({
                        plate:'',
                        deliveryDate:'',
                        deliveryPerson:'',
                        deliveryMileage:'',
                        remark:'',
                        fileList:[],
                    })
                }

            },
            deleteItem(row){
                var index = this.addForm.deliveryRegistrations.indexOf(row)
                if (this.addForm.deliveryRegistrations.length == 1) {
                    this.$message.error('至少保留一条交车登记');
                    return;
                }
                this.addForm.deliveryRegistrations.splice(index, 1);

            },
            getVehicle(i){
                debugger
                this.listUrl = "traffic/trafficDeliveryRegistration/vehicleList?organizationId="+this.detailForm.organizationId;
                this.resetList();
                this.vehicleShow = true;
                this.clickTableIndex = i;
            },
            selectVehicle(row){
                console.log(row.id)
                if(this.addForm.deliveryRegistrations && this.addForm.deliveryRegistrations.length > 0){
                    var list = this.addForm.deliveryRegistrations;
                    for(var i=0;i<list.length;i++){
                        if(list[i].vehicleId == row.id){
                            this.$message.error("该车辆已添加");
                            return;
                        }
                    }
                }
                this.addForm.deliveryRegistrations[this.clickTableIndex].plate = row.plate;
                this.addForm.deliveryRegistrations[this.clickTableIndex].vehicleId = row.id;
                this.vehicleShow = false;
            },
            resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false)
                this.organization=[];
                this.getList();
            },
            changeOrganization(){
                if(this.organization && this.organization.length==1){
                    this.$set(this.searchParam,'serviceOrganizationId',this.organization[0])
                }else {
                    this.$set(this.searchParam,'serviceOrganizationId','')
                    this.$set(this.searchParam,'organCascade',false)

                }
            },
            save(addForm){
                if(this.addForm.deliveryRegistrations && this.addForm.deliveryRegistrations.length > 0){
                    var list = this.addForm.deliveryRegistrations;
                    for(var i=0;i<list.length;i++){
                        list[i].attachment = JSON.stringify(list[i].fileList);
                    }
                }
                let url = "traffic/trafficDeliveryRegistration/save";
                let data = {
                    contractId : this.id,
                    deliveryRegistrations : this.addForm.deliveryRegistrations
                };
                this.$refs[addForm].validate((valid) => {
                    if (valid) {
                        if(this.state) {
                            return;
                        }
                        this.state = true;
                        ajax.post(url, data) .then(res => {
                            window.setTimeout(_=>{
                                this.state = false;
                            },1000);
                            if(res.status == 0){
                                this.$message({message: '保存成功！',type: 'success'});
                                this.close();
                            }else {
                                this.$message.error(res.message);
                            }
                        }).catch(_=>{
                            window.setTimeout(_=>{
                                this.state = false;
                            },1000);
                        });
                    } else {
                        return false;
                    }
                });
            }

        }

    }
</script>

<style scoped>
    .el-dialog .list-panel .search-box .organization{
        width: calc(45% - 20px);
    }
</style>
