<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">指令类型</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.act" placeholder="全部" clearable>
                            <el-option label="接收" value="Recv"></el-option>
                            <el-option label="发送" value="Send"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">命令字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.commandType" placeholder="请输入命令字"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">日期时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="time"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
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
            <el-table :ref="getRefName" :max-height="tableHeight" border :data="list" style="width: 100%">
                <el-table-column min-width="80" label="设备号" prop="equipmentId" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="时间" prop="time" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="60" label="指令类型" prop="act" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="50" label="命令字" prop="commandType" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="240" label="指令日志内容" prop="content" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="240" label="文本描述" prop="result" sortable
                                 show-overflow-tooltip></el-table-column>

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
        name: 'obdCommandLog',
        mixins: [tool],
        components: {TreeSelect},
        data() {
            return {
                searchParam: {},
                time: [this.currentStartTime(), this.currentEndTime()],
                listUrl: 'obd/obdCommandLog',
            }
        },
        activated() {
            this.getList();
        },
        mounted() {
            this.getList();
        },
        methods: {
            getListBefore(params) {
                if (this.time) {
                    params.startTime = this.time[0];
                    params.endTime = this.time[1];
                    let startTime = new Date(params.startTime).getTime();
                    let endTime = new Date(params.endTime).getTime();
                    if (endTime - startTime > (2 * 24 * 3600 * 1000)) {
                        this.$message({message: '选择的时间间隔大于48小时！', type: 'warning'});
                    }
                }
                let deviceId = this.$route.params.deviceId;
                if (deviceId) {
                    params.deviceId = deviceId;
                }
            },
            //重置筛选
            resetList() {
                this.searchParam = {};
                this.time = [this.currentStartTime(), this.currentEndTime()];
                this.handleCurrentChange(1);
            },
            currentStartTime() {
                let date = new Date();
                date.setTime(date.getTime() - 1000 * 60 * 60 * 2);
                let currentDate = date.format("yyyy-MM-dd HH:mm:ss");
                return currentDate;
            },
            currentEndTime() {
                let date = new Date();
                let currentDate = date.format("yyyy-MM-dd HH:mm:ss");
                return currentDate;
            }

        }
    }
</script>

