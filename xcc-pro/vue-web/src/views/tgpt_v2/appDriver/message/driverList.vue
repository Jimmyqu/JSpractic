<template>
    <el-dialog title="发布司机" :visible.sync="driverShow" :append-to-body="true" width="70%" >
        <div class="wrapper wrapper-content  fadeInRight list-panel" v-cloak>
            <div class="row form-horizontal search-box" v-show="flag">
                <div class="form-box">
                    <!--<div class="form-group">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                         url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        </div>
                    </div>-->
                    <div class="form-group">
                        <label class="control-label">服务城市</label>
                        <div class="input-group">
                            <city-select :value.sync="serviceCity" @change="changeCity()" placeholder="请选择服务城市"></city-select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">合同编号</label>
                        <div class="input-group">
                            <el-input  v-model="searchParam.contractNo" placeholder="请输入合同编号" clearable />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">工作类型</label>
                        <div class="input-group">
                            <el-select v-model="searchParam.workType" clearable placeholder="请选择工作类型">
                                <el-option label="专职长租" value="1"></el-option>
                                <el-option label="专职短租" value="2"></el-option>
                                <el-option label="兼职短租" value="3"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">服务状态</label>
                        <div class="input-group">
                            <el-select v-model="searchParam.serviceStatus" clearable placeholder="请选择服务状态">
                                <el-option label="空闲" value="1"></el-option>
                                <el-option label="服务中" value="2"></el-option>
                                <el-option label="休假" value="3"></el-option>
                                <el-option label="停用" value="4"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">司机姓名</label>
                        <div class="input-group">
                            <el-input  v-model="searchParam.name" placeholder="请输入司机姓名" clearable />
                        </div>
                    </div>
                </div>
                <div class="search-btn-list">
                    <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                    <el-button size="small" @click="resetList2()">重置</el-button>
                </div>
            </div>
            <div class="row">
                <el-table :data="list" style="width: 100%;" border>
                    <el-table-column prop="name" label="司机姓名"  min-width="120" ></el-table-column>
                    <el-table-column prop="phone" label="手机号" min-width="120"></el-table-column>
                    <el-table-column prop="sex" label="性别" min-width="120"></el-table-column>
                    <el-table-column prop="serviceCity" label="服务城市" min-width="80"></el-table-column>
                    <el-table-column prop="workType" label="工作类型" min-width="120"></el-table-column>
                    <el-table-column prop="serviceStatus" label="服务状态" min-width="100"></el-table-column>
                    <el-table-column prop="orgName" label="所属组织" min-width="100"></el-table-column>
                    <el-table-column prop="contractNo" label="合同编号" min-width="100"></el-table-column>
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

            <div class="left-row" style="padding-bottom: 20px" v-show="flag">
                <el-button type="primary" @click="confirmPublish()">确认发布</el-button>
                <el-button @click="cancel()">取消</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    export default {
        name: "driverListPanel",
        mixins: [tool],
        components:{TreeSelect,CitySelect},
        data(){
            return {
                driverShow:false,
                flag:'',
                organization:[],
                serviceCity:[],
                listUrl:'app/appDriverMessage/driverlist',
            }
        },
        methods:{
            resetList2(){
                this.searchParam={};
                this.serviceCity=[];
                this.getList();
            },
            open(id,organizationId,flag){
                this.searchParam={};
                this.serviceCity=[];
                this.driverShow = true;
                this.flag=flag;
                this.searchParam.id=id;
                if(organizationId){
                    this.searchParam.organizationId=organizationId;
                }
                this.getList();
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1)
                    this.searchParam.orgId=this.organization[0];
            },
            changeCity(){
                if(this.serviceCity && this.serviceCity.length>=2)
                    this.searchParam.serviceCityId=this.serviceCity[1];
            },
            cancel(){
                this.driverShow = false;
            },
            confirmPublish(){
                ajax.post('app/appDriverMessage/publish', this.searchParam).then(rs => {
                    if (rs.status == 0) {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.driverShow=false;
                        this.$emit('load');
                    }else{
                        this.$message({
                            message: rs.msg,
                            type: 'success'
                        });
                    }
                });
            }
        },
        mounted(){

        }
    }
</script>
