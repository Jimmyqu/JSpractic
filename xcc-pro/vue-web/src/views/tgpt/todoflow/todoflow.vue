<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="待办" name="1"></el-tab-pane>
            <el-tab-pane label="已办结" name="2"></el-tab-pane>
        </el-tabs>

        <div class="row form-horizontal search-box min">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">业务单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.businessNo" clearable autocomplete="off"
                                  placeholder="请输入业务单号查询"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <el-button type="primary" class="defaultSearchButton" size="small"
                           @click="modelActiveName='ALL';handleCurrentChange(1)">查询
                </el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>
        </div>
        <div class="table-box" v-loading="listLoading">
            <el-tabs tab-position="left" v-model="modelActiveName" class="left-box" @tab-click="modelHandleClick">
                <el-tab-pane v-for="(item,index) in models" :key="index" :label="item.modelName"
                             :name="item.modelCode"></el-tab-pane>
            </el-tabs>
            <div class="table-content">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-sizes="pageSizeSetting"
                    :page-size="pageSize"
                    :layout="pageLayout"
                    :total="listCount">
                </el-pagination>
                <el-table :ref="getRefName" :max-height="tableHeight" border :data="list" style="width: 100%">
                    <el-table-column fixed="left" label="操作" min-width="200">
                        <template slot-scope="scope">
                            <el-button v-show="showApprovalBtn&&activeName=='1'" @click="openApproval(scope.row)"
                                       type="text"
                                       size="small">审批
                            </el-button>
                            <el-button v-show="showDetailBtn" @click="toDetail(scope.row, this)" type="text"
                                       size="small">查看
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="businessNo" sortable label="业务单号" min-width="300">
                    </el-table-column>
                    <el-table-column prop="modelName" sortable label="业务模块" min-width="300"></el-table-column>
                    <el-table-column prop="positionName" sortable label="主办" min-width="300"></el-table-column>
                    <el-table-column prop="createTime" sortable label="创建时间" min-width="300"></el-table-column>
                    <el-table-column v-if="activeName=='2'" prop="endTime" sortable label="完成时间"
                                     min-width="300"></el-table-column>
                </el-table>
            </div>

        </div>
        <!-- 流程审批 -->
        <el-dialog :title="title" :visible.sync="approvalVisible" :append-to-body="true">
            <el-form :model="approvalForm" :rules="rules" label-position="top" ref="approvalForm" class="full-input">
                <el-form-item label="审批状态" prop="passType">
                    <el-select v-model="approvalForm.passType" placeholder="请选择">
                        <el-option
                            v-for="item in approvalStatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审批意见" prop="message">
                    <el-input type="textarea" v-model="approvalForm.message"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close('approvalForm')">取 消</el-button>
                <el-button type="primary" @click="approval('approvalForm')" :disabled="approveDisabled">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {WORKFLOW_CONFIG} from '@/utils/index'
    import $ from 'jquery-slim'

    console.log(WORKFLOW_CONFIG)


    export default {
        mixins: [tool],
        data() {
            return {
                title: "流程审批",
                activeName: "1",
                modelActiveName: "ALL",
                listUrl: "workflow/workflow/todoList",
                showApprovalBtn: true,
                approveDisabled: false,
                showDetailBtn: true,
                approvalStatusList: [{value: '1', label: '同意'}, {value: '2', label: '不同意'}],
                approvalForm: {},
                models: [],
                approvalVisible: false,
                rules: {
                    passType: [
                        {required: true, message: '请选择审批状态', trigger: 'blur'}
                    ]
                },
                selectData: null
            }
        },
        mounted() {
            var $this = this;
            $this.getList();
            $this.getTodoModelList();
        },
        methods: {
            handleClick(tab, event) {
                debugger
                this.modelActiveName='ALL';
                this.activeName = tab.name;
                this.searchParam.taskType = tab.name;
                this.searchParam.modelCode='';
                this.searchParam.businessNo='';
                this.searchParam=Object.assign({},this.searchParam);
                this.getList();
                this.getTodoModelList();
            },
            modelHandleClick(tab, event) {
                this.searchParam.modelCode = tab.name == "ALL" ? "" : tab.name;
                this.getList();
            },
            openApproval(data) {
                this.selectData = data;
                this.approvalForm = {};
                this.approvalVisible = true;
            },
            toDetail(data, event) {
                /*$(event).data("href", WORKFLOW_CONFIG.MODAL_TYPE[data.modelCode].DETAIL_URL + data.businessKey);
                $(event).data("title", data.modelName + "详情");
                $(event).data("index", data.modelCode);
                showIFrameTab(event);*/
                console.log((WORKFLOW_CONFIG.MODAL_TYPE[data.modelCode].DETAIL_URL + data.businessKey));
                this.$router.push({path: (WORKFLOW_CONFIG.MODAL_TYPE[data.modelCode].DETAIL_URL + data.businessKey)});
            },
            approval(approvalForm) {
                this.$refs[approvalForm].validate((valid) => {
                    if (valid) {
                        let url = "workflow/workflow/approval";
                        this.approvalForm.businessId = this.selectData.businessKey;
                        this.approvalForm.modelCode = this.selectData.modelCode;
                        this.approvalForm.businessService = WORKFLOW_CONFIG.MODAL_TYPE[this.selectData.modelCode].SERVICE;
                        this.approveDisabled = true;
                        ajax.post(url, this.approvalForm).then((res) => {
                            this.approveDisabled = false;
                            if (res.status == 0) {
                                this.showMessage(res.message, "success");
                                this.getList();
                                this.close();
                            } else {
                                this.showMessage(res.message, "error");
                            }

                        });
                    } else {
                        return false;
                    }
                });
            },
            getTodoModelList() {
                ajax.get("workflow/workflow/todoModelList?taskType=" + this.activeName).then(res => {
                    if (res.status == 0) {
                        this.models = res.data;
                        this.models.unshift({modelName: "全部", modelCode: "ALL"});
                    }
                });
            },
            close() {
                this.approvalVisible = false;
            },
        }
    }
</script>

<style rel="stylesheet/scss" scoped lang="scss">

    .row-bg {
        padding: 10px 0;
    }


    .box-card {
        margin: 20px 10px;
        min-width: 450px;
    }

    .list-panel {
        position: relative;
        padding: 0;
    }

    .list-panel .search-box {
        width: 100%;
        margin: 0;
    }

    .table-box {
        background: #fff;
        border: 1px solid #eee;
        display: flex;
        padding-right: 20px;
        padding-bottom: 20px;
        margin-left: 20px;
        margin-right: 20px;
        position: relative;
    }

    .table-box:before {
        content: "";
        position: absolute;
        left: 220px;
        top: 0;
        width: 1px;
        height: 100%;
        background: #eee;
    }

    .left-box {
        width: 230px;
        padding-top: 20px;
        padding-left: 15px;
    }

    .left-box /deep/ .el-tabs__nav.is-left {
        display: flex;
        flex-direction: column;
        width: calc(100% - 40px);
        margin-left: 0;
    }

    .left-box /deep/ .el-tabs__header.is-left {
        width: 220px;
        margin-right: 20px;
    }

    .left-box /deep/ .el-tabs__item.is-left {
        text-align: center;
        margin: 0;
    }

    .left-box /deep/ .el-tabs__nav-wrap::after {
        display: none;
    }

    .table-content {
        width: calc(100% - 240px);
    }

</style>
