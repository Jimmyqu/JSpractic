<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属部门</label>
                    <div class="input-group">
                        <tree-select v-model="searchParam.region" mode="select" url="admin/organization/tree"
                                     type="one"></tree-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服役状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.vehicleStatus" multiple placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">电量范围</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.powerStr" placeholder="请选择">
                            <el-option
                                v-for="item in powerOpts"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">产品型号名称</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.equipmentModalName" multiple placeholder="请选择">
                            <el-option
                                v-for="item in models"
                                :key="item.value"
                                :label="item.value"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">在线情况</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.online" multiple placeholder="请选择">
                            <el-option
                                v-for="item in onlineStatusArray"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.key" placeholder="车牌、IMEI"></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">定位时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="searchParam.times"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-d-arrow-right" @click="showSearch=!showSearch"></i>
                <el-button type="primary" size="small" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>
        </div>
        <div class="tool-box">
            <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出数据</el-button>
        </div>

        <div class="table-box">
            <el-table v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="180">
                    <template slot-scope="scope">
                        <el-dropdown placement="bottom" size="mini" trigger="click">
                            <span class="el-dropdown-link">
                                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu class="table-dropdown" slot="dropdown">
                                <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">工作模式</el-button>
                                <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">设置</el-button>
                                <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">读取</el-button>
                                <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">升级</el-button>
                                <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">升级记录</el-button>
                                <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">指令日志</el-button>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>

                <el-table-column min-width="140" label="车牌" prop="plate" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="IMEI" prop="imei" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="设备状态" prop="onlineStatus" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="电量" prop="power" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="产品型号名称" prop="equipmentModalName" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车辆服役状态" prop="vehicleStatus" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="通讯卡号" prop="simPhone" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="通讯信号" prop="networkSignal" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车型" prop="vehicleModelInfoName" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="所属部门" prop="organizationName" sortable
                                 show-overflow-tooltip></el-table-column>

                <el-table-column min-width="260" label="位置" prop="gpsAddress" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="150" label="定位时间" prop="gpsTime" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="150" label="数据更新时间" prop="createTime" sortable
                                 show-overflow-tooltip></el-table-column>
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
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'seEquipmentStatus',
        mixins: [tool],
        components: {TreeSelect},
        data() {
            return {
                showSearch: true,
                searchParam: {},
                showEditBtn: true,
                showAddBtn: true,
                showExportExcelBtn: true,
                listUrl: 'se/seEquipmentStatus',
                options: [{value: '1', label: '未投入运营'}, {value: '2', label: '待租'}, {
                    value: '3',
                    label: '已租'
                }, {value: '4', label: '保养'}, {value: '5', label: '维修'}, {value: '6', label: '退出运营'}],
                powerOpts: [{value: '70,100', label: '高>70%'}, {value: '15,70', label: '中15%~70%'}, {
                    value: '0~15',
                    label: '低<15%'
                }],
                models: [{value: 'SE100'}, {value: 'SE200'}, {value: 'SE300'}],
                onlineStatusArray: [{value: '1', label: '在线'}, {value: '2', label: '离线'}]
            }
        },
        activated() {
            this.getList();
        },
        mounted() {
            this.loadMapResource();
        },
        methods: {
            getListBefore(params) {
                if (params.times) {
                    if (params.times[0])
                        params.locationTimeStart = params.times[0];

                    if (params.times[1])
                        params.locationTimeEnd = params.times[1];
                }

                if (params.powerStr) {
                    let array = params.powerStr.split(',');
                    params.powerStart = array[0];
                    params.powerEnd = array[1];
                }
            },
            getListAfter() {
                this.geocode();
            },
            geocode() {

                let array = this.list;
                let index = 0;
                let _geo = new BMap.Geocoder();
                const that = this;
                const f = (function () {
                    if (index >= array.length)
                        return;

                    let object = array[index];
                    let point = new BMap.Point(object.longitude, object.latitude);

                    _geo.getLocation(point, function (rs) {
                        object.gpsAddress = rs.address;
                        that.$set(array, index, object);
                        index++;
                        f();
                    });
                });

                f();
            },
            loadMapResource() {
                // window.initialize = this.loadMapResourceCallback;
                // let script = document.createElement("script");
                // script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
                // document.body.appendChild(script);
                this.$nextTick(()=>{
                    this.initialize();
                })
            },
            loadMapResourceCallback() {
                this.getList();
            },
            exportExcel() {
                window.location = this.exportUrl("se//seEquipmentStatus//excel?" + $.param(this.searchParam));
            }
        }
    }
</script>

