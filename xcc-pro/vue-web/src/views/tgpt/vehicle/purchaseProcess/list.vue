<template>
    <div class="app-container white-bg list-panel newList-panel " v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">采购订单号</label>
                    <div class="input-group">
                        <el-input type="text" placeholder="请输入采购订单号" clearable v-model="searchParam.orderNumber"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">采购日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="purchaseDate"
                            type="daterange"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">采购方式</label>
                    <div class="input-group">
                        <el-select v-model="purchaseMethod" multiple collapseTags placeholder="不限" clearable>
                            <el-option label="新购" value="1"></el-option>
                            <el-option label="租赁" value="2"></el-option>
                            <el-option label="现有车辆安排" value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">供应商</label>
                    <div class="input-group">
                        <el-input type="text" placeholder="请输入供应商" clearable v-model="searchParam.supplierName"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车型</label>
                    <div class="input-group">
                        <el-input type="text" placeholder="请输入车型" clearable v-model="searchParam.vehicleModelInfoName"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="state" clearable multiple collapseTags placeholder="不限">
                            <el-option label="待提车/待派车" value="1"></el-option>
                            <el-option label="待上牌" value="2"></el-option>
                            <el-option label="完成" value="3"></el-option>
                            <el-option label="终止" value="6"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">采购过程编号</label>
                    <div class="input-group">
                        <el-input type="text" placeholder="请输入采购过程编号" clearable v-model="searchParam.processNo"/>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
          <!--      <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            -->
            </div>
        </div>
        <!--<div class="row tool-box">
            <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出数据</el-button>
        </div>-->
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button  v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" min-width="160">
                    <template slot-scope="scope">
                        <el-button
                            v-if="(scope.row.showFinishBtn && scope.row.showFinishBtn.first)"
                            @click="finish(scope.row)" type="text" size="small">
                            终止
                        </el-button>
                        <el-button
                            v-if="(scope.row.showEnableBtn && scope.row.showEnableBtn.first) || (scope.row.showEnableBtn && !scope.row.showEnableBtn.first && scope.row.btnNum == 2)"
                            @click="enable(scope.row)" type="text" size="small">
                            启用
                        </el-button>

                        <el-button
                            v-if="(scope.row.showLiftCarBtn && scope.row.showLiftCarBtn.first) || (scope.row.showLiftCarBtn && !scope.row.showLiftCarBtn.first && scope.row.btnNum == 2)"
                            @click="openForm(scope.row,'2')" type="text" size="small">
                            提车
                        </el-button>

                        <el-button
                            v-if="(scope.row.showRentalCarLiftBtn && scope.row.showRentalCarLiftBtn.first) || (scope.row.showRentalCarLiftBtn && !scope.row.showRentalCarLiftBtn.first && scope.row.btnNum == 2)"
                            v-show="showRentalCarLiftBtn" @click="openForm(scope.row,'1')" type="text" size="small">
                            租赁提车
                        </el-button>

                        <el-button
                            v-if="(scope.row.showExistVehicleArrangementsBtn && scope.row.showExistVehicleArrangementsBtn.first) || (scope.row.showExistVehicleArrangementsBtn && !scope.row.showExistVehicleArrangementsBtn.first && scope.row.btnNum == 2)"
                            @click="openForm(scope.row,'1')" type="text" size="small">
                            现有车安排
                        </el-button>

                        <el-button
                            v-if="(scope.row.showPickUpTheCarBtn && scope.row.showPickUpTheCarBtn.first) || (scope.row.showPickUpTheCarBtn && !scope.row.showPickUpTheCarBtn.first && scope.row.btnNum == 2)"
                            @click="openForm(scope.row,'3')" type="text" size="small">
                            上牌
                        </el-button>
                        <!-- 更多 -->
                        <el-dropdown v-if="scope.row.btnNum > 2" trigger="click">
                            <span class="el-dropdown-link">
                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <el-button
                                        v-if="(scope.row.showEnableBtn && !scope.row.showEnableBtn.first)"
                                        @click="enable(scope.row)" type="text" size="small">
                                        启用
                                    </el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button
                                        v-if="(scope.row.showLiftCarBtn && !scope.row.showLiftCarBtn.first)"
                                        @click="openForm(scope.row,'2')" type="text" size="small">
                                        提车
                                    </el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button
                                        v-if="(scope.row.showRentalCarLiftBtn && !scope.row.showRentalCarLiftBtn.first)"
                                        @click="openForm(scope.row,'1')" type="text" size="small">
                                        租赁提车
                                    </el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button
                                        v-if="(scope.row.showExistVehicleArrangementsBtn && !scope.row.showExistVehicleArrangementsBtn.first)"
                                        @click="openForm(scope.row,'1')" type="text" size="small">
                                        现有车安排
                                    </el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button
                                        v-if="(scope.row.showPickUpTheCarBtn && !scope.row.showPickUpTheCarBtn.first)"
                                        @click="openForm(scope.row,'3')" type="text" size="small">
                                        上牌
                                    </el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
                <el-table-column sortable show-overflow-tooltip fixed prop="purchaseProcessNo" label="采购过程编号"
                                 min-width="200">
                    <template slot-scope="scope">
                        <a size="mini" @click="detail(scope.row)">{{scope.row.purchaseProcessNo}}</a>
                    </template>
                </el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="orderNumber" label="采购订单号" min-width="200">
                    <template slot-scope="scope">
                        <a size="mini" @click="toOrderDetail(scope.row)">{{scope.row.orderNumber}}</a>
                    </template>
                </el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="vehicleModelInfoName" label="车型"
                                 min-width="220"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="purchaseMethod" label="采购方式" min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.purchaseMethod==1">新购</span>
                        <span v-else-if="scope.row.purchaseMethod==2">租赁</span>
                        <span v-else-if="scope.row.purchaseMethod==3">现有车辆安排</span>
                    </template>
                </el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="purchaseDate" label="采购日期"
                                 min-width="100"></el-table-column>
                <el-table-column sortable prop="supplierName" label="供应商" show-overflow-tooltip min-width="170"></el-table-column>
                <el-table-column sortable prop="state" label="状态" min-width="100">
                    <template slot-scope="scope">

                        <div v-if="scope.row.purchaseMethod==1">
                            <span v-if="scope.row.state==1">待提车</span>
                            <span v-else-if="scope.row.state==2">待上牌</span>
                            <span v-else-if="scope.row.state==3">完成</span>
                            <span v-else-if="scope.row.state==6">终止</span>
                        </div>
                        <div v-else>
                            <span v-if="scope.row.state==1">待派车</span>
                            <span v-else-if="scope.row.state==3">完成</span>

                            <span v-else-if="scope.row.state==6">终止</span>
                        </div>
                    </template>
                </el-table-column>
                <!--<el-table-column sortable show-overflow-tooltip prop="planDeliveryDate" label="预计到车时间"
                                 min-width="140"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="requiredDeliveryDate" label="要求到位时间"
                                 min-width="140"></el-table-column>-->
                <el-table-column sortable show-overflow-tooltip prop="plate" label="车牌"
                                 min-width="100"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="vin" label="车架号"
                                 min-width="140"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="originateName" label="所属组织"
                                 min-width="120"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="purchaser" label="采购人"
                                 min-width="100"></el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>
    import ConfirmForm from '@/views/tgpt/project/contract/confirm'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'vehiclePurchaseProcess',
        mixins: [tool],
        components: {ConfirmForm},
        data() {
            return {
                showSearch: false,
                showViewBtn: true,
                showFinishBtn: this.getCurrentUserAuthority('core/purchaseProcess/finish'),
                showDeliveryBtn: this.getCurrentUserAuthority('core/purchaseProcess/deliveryCar'),
                showExistingCarArrangeBtn: this.getCurrentUserAuthority('core/purchaseProcess/setPlate'),
                showToTheCarBtn: this.getCurrentUserAuthority('core/purchaseProcess/arriveCar'),
                showPickUpTheCarBtn: this.getCurrentUserAuthority('core/purchaseProcess/pickUpCar'),
                showLiftCarBtn: this.getCurrentUserAuthority('core/purchaseProcess/liftCar'),
                showRentalCarLiftBtn:this.getCurrentUserAuthority('core/purchaseProcess/rentalCarLift'),
                showExistVehicleArrangementsBtn:this.getCurrentUserAuthority('core/purchaseProcess/existVehicleArrangements'),
                showBoardingBtn: this.getCurrentUserAuthority('core/purchaseProcess/setPlate'),
                showRentCarBtn: this.getCurrentUserAuthority('core/purchaseProcess/setPlate'),
                showExportExcelBtn: this.getCurrentUserAuthority('core/purchaseProcess/exportExcel'),
                showEnableBtn: this.getCurrentUserAuthority('core/purchaseProcess/enable'),
                /*searchParam: {
                    orderNum: "",
                    contractNo: "",
                    purchasePattern: "",
                    provider: "",
                    model: "",
                    processNo: "",
                },*/
                listUrl: '/core/purchaseProcess/list',
                editFormData: {},
                state:[],
                purchaseMethod:[],
                purchaseDate:[],
                //pickUpCarForm: {},
                form1: {},
                arriveCarForm: {},
                rules: {}
            }
        },
        activated() {
            this.getList();
        },
        mounted: function () {
            debugger
            var purchaseMethod=this.$route.query.purchaseMethod;
            var state=this.$route.query.state;
            var startDate=this.$route.query.startDate;
            var endDate=this.$route.query.endDate;
            if(purchaseMethod && state){
                this.searchParam.purchaseMethod=purchaseMethod;
                this.state=state.split('-');
            }
            if(startDate && endDate){
                this.purchaseDate.push(startDate,endDate);
            }
            this.searchParam=Object.assign({},this.searchParam);
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        watch: {},
        methods: {
            getListBefore(params){
                if(this.purchaseDate && this.purchaseDate.length>0){
                    params.purchaseDateStart = this.purchaseDate[0];
                    params.purchaseDateEnd = this.purchaseDate[1];
                    this.searchParam.purchaseDateStart = this.purchaseDate[0];
                    this.searchParam.purchaseDateEnd = this.purchaseDate[1];
                }else{
                    params.purchaseDateStart = '';
                    params.purchaseDateEnd = '';
                    this.searchParam.purchaseDateStart = '';
                    this.searchParam.purchaseDateEnd = '';
                }

                if(this.state && this.state.length>0){
                    params.state=this.state.join(',');
                    this.searchParam.state=this.state.join(',');
                }else{
                    params.state=[];
                    this.searchParam.state='';
                }

                if(this.purchaseMethod && this.purchaseMethod.length>0){
                    params.purchaseMethod = this.purchaseMethod.join(',');
                    this.searchParam.purchaseMethod = this.purchaseMethod.join(',');
                }else{
                    params.purchaseMethod = '';
                    this.searchParam.purchaseMethod = '';
                }
            },
            openForm(row, type) {
                let _path = this.$route.fullPath.indexOf('?') != -1 ?this.$route.fullPath.split('?')[0]: this.$route.fullPath
                let url = _path + '/edit?id=' + row.id + '&type=' + type;
                this.$router.push({path: url});
            },

            finish(row) { //终止
                this.$confirm('确认执行终止操作？')
                    .then(_ => {
                        ajax.post('/core/purchaseProcess/finish?id=' + row.id).then(rs => {
                            if (rs.status == 0) {
                                this.getList();
                            } else
                                this.$message.error(rs.message);
                        })
                    })
                    .catch(_ => {
                    });
            },
            enable(row) { //启用
                this.$confirm('确认执行启用操作？')
                    .then(_ => {
                        ajax.post('/core/purchaseProcess/enable?id=' + row.id).then(rs => {
                            if (rs.status == 0) {
                                this.getList();
                            } else
                                this.$message.error(rs.message);
                        })
                    })
                    .catch(_ => {
                    });
            },
            exportExcel() {
                window.location = this.exportUrl("core/purchaseProcess/exportExcel?" + $.param(this.searchParam));
            },
            toOrderDetail(row) {
                let url = '/tgpt/vehicle/purchaseOrder/detail/' + row.orderId;
                this.$router.push({path: url});
            },
            toContractDetail(row) {
                let url = '/tgpt/project/contract/detail/' + row.contractId;
                this.$router.push({path: url});
            },
            resetList(){
                this.state=[];
                this.purchaseDate=[];
                this.purchaseMethod=[];
                this.searchParam={};
                this.getList();
            },
            detail(row){
                let url=this.$route.fullPath;
                if (url.indexOf('?') > -1){
                    let nUrl = url.split('?');
                    this.$router.push({path:nUrl[0]+"/detail/"+row.id});
                }else{
                    this.$router.push({path:url+"/detail/"+row.id});
                }
            },
            handleBtn(list){
                var setList = []
                for(var i =0;i<this.list.length;i++){
                    var scope = this.list[i]
                    scope.btnNum = 0
                    if(this.showFinishBtn && scope.state == 1){
                        scope.showFinishBtn = {
                            show:true
                        }
                        scope.first = true
                        scope.showFinishBtn.first = true
                        scope.btnNum += 1
                    }
                    if(this.showEnableBtn && scope.state == 6){
                        scope.showEnableBtn = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showEnableBtn.first = true
                        }
                        scope.btnNum += 1
                    }
                    if(this.showLiftCarBtn && scope.state == 1 && scope.purchaseMethod == 1){
                        scope.showLiftCarBtn = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showLiftCarBtn.first = true
                        }
                        scope.btnNum += 1
                    }
                    if(this.showRentalCarLiftBtn && scope.state == 1 && scope.purchaseMethod == 2){
                        scope.showRentalCarLiftBtn = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showRentalCarLiftBtn.first = true
                        }
                        scope.btnNum += 1
                    }
                    if(this.showExistVehicleArrangementsBtn && scope.state == 1 && scope.purchaseMethod == 3){
                        scope.showExistVehicleArrangementsBtn = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showExistVehicleArrangementsBtn.first = true
                        }
                        scope.btnNum += 1
                    }
                    if(this.showPickUpTheCarBtn && scope.state == 2 && scope.purchaseMethod == 1){
                        scope.showPickUpTheCarBtn = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showPickUpTheCarBtn.first = true
                        }
                        scope.btnNum += 1
                    }
                    setList.push(scope)
                }
                this.$set(this,'list',setList)
            },
        },

    }
</script>

