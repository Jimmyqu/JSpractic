<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">IMEI</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.imei" placeholder="IMEI" :disabled="true"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">起始时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="searchParam.startTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm"
                            :editable="false">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">结束时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="searchParam.endTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm"
                            :editable="false">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">指令类型</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.type" clearable placeholder="指令类型"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">指令动作</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.act" clearable placeholder="全部">
                            <el-option label="Recv" value="Recv"></el-option>
                            <el-option label="Send" value="Send"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-d-arrow-right" @click="showSearch=!showSearch"></i>
                <el-button type="primary" size="small" @click="getList()">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>
        </div>

        <div class="table-box">
            <el-table border :data="list" style="width: 100%">
                <el-table-column min-width="100" label="指令类型" prop="type" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="60" label="指令动作" prop="act" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="60" label="指令记录时间" prop="date" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="原始指令" prop="content" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="指令解析结果" prop="analysis" sortable show-overflow-tooltip></el-table-column>
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
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool,ruleTool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'equipmentWorkStatusImeiDetail',
        mixins: [tool,ruleTool],
        data() {
            return {
                showSearch: false,
                listUrl: 'base/equipmentWorkStatus/obdCommandRecordList',
                searchParam: {
                    imei: this.$route.params.id,
                    startTime: this.subMinute(),
                    endTime: this.addMinute()
                }
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            this.getList();
        },
        methods: {
            //查询列表
            getList(callback) {debugger;
                if (!this.checkTime()) {
                    return;
                }

                const params = Object.assign({},this.searchParam);
                params.size = this.pageSize;
                params.current = this.page;
                this.getListBefore(params);
                ajax.get(this.listUrl, params).then(res => {
                    this.list = res.records;
                    this.listCount = res.total;
                    $.isFunction(callback) && callback(res);
                    this.getListAfter(callback);
                })
            },
            //重置筛选
            resetList() {
                this.searchParam = {
                    imei: this.$route.params.id,
                    startTime: this.subMinute(),
                    endTime: this.addMinute()
                };
                this.handleCurrentChange(1);
            },
            checkTime() {
                var $this = this;
                if (!this.searchParam.startTime) {
                    $this.$message.error("请选择起始时间");
                    return false;
                }
                if (!this.searchParam.endTime) {
                    $this.$message.error("请选择结束时间");
                    return false;
                }
                if (this.searchParam.startTime > this.searchParam.endTime) {
                    $this.$message.error("起始时间必须小于等于结束时间");
                    return false;
                }
                return true;
            },
            addMinute() {
                var date=new Date();
                var min=date.getMinutes();
                date.setMinutes(min+30);
                return date.format('yyyy-MM-dd HH:mm');
            },
            subMinute() {
                var date=new Date();
                var min=date.getMinutes();
                date.setMinutes(min-30);
                return date.format('yyyy-MM-dd HH:mm');
            }
        }
    }
</script>

