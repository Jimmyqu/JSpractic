<template>
    <div class="form-panel">
        <el-form :model="maintenanceBillForm" :rules="rules" label-position="top" ref="maintenanceBillForm" label-width="100px">
            <el-collapse v-model="openCollapse" >
                <el-collapse-item title="车辆基本信息" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="车辆" prop="vehiclePlate">
                            <el-input v-model="maintenanceBillForm.vehiclePlate" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="车型" prop="vehicleModel">
                            <el-input v-model="maintenanceBillForm.vehicleModel" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="车辆所在城市" prop="runCity">
                            <el-input v-model="maintenanceBillForm.runCity" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="所属组织" prop="companyName">
                            <el-input v-model="maintenanceBillForm.companyName" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="事故单基本信息" name="2" >
                    <div class="flex-panel">
                        <el-form-item label="事故单" prop="accidentCode">
                            <el-input v-model="maintenanceBillForm.accidentCode" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="申请信息" name="3" >
                    <div class="flex-panel">
                        <el-form-item label="申请人" prop="applicant">
                            <el-input v-model="maintenanceBillForm.applicant" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="申请时间" prop="applicantTime">
                            <el-input v-model="maintenanceBillForm.applicantTime" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="送修信息" name="4" >
                    <div class="flex-panel">
                        <el-form-item label="维修单号" prop="maintenanceNo">
                            <el-input v-model="maintenanceBillForm.maintenanceNo" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="维修厂" prop="repairerName">
                            <el-input v-model="maintenanceBillForm.repairerName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="交车修理厂时间" prop="arriveRepairTime">
                            <el-input v-model="maintenanceBillForm.arriveRepairTime" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="送车人" prop="sendCarPeopleName">
                            <el-input v-model="maintenanceBillForm.sendCarPeopleName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="送车用时" prop="sendCarHours">
                            <el-input v-model="maintenanceBillForm.sendCarHours" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="是否4S店司机" prop="is4sShopsDriver">
                            <template>
                                <el-radio-group v-model="maintenanceBillForm.is4sShopsDriver">
                                    <el-radio :label="true" disabled>是</el-radio>
                                    <el-radio :label="false" disabled>否</el-radio>
                                </el-radio-group>
                            </template>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="提车信息" name="5" >
                    <div class="flex-panel">
                        <el-form-item label="修理厂提车时间" prop="fetchCarTime">
                            <el-input v-model="maintenanceBillForm.fetchCarTime" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="提车人" prop="fetchCarPeopleName">
                            <el-input v-model="maintenanceBillForm.fetchCarPeopleName" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="核价信息" name="6" >
                    <div class="flex-panel">
                        <el-form-item label="事故维修费用" prop="accidentRepairCost">
                            <el-input v-model="maintenanceBillForm.accidentRepairCost" placeholder="请输入事故维修费用" clearable @blur="getTotalPrice()" type="number"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="自然维修费用" prop="naturalRepairCost">
                            <el-input v-model="maintenanceBillForm.naturalRepairCost"  placeholder="请输入自然维修费用" clearable @blur="getTotalPrice()" type="number"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="保养费用" prop="maintenanceCost" >
                            <el-input v-model="maintenanceBillForm.maintenanceCost" placeholder="请输入保养费用" clearable @blur="getTotalPrice()" type="number"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="其它费用" prop="otherCost">
                            <el-input v-model="maintenanceBillForm.otherCost"  placeholder="请输入其它费用" clearable @blur="getTotalPrice()" type="number"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="报价总额" prop="totalPrice">
                            <el-input v-model="maintenanceBillForm.totalPrice" clearable :disabled="true"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="核价人员" prop="nuclearPricePeopleName">
                            <el-input v-model="maintenanceBillForm.nuclearPricePeopleName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="核价时间" prop="nuclearPriceTime">
                            <el-input v-model="maintenanceBillForm.nuclearPriceTime" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="核价说明" name="7" >
                    <div class="flex-panel">
                        <el-form-item label="核价审批说明" prop="nuclearPriceRemark" class="big">
                            <el-input type="textarea" v-model="maintenanceBillForm.nuclearPriceRemark" maxlength="200" placeholder="请输入核价审批说明" ></el-input>
                        </el-form-item>
                        <el-form-item label="诊断维修项目及报价描述" prop="nuclearPriceDescription" class="big">
                            <el-input type="textarea" v-model="maintenanceBillForm.nuclearPriceDescription" maxlength="200" placeholder="请输入诊断维修项目及报价描述"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="报价单扫描" name="8" >
                    <div class="flex-panel">
                        <el-form-item label="报价单">
                            <upload-panel :size="50" :file-list.sync="nuclearPricePhoto" accept=".jpg,.jpeg,.png" :show-img="true"></upload-panel>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="配件项目" name="9">
                    <el-button class="float-btn" type="primary" @click="addRowAccessories()">新增</el-button>
                    <el-table class="left" :data="maintenanceBillForm.accessoriesList" border style="width: 100%;margin-top: 10px">
                        <el-table-column fixed label="操作" width="80">
                            <template slot-scope="scope">
                                <el-button @click="deleteRowAccessories(scope.row)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="配件项目" min-width="150" label-class-name="required">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'accessoriesList.'+scope.$index+'.name'"
                                    :rules="[
                                           { required: true, message: '请选择配件项目', trigger: 'change' }
                                        ]">
                                    <el-input v-model="scope.row.name" size="small" @focus="getAccessories(scope.$index)"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="城市" min-width="100">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.cityName" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="维修厂" min-width="140">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.repairerName" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="配件编号" min-width="180">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.code" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="配件项目分类名称" min-width="150">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.typeName" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="性质" min-width="150" label-class-name="required">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'accessoriesList.'+scope.$index+'.natureType'"
                                    :rules="[
                                           { required: true, message: '请选择性质', trigger: 'change' }
                                        ]">
                                    <el-select v-model="scope.row.natureType" placeholder="请选择性质">
                                        <el-option label="事故维修" value="1"></el-option>
                                        <el-option label="自然维修" value="2"></el-option>
                                        <el-option label="保养" value="3"></el-option>
                                        <el-option label="其他" value="4"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="价格（元）" min-width="140" label-class-name="required">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'accessoriesList.'+scope.$index+'.price'"
                                    :rules="[
                                           { required: true, message: '请输入价格', trigger: 'blur' },
                                           {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'blur'}
                                        ]">
                                    <el-input v-model="scope.row.price" @blur="getAccessoriesTotal(scope.$index)" type="number" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量" min-width="140" label-class-name="required">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'accessoriesList.'+scope.$index+'.amount'"
                                    :rules="[
                                           { required: true, message: '请输入数量', trigger: 'blur' }
                                        ]">
                                    <el-input v-model="scope.row.amount" @blur="getAccessoriesTotal(scope.$index)" type="number" clearable></el-input>
                                </el-form-item>

                            </template>
                        </el-table-column>
                        <el-table-column label="小计（元）" min-width="140">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.totalPrice" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="参考价格（元）" min-width="200">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.referencePrice" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="溢价百分比" min-width="140">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.premiumPercentage" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
                <el-collapse-item title="工时项目" name="10">
                    <el-button class="float-btn" type="primary" @click="addRowManhour()">新增</el-button>
                    <el-table class="left" :data="maintenanceBillForm.manhourList" border style="width: 100%;margin-top: 10px">
                        <el-table-column fixed label="操作" width="80">
                            <template slot-scope="scope">
                                <el-button @click="deleteRowManhour(scope.row)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="工时项目" min-width="150" label-class-name="required">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'manhourList.'+scope.$index+'.name'"
                                    :rules="[
                                           { required: true, message: '请选择工时项目', trigger: 'change' }
                                        ]">
                                    <el-input v-model="scope.row.name" size="small" @focus="getManhour(scope.$index)"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="城市" min-width="100">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.cityName" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="维修厂" min-width="140">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.repairerName" :disabled="true" ></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="工时项目编号" min-width="180">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.code" :disabled="true" ></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="工时项目分类名称" min-width="150">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.typeName" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="natureType" label="性质" min-width="140" label-class-name="required">{{natureTypeOptions}}
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'manhourList.'+scope.$index+'.natureType'"
                                    :rules="[
                                           { required: true, message: '请选择性质', trigger: 'change' }
                                        ]">
                                    <el-select v-model="scope.row.natureType" placeholder="请选择性质">
                                        <el-option label="事故维修" value="1"></el-option>
                                        <el-option label="自然维修" value="2"></el-option>
                                        <el-option label="保养" value="3"></el-option>
                                        <el-option label="其他" value="4"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="价格（元）" min-width="140" label-class-name="required">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'manhourList.'+scope.$index+'.price'"
                                    :rules="[
                                           { required: true, message: '请输入价格', trigger: 'blur' },
                                           {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'blur'}
                                        ]">
                                    <el-input v-model="scope.row.price" @blur="getManhourTotal(scope.$index)" type="number" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="参考价格（元）" min-width="140">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.referencePrice" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="溢价百分比" min-width="140">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.premiumPercentage" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>

            <div  class="left-row">
                <el-button type="primary" @click="submitForm('maintenanceBillForm')">保存</el-button>
                <el-button @click="close('maintenanceBillForm')">返回</el-button>
            </div>
        </el-form>

        <!-- 配件项目弹窗 -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="选择配件项目"
            :visible.sync="accessoriesShow"
            width="1000px"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="search-box min">
                    <div class="form-box">
                        <div class="form-group">
                            <div class="input-group">
                                <el-input v-model="searchParam.model" autocomplete="off" type="text" placeholder="请输入型号"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1);">查询</el-button>
                        <el-button type="small" @click="resetList();" size="small">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectAccessories(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="code" label="编号" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="name" label="配件名称" width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="model" label="型号" width="140"></el-table-column>
                        <el-table-column prop="repairerName" label="维修厂" width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cityName" label="城市" width="100"></el-table-column>
                        <el-table-column prop="brand" label="品牌" width="140"></el-table-column>
                        <el-table-column prop="suitVehicleModel" label="适合车型" width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="measureUnit" label="计量单位" width="140"></el-table-column>
                        <el-table-column prop="typeName" label="项目分类" width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="advice" label="参考说明" width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="referencePrice" label="参考价格" width="140"></el-table-column>
                    </el-table>
                    <!-- 分页 -->
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

        <!-- 工时项目弹窗 -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="选择工时项目"
            :visible.sync="manhourShow"
            width="1000px"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="search-box min">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">编号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.code" autocomplete="off" type="text" placeholder="请输入编号"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1);">查询</el-button>
                        <el-button type="small" @click="resetList();" size="small">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectManhour(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="code" label="编号" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="name" sortable label="工时项目名称" width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="typeName" sortable label="项目分类" width="140"></el-table-column>
                        <el-table-column prop="repairerName" sortable label="维修厂" width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cityName" label="城市" width="100"></el-table-column>
                        <el-table-column prop="referencPrice" sortable label="参考价格" width="100"></el-table-column>
                        <el-table-column prop="advice" sortable label="参考说明" width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="suitVehicleModel" label="适合车型" width="140"></el-table-column>
                    </el-table>
                    <!-- 分页 -->
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
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {formRule} from "@/utils/common";
    import UploadPanel from '@/components/UploadPanel/index'

    export default {
        name: "nuclearPrice",
        mixins: [tool],
        components:{ UploadPanel },
        data(){
            return {
                maintenanceBillForm:{
                    accessoriesList:[],
                    manhourList:[],
                    nuclearPricePhotoList:[]
                },
                nuclearPricePhoto:[],
                natureTypeOptions:[],
                openCollapse:["1","2","3","4","5","6","7","8","9","10"],
                clickTableIndex: 0,
                clickTable1Index: 0,
                show:false,
                accessoriesShow:false,
                manhourShow:false,
                formRule,
                rules:{
                    accidentRepairCost: [
                        {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'blur'}
                    ],
                    naturalRepairCost:[
                        {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'blur'}
                    ],
                    maintenanceCost:[
                        {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'blur'}
                    ],
                    otherCost:[
                        {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'blur'}
                    ],
                }
            }
        },
        mounted(){
            this.open();
        },
        methods:{
            open(){
                this.openCollapse = ["1","2","3","4","5","6","7","8","9","10"];
                this.show = true;
                this.initData();
            },
            initData(){
                ajax.get('/core/maintenanceBill/detail/' + this.$route.query.id).then(rs => {
                    console.log(rs);
                    this.maintenanceBillForm = rs.data;
                });
            },
            getTotalPrice(){
                this.maintenanceBillForm.totalPrice = parseFloat(0);
                if(null != this.maintenanceBillForm.accidentRepairCost && this.maintenanceBillForm.accidentRepairCost != ""){
                    this.maintenanceBillForm.totalPrice += parseFloat(this.maintenanceBillForm.accidentRepairCost);
                }
                if(null != this.maintenanceBillForm.naturalRepairCost && this.maintenanceBillForm.naturalRepairCost != ""){
                    this.maintenanceBillForm.totalPrice += parseFloat(this.maintenanceBillForm.naturalRepairCost);
                }
                if(null != this.maintenanceBillForm.maintenanceCost && this.maintenanceBillForm.maintenanceCost != ""){
                    this.maintenanceBillForm.totalPrice += parseFloat(this.maintenanceBillForm.maintenanceCost);
                }
                if(null != this.maintenanceBillForm.otherCost && this.maintenanceBillForm.otherCost != ""){
                    this.maintenanceBillForm.totalPrice += parseFloat(this.maintenanceBillForm.otherCost);
                }
            },
            getAccessoriesTotal(index){
                this.maintenanceBillForm.accessoriesList[index].totalPrice = parseFloat(0);
                if((null != this.maintenanceBillForm.accessoriesList[index].price && this.maintenanceBillForm.accessoriesList[index].price != "")
                    && (null != this.maintenanceBillForm.accessoriesList[index].amount && this.maintenanceBillForm.accessoriesList[index].amount != "")){
                    this.maintenanceBillForm.accessoriesList[index].totalPrice =
                        parseFloat(this.maintenanceBillForm.accessoriesList[index].price)*parseFloat(this.maintenanceBillForm.accessoriesList[index].amount);
                    //溢价百分比=((价格-参考价格)/ 参考价格)* 100%
                    if(null != this.maintenanceBillForm.accessoriesList[index].referencePrice && this.maintenanceBillForm.accessoriesList[index].referencePrice != ""
                        && this.maintenanceBillForm.accessoriesList[index].referencePrice != 0){
                        this.maintenanceBillForm.accessoriesList[index].premiumPercentage =this.toDecimal(((this.maintenanceBillForm.accessoriesList[index].price-this.maintenanceBillForm.accessoriesList[index].referencePrice)
                            /parseFloat(this.maintenanceBillForm.accessoriesList[index].referencePrice))*parseFloat(100));
                        this.maintenanceBillForm.accessoriesList[index].premiumPercentage = this.maintenanceBillForm.accessoriesList[index].premiumPercentage + "%";
                    }

                }
            },
            getManhourTotal(index){
                this.maintenanceBillForm.manhourList[index].totalPrice = parseFloat(0);
                //溢价百分比=((价格-参考价格)/ 参考价格)* 100%
                if(null != this.maintenanceBillForm.manhourList[index].referencePrice && this.maintenanceBillForm.manhourList[index].referencePrice != ""
                    && this.maintenanceBillForm.manhourList[index].referencePrice != 0){
                    this.maintenanceBillForm.manhourList[index].premiumPercentage =this.toDecimal(((this.maintenanceBillForm.manhourList[index].price-this.maintenanceBillForm.manhourList[index].referencePrice)
                        /parseFloat(this.maintenanceBillForm.manhourList[index].referencePrice))*parseFloat(100));
                    this.maintenanceBillForm.manhourList[index].premiumPercentage = this.maintenanceBillForm.manhourList[index].premiumPercentage + "%";
                }
            },
            toDecimal(x) { //除法四舍五入保留两位小数
                var f = parseFloat(x);
                if (isNaN(f)) {
                    return;
                }
                f = Math.round(x*100)/100;
                return f;
            },
            photoHandle(list) {
                var nuclearPricePhotoArray = new Array();
                for(var i = 0;i < list.length;i++){
                    var object = {};
                    object['name'] = list[i].name;
                    object['path'] = list[i].path;
                    object['filedomain'] = list[i].filedomain;
                    nuclearPricePhotoArray.push(JSON.stringify(object));
                }
                this.maintenanceBillForm.nuclearPricePhotoList = nuclearPricePhotoArray;
            },
            addRowAccessories(){
                this.maintenanceBillForm.accessoriesList.push({
                    name:"",
                    cityName:"",
                    repairerName:"",
                    code:"",
                    typeName:"",
                    natureType:"",
                    price:"",
                    amount:"",
                    totalPrice:"",
                    referencePrice:"",
                    premiumPercentage:""
                });
            },
            deleteRowAccessories(row) {
                var index = this.maintenanceBillForm.accessoriesList.indexOf(row)
                if (index !== -1) {
                    this.maintenanceBillForm.accessoriesList.splice(index, 1);
                }
            },
            addRowManhour(){
                this.maintenanceBillForm.manhourList.push({
                    name:"",
                    cityName:"",
                    repairerName:"",
                    code:"",
                    typeName:"",
                    natureType:"",
                    price:"",
                    referencePrice:"",
                    premiumPercentage:""
                });
            },
            deleteRowManhour(row) {
                var index = this.maintenanceBillForm.manhourList.indexOf(row)
                if (index !== -1) {
                    this.maintenanceBillForm.manhourList.splice(index, 1);
                }
            },
            getAccessories(i){
                this.clickTableIndex = i;
                this.listUrl = "core/maintenanceBill/accessoriesList";
                this.resetList();
                this.accessoriesShow = true;
            },
            selectAccessories(row){ //选择配件项目
                console.log(this.clickTableIndex)
                this.maintenanceBillForm.accessoriesList[this.clickTableIndex].accessoriesId = row.id;
                this.maintenanceBillForm.accessoriesList[this.clickTableIndex].name = row.name;
                this.maintenanceBillForm.accessoriesList[this.clickTableIndex].cityName = row.cityName;
                this.maintenanceBillForm.accessoriesList[this.clickTableIndex].repairerName = row.repairerName;
                this.maintenanceBillForm.accessoriesList[this.clickTableIndex].code = row.code;
                this.maintenanceBillForm.accessoriesList[this.clickTableIndex].typeName = row.typeName;
                this.maintenanceBillForm.accessoriesList[this.clickTableIndex].referencePrice = row.referencePrice;
                this.accessoriesShow = false;
                //计算溢价百分比
                this.getAccessoriesTotal(this.clickTableIndex);
            },
            getManhour(i){
                this.clickTable1Index = i;
                this.listUrl = "core/maintenanceBill/manhourList";
                this.resetList();
                this.manhourShow = true;
            },
            selectManhour(row){
                console.log(this.clickTable1Index)
                this.maintenanceBillForm.manhourList[this.clickTable1Index].manhourId = row.id;
                this.maintenanceBillForm.manhourList[this.clickTable1Index].name = row.name;
                this.maintenanceBillForm.manhourList[this.clickTable1Index].cityName = row.cityName;
                this.maintenanceBillForm.manhourList[this.clickTable1Index].repairerName = row.repairerName;
                this.maintenanceBillForm.manhourList[this.clickTable1Index].code = row.code;
                this.maintenanceBillForm.manhourList[this.clickTable1Index].typeName = row.typeName;
                this.maintenanceBillForm.manhourList[this.clickTable1Index].referencePrice = row.referencPrice;
                this.manhourShow = false;
                //计算溢价百分比
                this.getManhourTotal(this.clickTable1Index);
            },
            submitForm(maintenanceBillForm) {
                let data = this.maintenanceBillForm;
                if (this.nuclearPricePhoto != null && this.nuclearPricePhoto.length > 0) {
                    this.photoHandle(this.nuclearPricePhoto);
                }
                data.nuclearPricePeopleName = this.getCurrentUserInfo().name;
                data.nuclearPricePeople = this.getCurrentUserInfo().userId;
                this.$refs[maintenanceBillForm].validate((valid) => {
                    if (valid) {
                        let url = "core/maintenanceBill/nuclearPrice";
                        ajax.post(url, data) .then(res => {
                            if(res.status == 0){
                                this.$message({message: '保存成功！',type: 'success'});
                                this.close(maintenanceBillForm);
                            }else {
                                this.$message.error(res.message);
                            }
                        });
                    }
                });
            },
        },

    }


</script>
