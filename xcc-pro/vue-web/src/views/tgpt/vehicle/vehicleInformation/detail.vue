<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <!--车辆资料-->
            <el-collapse-item title="基本资料" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">车牌</label>
                        <div class="input-group">
                            <span>{{vehicle.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">港车车牌</label>
                        <div class="input-group">
                            <span>{{vehicle.hongkongPlate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车型</label>
                        <div class="input-group">
                            <span style="cursor: pointer;color: #4e8fff;" @click="getModelInfo(vehicle.vehicleModelInfoId)">{{vehicle.modelName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">颜色</label>
                        <div class="input-group">
                            <span>{{vehicle.colorName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{vehicle.providerCompanyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务组织</label>
                        <div class="input-group">
                            <span>{{vehicle.serviceCompanyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">客户</label>
                        <div class="input-group">
                            <span>{{vehicle.serviceEnterpriseName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">注册城市</label>
                        <div class="input-group">
                            <span>{{vehicle.registerCityName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">资产属性</label>
                        <div class="input-group">
                            <span>{{vehicle.assetsType}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车牌属性</label>
                        <div class="input-group">
                            <span>{{vehicle.plateType}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">使用性质</label>
                        <div class="input-group">
                            <span>{{vehicle.useNatureName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车辆状态</label>
                        <div class="input-group">
                            <span>{{vehicle.vehicleStatusText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服役状态</label>
                        <div class="input-group">
                            <span>{{vehicle.serviceStatusText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车辆来源</label>
                        <div class="input-group">
                            <span>{{vehicle.vehicleSourceText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">驾驶员</label>
                        <div class="input-group">
                            <span>{{vehicle.driver}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">行驶里程（公里）</label>
                        <div class="input-group">
                            <span>{{vehicle.mileage}}</span>
                        </div>
                    </div>
                    <div class="detail-item small">
                        <label class="control-label">车龄（月）</label>
                        <div class="input-group">
                            <span>{{vehicle.carAgeMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">通行证有效截止日期</label>
                        <div class="input-group">
                            <span>{{vehicle.passValidDate}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>

            <el-collapse-item title="详细资料" name="2" v-show="vehicle.vehicleSource == 1">
                <el-tabs v-model="activeTabName"  @tab-click="handleClick">
                    <el-tab-pane label="基本信息" name="first">
                        <div class="flex-panel detail-box">
                            <div class="detail-item">
                                <label class="control-label">车架号</label>
                                <div class="input-group">
                                    <span>{{vehicle.vin}}</span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <label class="control-label">发动机号</label>
                                <div class="input-group">
                                    <span>{{vehicle.engineNo}}</span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <label class="control-label">机动车登记证</label>
                                <div class="input-group">
                                    <span>{{vehicle.certificate}}</span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <label class="control-label">登记证状态</label>
                                <div class="input-group">
                                    <span>{{vehicle.certificateStatus}}</span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <label class="control-label">行驶证号</label>
                                <div class="input-group">
                                    <span>{{vehicle.licenseNumber}}</span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <label class="control-label">行驶证所有人</label>
                                <div class="input-group">
                                    <span>{{vehicle.licenseName}}</span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <label class="control-label">油箱容量</label>
                                <div class="input-group">
                                    <span>{{vehicle.fuelCapacity}}</span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <label class="control-label">燃油类型</label>
                                <div class="input-group">
                                    <span>{{vehicle.fuelType}}</span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <label class="control-label">购车日期</label>
                                <div class="input-group">
                                    <span>{{vehicle.buyDate}}</span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <label class="control-label">购车价格(元)</label>
                                <div class="input-group">
                                    <span>{{vehicle.price}}</span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <label class="control-label">上牌日期</label>
                                <div class="input-group">
                                    <span>{{vehicle.registrationDate}}</span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <label class="control-label">上牌费用(元)</label>
                                <div class="input-group">
                                    <span>{{vehicle.plateCost}}</span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <label class="control-label">座位数</label>
                                <div class="input-group">
                                    <span>{{vehicle.seatNum}}</span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <label class="control-label">行驶证图片</label>
                                <div class="input-group">
                                    <upload-panel :size="2" disabled :file-list.sync="licenseimgs" :show-img="true"></upload-panel>
                                </div>
                            </div>
                            <div class="detail-item small">
                                <label class="control-label">驾驶证图片</label>
                                <div class="input-group">
                                    <upload-panel :size="2" disabled :file-list.sync="certificateimgs" :show-img="true"></upload-panel>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="车牌修改记录" name="second">
                        <div class="app-container white-bg list-panel" v-cloak>
                            <div class="table-box">
                                <el-table border :data="list" style="width: 100%">
                                    <el-table-column prop="beforeValue" sortable label="变更前车牌" min-width="100"></el-table-column>
                                    <el-table-column prop="afterValue" sortable label="变更后车牌" min-width="140" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="reason" sortable label="变更事由" min-width="150"></el-table-column>
                                    <el-table-column prop="creater" sortable label="变更人" min-width="100"></el-table-column>
                                    <el-table-column prop="updateTime" sortable label="变更时间" min-width="150"></el-table-column>
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
                    </el-tab-pane>
                    <el-tab-pane label="行程数据" name="track">
                        <div class="app-container white-bg list-panel" v-cloak>
                            <div class="table-box">
                                <el-table border :data="list" style="width: 100%">
                                    <el-table-column fixed="left" label="操作" min-width="160">
                                        <template slot-scope="scope">
                                            <el-button @click="vehicleTrackRecord(scope.row)" type="text" size="small">
                                                查看详情
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="startTime" sortable label="开始时间" min-width="100"></el-table-column>
                                    <el-table-column prop="endTime" sortable label="结束时间" min-width="140" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="totalTime" sortable label="行驶时长(min)" min-width="150"></el-table-column>
                                    <el-table-column prop="totalMileage" sortable label="里程(km)" min-width="100">
                                        <template slot-scope="scope">
                                            {{(scope.row.totalMileage / 1000).toFixed(2)}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="totalOil" sortable label="耗油量(L)" min-width="150"></el-table-column>
                                    <el-table-column prop="idleTime" sortable label="怠速时长(min)" min-width="150"></el-table-column>
                                    <el-table-column prop="idleFuel" sortable label="怠速耗油量(L)" min-width="150"></el-table-column>
                                    <el-table-column prop="fuelConsumption" sortable label="油耗(L/100km)" min-width="150"></el-table-column>
                                    <el-table-column prop="speed" sortable label="平均车速(km/h)" min-width="150"></el-table-column>
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
                    </el-tab-pane>
                    <el-tab-pane label="年检记录" name="annual">
                        <div class="app-container white-bg list-panel" v-cloak>
                            <div class="table-box">
                                <el-table border :data="list" style="width: 100%">
                                    <el-table-column prop="operateDate" sortable label="年检日期" min-width="100"></el-table-column>
                                    <el-table-column prop="result" sortable label="检验结果" min-width="140" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="effectiveDate" sortable label="合格有效期至" min-width="150"></el-table-column>
                                    <el-table-column prop="department" sortable label="年检单位" min-width="100"></el-table-column>
                                    <el-table-column prop="cost" sortable label="年检费用" min-width="150"></el-table-column>
                                    <el-table-column prop="operator" sortable label="办理人" min-width="150"></el-table-column>
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
                    </el-tab-pane>
                    <el-tab-pane label="设备绑定记录" name="third">
                        <div class="app-container white-bg list-panel" v-cloak>
                            <div class="table-box">
                                <el-table border :data="list" style="width: 100%">
                                    <el-table-column prop="equipmentType" sortable label="设备类型" min-width="140"></el-table-column>
                                    <el-table-column prop="sn" sortable label="设备号SN" min-width="140" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="imei" sortable label="IMEI" min-width="140"></el-table-column>
                                    <el-table-column prop="typeName" sortable label="操作类型" min-width="120"></el-table-column>
                                    <el-table-column prop="equipmentModalName" sortable label="产品型号" min-width="120"></el-table-column>
                                    <el-table-column prop="installSit" sortable label="安装位置" min-width="150"></el-table-column>
                                    <el-table-column prop="creater" sortable label="操作人" min-width="120"></el-table-column>
                                    <el-table-column prop="createTime" sortable label="操作时间" min-width="120"></el-table-column>
                                    <el-table-column prop="remark" sortable label="操作说明" min-width="150"></el-table-column>
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
                    </el-tab-pane>
                    <el-tab-pane label="服役记录" name="fourth">
                       <!-- <span style="margin-left: 25px;"><font color="#FF0000">服役记录列表需求暂未明确！！！</font></span>-->
                        <div class="app-container white-bg list-panel" v-cloak>
                            <div class="table-box">
                                <el-table border :data="list" style="width: 100%">
                                    <el-table-column prop="contractType" sortable label="服务类型" min-width="100"></el-table-column>
                                    <el-table-column prop="enterpriseName" sortable label="服务客户" min-width="140" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="contractNumber" sortable label="合同编号" min-width="150"></el-table-column>
                                    <el-table-column prop="serviceStatus" sortable label="服务状态" min-width="100"></el-table-column>
                                    <el-table-column prop="contractStartDate" sortable label="服务开始时间" min-width="120"></el-table-column>
                                    <el-table-column prop="contractEndDate" sortable label="服务结束时间" min-width="120"></el-table-column>
                                    <el-table-column prop="contractAmount" sortable label="租金" min-width="120"></el-table-column>
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
                    </el-tab-pane>
                    <el-tab-pane label="加油记录" name="fifth">
                        <div class="app-container white-bg list-panel" v-cloak>
                            <div class="table-box">
                                <el-table border :data="list" style="width: 100%">
                                    <el-table-column prop="orderNo" sortable label="加油单号" min-width="180" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="addOilTime" sortable label="加油时间" min-width="140" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="addOilPlace" sortable label="加油地点" min-width="200" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="addOilReason" sortable label="加油原因" min-width="120" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="driverName" sortable label="驾驶员" min-width="120"></el-table-column>
                                    <el-table-column prop="oilTotalAmount" sortable label="加油金额（元）" min-width="120"></el-table-column>
                                    <!--<el-table-column prop="transportation" sortable label="交通费（元）" min-width="120"></el-table-column>
                                    <el-table-column prop="totalAmount" sortable label="总金额（元）" min-width="150"></el-table-column>-->
                                    <el-table-column prop="billStatus" sortable label="状态" min-width="120"></el-table-column>
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
                    </el-tab-pane>
                    <el-tab-pane label="保险记录" name="sixth">
                        <div class="table-box">
                            <el-table border :data="list" style="width: 100%">
                                <el-table-column prop="policyNumber" sortable label="保险单号" min-width="100"></el-table-column>
                                <el-table-column prop="insuranceTypeName" sortable label="保险类型" min-width="140" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="insuranceCompanyName" sortable label="保险公司" min-width="150"></el-table-column>
                                <el-table-column prop="insuredDate" sortable label="投保日" min-width="100"></el-table-column>
                                <el-table-column prop="expiryDate" sortable label="到期日" min-width="150"></el-table-column>
                                <el-table-column prop="warrantyStatusName" sortable label="保单状态" min-width="150"></el-table-column>
                                <el-table-column prop="insuranceCost" sortable label="保费（元）" min-width="150"></el-table-column>
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
                    </el-tab-pane>
                    <el-tab-pane label="维保记录" name="seventh">
                        <div class="table-box">
                            <el-table border :data="list" style="width: 100%">
                                <el-table-column prop="maintenanceNo" sortable label="维保单号" min-width="100"></el-table-column>
                                <el-table-column prop="maintenanceType" sortable label="维保类型" min-width="140" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="totalPrice" sortable label="维保费用（元）" min-width="150"></el-table-column>
                                <el-table-column prop="arriveRepairTime" sortable label="送修日期" min-width="100"></el-table-column>
                                <el-table-column prop="fetchCarTime" sortable label="提车日期" min-width="100"></el-table-column>
                                <el-table-column prop="billStatus" sortable label="状态" min-width="150"></el-table-column>
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
                    </el-tab-pane>
                    <el-tab-pane label="事故记录" name="eighth">
                        <div class="table-box">
                            <el-table border :data="list" style="width: 100%">
                                <el-table-column prop="code" sortable label="事故单号" min-width="150"></el-table-column>
                                <el-table-column prop="accidentTime" sortable label="事故发生时间" min-width="120" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="accidentPlace" sortable label="事故地点" min-width="150"></el-table-column>
                                <el-table-column prop="accidentCauseName" sortable label="事故起因" min-width="100"></el-table-column>
                                <el-table-column prop="accidentSquareName" sortable label="事故方" min-width="100"></el-table-column>
                                <el-table-column prop="accidentResponsibilityName" sortable label="事故责任" min-width="100"></el-table-column>
                                <el-table-column prop="accidentGradeName" sortable label="事故等级" min-width="120"></el-table-column>
                                <el-table-column prop="userName" sortable label="事故经手人" min-width="150"></el-table-column>
                                <el-table-column prop="accidentAmount" sortable label="事故总金额（元）" min-width="150"></el-table-column>
                                <el-table-column prop="billStatus" sortable label="状态" min-width="150"></el-table-column>
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
                    </el-tab-pane>
                <!--    <el-tab-pane label="单车利润" name="ninth">
                        &lt;!&ndash;<span style="margin-left: 25px;"><font color="#FF0000">单车利润列表需求暂未明确！！！</font></span>&ndash;&gt;
                        <div class="table-box">
                            <el-table border :data="list" style="width: 100%">
                                <el-table-column prop="buyDate" sortable label="购入日期" min-width="150"></el-table-column>
                                <el-table-column prop="vehicle_age" sortable label="车龄(月)" min-width="120" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="price" sortable label="购车金额" min-width="150"></el-table-column>
                                <el-table-column prop="total_monthly_rent" sortable label="租金总额" min-width="100"></el-table-column>
                                <el-table-column prop="total_maintenance" sortable label="保养总额" min-width="100"></el-table-column>
                                <el-table-column prop="total_insurance" sortable label="保险总额" min-width="100"></el-table-column>
                                <el-table-column prop="total_depreciation" sortable label="折旧" min-width="120"></el-table-column>
                                <el-table-column prop="other" sortable label="其他费用" min-width="150"></el-table-column>
                                <el-table-column prop="total_profit" sortable label="利润" min-width="150"></el-table-column>
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
                    </el-tab-pane>-->
                </el-tabs>
            </el-collapse-item>
        </el-collapse>
        <!--<el-dialog :title="model.name" :visible.sync="dialogModelVisible" :append-to-body="true" width="50%" >
            <div class="list-panel" v-cloak>
                <div class="detail-item">
                    <label class="control-label">车厢数</label>
                    <div class="input-group">
                        <span>{{model.vehicleNumber}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">排量</label>
                    <div class="input-group">
                        <span>{{model.displacement}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">变速箱</label>
                    <div class="input-group">
                        <span>{{model.transmission}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">车身尺寸</label>
                    <div class="input-group">
                        <span>{{model.vehicleSize}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">座位数</label>
                    <div class="input-group">
                        <span>{{model.seating}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">车身结构</label>
                    <div class="input-group">
                        <span>{{model.vehicleStructure}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">燃油类型</label>
                    <div class="input-group">
                        <span>{{vehicle.fuelType}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">油箱容量(L)</label>
                    <div class="input-group">
                        <span>{{model.fuelCapacity}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">环保标准</label>
                    <div class="input-group">
                        <span>{{model.protectionStandard}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">能源类型</label>
                    <div class="input-group">
                        <span>{{model.energyType}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">综合油耗(L/100km)</label>
                    <div class="input-group">
                        <span>{{model.combined}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">整车质保(年)</label>
                    <div class="input-group">
                        <span>{{model.vehicleWarrantyYear}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">整车质保(km)</label>
                    <div class="input-group">
                        <span>{{model.vehicleWarrantyKm}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">轮胎尺寸</label>
                    <div class="input-group">
                        <span>{{model.tireSize}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">备胎规格</label>
                    <div class="input-group">
                        <span>{{model.spareTireType}}</span>
                    </div>
                </div>
            </div>
        </el-dialog>-->


        <div class="float-box" :class="{'open':dialogModelVisible}" tabindex="1">
            <div class="float-box-title">
                {{model.name}}
                <i class="el-icon-close" @click="dialogModelVisible = false"></i>
            </div>
            <div class="float-box-content">
                <div class="detail-item">
                    <label class="control-label">车厢数</label>
                    <div class="input-group">
                        <span>{{model.vehicleNumber}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">排量</label>
                    <div class="input-group">
                        <span>{{model.displacement}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">变速箱</label>
                    <div class="input-group">
                        <span>{{model.transmission}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">车身尺寸</label>
                    <div class="input-group">
                        <span>{{model.vehicleSize}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">座位数</label>
                    <div class="input-group">
                        <span>{{model.seating}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">车身结构</label>
                    <div class="input-group">
                        <span>{{model.vehicleStructure}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">燃油类型</label>
                    <div class="input-group">
                        <span>{{vehicle.fuelType}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">油箱容量(L)</label>
                    <div class="input-group">
                        <span>{{model.fuelCapacity}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">环保标准</label>
                    <div class="input-group">
                        <span>{{model.protectionStandard}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">能源类型</label>
                    <div class="input-group">
                        <span>{{model.energyType}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">综合油耗(L/100km)</label>
                    <div class="input-group">
                        <span>{{model.combined}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">整车质保(年)</label>
                    <div class="input-group">
                        <span>{{model.vehicleWarrantyYear}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">整车质保(km)</label>
                    <div class="input-group">
                        <span>{{model.vehicleWarrantyKm}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">轮胎尺寸</label>
                    <div class="input-group">
                        <span>{{model.tireSize}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">备胎规格</label>
                    <div class="input-group">
                        <span>{{model.spareTireType}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import {tool} from '@/utils/common'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'

    export default {
        name: "vehicleVehicleInformationDetail",
        mixins: [tool],
        components:{ ApprovalFlow, FileDetail, UploadPanel},
        data(){
            return{
                showEditBtn:false,
                activeNames: ['1','2'],
                activeTabName : "first",
                certificateimgs:[],
                licenseimgs:[],
                dialogModelVisible:false,
                vehicle:{},
                model:{},
                listUrl: "",

            }
        },
        mounted: function () {
            this.detail();
        },
        watch: {

        },
        methods: {
            handleClick(tab, event) {

                if (tab.name == "first"){
                    return;
                }else if (tab.name == "second"){
                    this.listUrl = "base/vehicle/changePlatelist";
                }else if (tab.name == "third"){
                    this.listUrl = "base/vehicle/vehicleEquipmentlist";
                }else if (tab.name == "fourth"){
                    this.listUrl = "base/vehicle/vehicleServicelist";
                }else if (tab.name == "fifth"){
                    this.listUrl = "base/vehicle/vehicleOilOrderlist";
                }else if (tab.name == "sixth"){
                    this.listUrl = "base/vehicle/vehicleInsuranceOrderlist";
                }else if (tab.name == "seventh"){
                    this.listUrl = "base/vehicle/vehicleMaintenanceBilllist";
                }else if (tab.name == "eighth"){
                    this.listUrl = "base/vehicle/vehicleAccidentBilllist";
                }else if (tab.name == "ninth"){
                    this.listUrl = "base/vehicle/profitList";
                }else if (tab.name == "annual"){
                    this.listUrl = "base/vehicle/annualInspectionList";
                }else if (tab.name == "track"){
                    this.listUrl = "base/vehicle/vehicleTrackList";
                }
                this.searchParam = {vehicleId : this.vehicle.vehicleId, rId : this.$route.params.id, vehicleSource : this.vehicle.vehicleSource};
                this.getList();
            },
            getModelInfo(id){
                ajax.get("base/vehicle/model/"+id).then(res => {
                    this.model=res.data;
                    this.dialogModelVisible=true;
                })
            },
            detail(){
                const id = this.$route.params.id
                ajax.get("base/vehicle/detail/"+id).then(res => {
                    if (res.data.licensePic) {
                        //转换图片
                        var licenseimg = JSON.parse(res.data.licensePic);
                        if (typeof licenseimg === 'object' && !isNaN(licenseimg.length)) {
                            this.licenseimgs = licenseimg
                        } else {
                            this.licenseimgs = [licenseimg];
                        }
                    } else {
                        this.licenseimgs = []
                    }
                    if (res.data.certificatePic){//转换图片
                        var certificateimg = JSON.parse(res.data.certificatePic);
                        if (typeof certificateimg === 'object' && !isNaN(certificateimg.length)) {
                            this.certificateimgs = certificateimg
                        } else {
                            this.certificateimgs = [certificateimg];
                        }
                    }else{
                        this.certificateimgs= []
                    }
                    this.vehicle = res.data;
                    //初始化车龄（月）
                    this.getCarAgeMonth();
                })
            },
            /*跳转行程记录*/
            vehicleTrackRecord(row){
                let url = `/tgpt_v2/obd/vehicleTrackRecord`;
                this.$router.push({path: url , query:{plate:this.vehicle.plate}});
                /*this.$router.push({name:'vehicleTrackRecord?plate=' +this.vehicle.plate, params:{}});*/
            },
            getCarAgeMonth(){
                if (this.vehicle.registrationDate){
                    var startDate = new Date(this.vehicle.registrationDate);
                    var endDate = new Date();
                    var days = endDate.getTime() - startDate.getTime();
                    var difMonth = days / (1000 * 60 * 60 * 24 * 30);
                    this.vehicle.carAgeMonth = difMonth.toFixed(1);
                }
            }
        },

    }
</script>
<style scoped lang="scss">
    .float-box-title {
        font-size: 18px;
        font-weight: bold;
        .el-icon-close {
            position: absolute;
            right: 30px;
            font-size: 20px;
            cursor: pointer;
        }
    }

    .float-box-content {
        padding-top: 10px;
    }
    .float-box {

        position: fixed;
        background: #fff;
        right: -100%;
        width: 350px;
        top: 100px;
        transition: right 0.5s;
        max-height: calc(100% - 120px);
        overflow-y: auto;
        z-index: 5;
        padding: 20px;
        box-shadow: 0 3px 8px 0 rgba(0,0,0,0.10);
        &.open {
            right: 0;
        }

        .detail-item {
            display: flex;
            height: 40px;
            align-items: center;
            .control-label {
                width: 100px;
                text-align: right;
                margin-right: 20px;
            }
        }
    }

</style>
