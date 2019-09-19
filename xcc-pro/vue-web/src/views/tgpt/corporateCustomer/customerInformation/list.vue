<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!--查询条件-->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">企业客户名称</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.name" clearable placeholder="请输入企业客户名称或简称"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">社会统一信用代码</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.taxpayerNo" clearable placeholder="请输入社会统一信用代码"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">客户经理</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.customerManager" clearable placeholder="请输入客户经理"></el-input>
                    </div>
                </div>
                <!-- <div class="form-group">
                    <label class="control-label">企业状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.enterpriseStatus" clearable placeholder="请选择企业状态">
                            <el-option v-for="item in enterpriseStatusList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div> -->
                <div class="form-group">
                    <label class="control-label">签约状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.signStatus" clearable placeholder="请选择签约状态">
                            <el-option v-for="item in signingStatusList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择" type="one"
                                     url="admin/organization/tree" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="check" @change="organCascadeCheck" :disabled="!searchParam.organId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所在城市</label>
                    <div class="input-group">
                        <city-select-panel :value.sync="nearCity4" @change="changeCity()" clearable ref="citySelect"></city-select-panel>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">企业规模</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.scale" clearable placeholder="请选择企业规模">
                            <el-option v-for="item in enterpriseScaleList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">业务助理</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.assistantManager" clearable placeholder="请输入业务助理"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">企业性质</label>
                    <div class="input-group">
                        <el-select v-model="nature" clearable multiple collapse-tags placeholder="请选择企业性质">
                            <el-option v-for="item in enterpriseNatureList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">行业分类</label>
                    <div class="input-group">
                        <el-select v-model="classification" clearable multiple collapse-tags placeholder="请选择行业分类">
                            <el-option v-for="item in classificationList" :key="item.value" :label="item.text" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <!-- <div class="form-group">
                    <label class="control-label">阶段</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.stage" clearable placeholder="请选择阶段">
                            <el-option v-for="item in stageList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div> -->
                <div class="form-group">
                    <label class="control-label">来源渠道</label>
                    <div class="input-group">
                        <el-select v-model="channel" clearable multiple collapse-tags placeholder="请选择来源渠道">
                            <el-option v-for="item in channelList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>

            </div>
        </div>
        <!--grid按钮-->
        <div class="tool-box">
            <div class="operation">
                <el-button size="mini" type="warning" v-show="addBtnShow" @click="add()">新增</el-button>
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button size="mini" v-show="exportBtnShow" @click="exportExcel()">导出</el-button>
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
        <!--grid列表部分-->
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" :data="list" style="width: 100%" border>
                <el-table-column fixed="left" label="操作" min-width="200">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row.id)" v-show="editBtnShow" type="text" size="small">编辑</el-button>
                        <el-button v-show="authorityBtnShow" @click="assignAuthority(scope.row)" type="text"
                                   size="small">分配权限
                        </el-button>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="serialNum" label="流水号" min-width="70"></el-table-column>-->
                <el-table-column prop="name" fixed sortable label="企业客户名称" show-overflow-tooltip min-width="200">
                    <template slot-scope="scope">
                        <!-- <template v-if="detailBtnShow">-->
                        <a size="mini" @click="viewCustomerInfo(scope.row.id)">{{scope.row.name}}</a>
                        <!--</template>
                        <template v-else>{{scope.row.name}}</template>-->
                    </template>
                </el-table-column>
                <el-table-column prop="shortName" sortable label="简称" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="taxpayerNo" sortable label="信用代码" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="company" sortable label="所属组织" min-width="120"></el-table-column>
                <el-table-column prop="city" sortable label="企业所在城市" min-width="120"></el-table-column>
                <!-- <el-table-column prop="stage" sortable label="阶段" min-width="100"></el-table-column> -->
                <el-table-column prop="scale" sortable label="企业规模" min-width="100"></el-table-column>
                <el-table-column prop="nature" sortable label="企业性质" min-width="100"></el-table-column>
                <el-table-column prop="signDate" sortable label="签约日期" min-width="100"></el-table-column>
                <el-table-column prop="customerManager" sortable label="客户经理" min-width="100"></el-table-column>
                <el-table-column prop="assistantManager" sortable label="业务助理" min-width="100"></el-table-column>
                <el-table-column prop="contactName" sortable label="企业联系人" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.contactName==''?'/':scope.row.contactName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="contactPhone" sortable label="联系人手机号" min-width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.contactPhone==''?'/':scope.row.contactPhone}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="enterpriseStatus" sortable label="企业状态" min-width="100"></el-table-column> -->
                <el-table-column prop="signStatus" sortable label="签约状态" min-width="100"></el-table-column>
                <el-table-column prop="classification" sortable label="行业分类" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="creater" sortable label="创建人" min-width="100"></el-table-column>
                <el-table-column prop="createTime" sortable label="创建时间" min-width="140"></el-table-column>
                <el-table-column prop="updateTime" sortable label="更新时间" min-width="140"></el-table-column>
            </el-table>

        </div>
        <!-- 权限分配、权限详情-->
        <permissionForm ref="permissionForm"></permissionForm>
    </div>
