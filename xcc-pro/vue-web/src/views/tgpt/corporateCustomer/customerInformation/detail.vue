<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="基本信息" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">企业客户名称</label>
                        <div class="input-group">
                            <span>{{customer.name}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">简称</label>
                        <div class="input-group">
                            <span>{{customer.shortName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">企业所在城市</label>
                        <div class="input-group">
                            <span>{{customer.cityName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">企业性质</label>
                        <div class="input-group">
                            <span>
                                <span v-if="customer.nature=='1'">国营</span>
                                <span v-else-if="customer.nature=='2'">民营</span>
                                <span v-else-if="customer.nature=='3'">合资</span>
                                <span v-else-if="customer.nature=='4'">外资</span>
                                <span v-else-if="customer.nature=='5'">其它</span>
                                <span v-else>/</span>
                            </span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">行业分类</label>
                        <div class="input-group">
                            <span>{{customer.classificationText==null?'/':customer.classificationText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">企业规模</label>
                        <div class="input-group">
                                <span v-if="customer.scale=='1'">大型企业</span>
                                <span v-else-if="customer.scale=='2'">中型企业</span>
                                <span v-else-if="customer.scale=='3'">小型企业</span>
                                <span v-else>/</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">企业联系人</label>
                        <div class="input-group">
                            <span>{{customer.contactName==null?'/':customer.contactName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">联系人手机号</label>
                        <div class="input-group">
                            <span>{{customer.contactPhone==null?'/':customer.contactPhone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">来源渠道</label>
                        <div class="input-group">
                                <span v-if="customer.channel=='1'">招投标</span>
                                <span v-else-if="customer.channel=='2'">自主开发</span>
                                <span v-else-if="customer.channel=='3'">媒体渠道</span>
                                <span v-else-if="customer.channel=='4'">转介绍</span>
                                <span v-else>/</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">支付主体</label>
                        <div class="input-group">
                            <span>{{customer.paymentSubject==null?'/':customer.paymentSubject}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">保证金(元)</label>
                        <div class="input-group">
                            <span>{{customer.depositCash==null?'/':numberFormat(customer.depositCash)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">信用额度(元)</label>
                        <div class="input-group">
                            <span>{{customer.creditLimit==null?'/':numberFormat(customer.creditLimit)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">曾用名</label>
                        <div class="input-group">
                            <span>{{customer.usedName==null?'/':customer.usedName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">登录账号</label>
                        <div class="input-group">
                            <span>{{customer.loginAccount}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="开票信息" name="2">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">开票名称</label>
                        <div class="input-group">
                            <span>{{customer.billingName==null?'/':customer.billingName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">纳税人识别号</label>
                        <div class="input-group">
                            <span>{{customer.taxpayerNo==null?'/':customer.taxpayerNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">开户银行</label>
                        <div class="input-group">
                            <span>{{customer.bankName==null?'/':customer.bankName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">开户账号</label>
                        <div class="input-group">
                            <span>{{customer.accountNo==null?'/':customer.accountNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">开票电话</label>
                        <div class="input-group">
                            <span>{{customer.billingPhone==null?'/':customer.billingPhone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">开票地址</label>
                        <div class="input-group">
                            <span>{{customer.billingAddress==null?'/':customer.billingAddress}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="企业服务信息" name="3">
                <div class="flex-panel detail-box">
                    <!-- <div class="detail-item">
                        <label class="control-label">阶段</label>
                        <div class="input-group">
                            <span>
                                <template v-if="customer.stage==1">初步接治</template>
                                <template v-else-if="customer.stage==2">确认需求</template>
                                <template v-else-if="customer.stage==3">方案报价</template>
                                <template v-else-if="customer.stage==4">谈判</template>
                                <template v-else-if="customer.stage==5">签约</template>
                                <template v-else-if="customer.stage==6">其它</template>
                                <template v-else>/</template>
                            </span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">企业状态</label>
                        <div class="input-group">
                            <span>
                                <template v-if="customer.enterpriseStatus==1">待开拓</template>
                                <template v-else-if="customer.enterpriseStatus==2">开拓中</template>
                                <template v-else-if="customer.enterpriseStatus==3">正常</template>
                                <template v-else-if="customer.enterpriseStatus==4">逾期</template>
                                <template v-else-if="customer.enterpriseStatus==5">停止开拓</template>
                                <template v-else-if="customer.enterpriseStatus==6">停用</template>
                                <template v-else-if="customer.enterpriseStatus==7">黑名单</template>
                                <template v-else>/</template>
                            </span>
                        </div>
                    </div>-->
                    <div class="detail-item">
                        <label class="control-label">签约状态</label>
                        <div class="input-group">
                            <span v-if="customer.signStatus=='1'">未签约</span>
                            <span v-else-if="customer.signStatus=='2'">已签约</span>
                            <span v-else>/</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">签约日期</label>
                        <div class="input-group">
                            <span>{{customer.signDate==null?'/':customer.signDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">客户经理</label>
                        <div class="input-group">
                            <span>{{customer.customerManagerName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">业务助理</label>
                        <div class="input-group">
                            <span>{{customer.assistantManagerName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{customer.organizationName}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="备注" name="4">
                <div class="flex-panel detail-box">
                    <div class="detail-item big">
                        <label class="control-label">备注说明</label>
                        <div class="input-group">
                            <span>{{customer.remark==null?'/':customer.remark}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="银行信息" name="5">
                <el-table :data="customer.bank" style="width: 100%" border>
                    <!--<el-table-column fixed="right" label="操作" min-width="100">
                        <template slot-scope="{row,$index}">
                            <el-button @click="delEnterpriseBank(row,$index)" type="text" size="small">删除
                            </el-button>
                        </template>
                    </el-table-column>-->
                    <el-table-column prop="index" label="序号" min-width="70">
                        <template slot-scope="{row,$index}">
                            <span>{{$index+1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="bankName" label="银行" min-width="200">
                        <template slot-scope="{row,$index}">
                            <span>{{row.bankName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="accountName" label="户名" min-width="200">
                        <template slot-scope="{row,$index}">
                            <span>{{row.accountName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="accountNo" label="银行账户" min-width="200">
                        <template slot-scope="{row,$index}">
                            <span>{{row.accountNo}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { number_format } from '@/utils'

    export default {
        name: "corporateCustomerInformationDetail",
        data() {
            return{
            activeNames:["1","2","3","4","5"],
            customer: {}
            }
        },
        mounted: function () {
            var $this = this;
            $this.initData();
        },
        methods: {
            initData() {
                var id = this.$route.params.id;
                var $this = this;
                ajax.get("base/enterprise/detail/"+id).then(result=>{
                    if(result.status==0){
                        $this.customer=result.data;
                    }else{
                        console.log(result.message);
                    }
                });
            },
            numberFormat(number){
                return number_format(number, 2, '.', ',');
            },

        }

    }
</script>
