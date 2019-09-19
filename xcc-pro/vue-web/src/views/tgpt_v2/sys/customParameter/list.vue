<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">管理公司</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.orgId" filterable clearable placeholder="请选择管理公司">
                            <el-option
                                v-for="item in orgIdList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>

        </div>


        <div class="tool-box">
            <div class="operation">
                <el-button  v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
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
                        <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">编辑</el-button>
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label="管理公司" prop="orgId" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="150" label="年检即将到期(天数)" prop="inspection" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="150" label="保单即将到期(天数)" prop="insurance" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="150" label="通行证即将到期(天数)" prop="passMaturity" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="160" label="距下次保养里程(公里)" prop="maintenance" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="违章未处理(天数)" prop="violation" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="150" label="疲劳驾驶里程(公里)" prop="fatigueMile" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="150" label="疲劳驾驶时长(小时)" prop="fatigueTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="怠速阀值(分钟)" prop="idleSpeed" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="150" label="违章查询周期(天数)" prop="violationCycle" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="违章最后查询时间" prop="violationTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="违章查询状态" prop="isViolation" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                       {{scope.row.isViolation==1?"开启":"关闭"}}
                    </template>
                </el-table-column>

                <el-table-column min-width="120" label="操作者" prop="updater" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="150" label="操作时间" prop="updateTime" sortable show-overflow-tooltip></el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'customParameter',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                showEditBtn: this.getCurrentUserAuthority('customParameter/edit'),
                showAddBtn:this.getCurrentUserAuthority('customParameter/add'),
                listUrl: 'base/baseParamSet/selectParamSetList',
                orgIdList: []
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.getOrgIdList();
        },
        methods: {
            //获取管理公司
            getOrgIdList() {
                ajax.get("base/baseParamSet/selectOrganization").then(
                    res => {
                        if (res.data.length > 0) {
                            this.orgIdList = res.data;
                        } else {
                            this.orgIdList = [];
                        }
                    }
                )
            }
        }
    }
</script>

