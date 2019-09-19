<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">手机卡号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.phone" placeholder="手机卡号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <template>
                            <el-select v-model="searchParam.workStatus" placeholder="请选择" clearable>
                                <el-option label="正常" value="3"></el-option>
                                <el-option label="即将到期" value="5"></el-option>
                                <el-option label="到期" value="4"></el-option>
                                <el-option label="异常" value="1"></el-option>
                                <el-option label="报停" value="2"></el-option>
                            </el-select>
                        </template>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">使用状态</label>
                    <div class="input-group">
                        <template>
                            <el-select v-model="searchParam.useStatus" placeholder="请选择" clearable>
                                <el-option label="已使用" value="1"></el-option>
                                <el-option label="未使用" value="2"></el-option>
                            </el-select>
                        </template>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">激活状态</label>
                    <div class="input-group">
                        <template>
                            <el-select v-model="searchParam.activationStatus" placeholder="请选择" clearable>
                                <el-option label="激活" value="1"></el-option>
                                <el-option label="未激活" value="2"></el-option>
                            </el-select>
                        </template>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">库存状态</label>
                    <div class="input-group">
                        <template>
                            <el-select v-model="searchParam.stockStatus" placeholder="请选择" clearable>
                                <el-option label="库存" value="1"></el-option>
                                <el-option label="已出库" value="2"></el-option>
                            </el-select>
                        </template>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">供应商</label>
                    <div class="input-group">
                        <template>
                            <el-select v-model="searchParam.supplierId" placeholder="请选择" clearable>
                                <el-option
                                    v-for="item in supplierList"
                                    :key="item.value"
                                    :label="item.text"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">激活时间</label>
                    <div class="input-group">
                        <el-date-picker
                            @change="choseTime()"
                            v-model="time"
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
                        <el-input v-model="searchParam.keyword" placeholder="IMSI , ICCID , IMEI" clearable></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button v-show="showAddBtn" type="warning" size="mini" @click="addList()">批量续费</el-button>
                <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="showImportBtn" size="mini" @click="addSim()">导入</el-button>
                <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
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
                <el-table-column fixed="left" label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn" type="text" @click="edit(scope.row)">修改</el-button>
                        <el-button v-show="showEditBtn" type="text" style="color: #F56C6C" @click="err(scope.row.id)">异常处理</el-button>

                        <el-button v-show="showEditBtn" type="text" style="color: #F56C6C" @click="del(scope.row.id)">删除</el-button>
                        <el-button v-show="showEditBtn" type="text" @click="reStop(scope.row.id)">报停</el-button>
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label="手机卡号" prop="phone" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="IMSI" prop="imsi" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="ICCID" prop="iccid" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="IMEI" prop="imei" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="供应商" prop="supName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="激活时间" prop="activationTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="费用有效期" prop="validity" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="状态" prop="workStatus" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span style="color: #F56C6C" v-if="scope.row.workStatus == 1">异常</span>
                        <span style="color: #F56C6C" v-if="scope.row.workStatus == 2">报停</span>
                        <span style="color: #409EFF" v-if="scope.row.workStatus == 3">正常</span>
                        <span style="color: #F56C6C" v-if="scope.row.workStatus == 4">到期</span>
                        <span style="color: #E6A23C" v-if="scope.row.workStatus == 5">即将到期</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="100" label="使用状态" prop="useStatus" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span  v-if="scope.row.useStatus == 1">已使用</span>
                        <span v-if="scope.row.useStatus == 2">未使用</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="100" label="激活状态" prop="useStatus" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span  v-if="scope.row.activationTime">激活</span>
                        <span v-if="!scope.row.activationTime">未激活</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="100" label="库存状态" prop="stockStatus" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span  v-if="scope.row.stockStatus == 1">库存</span>
                        <span v-if="!scope.row.stockStatus == 2">已出库</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label="采购日期" prop="buyTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="入库时间" prop="storageTime" sortable show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
        <!--批量续费-->
        <el-dialog title="批量续费" class="import-box" :visible.sync="importVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
                <el-form-item prop="filePath" >
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'base/baseSim/import'"
                                  name="file" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "批量续费导入模板" 的格式一致。
                            <a href="static/excelTemplate/批量续费导入模板.xls">下载模板</a>
                            <br>支持扩展名：.xls和.xlsx
                            <br>文件大小：20M以内
                        </span>
                    </UploadSubmit>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="importVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <!--批量续费-->
        <el-dialog title="导入" class="import-box" :visible.sync="importSimVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
                <el-form-item prop="filePath" >
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'base/baseSim/importSim'"
                                  name="file" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "无线手机卡信息导入模板" 的格式一致。
                            <a href="static/excelTemplate/无线手机卡信息导入.xlsx">下载模板</a>
                            <br>支持扩展名：.xls和.xlsx
                            <br>文件大小：20M以内
                        </span>
                    </UploadSubmit>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="importSimVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import UploadSubmit from '@/components/UploadSubmit'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'sim',
        mixins: [tool],
        components: { TreeSelect,UploadSubmit },
        data() {
            return {
                showSearch: false,
                searchParam: {
                },
                showEditBtn: 'sim/edit',
                showAddBtn: 'sim/add',
                showExportExcelBtn: 'sim/eport',
                showImportBtn:'sim/import',
                listUrl: 'base/baseSim',
                importVisible: false,
                importSimVisible:false,
                fileUpload : true,
                /*供应商*/
                supplierList: [],
                time:[]
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
            this.getSupplier();
        },
        methods: {
            getListBefore(params) {
                /*if (this.time) {
                    params.startTime = this.time[0];
                    params.endTime = this.time[1];
                }*/
            },
            exportExcel() {

                window.location = this.exportUrl("base/baseSim/excel?" + $.param(this.searchParam));
            },

            /*查询电话号码*/
            querySearchAsync(queryString, cb) {
                if(queryString && queryString.length > 4 && queryString.length<=11){
                    //根据电话号码查询
                    ajax.get(`base/baseSim/phone?number=${queryString}`).then(
                        res => {
                            if(res.status == 0){
                                /*组装数据*/
                                const values = [];
                                res.data.forEach(item => {
                                    values.push({
                                        value: item.phone,
                                        id: item.id
                                    })
                                });
                                cb(values);
                            }
                        },error => {
                            this.showMessage('获取电话失败');
                        }
                    )
                }
            },

            /*加载供应商数据*/
            getSupInfo(){
                ajax.get('')

            },

            /*选择时间*/
            choseTime(){
                const time = this.time;
                if(time){
                    this.searchParam.activationStartTime = time[0] + ' 00:00:00'
                    this.searchParam.activationEndTime = time[1] + ' 59:59:59'
                }else{
                    this.searchParam.activationStartTime = null;
                    this.searchParam.activationEndTime = null;
                }
            },

            /*批量续费*/
            addList(){
                this.importVisible = true;
            },
            addSim(){
              this.importSimVisible=true;
            },
            /*修改*/
            edit(row){
                let url = this.$route.fullPath + '/edit';
                this.$router.push({path:url , query:row});
            },

            /*删除*/
            del(id){
                this.$confirm('确定删除吗？').then(
                    () => {
                        ajax.delete(`base/baseSim/${id}`).then(res => {
                            if(res.status == 0){
                                this.showMessage('删除成功', 'success');
                                this.getList();
                            }else{
                                this.showMessage('删除失败');
                            }
                        },error => {
                            this.showMessage('删除失败');
                        })
                    }
                )


            },

            /*报停*/
            reStop(id){
                this.$confirm('确定要报停吗？').then(
                    () => {
                        ajax.get(`base/baseSim/stop/${id}?type=2`).then(res => {
                            if(res.status == 0){
                                this.showMessage('报停成功', 'success');
                                this.getList();
                            }else{
                                this.showMessage('报停失败');
                            }
                        },error => {
                            this.showMessage('报停失败');
                        })
                    }
                )
            },

            /*异常处理*/
            err(id){
                this.$prompt( '异常处理', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputErrorMessage: '邮箱格式不正确',
                    inputType: 'textarea'
                }).then(({ value }) => {
                    ajax.get(`base/baseSim/err/${id}?message=${value}`).then(res => {
                        if(res.status == 0){
                            this.showMessage('修改异常成功', 'success');
                            this.getList();
                        }else{
                            this.showMessage('修改异常失败');
                        }
                    },error => {
                        this.showMessage('修改异常失败');
                    })
                })
            },
            //获取供应商
            getSupplier() {
                ajax.post("base/baseEquipmentReturn/selectSupplier").then(
                    res => {
                        if (res.length > 0) {
                            this.supplierList = res;
                        } else {
                            this.supplierList = [];
                        }
                    }
                )
            },resetList(){
                this.searchParam={};
                this.time = "";
                this.handleCurrentChange(1);
            }
        }
    }
</script>

