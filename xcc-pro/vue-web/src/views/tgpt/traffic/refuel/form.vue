<template>
    <div class="form-panel">
        <el-form :model="oilDataFrom" :rules="rules" label-position="top" ref="oilDataFrom" label-width="100px">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="车辆加油单" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="companyId">
                            <tree-select v-model="oilDataFrom.companyId" placeholder="请选择组织" type="one" url="/admin/organization/tree"></tree-select>
                        </el-form-item>
                        <el-form-item label="车辆" prop="vehicleId">
                            <el-input readonly v-model="oilDataFrom.plate" :disabled="organizationFlag">
                                <template slot="append" ><el-button class="el-icon-search" @click.native="openVehicle" :disabled="organizationFlag"></el-button></template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="车型名称">
                            <el-input disabled v-model="oilDataFrom.modelName"></el-input>
                        </el-form-item>
                        <el-form-item label="燃油类型">
                            <el-input disabled v-model="oilDataFrom.fuelType"></el-input>
                        </el-form-item>
                        <el-form-item label="油箱容量">
                            <el-input disabled v-model="oilDataFrom.fuelCapacity">
                                <template slot="append">L</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="驾驶员" prop="driverId">
                            <el-input readonly v-model="oilDataFrom.driver" :disabled="organizationFlag">
                                <template slot="append"><el-button class="el-icon-search" @click.native="openDriver" :disabled="organizationFlag"></el-button></template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="加油时间" prop="addOilTime">
                            <el-date-picker v-model="oilDataFrom.addOilTime" clearable type="datetime" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期" :disabled="organizationFlag"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="加油地点" prop="addOilPlace">
                            <el-input clearable maxlength="200" v-model="oilDataFrom.addOilPlace" :disabled="organizationFlag"></el-input>
                        </el-form-item>
                        <el-form-item label="加油原因" prop="addOilReason">
                            <el-select v-model="oilDataFrom.addOilReason" clearable placeholder="全部" :disabled="organizationFlag">
                                <el-option label="用车加油" value="1"></el-option>
                                <el-option label="新车加油" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="加油前油量" prop="addOilBefore">
                            <el-input clearable v-model="oilDataFrom.addOilBefore" :disabled="organizationFlag"><template slot="append">%</template></el-input>
                        </el-form-item>
                        <el-form-item label="加油单价" prop="oilUnitPrice">
                            <el-input clearable v-model="oilDataFrom.oilUnitPrice" @blur="calculateOilAmount" :disabled="organizationFlag">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="加油量" prop="addOil">
                            <el-input clearable v-model="oilDataFrom.addOil" @blur="calculateOilAmount" :disabled="organizationFlag">
                                <template slot="append">升</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="加油后油量" prop="addOilAfter">
                            <el-input clearable v-model="oilDataFrom.addOilAfter" :disabled="organizationFlag">
                                <template slot="append">%</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="加油里程" prop="gasMileage">
                            <el-input clearable v-model="oilDataFrom.gasMileage" :disabled="organizationFlag">
                                <template slot="append">公里</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="加油票图片">
                            <upload-panel :size="1" :file-list.sync="iconPhoto" accept=".png,.jpg" :show-img="true" :disabled="organizationFlag"></upload-panel>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="支付方式及费用归属" name="2" >
                    <div class="flex-panel">
                        <el-form-item label="合同编号" prop="contractNo">
                            <el-input readonly v-model="oilDataFrom.contractNo" :disabled="organizationFlag">
                                <template slot="append"><el-button class="el-icon-search" @click.native="openContract" :disabled="organizationFlag"></el-button></template>
                            </el-input>
                        </el-form-item>
                        <!--<el-form-item label="每月结算单号">
                            <el-input clearable readonly @click.native="openSettlement" v-model="oilDataFrom.monthStatementNo" :disabled="organizationFlag">
                                <template slot="append"><i class="el-icon-search"></i></template>
                            </el-input>
                        </el-form-item>-->
                        <el-form-item label="服务客户">
                            <el-input disabled clearable v-model="oilDataFrom.enterprise"></el-input>
                        </el-form-item>
                        <el-form-item label="支付方式" prop="paymentMethod">
                            <el-select v-model="oilDataFrom.paymentMethod" @change="$refs.oilDataFrom.clearValidate(['oilCardId'])" :disabled="organizationFlag">
                                <el-option label="现金" :value="1" :key="1"></el-option>
                                <el-option label="油卡" :value="2" :key="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <template v-if="oilDataFrom.paymentMethod == '2'">
                            <el-form-item label="加油卡" prop="oilCardId">
                                <el-input clearable readonly @click.native="openOilCard" v-model="oilDataFrom.oilCardCode" :disabled="organizationFlag">
                                    <template slot="append"><i class="el-icon-search"></i></template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="油卡加油前余额">
                                <el-input disabled v-model="oilDataFrom.oilCardBeforeBalance">
                                    <template slot="append">元</template>
                                </el-input>
                            </el-form-item>
                            <!--<el-form-item label="油卡加油后余额">-->
                            <!--<el-input :disabled = "true"-->
                            <!--:value="((oilDataFrom.oilCardBeforeBalance == undefined ? 0:oilDataFrom.oilCardBeforeBalance) - (oilDataFrom.oilUnitPrice == undefined ? 0:oilDataFrom.oilUnitPrice) * (oilDataFrom.addOil ==  undefined ? 0 : oilDataFrom.addOil)).toFixed(2)">-->
                            <!--<template slot="append">元</template>-->
                            <!--</el-input>-->
                            <!--</el-form-item>-->
                            <el-form-item label="油卡加油后余额">
                                <el-input disabled
                                          :value="((oilDataFrom.oilCardBeforeBalance ? oilDataFrom.oilCardBeforeBalance:0.00) - (oilDataFrom.oilTotalAmount?oilDataFrom.oilTotalAmount:0.00)).toFixed(2)">
                                    <template slot="append">元</template>
                                </el-input>
                            </el-form-item>
                        </template>
                        <el-form-item label="加油发票号" v-if="oilDataFrom.paymentMethod == '1'">
                            <el-input v-model="oilDataFrom.addOilInvoiceNo" :disabled="organizationFlag"></el-input>
                        </el-form-item>
                        <el-form-item label="加油金额">
                            <el-input :disabled="organizationFlag" v-model="oilDataFrom.oilTotalAmount" clearable>
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="交通费" prop="transportation">
                            <el-input clearable v-model="oilDataFrom.transportation" :disabled="organizationFlag">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="交通费使用原因">
                            <el-input clearable maxlength="200" v-model="oilDataFrom.transportationReason" :disabled="organizationFlag"></el-input>
                        </el-form-item>
                        <el-form-item label="总金额">
                            <el-input disabled :value="(parseInt((oilDataFrom.transportation ? oilDataFrom.transportation : 0)) + (oilDataFrom.oilTotalAmount?oilDataFrom.oilTotalAmount:0.00)).toFixed(2)">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="备注" name="3" >
                    <div class="flex-panel">
                        <el-form-item label="备注" class = "big">
                            <el-input type="textarea" :rows="4" v-model="oilDataFrom.remark" clearable :disabled="organizationFlag"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <div class="left-row">
                <el-button type="primary" @click="submitForm('oilDataFrom')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>

        <el-dialog title="选择加油卡" :visible.sync="dialog.dialogOilCard" :append-to-body="true" width="70%" >
            <div class="wrapper wrapper-content  fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">加油卡号</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.code" placeholder="请输入加油卡号" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">所属组织</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.company" placeholder="请输入所属组织" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">服务客户</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.enterprise" placeholder="请输入服务客户" clearable />
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table :data="list" style="width: 100%;" border>
                        <el-table-column fixed="left" label="操作" min-width="50">
                            <template slot-scope="scope">
                                <el-button @click="changeOilCard(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="code" label="加油卡号"  min-width="200" ></el-table-column>
                        <el-table-column prop="supplier" label="能源企业" min-width="250"></el-table-column>
                        <el-table-column prop="balance" label="油卡余额" min-width="90"></el-table-column>
                        <el-table-column prop="type" label="油卡类型" min-width="80"></el-table-column>
                        <el-table-column prop="cardholderUser" label="持卡人" min-width="150"></el-table-column>
                        <el-table-column prop="company" label="所属组织" min-width="200"></el-table-column>
                        <el-table-column prop="oilCardStatus" label="状态" min-width="100"></el-table-column>
                        <el-table-column prop="enterprise" label="服务客户" min-width="250"></el-table-column>
                        <el-table-column prop="modelName" label="绑定车型" min-width="300"></el-table-column>
                        <el-table-column prop="plate" label="绑定车辆" min-width="100"></el-table-column>
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
        </el-dialog>

        <el-dialog title="选择合同" :visible.sync="dialog.dialogContractNo" :append-to-body="true" width="70%" >
            <div class="wrapper wrapper-content  fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">合同编号</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.contractNumber" placeholder="请输入合同编号" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">服务客户</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.enterprise" placeholder="请输入服务客户" clearable />
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table :data="list" style="width: 100%;" border max-height="250">
                        <el-table-column fixed="left" label="操作" min-width="50">
                            <template slot-scope="scope">
                                <el-button @click="changeContract(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="contractNumber" label="合同编号"  min-width="200" ></el-table-column>
                        <el-table-column prop="projectName" label="项目名称" min-width="250"></el-table-column>
                        <el-table-column prop="enterprise" label="服务客户" min-width="150"></el-table-column>
                        <el-table-column prop="startDate" label="开始时间" min-width="120"></el-table-column>
                        <el-table-column prop="endDate" label="结束时间" min-width="120"></el-table-column>
                        <el-table-column prop="company" label="所属组织" min-width="200"></el-table-column>
                        <el-table-column prop="contractStatus" label="合同状态" min-width="100"></el-table-column>
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
        </el-dialog>

        <el-dialog title="选择每月结算单号" :visible.sync="dialog.dialogMonthStatementNo" :append-to-body="true" width="70%" >
            <div class="wrapper wrapper-content  fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">项目订单编号</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.orderNumber" placeholder="请输入项目订单编号" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">合同编号</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.contractNumber" placeholder="请输入合同编号" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">服务客户</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.enterprise" placeholder="请输入服务客户" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">项目月结单编号</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.projectVehicleSettlementNo" placeholder="请输入项目月结单编号" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.plate" placeholder="请输入车牌" clearable />
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table :data="list" style="width: 100%;" border max-height="250">
                        <el-table-column fixed="left" label="操作" min-width="50">
                            <template slot-scope="scope">
                                <el-button @click="changeSettlement(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderNumber" label="项目订单编号"  min-width="200" ></el-table-column>
                        <el-table-column prop="contractNumber" label="合同编号" min-width="200"></el-table-column>
                        <el-table-column prop="enterprise" label="服务客户" min-width="250"></el-table-column>
                        <el-table-column prop="projectVehicleSettlementNo" label="项目月结单编号" min-width="200"></el-table-column>
                        <el-table-column prop="startSate" label="开始日期" min-width="120"></el-table-column>
                        <el-table-column prop="endSate" label="结束日期" min-width="120"></el-table-column>
                        <el-table-column prop="plate" label="车牌" min-width="100"></el-table-column>
                        <el-table-column prop="modelName" label="车型名称" min-width="300"></el-table-column>
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
        </el-dialog>

        <el-dialog title="选择司机" :visible.sync="dialog.dialogDriver" :append-to-body="true" width="70%" >
            <div class="wrapper wrapper-content  fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">司机姓名</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.name" placeholder="请输入司机姓名" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">手机号</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.phone" placeholder="请输入手机号" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">服务城市</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.serviceCity" placeholder="请输入服务城市" clearable />
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table :data="list" style="width: 100%;" border>
                        <el-table-column fixed="left" label="操作" min-width="50">
                            <template slot-scope="scope">
                                <el-button @click="changeDriver(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="姓名"  min-width="300" ></el-table-column>
                        <el-table-column prop="phone" label="手机号" min-width="120"></el-table-column>
                        <el-table-column prop="serviceName" label="服务城市" min-width="80"></el-table-column>
                        <el-table-column prop="driveAge" label="驾龄" min-width="80"></el-table-column>
                        <el-table-column prop="company" label="所属组织" min-width="120"></el-table-column>
                        <el-table-column prop="workStatus" label="工作状态" min-width="80"></el-table-column>
                        <el-table-column prop="serviceStatus" label="服务状态" min-width="100"></el-table-column>
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
        </el-dialog>

        <el-dialog title="选择车辆" :visible.sync="dialog.dialogVehicle" :append-to-body="true" width="70%" >
            <div class="wrapper wrapper-content  fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.plate" placeholder="请输入车牌" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">车型</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.modelName" placeholder="请输入车型" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">经营城市</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.runCityName" placeholder="请输入经营城市" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">车辆状态</label>
                            <div class="input-group">
                                <el-select v-model="searchParam.vehicleStatus" placeholder="不限">
                                    <el-option label="未投入运营" value="1"></el-option>
                                    <el-option label="待租" value="2"></el-option>
                                    <el-option label="已租" value="3"></el-option>
                                    <el-option label="保养" value="4"></el-option>
                                    <el-option label="维修" value="5"></el-option>
                                    <el-option label="退出运营" value="6"></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">在库状态</label>
                            <div class="input-group">
                                <el-select v-model="searchParam.stockStatus" placeholder="不限">
                                    <el-option label="在库" value="1"></el-option>
                                    <el-option label="出库" value="2"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table :data="list" style="width: 100%;" border>
                        <el-table-column fixed="left" label="操作" min-width="50">
                            <template slot-scope="scope">
                                <el-button @click="changeVehicle(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="companyName" label="所属组织" min-width="150" ></el-table-column>
                        <el-table-column prop="plate" label="车牌" min-width="100"></el-table-column>
                        <el-table-column prop="modelName" label="车型" min-width="300"></el-table-column>
                        <el-table-column prop="color" label="颜色" min-width="80"></el-table-column>
                        <el-table-column prop="registerCityName" label="注册城市" min-width="120"></el-table-column>
                        <el-table-column prop="runCityName" label="经营城市" min-width="120"></el-table-column>
                        <el-table-column prop="vehicleStatus" label="车辆状态" min-width="100"></el-table-column>
                        <el-table-column prop="stockStatus" label="在库状态" min-width="100"></el-table-column>
                        <el-table-column prop="registrationDate" label="上牌日期" min-width="120"></el-table-column>
                        <el-table-column prop="assetsType" label="资产属性" min-width="100"></el-table-column>
                        <el-table-column prop="plateType" label="车牌属性" min-width="100"></el-table-column>
                        <el-table-column prop="useNature" label="经营属性" min-width="100"></el-table-column>
                        <el-table-column prop="fuelType" label="燃油类型" min-width="80"></el-table-column>
                        <el-table-column prop="fuelCapacity" label="邮箱容量" min-width="80"></el-table-column>
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
        </el-dialog>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'
    import ElButton from "../../../../../node_modules/element-ui/packages/button/src/button.vue";

    export default {
        mixins: [ tool, ruleTool ],
        components:{
            ElButton,
            TreeSelect, MoneyInput, UploadPanel },
        data: function () {
            return {
                dialog: {
                    dialogDriver : false,
                    dialogVehicle : false,
                    dialogOilCard: false,
                    dialogContractNo: false,
                    dialogMonthStatementNo : false
                },
                organizationFlag: true,
                oilDataFrom: {},
                iconPhoto:[],
                currentUserInfo : this.getCurrentUserInfo().organizationList,
                activeNames: ['1','2','3'],
                show:false,
                rules: {
                    vehicleId: [
                        { required: true, message: '请选择车辆', trigger: 'change' }
                    ],
                    driverId: [
                        { required: true, message: '请选择驾驶员', trigger: 'change' }
                    ],
                    addOilTime: [
                        { required: true, message: '请选择加油时间', trigger: 'blur' }
                    ],
                    addOilPlace: [
                        { required: true, message: '请输入加油地点', trigger: 'blur' }
                    ],
                    addOilReason: [
                        { required: true, message: '请选择加油原因', trigger: 'change' }
                    ],
                    addOilBefore: [
                        { required: true, message: '请输入加油前油量', trigger: 'blur' }
                    ],
                    oilUnitPrice: [
                        { required: true, message: '请输入加油单价', trigger: 'blur' },
                        { validator: formRule.money, message: '加油单价最大输入11位整数两位小数', trigger: 'blur' }
                    ],
                    addOil: [
                        { required: true, message: '请输入加油量', trigger: 'blur' },
                        { validator: formRule.money, message: '加油量最大输入11位整数两位小数', trigger: 'blur' }
                    ],
                    paymentMethod: [
                        { required: true, message: '请选择支付方式', trigger: 'blur' }
                    ],
                    oilCardId: [
                        { required: true, message: '请输入加油卡', trigger: 'change' }
                    ],

                    addOilBefore: [
                        { validator: formRule.cess, message: '请输入小于100以下非负数', trigger: 'blur' }
                    ],
                    addOilAfter: [
                        { validator: formRule.cess, message: '请输入小于100以下非负数', trigger: 'blur' }
                    ],
                    gasMileage: [
                        { required: true, message: '请输入加油里程', trigger: 'blur' },
                        { validator: formRule.money, message: '最大输入11位整数两位小数', trigger: 'change' }
                    ],
                    transportation: [
                        { validator: formRule.money, message: '交通费输入大于0可包含两位小数', trigger: 'change' }
                    ]
                }
            }
        },
        beforeMount: function () {//载入前
        },
        mounted: function () {//载入后
           // debugger;
            this.open();
        },
        watch: {//它用于观察Vue实例上的数据变动。对应一个对象，键是观察表达式，值是对应回调。值也可以是方法名，或者是对象，包含选项。

        },
        methods: {
            //自定义方法
            open(){
                var $this = this;
                $this.activeNames = ['1','2','3'];
                $this.show = true;
                //this.oilDataFrom = row;
                $this.iconPhoto = [];
                if(this.$route.query.id){
                    ajax.get('/core/coreVehicleFuelOilBill/oilBillDetail?id=' + this.$route.query.id).then(
                        res => {
                            if(res.status == 0 && res.data != null){
                                $this.oilDataFrom = res.data;
                                $this.oilDataFrom.oilCardId = res.data.oilCardId;
                                if(res.data.addOilTicketPhoto){
                                    $this.iconPhoto.push(JSON.parse(res.data.addOilTicketPhoto));
                                }
                            }
                        }
                    )
                }
               /* if(!$this.oilDataFrom.paymentMethod){
                    this.$set(this.oilDataFrom,"paymentMethod","2");
                }*/
            },
            //计算加油金额
            calculateOilAmount(){
                if(this.oilDataFrom.oilUnitPrice && this.oilDataFrom.addOil){
                    this.oilDataFrom.oilTotalAmount= (parseFloat(this.oilDataFrom.oilUnitPrice == undefined ? 0 : this.oilDataFrom.oilUnitPrice) * parseFloat(this.oilDataFrom.addOil ==  undefined ? 0 : this.oilDataFrom.addOil)).toFixed(2);
                }
            },
            submitForm(oilDataFrom) {
                var $this = this;
                $this.$refs[oilDataFrom].validate((valid) => {
                    if (valid) {

                        //$this.oilDataFrom.oilTotalAmount = parseFloat($this.oilDataFrom.oilUnitPrice == undefined ? 0 : $this.oilDataFrom.oilUnitPrice) * parseFloat($this.oilDataFrom.addOil ==  undefined ? 0 : $this.oilDataFrom.addOil);
                        $this.oilDataFrom.totalAmount = parseFloat($this.oilDataFrom.oilTotalAmount) + parseFloat($this.oilDataFrom.transportation);
                        //$this.oilDataFrom.oilCardAfterBalance = (($this.oilDataFrom.oilCardBeforeBalance == undefined ? 0:$this.oilDataFrom.oilCardBeforeBalance) - ($this.oilDataFrom.oilUnitPrice == undefined ? 0:$this.oilDataFrom.oilUnitPrice) * ($this.oilDataFrom.addOil ==  undefined ? 0 : $this.oilDataFrom.addOil)).toFixed(2);
                        $this.oilDataFrom.oilCardAfterBalance = (($this.oilDataFrom.oilCardBeforeBalance == undefined ? 0:$this.oilDataFrom.oilCardBeforeBalance) - parseFloat($this.oilDataFrom.oilTotalAmount)).toFixed(2);

                        if($this.oilDataFrom.oilCardAfterBalance<0){
                            this.$message.error("油卡余额不足，请充值!");
                            return;
                        }


                        if($this.iconPhoto != null && $this.iconPhoto.length > 0 && $this.iconPhoto[0] != null){
                            var object = {};
                            object['name'] = $this.iconPhoto[0].name;
                            object['path'] = $this.iconPhoto[0].path;
                            object['filedomain'] = $this.iconPhoto[0].filedomain;
                            $this.oilDataFrom.addOilTicketPhoto = JSON.stringify(object);
                        }
                        var url = "/core/coreVehicleFuelOilBill/addOrEdit";
                        if($this.oilDataFrom.id == undefined){
                            $this.oilDataFrom.id = "add";
                        }
                        ajax.post(url, $this.oilDataFrom).then(
                            res => {
                                if(res.status == 0){
                                    $this.showMessage("保存成功","success",function(){
                                        $this.close(oilDataFrom);
                                        $this.$emit('load');
                                    });
                                }else {
                                    $this.$message.error(res.message);
                                }
                            }
                        )
                    } else {
                        return false;
                    }
                });
            },
            openVehicle(){
                if(this.oilDataFrom.companyId) {
                    //this.searchParam.companyId=this.oilDataFrom.companyId;
                    this.getListByUrl("core/coreVehicleFuelOilBill/queryVehicleList?companyId="+this.oilDataFrom.companyId);
                    this.dialog.dialogVehicle = true;
                }else{
                    this.$message.error("请先选择所属组织!");
                    return;
                }
            },
            changeVehicle(row) {
                if(row != null){
                    this.dialog.dialogVehicle = false;
                    this.$set(this.oilDataFrom,"plate",row.plate);
                    this.$set(this.oilDataFrom,"modelName",row.modelName);
                    this.$set(this.oilDataFrom,"fuelType",row.fuelType);
                    this.$set(this.oilDataFrom,"fuelCapacity",row.fuelCapacity);
                    this.$set(this.oilDataFrom,"vehicleId",row.id);
                    this.$set(this.oilDataFrom,"enterprise",row.serviceRegion);

                    this.$set(this.oilDataFrom,"oilCardBeforeBalance",0.00);
                    this.$set(this.oilDataFrom,"oilCardCode",'');
                    this.$set(this.oilDataFrom,"oilCardId",'');
                }
            },
            openDriver(){
                this.getListByUrl("core/coreVehicleFuelOilBill/queryDriverList");
                this.dialog.dialogDriver = true;
            },
            changeDriver(row) {
                if(row != null){
                    this.dialog.dialogDriver = false;
                    this.oilDataFrom.driver = row.name;
                    this.$set(this.oilDataFrom,"driverId",row.id);
                }
            },
            openOilCard(){
                if(this.oilDataFrom.vehicleId){
                    //this.searchParam.vehicleId=this.oilDataFrom.vehicleId;
                    //this.searchParam.companyId=this.oilDataFrom.companyId;
                    this.getListByUrl("core/coreVehicleFuelOilBill/queryOilCard?vehicleId="+this.oilDataFrom.vehicleId+"&companyId="+this.oilDataFrom.companyId);
                    this.dialog.dialogOilCard = true;
                }else {
                    this.$message.error("请先选择车辆!");
                    return;
                }
            },
            changeOilCard(row) {
                if(row != null){
                    this.dialog.dialogOilCard = false;
                    this.$set(this.oilDataFrom,"oilCardId",row.id);
                    this.$set(this.oilDataFrom,"oilCardCode",row.code);
                    this.oilDataFrom.oilCardBeforeBalance = row.balance;
                }
            },
            openContract(){
                if(this.oilDataFrom.vehicleId) {//先选车再选合同
                    //this.searchParam.vehicleId=this.oilDataFrom.vehicleId;
                    this.getListByUrl("core/coreVehicleFuelOilBill/queryContractList?vehicleId="+this.oilDataFrom.vehicleId);
                    this.dialog.dialogContractNo = true;
                }else{
                    this.$message.error("请先选择车辆!");
                    return;
                }
            },
            changeContract(row) {
                if(row != null){
                    this.dialog.dialogContractNo = false;
                    this.oilDataFrom.contractNo = row.contractNumber;
                }
            },
            openSettlement(){
                if(this.oilDataFrom.contractNo){
                    this.getListByUrl("core/coreVehicleFuelOilBill/querySettlement?contractNumberParam=" + this.oilDataFrom.contractNo);
                    this.dialog.dialogMonthStatementNo = true;
                }else {
                    this.$message.error("请先选择合同编号!");
                    return;
                }
            },
            changeSettlement(row) {
                if(row != null){
                    this.dialog.dialogMonthStatementNo = false;
                    this.oilDataFrom.monthStatementNo = row.projectVehicleSettlementNo;
                }
            },
            selectOrganization(data){
                if(data){
                    this.organizationFlag= false;
                    this.oilDataFrom={companyId:data};
                }else{
                    this.organizationFlag= true;
                    this.oilDataFrom={};
                }
            }
        }
    }
</script>

