<template>
    <el-dialog title="添加车辆" :visible.sync="dialogVisible" width="900px" class="vehicle-dialog" append-to-body>
        <el-row :gutter="20" style="margin:15px">
            <el-col :span="7">
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
            </el-col>
            <el-col :span="6">
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group">
                        <tree-select v-model="regions" mode="select" :url="treeUrl"
                                     type="one"></tree-select>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="车牌"></el-input>
                    </div>
                </div>
            </el-col>
            <el-col :span="5">
                <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </el-col>
        </el-row>


        <div class="row tool-box">
        </div>
        <div class="row">
            <el-table border :data="list" style="width: 100%" height="calc(100vh - 450px)">

                <el-table-column fixed="left" label="选择" width="80">
                    <template slot-scope="scope">
                        <el-checkbox v-model="organCascade[scope.$index]"></el-checkbox>
                    </template>
                </el-table-column>

                <el-table-column prop="plate" sortable label="车牌" min-width="100"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="assetsTypeVal" sortable label="车辆所属" min-width="100"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="attributionRegionVal" sortable label="部门" min-width="100"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="vehicleModelInfo" sortable label="车型" min-width="300"
                                 show-overflow-tooltip></el-table-column>
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
                                            <el-tag type="success" v-if="va.fenceStatus==1">已启用</el-tag>
                                            <el-tag type="info" v-if="va.fenceStatus==0">未启用</el-tag>
                                        </el-col>
                                    </el-row>

                                    <div class="city_wrap">允许运行城市: {{va.cityName}}</div>
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
    </el-dialog>
</template>

<script>
    import ajax from '@/utils/request'
    import TreeSelect from '@/components/TreeSelect/index'
    import {tool} from '@/utils/common'

    export default {
        name: 'vehicle-dialog',
        mixins: [tool],
        components: {TreeSelect},
        data() {
            return {
                dialogVisible: false,
                searchParam: {},
                organCascade:[],
                regions:[],
                listUrl: '/base/baseAreaFence/vehicle',
                areaId: '',
                treeUrl:""
            }
        },
        methods: {
            open(aId,companyId) {
                this.treeUrl= "admin/organization/tree/"+companyId;
                this.searchParam = {
                    region:[]
                };
                this.dialogVisible = true;
                this.areaId = aId;
                this.regions[0]=companyId;
                this.getList();
            },
            getListBefore(param) {
                param.areaId=this.areaId;
                if (this.regions){
                    param.region = this.regions[0];
                }

                var organ=[];
                for(var i = 0;i<this.list.length;i++) {
                    organ[i] = false;
                }
                this.$set(this,"organCascade",organ);
            },
            getListAfter() {
                this.list.forEach(obj => {
                    obj.areaCount = obj.vas ? obj.vas.length : 0;
                });
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
                        ajax.post('/base/baseAreaFence/areaFenceToVehicle', {areaId: this.areaId, vehicleIds: vehicleIds})
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
    };
</script>

<style>
    .vehicle-dialog .form-group .control-label {
        display: inline-block !important;
        width: 65px;
    }

    .vehicle-dialog .form-group .input-group {
        display: inline-block !important;
        width: calc(100% - 70px);
    }

    .vehicle-dialog .abs_right_v {
        position: absolute;
        right: 15px;
        top: 12px;
    }

    .t_popover {
        line-height: 30px;
        margin-top: -10px;
    }

    .t_popover .el-tag {
        height: 22px;
        line-height: 20px;
    }

    .city_wrap {
        padding: 7px;
        font-size: 12px;
    }

    ._a_v_ul_list > li {
        margin-bottom: 15px;
        background: #f3f3f3;
        padding: 15px 7px 7px 7px;
    }

    ._a_v_ul_list > li:last-child {
        margin-bottom: 0px;
    }

    .vehicle-dialog .el-popover {
        padding-bottom: 0;
        padding-top: 0;
    }
</style>
