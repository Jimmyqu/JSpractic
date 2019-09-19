<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">维修厂名称</label>
                    <div class="input-group">
                        <el-input id="name" name="name" v-model="searchParam.name"  type="text"
                                  clearable  placeholder="请输入修理厂名称"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">联系人</label>
                    <div class="input-group">
                        <el-input id="contacts" name="contacts" v-model="searchParam.contacts"
                                  clearable type="text" placeholder="请输入联系人"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">联系人手机号</label>
                    <div class="input-group">
                        <el-input id="contactsPhone" name="contactsPhone" v-model="searchParam.contactsPhone"
                                  clearable  type="text" placeholder="请输入联系人手机号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">城市</label>
                    <div class="input-group">
                        <city-select :value.sync="nearCity4" @change="changeCity()" ref="citySelect"></city-select>
                    </div>
                </div>

            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>

            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button size="mini" type="warning" v-if="showAddBtn" @click="add()">新增</el-button>
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border style="width: 100%;" :data="list">
                <el-table-column label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-button @click="stop(scope.row.id,0)" type="text" size="small"
                                   v-if="showStopBtn && scope.row.state == 1">停用</el-button>
                        <el-button @click="stop(scope.row.id,1)" type="text" size="small"
                                   v-if="showStopBtn && scope.row.state == 0">启用</el-button>
                        <el-button @click="edit(scope.row.id)" type="text" size="small" v-if="showEditBtn">编辑</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="维修厂名称" min-width="140" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" @click="toDetail(scope.row)">
                            {{scope.row.name}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="state" label="维修厂状态" min-width="100" sortable>
                    <template slot-scope="scope">
                        <span v-if="scope.row.state == 0">停用</span>
                        <span v-if="scope.row.state == 1">启用</span>
                    </template>
                </el-table-column>
                <el-table-column prop="qualificationName" label="资质" min-width="100" sortable></el-table-column>
                <el-table-column prop="contacts" label="联系人" min-width="100" sortable></el-table-column>
                <el-table-column prop="contactsPhone" label="联系人手机号" min-width="100" sortable></el-table-column>
                <el-table-column prop="cityName" label="城市" min-width="80" sortable></el-table-column>
                <el-table-column prop="serviceContent" label="维修内容" min-width="140" sortable
                                 show-overflow-tooltip></el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>
    import CitySelect from '@/components/CitySelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        name: 'trafficServiceDepot',
        mixins: [tool],
        components: { CitySelect },
        data: function () {
            return {
                showSearch: false,
                nearCity4: [],
                showAddBtn: this.getCurrentUserAuthority("traffic/serviceDepot/add"),
                showEditBtn: this.getCurrentUserAuthority("traffic/serviceDepot/edit"),
                showStopBtn: this.getCurrentUserAuthority("traffic/serviceDepot/stop"),
                showDetailBtn: this.getCurrentUserAuthority("traffic/serviceDepot/detail"),
                listUrl: "/base/repairer/list",
            }
        },
        // 返回页面调用
        activated(){
            this.getList();
        },
        mounted: function () {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            /*getList(callback) {
                let params = Object.assign({}, this.searchParam);
                if (params.cityId && Array.isArray(params.cityId) && params.cityId.length == 2)
                    params.cityId = params.cityId[1];
                params.rows = this.pageSize;
                params.page = this.page;
                ajax.get(this.listUrl, params).then(res => {
                    this.list = res.rows;
                    this.listCount = res.records;
                    $.isFunction(callback) && callback(res);
                })
            },*/
            changeCity(){
                if(this.nearCity4 && this.nearCity4.length>=2)
                    this.searchParam.cityId=this.nearCity4[1];
                else
                    this.searchParam.cityId="";
            },
            resetList(){
                this.nearCity4=[];
                this.searchParam={};
                this.getList();
            },
            stop(id, state) {
                let url = "/base/repairer/disable";
                let title = state == 0 ? "确定停用该维修厂" : "确定启用该维修厂";
                //停用维修厂
                let data = {
                    id: id,
                    state: state,
                };
                this.$confirm(title, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.post(url, data) .then(res => {
                        if(res.status == 0){
                            this.$message({message: '操作成功！',type: 'success'});
                            this.getList();
                        }else {
                            this.$message.error(res.message);
                        }
                    });
                });

            },
        }

    }
</script>