</template>

<script>
    import permissionForm from '@/views/tgpt/corporateCustomer/customerInformation/permissionForm.vue'
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelectPanel from '@/components/CitySelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        name: 'corporateCustomerInformation',
        mixins: [tool],
        components: { CitySelectPanel,TreeSelect,permissionForm},
        data() {
            return{
            check:false,
            dialogFormVisible: false,
            showSearch: false,
            addBtnShow: this.getCurrentUserAuthority("enterprise/add"),
            editBtnShow:this.getCurrentUserAuthority("enterprise/edit"),
            exportBtnShow:this.getCurrentUserAuthority("enterprise/export"),
            importBtnShow:this.getCurrentUserAuthority("enterprise/import"),
            detailBtnShow:this.getCurrentUserAuthority("enterprise/detail"),
            authorityBtnShow: true,
            channelList: [
                {
                    value: '1',
                    label: '招投标'
                }, {
                    value: '2',
                    label: '自主开发'
                }, {
                    value: '3',
                    label: '媒体渠道'
                }, {
                    value: '4',
                    label: '转介绍'
                }],
            stageList: [
                {
                    value: '1',
                    label: '初步接治'
                }, {
                    value: '2',
                    label: '确认需求'
                }, {
                    value: '3',
                    label: '方案报价'
                }, {
                    value: '4',
                    label: '谈判'
                }, {
                    value: '5',
                    label: '签约'
                }, {
                    value: '6',
                    label: '其它'
                }],
            classificationList: [],
            enterpriseNatureList: [
                {
                    value: '1',
                    label: '国营'
                }, {
                    value: '2',
                    label: '民营'
                }, {
                    value: '3',
                    label: '合资'
                }, {
                    value: '4',
                    label: '外资'
                }, {
                    value: '5',
                    label: '其他'
                }],
            enterpriseScaleList: [
                {
                    value: '1',
                    label: '大型企业'
                }, {
                    value: '2',
                    label: '中型企业'
                }, {
                    value: '3',
                    label: '小型企业'
                }],
            signingStatusList: [
                {
                    value: '1',
                    label: '未签约'
                }, {
                    value: '2',
                    label: '已签约'
                }],
            enterpriseStatusList: [
                {
                    value: '1',
                    label: '待开拓'
                }, {
                    value: '2',
                    label: '开拓中'
                }, {
                    value: '3',
                    label: '正常'
                }, {
                    value: '4',
                    label: '逾期'
                }, {
                    value: '5',
                    label: '停止开拓'
                }, {
                    value: '6',
                    label: '停用'
                }, {
                    value: '7',
                    label: '黑名单'
                }],
            companys:[],
            organization:[],
            nearCity4:[],
            nature:[],
            classification:[],
            channel:[],
            companyId:"",
            listUrl:"base/enterprise/list",

            }
        },
        activated(){
            this.getList();
        },
        mounted: function () {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.selectClassifications();
        },
        watch: {},
        methods:{
            getListBefore(params) {
                //params.organCascade = params.organCascade ? 1 : 0;
                /*if (this.organization && this.organization.length>0){
                    params.organId = this.organization.join(',');
                    this.searchParam.organId = this.organization.join(',');
                } else{
                    params.organId = '';
                    this.searchParam.organId = '';
                }*/

                if(this.nature && this.nature.length>0){
                    params.nature=this.nature.join(',');
                    this.searchParam.nature=this.nature.join(',');
                }else{
                    params.nature='';
                    this.searchParam.nature='';
                }

                if(this.classification && this.classification.length>0){
                    params.classification=this.classification.join(',');
                    this.searchParam.classification=this.classification.join(',');
                }else{
                    params.classification='';
                    this.searchParam.classification='';
                }

                if(this.channel && this.channel.length>0){
                    params.channel=this.channel.join(',');
                    this.searchParam.channel=this.channel.join(',');
                }else{
                    params.channel='';
                    this.searchParam.channel='';
                }
            },
            organCascadeCheck(check){
                this.check = check;
                if(check==true){
                    this.searchParam.organCascade=1;
                }else{
                    this.searchParam.organCascade=0;
                }
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organId=this.organization[0];
                }else{
                    this.check = false;
                    this.searchParam.organId = '';
                    this.$set(this.searchParam,'organCascade',0);
                }
            },
            resetList(){
                this.searchParam={};
                this.check = false;
                this.$set(this.searchParam,'organCascade',0);
                this.nearCity4=[];
                this.organization=[];
                this.channel=[];
                this.classification=[];
                this.nature=[];
                this.getList();
            },
            assignAuthority(row, showButton) {
                this.$refs.permissionForm.open(row, showButton);
            },
           /* getList(callback){
                //const params = this.searchParam;
                let params = Object.assign({},this.searchParam);
                if(params.city && Array.isArray(params.city) && params.city.length==2)
                    params.city=params.city[1];
                this.getListByUrl("base/enterprise/list");
                /!*params.rows = this.pageSize;
                params.page = this.page;
                ajax.get(this.listUrl,params).then(res => {
                    this.list = res.rows;
                    this.listCount = res.records;
                    $.isFunction(callback) && callback(res);
                })*!/
            },*/

            selectClassifications(){
                var $this=this;
                ajax.get("base/enterprise/selectdicts/行业分类").then(result=>{
                    if(result.status==0){
                        $this.classificationList=result.data;
                    }else{
                        console.log(result.message);
                    }
                });
            },

            viewCustomerInfo(id) {
                this.$router.push({path:"/tgpt/corporateCustomer/customerInformation/detail/"+id});
            },
            exportExcel(){
                location.href = this.exportUrl("base/enterprise/export?" + $.param(this.searchParam));
            },
            changeCity(){
                if(this.nearCity4 && this.nearCity4.length>=2) {
                    this.searchParam.city = this.nearCity4[1];
                }else{
                    this.searchParam.city = '';
                }
            },
            importExcel() {
                var $this = this;
                //上传文件
                $('#importfile').fileupload(
                    {
                        url: "base/enterprise/import",
                        //dataType: 'json',
                        acceptFileTypes: /(\.|\/)(xls|xlsx)$/i,
                        maxFileSize: 10 * 1024 * 1024,
                        messages: {
                            maxFileSize: '上传失败，文件大小超限',
                            acceptFileTypes: '上传失败，文件格式不正确'
                        },
                        processfail: function (e, data) {
                            var currentFile = data.files[data.index];
                            if (data.files.error && currentFile.error) {
                                // toastr.error(currentFile.error);
                                $this.$message({message: currentFile.error,type: 'error'});
                            }
                        },
                        done: function (e, data) {
                            $("#importConfirm").modal("hide");
                            if (data.result.ResultSign == "Successful") {
                                var message = data.result.MessageKey == null ? data : data.result.MessageKey;
                                $("#importResult").modal("show");
                                $("#resultDiv").html("以下企业信息导入失败：<br>" + message);
                                $("#addExcel").modal("hide");
                            } else if (data.result.ResultSign == "Error") {
                                var message = data.result.MessageKey == null ? data : data.result.MessageKey;
                                $this.$message({message: message,type: 'error'});
                                $("#addExcel").modal("hide");
                            } else {
                                $this.$message({message: "导入成功",type: 'success'});
                                $("#addExcel").modal("hide");
                            }

                        }
                    }
                );

            }
        }
    }
</script>


<style scoped lang="scss">
    .organ_wrap {
        display: flex;

        .tree-select-panel {
            width: 100%;
        }

        .el-checkbox {
            display: flex;
            align-items: center;
            margin-left: 10px;
            margin-right: 0;

            /deep/ .el-checkbox__label {
                font-size: 12px;
            }
        }
    }

    .list-panel .search-box .input-group {
        width: calc(100% - 65px);
    }
</style>
