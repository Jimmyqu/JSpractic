<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">产品型号</label>
                    <div class="input-group">
                        <template>
                            <el-select v-model="searchParam.modalId" placeholder="请选择">
                                <el-option
                                    v-for="item in equModals"
                                    :key="item.id"
                                    :label="item.supplierId + ' '+ item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">执行状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.cmdStatus" clearable placeholder="全部">
                            <el-option label="已缓存" value="1"></el-option>
                            <el-option label="执行失败" value="3"></el-option>
                            <el-option label="执行成功" value="4"></el-option>
                            <el-option label="已取消" value="5"></el-option>
                        </el-select>
                    </div>
                </div>
            <!--    <div class="form-group">
                    <label class="control-label">参数类型</label>
                    <div class="input-group">
                        <template>
                            <el-select v-model="searchParam.type" placeholder="请选择">
                                <el-option
                                    v-for="item in sendParameterContrast"
                                    :key="item.type"
                                    :label="item.typeText"
                                    :value="item.type">
                                </el-option>
                            </el-select>
                        </template>
                    </div>
                </div>-->
                <div class="form-group">
                    <label class="control-label">创建时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="createDate"
                            @change="createDateChange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.imei" clearable placeholder="IMEI"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn && scope.row.cmdStatus == 1" type="text" @click="cancelSend(scope.row.id)">取消</el-button>
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label="IMEI" prop="imei" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="产品类型" prop="modalType" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="产品型号" prop="modalName" sortable show-overflow-tooltip></el-table-column>
                <!--<el-table-column min-width="140" label="指令类型" prop="commandType" sortable show-overflow-tooltip></el-table-column>-->
                <el-table-column min-width="140" label="执行命令" prop="name" sortable show-overflow-tooltip>
                    <template slot-scope="scope" >
                        <template  v-if="scope.row.commandType=='设置'">
                            {{scope.row.name | splitsValue}}
                        </template>
                        <template  v-if="scope.row.commandType=='读取'">
                            读取参数
                        </template>
                    </template>
                </el-table-column>
                  <el-table-column min-width="140" label="执行值" prop="text">
                    <template slot-scope="scope">
                     <el-tooltip  placement="top" effect="light">
                       <div slot="content"  v-for="(textVal,key) in scope.row.textArr" :key="key">
                         {{textVal}}
                       </div>
                       <el-button type="text" style="width: 100%;">{{scope.row.text|splitText}}</el-button>
                     </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label="执行状态" prop="cmdStatus" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.cmdStatus == 1 && scope.row.lastSendTime">已下发</span>
                        <span v-if="scope.row.cmdStatus == 1 && !scope.row.lastSendTime">已缓存</span>
                        <span v-if="scope.row.cmdStatus == 2">失败:{{scope.row.errMsg}}</span>
                        <span v-if="scope.row.cmdStatus == 3">成功</span>
                        <span v-if="scope.row.cmdStatus == 4">已取消</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="150" label="创建时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="创建人" prop="creater" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="150" label="最后下发时间" prop="lastSendTime" sortable show-overflow-tooltip></el-table-column>
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
        name: 'sendRecord',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                showEditBtn: true,
                listUrl: 'obd/obdParameterSetting',
                createDate: [],
                /*产品型号*/
                equModals: [],
                /*参数类型*/
                sendParameterContrast: [],
                searchParam: {}
            }
        },

        filters: {
            splitsValue: function (value) {
                let result = '';
                if(value){
                    let values = value.split("&");
                    values.forEach(item => {
                        if(item == 'heartbeat'){
                            result += '终端发送间隔' + '及';
                        }
                        if(item == 'apn'){
                            result += '主服务器APN' + '及';
                        }
                        if(item == 'ip'){
                            result += '服务器地址' + '及';
                        }
                        if(item == 'ip'){
                            result += '服务器ip(域名)' + '及';
                        }
                        if(item == 'tcpPort'){
                            result += '服务器端口' + '及';
                        }
                        if(item == 'upType'){
                            result += '位置汇报策略' + '及';
                        }
                        if(item == 'upTimeInterval'){
                            result += '缺省时间汇报间隔' + '及';
                        }
                        if(item == 'maxSpeed'){
                            result += '最高速度' + '及';
                        }
                        if(item == 'inflexionAngle'){
                            result += '拐点补传角度' + '及';
                        }
                        if(item == 'overSpeedDuration'){
                            result += '超速持续时间' + '及';
                        }
                    });
                    return result.substr( 0, result.length-1);
                }
            },
            splitText: function(value){
                if (!value) return ''
                if (value.length > 12) {
                    return value.slice(0,12) + '...'
                }
                return value

            }
           },

        mounted() {
            let imei = this.$route.query.id;
            this.searchParam = {imei: imei};
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.getEquModalInfo();
            //this.getSendParameterContrast();
        },
        activated: function () {
            this.getList();
        },
        methods: {
            getListAfter(){
                this.list.forEach(item =>{
                   let textArr = item.text.split(";");
                   item.textArr=textArr;
                })
            },
            resetList(){
                this.searchParam={};
                this.createDate=[];
                this.getList();
            },
            createDateChange() {
                if(this.createDate && this.createDate.length>0){
                    let createDate = this.createDate;
                    this.searchParam.startTime = createDate[0];
                    this.searchParam.endTime = createDate[1];
                }else{
                    this.searchParam.startTime="";
                    this.searchParam.endTime="";
                }
            },
            //获取产品类型
            getEquModalInfo() {
                ajax.get("base/baseEquipmentModal/type?type=1,2").then(
                    res => {
                        if (res.status == 0) {
                            this.equModals = res.data;
                        }
                    }
                )
            },
            //获取参数类型
            getSendParameterContrast() {
                ajax.post("obd/obdSendParameter/selectSendParameterContrast").then(
                    res => {
                        if (res.length > 0) {
                            this.sendParameterContrast = res;
                        } else {
                            this.sendParameterContrast = [];
                        }
                    }
                )
            },
            //取消
            cancelSend(id) {
                var $this = this;
                this.$confirm('确认取消吗？').then(_ => {
                    ajax.get("obd/obdParameterSetting/cancelSend/"+id, null).then(result => {
                        if (result.status==0) {
                            $this.$message.success(result.msg);
                            $this.getList();
                        } else {
                            $this.$message.error(result.msg);
                        }
                    });
                }).catch(_ => {
                    console.log("关闭");
                });
            }
        }
    }
</script>

