<template>
    <el-dialog title="添加车辆" :visible.sync="show" :append-to-body="true" width="70%" >
        <div class="wrapper wrapper-content  fadeInRight list-panel" v-cloak>
            <div class="row form-horizontal search-box">
                <div class="form-box">
                    <div class="form-group">
                        <label class="control-label">车辆所属</label>
                        <div class="input-group">
                            <el-select v-model="searchParam.assetsType" placeholder="不限">
                                <el-option label="自有" value="1"></el-option>
                                <el-option label="租赁" value="2"></el-option>
                                <el-option label="挂靠" value="3"></el-option>
                                <el-option label="个人" value="4"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">所属部门</label>
                        <div class="input-group">
                            <tree-select v-model="regions" placeholder="请选择" type="one"
                                         :url="treeUrl"></tree-select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">车牌</label>
                        <div class="input-group">
                            <el-input  v-model="searchParam.plate" placeholder="请输入车牌" clearable />
                        </div>
                    </div>
                </div>
                <div class="search-btn-list">
                    <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                    <el-button size="small" @click="resetList()">重置</el-button>
                </div>
            </div>
            <div class="row">
                <el-table :data="list" style="width: 100%;" border height="calc(100vh - 450px)">
                    <!--<el-table-column fixed="left" label="操作" min-width="50">
                        <template slot-scope="scope">
                            <el-button @click="changeVehicle(scope.row)" type="text" size="small">选择</el-button>
                        </template>
                    </el-table-column>-->
                    <el-table-column fixed="left" label="选择" width="80">
                        <template slot-scope="scope">
                            <el-checkbox v-model="organCascade[scope.$index]"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column prop="plate" label="车牌" min-width="80"></el-table-column>
                    <el-table-column prop="assetsType" label="车辆所属" min-width="100" ></el-table-column>
                    <el-table-column prop="attributionRegion" label="服务组织" min-width="150"></el-table-column>
                    <el-table-column prop="vehicleModel" label="车型信息" min-width="200"></el-table-column>

                    total
                    <el-table-column prop="areaCount" sortable label="关联栅栏" min-width="100"
                                     show-overflow-tooltip>

                        <template slot-scope="scope">
                            <span>{{scope.row.areaCount}}</span>
                            <el-popover v-if="scope.row.areaCount > 0"
                                        placement="left"
                                        width="400"
                                        trigger="hover">

                                <ul class="_a_v_ul_list">
                                    <li v-for="(va,i) in scope.row.vas" :key="i">
                                        <el-row :gutter="20" class="t_popover">
                                            <el-col :span="14">
                                                栅栏名称：{{va.name}}
                                            </el-col>
                                            <el-col :span="8">
                                                状态：
                                                <el-tag size="small" type="success" v-if="va.fenceStatus==1">已启用</el-tag>
                                                <el-tag size="small" type="info" v-if="va.fenceStatus==2">未启用</el-tag>
                                            </el-col>
                                        </el-row>

                                        <div class="city_wrap">停止报警时间段: {{va.startTime}}-{{va.endTime}}</div>
                                        <div class="city_wrap">停止时长限制: {{va.stopTime}}小时</div>
                                    </li>
                                </ul>

                                <el-button type="text" slot="reference" class="abs_right_v">
                                    查看
                                </el-button>
                            </el-popover>
                        </template>
                    </el-table-column>

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
                <div class="left-row" style="padding-bottom: 20px">
                    <el-button @click="selectAll()">全选</el-button>
                    <el-button type="primary" @click="dblClickHandle()">添加</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'

    export default {
        name: "assignVehicle",
        mixins: [tool],
        components: { TreeSelect },
        data(){
            return {
                show:false,
                organCascade:[],
                timeFenceId : '',
                regions:[],
                treeUrl:""
            }
        },
        methods:{
            getListBefore(params){
                if (this.regions){
                    params.companyId = this.regions[0];
                }
                var organ=[];
                for(var i = 0;i<this.list.length;i++) {
                    organ[i] = false;
                }
                this.$set(this,"organCascade",organ);
            },
            open(id,organizationId){
                this.treeUrl= "admin/organization/tree/"+organizationId;
                this.searchParam = {
                    companyId:[]
                };
                this.regions[0] =  organizationId;
                this.timeFenceId = id;
                this.getListByUrl("base/baseTimeOutFence/selectAddVehicle?timeOutFenceId=" + id+"&organizationId="+organizationId);
                this.show = true;
            },
            dblClickHandle() {
                let that = this;
                var vehicleIds="";
                var length=0;
                for (var i=0;i<this.organCascade.length;i++){
                    if(this.organCascade[i] == true){
                        vehicleIds+=this.list[i].id+","
                        length++
                    }
                }
                if(length<1){
                    this.$message({message: '请选择需要添加的车辆', type: 'warning'});
                    return;
                }
                vehicleIds=vehicleIds.substring(0,vehicleIds.length-1)
                this.$confirm('确定添加（' + length + '）辆车?')
                    .then(() => {
                        ajax.post('/base/baseTimeOutFence/addVehicle', {timeOutFenceId: this.timeFenceId, vehicleIds: vehicleIds})
                            .then(res => {
                                if(res.status==0) {
                                    this.$message({message: '操作成功', type: 'success'});
                                    this.$emit('reload');
                                    that.getList();
                                }else{
                                    this.$message({message: res.message, type: 'error'});
                                }
                            });
                    }).catch(res => {
                    console.log('res', res);
                });
            },selectAll(){
                var isAelectAll=1;
                for(var i = 0;i<this.list.length;i++) {
                    if (this.organCascade[i] == null || this.organCascade[i] == '' || this.organCascade[i] != true) {
                        isAelectAll=0;
                    }
                }
                var organ=[];
                for(var i = 0;i<this.list.length;i++) {
                    if (isAelectAll==1) {
                        organ[i] = false;
                    }else {
                        organ[i] = true;
                    }
                }
                this.$set(this,"organCascade",organ);
            }
        }
    }
</script>
