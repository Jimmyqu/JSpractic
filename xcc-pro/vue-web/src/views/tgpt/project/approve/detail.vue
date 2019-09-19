<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="项目评审" name="2" class="small_margin_001">

                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">项目名称</label>
                        <div class="input-group">
                            <span>{{detailForm.project.projectName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">项目编号</label>
                        <div class="input-group">
                            <span>{{detailForm.project.projectNumber}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">客户类型</label>
                        <div class="input-group">
                            <span>{{detailForm.project.customerType=='1'?'企业客户':(detailForm.project.customerType=='2'?'个人客户':'/')}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务客户</label>
                        <div class="input-group">
                            <span>{{detailForm.project.enterpriseName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{detailForm.project.originateDeptName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">业务类型</label>
                        <div class="input-group">
                            <span>长租</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">项目类型</label>
                        <div class="input-group">
                            <span>{{detailForm.project.projectType}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">项目负责人</label>
                        <div class="input-group">
                            <span>{{detailForm.project.projectLeaderName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">油费类型</label>
                        <div class="input-group">
                            <span v-if="detailForm.project.oilFeePaymenModel==1">全包</span>
                            <span v-if="detailForm.project.oilFeePaymenModel==2">里程内包</span>
                            <span v-if="detailForm.project.oilFeePaymenModel==3">不包</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">项目周期（月）</label>
                        <div class="input-group">
                            <span>{{detailForm.project.contractMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">申请日期</label>
                        <div class="input-group">
                            <span>{{detailForm.project.applicationDateStr}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">交付日期</label>
                        <div class="input-group">
                            <span>{{detailForm.project.deliveryDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">招标编号</label>
                        <div class="input-group">
                            <span>{{detailForm.project.bidNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">框架合同</label>
                        <div class="input-group">
                            <span v-if="detailForm.project.frameContract==1">是</span>
                            <span v-if="detailForm.project.frameContract==0">否</span>
                        </div>
                    </div>
                </div>

                <div>

                    <template>
                        <el-tabs v-model="tabActiveName">
                            <el-tab-pane label="招标信息" name="bidInfo">
                                <div class="flex-panel detail-box">
                                    <div class="detail-item">
                                        <label class="control-label">招标编号</label>
                                        <div class="input-group">
                                            <span>{{detailForm.project.bidNo}}</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <label class="control-label">招标供应商</label>
                                        <div class="input-group">
                                            <span>{{detailForm.project.enterpriseName}}</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <label class="control-label">发布公布日期</label>
                                        <div class="input-group">
                                            <span>{{detailForm.project.issueDate}}</span>
                                        </div>
                                    </div>
                                    <!--<div class="detail-item">
                                        <label class="control-label">标包划分</label>
                                        <div class="input-group">
                                            <span></span>
                                        </div>
                                    </div>-->
                                    <div class="detail-item">
                                        <label class="control-label">投标日期</label>
                                        <div class="input-group">
                                            <span>{{detailForm.project.bidDate}}</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <label class="control-label">招标文件</label>
                                        <div class="input-group">
                                            <file-detail :file-json="detailForm.project.bidFile"
                                                         :show-download="true" :show-del="false"></file-detail>
                                        </div>
                                    </div>
                                </div>

                            </el-tab-pane>
                            <el-tab-pane label="费用信息" name="costInfo">
                                <div class="flex-panel detail-box">
                                    <div class="detail-item">
                                        <label class="control-label">结算方式</label>
                                        <div class="input-group">
                                            <span>{{detailForm.project.settlementModel}}</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <label class="control-label">结算日（日）</label>
                                        <div class="input-group">
                                            <span>{{detailForm.project.settlementDate}}</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <label class="control-label">结算周期（天）</label>
                                        <div class="input-group">
                                            <span>{{detailForm.project.settlementCycle}}</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <label class="control-label">付款方式</label>
                                        <div class="input-group">
                                            <span>{{detailForm.project.paymentModel}}</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <label class="control-label">项目总金额（元）</label>
                                        <div class="input-group">
                                            <span>{{detailForm.project.totalAmount}}</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <label class="control-label">押金金额（元）</label>
                                        <div class="input-group">
                                            <span>{{detailForm.project.deposit}}</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <label class="control-label">保证金金额（元）</label>
                                        <div class="input-group">
                                            <span>{{detailForm.project.depositAmount}}</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <label class="control-label">服务费金额（元）</label>
                                        <div class="input-group">
                                            <span>{{detailForm.project.serviceCost}}</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <label class="control-label">发票税率（人%）</label>
                                        <div class="input-group">
                                            <span>{{detailForm.project.invoiceTaxRateDriver}}</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <label class="control-label">发票税率（车%）</label>
                                        <div class="input-group">
                                            <span>{{detailForm.project.invoiceTaxRateVehicle}}</span>
                                        </div>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="报价信息" name="offerInfo">
                                <div v-for="item in detailForm.inquiryArray" class="flex-panel detail-box"
                                     style="padding: 0 15px;">
                                    <h3 style="width: 100%;">{{item.serviceCityName}} {{item.vehicleModelInfoName}}
                                        {{item.carColorName}} {{item.newOrOldCarName}}车 {{item.vehicleQty}}辆
                                        {{item.driverQty}}位司机</h3>

                                    <div class="flex-panel detail-box">
                                        <div class="detail-item">
                                            <label class="control-label">车龄（月）</label>
                                            <div class="input-group">
                                                <span>{{item.carAge}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">合同周期（月）</label>
                                            <div class="input-group">
                                                <span>{{item.contractCycle}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">加装要求</label>
                                            <div class="input-group">
                                                <span>{{item.retrofitRequirementOptionsText}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">客户限价（不含税/元）</label>
                                            <div class="input-group">
                                                <span>{{item.customerLimitPrice}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">客户限价（含税/元）</label>
                                            <div class="input-group">
                                                <span>{{item.customerLimitPriceTax}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">购车价格（包牌/元）</label>
                                            <div class="input-group">
                                                <span>{{item.carPrice}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">最近价格（元）</label>
                                            <div class="input-group">
                                                <span>{{item.recentPrice}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">加装费（元）</label>
                                            <div class="input-group">
                                                <span>{{item.installationCost}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">保险费（元/年）</label>
                                            <div class="input-group">
                                                <span>{{item.insuranceCost}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">维修费（元/月）</label>
                                            <div class="input-group">
                                                <span>{{item.maintenanceCost}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">保养费（元/月）</label>
                                            <div class="input-group">
                                                <span>{{item.maintainCost}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">油路费（元/月）</label>
                                            <div class="input-group">
                                                <span>{{item.oilCost}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">车船税（元）</label>
                                            <div class="input-group">
                                                <span>{{item.carShipTax}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">GPS（元/月）</label>
                                            <div class="input-group">
                                                <span>{{item.gpsCost}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">年检费（元）</label>
                                            <div class="input-group">
                                                <span>{{item.monthInspection}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">绿标费（元）</label>
                                            <div class="input-group">
                                                <span>{{item.greenLabeCost}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">年票费（元/年）</label>
                                            <div class="input-group">
                                                <span>{{item.yearTicketCost}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">停车费（元/月）</label>
                                            <div class="input-group">
                                                <span>{{item.parkCost}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">清洁费（元）</label>
                                            <div class="input-group">
                                                <span>{{item.cleanCost}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">牌照费（元）</label>
                                            <div class="input-group">
                                                <span>{{item.licencesUseCost}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">基本工资（元）</label>
                                            <div class="input-group">
                                                <span>{{item.basicSalary}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">单位社保（元）</label>
                                            <div class="input-group">
                                                <span>{{item.socialSecurityCompany}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">个人社保（元）</label>
                                            <div class="input-group">
                                                <span>{{item.socialSecurityPersonal}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">单位公积金（元）</label>
                                            <div class="input-group">
                                                <span>{{item.providentFundCompany}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">个人公积金（元）</label>
                                            <div class="input-group">
                                                <span>{{item.providentFundPersonal}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">其他福利（元）</label>
                                            <div class="input-group">
                                                <span>{{item.otherWeal}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">采购说明</label>
                                            <div class="input-group">
                                                <span>{{item.procurementExplanation}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">司机其他要求</label>
                                            <div class="input-group">
                                                <span>{{item.driverOtherRequirement}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="询价信息" name="inquiryInfo">
                                <el-collapse-item title="询价状态" name="3">
                                    <div class="flex-panel detail-box">
                                        <div class="detail-item">
                                            <label class="control-label">采购询价</label>
                                            <div class="input-group">
                                                <span v-if="detailForm.project.purchaseConfirm==1">已确认</span>
                                                <span v-if="detailForm.project.purchaseConfirm==0">未确认</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">确认人</label>
                                            <div class="input-group">
                                                <span v-if="detailForm.confirmInfo.a_1">{{detailForm.confirmInfo.a_1.name}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item" >
                                            <label class="control-label">确认时间</label>
                                            <div class="input-group">
                                                <span v-if="detailForm.confirmInfo.a_1">{{detailForm.confirmInfo.a_1.date}}</span>
                                            </div>
                                        </div>

                                        <div class="detail-item">
                                            <label class="control-label">维保询价</label>
                                            <div class="input-group">
                                                <span v-if="detailForm.project.maintenanceConfirm==1">已确认</span>
                                                <span v-if="detailForm.project.maintenanceConfirm==0">未确认</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">确认人</label>
                                            <div class="input-group">
                                                <span v-if="detailForm.confirmInfo.a_2">{{detailForm.confirmInfo.a_2.name}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">确认时间</label>
                                            <div class="input-group">
                                                <span v-if="detailForm.confirmInfo.a_2">{{detailForm.confirmInfo.a_2.date}}</span>
                                            </div>
                                        </div>

                                        <div class="detail-item">
                                            <label class="control-label">人力询价</label>
                                            <div class="input-group">
                                                <span v-if="detailForm.project.humanConfirm==1">已确认</span>
                                                <span v-if="detailForm.project.humanConfirm==0">未确认</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">确认人</label>
                                            <div class="input-group">
                                                <span v-if="detailForm.confirmInfo.a_3">{{detailForm.confirmInfo.a_3.name}}</span>
                                            </div>
                                        </div>
                                        <div class="detail-item">
                                            <label class="control-label">确认时间</label>
                                            <div class="input-group">
                                                <span v-if="detailForm.confirmInfo.a_3">{{detailForm.confirmInfo.a_3.date}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-collapse-item>

                                <el-collapse-item title="询价信息" name="4">
                                    <div v-for="item in detailForm.inquiryArray" class="flex-panel detail-box">
                                        <h3 style="width: 100%;">{{item.serviceCityName}} {{item.vehicleModelInfoName}}
                                            {{item.carColorName}} {{item.newOrOldCarName}}车 {{item.vehicleQty}}辆</h3>

                                        <h3 style="width: 100%;font-weight: 400;padding-left: 12px;">采购询价</h3>
                                        <div class="flex-panel detail-box">
                                            <div class="detail-item">
                                                <label class="control-label">购车价格（包牌/元）</label>
                                                <div class="input-group">
                                                    <span>{{item.carPrice}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">最近价格（元）</label>
                                                <div class="input-group">
                                                    <span>{{item.recentPrice}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">加装费（元）</label>
                                                <div class="input-group">
                                                    <span>{{item.installationCost}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">采购说明</label>
                                                <div class="input-group">
                                                    <span>{{item.procurementExplanation}}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 style="width: 100%;font-weight: 400;padding-left: 12px;">维保询价</h3>
                                        <div class="flex-panel detail-box">
                                            <div class="detail-item">
                                                <label class="control-label">保险费（元/年）</label>
                                                <div class="input-group">
                                                    <span>{{item.insuranceCost}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">维修费（元/月）</label>
                                                <div class="input-group">
                                                    <span>{{item.maintenanceCost}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">保养费（元/月）</label>
                                                <div class="input-group">
                                                    <span>{{item.maintainCost}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">油路费（元/月）</label>
                                                <div class="input-group">
                                                    <span>{{item.oilCost}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">车船税（元）</label>
                                                <div class="input-group">
                                                    <span>{{item.carShipTax}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">GPS（元/月）</label>
                                                <div class="input-group">
                                                    <span>{{item.gpsCost}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">年检费（元）</label>
                                                <div class="input-group">
                                                    <span>{{item.inspectionCost}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">绿标费（元）</label>
                                                <div class="input-group">
                                                    <span>{{item.greenLabeCost}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">年票费（元/年）</label>
                                                <div class="input-group">
                                                    <span>{{item.yearTicketCost}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">停车费（元/月）</label>
                                                <div class="input-group">
                                                    <span>{{item.parkCost}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">清洁费（元）</label>
                                                <div class="input-group">
                                                    <span>{{item.cleanCost}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">牌照费（元）</label>
                                                <div class="input-group">
                                                    <span>{{item.licencesUseCost}}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 style="width: 100%;font-weight: 400;padding-left: 12px;">人力询价</h3>
                                        <div class="flex-panel detail-box">
                                            <div class="detail-item">
                                                <label class="control-label">基本工资（元）</label>
                                                <div class="input-group">
                                                    <span>{{item.basicSalary}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">单位社保（元）</label>
                                                <div class="input-group">
                                                    <span>{{item.socialSecurityCompany}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">个人社保（元）</label>
                                                <div class="input-group">
                                                    <span>{{item.socialSecurityPersonal}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">单位公积金（元）</label>
                                                <div class="input-group">
                                                    <span>{{item.providentFundCompany}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">个人公积金（元）</label>
                                                <div class="input-group">
                                                    <span>{{item.providentFundPersonal}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">其他福利（元）</label>
                                                <div class="input-group">
                                                    <span>{{item.otherWeal}}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <label class="control-label">司机其他要求</label>
                                                <div class="input-group">
                                                    <span>{{item.driverOtherRequirement}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </el-collapse-item>
                            </el-tab-pane>
                            <el-tab-pane label="审批记录" name="approvalInfo">
                                <el-collapse-item title="审批进程" name="5"  v-if="detailForm.project.reviewStatus>=40">
                                    <approval-flow :id="id"></approval-flow>
                                </el-collapse-item>
                            </el-tab-pane>
                        </el-tabs>
                    </template>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import {calculator} from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'

    export default {
        name: "projectApproveDetail",
        components: {ApprovalFlow, FileDetail},
        data() {
            return {
                openCollapse: ["1", "2", "3", "4", "5", "6", "7"],
                show: true,
                dialogProvinceTableVisible: false,
                detailForm: {
                    project: {},
                    inquiryArray: [],
                    confirmInfo: {}
                },
                frameContractOps: [
                    {label: '是', value: 1},
                    {label: '否', value: 0}
                ],
                id: this.$route.params.id,
                tabActiveName: 'bidInfo'
            }
        },
        methods: {
            tzsyInput(i, e) {
                let v = parseFloat(e);
                if (v > 100)
                    v = 100;

                let item = this.detailForm.inquiryArray[i];
                item.monthInvestmentIncome = calculator.Div(
                    calculator.Mul(item.carPrice, v), 1200, 2);
            },
            rzcbInput(i, e) {
                let v = parseFloat(e);
                if (v > 100)
                    v = 100;

                var item = this.detailForm.inquiryArray[i];
                item.monthFinancingCost = calculator.Div(
                    calculator.Mul(item.carPrice, v), 1200, 2);
            },
            open() {
                this.openCollapse = ["1", "2", "3", "4", "5", "6"];
                this.show = true;
            }
        }
        ,
        mounted() {
            ajax.get('/core/coreProjectReview/detailByReviewSubmit'
                , {id: this.id}).then(rs => {

                if (rs.data['project'].humanConfirm)
                    rs.data['project'].humanConfirm += '';
                if (rs.data['project'].maintenanceConfirm)
                    rs.data['project'].maintenanceConfirm += '';
                if (rs.data['project'].purchaseConfirm)
                    rs.data['project'].purchaseConfirm += '';

                this.$set(this.detailForm, 'project', rs.data['project']);
                this.$set(this.detailForm, 'inquiryArray', rs.data['inquiry']);

                let confirms = {};
                rs.data.confirmInfoArray.forEach(item => {
                    confirms['a_' + item.type] = item;
                });

                this.$set(this.detailForm, 'confirmInfo', confirms);

                rs.data['inquiry'].forEach((item, index) => {
                    this.tzsyInput(index, item['investmentIncome']);
                    this.rzcbInput(index, item['financingCost']);
                });
            });
        }

    }
</script>
