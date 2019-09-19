<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="车辆保险单信息" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">服务组织</label>
                        <div class="input-group">
                            <span>{{insuranceBill.companyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车牌</label>
                        <div class="input-group">
                            <span>{{insuranceBill.vehiclePlate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车架号</label>
                        <div class="input-group">
                            <span>{{insuranceBill.vin}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">保险公司</label>
                        <div class="input-group">
                            <span>{{insuranceBill.insuranceCompany}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">保险类</label>
                        <div class="input-group">
                            <span>{{insuranceBill.insuranceTypeText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">保单号</label>
                        <div class="input-group">
                            <span>{{insuranceBill.policyNumber}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">保单业务员</label>
                        <div class="input-group">
                            <span>{{insuranceBill.policySalesman}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">联系电话</label>
                        <div class="input-group">
                            <span>{{insuranceBill.phone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">签单保费（元）</label>
                        <div class="input-group">
                            <span>{{insuranceBill.insuranceCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">投保日期</label>
                        <div class="input-group">
                            <span>{{insuranceBill.insuredDate}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">到期日</label>
                        <div class="input-group">
                            <span>{{insuranceBill.expiryDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">状态</label>
                        <div class="input-group">
                            <span>{{insuranceBill.billStatusText}}</span>
                        </div>
                    </div>
                    <div class="detail-item" v-show="showReturn">
                        <label class="control-label">退保日</label>
                        <div class="input-group">
                            <span>{{insuranceBill.exitDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item small" v-show="showReturn">
                        <label class="control-label">退保金额（元）</label>
                        <div class="input-group">
                            <span>{{insuranceBill.exitAmount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">购买类型</label>
                        <div class="input-group">
                            <span>{{insuranceBill.buyTypeText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">发票抬头</label>
                        <div class="input-group">
                            <span>{{insuranceBill.invoiceTitle}}</span>
                        </div>
                    </div>
                    <div class="detail-item small">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{insuranceBill.remarks}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">报价单</label>
                        <upload-panel :size="1"  disabled :file-list.sync="detailPic" :show-img="true"></upload-panel>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import UploadPanel from '@/components/UploadPanel/index'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'
    import ajax from '@/utils/request'

    export default {
        name: "trafficInsuranceBillDetail",
        components:{FileDetail,UploadPanel },
        data:function () {
            return {
                activeNames: ['1','2','3','4'],
                insuranceBill:{},
                showReturn:false,
                detailPic:[],
            }
        },
        mounted:function () {
            this.initData();
        },
        methods:{
            initData(){
                let id = this.$route.params.id;
                ajax.get('/core/insuranceBill/detail/' + id).then(result => {
                    if (result.status == 0) {
                        debugger
                        this.insuranceBill = result.data;
                        if(this.insuranceBill.billStatus == 30){
                            this.showReturn = true;
                        }else{
                            this.showReturn = false;
                        }
                        if(null != result.data.detailPic && result.data.detailPic.length > 0){
                            this.detailPic=JSON.parse(result.data.detailPic);
                        }
                    }
                });
            }
        }

    }
</script>
