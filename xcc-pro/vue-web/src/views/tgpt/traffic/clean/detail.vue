<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="清洁单信息" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">清洁单号</label>
                        <div class="input-group">
                            <span>{{form.washNum}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同编号</label>
                        <div class="input-group">
                            <span>{{form.contractNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{form.companyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务客户</label>
                        <div class="input-group">
                            <span>{{form.enterpriseName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车辆</label>
                        <div class="input-group">
                            <span>{{form.plate}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">驾驶员</label>
                        <div class="input-group">
                            <span>{{form.driverName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">洗车场</label>
                        <div class="input-group">
                            <span>{{form.washShopName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">清洁时间</label>
                        <div class="input-group">
                            <span>{{form.washTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">地点</label>
                        <div class="input-group">
                            <span>{{form.washArea}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">业务类型</label>
                        <div class="input-group">
                            <span>{{form.businessType==1?"次结":"月结"}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">费用</label>
                        <div class="input-group">
                            <span>{{form.washCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">上传票据</label>
                        <div class="input-group">
                            <upload-panel :size="1"  disabled :file-list.sync="invoiceImg" :show-img="true"></upload-panel>
                            <!--<img :src="form.invoiceImg" @click="showBigImg($event)">-->
                        </div>
                    </div>

                </div>
            </el-collapse-item>
            <el-collapse-item title="录入信息" name="2" >
                <div class="flex-panel detail-box">
                    <div class="detail-item half">
                        <label class="control-label">录入人</label>
                        <div class="input-group">
                            <span>{{form.createrName}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">录入时间</label>
                        <div class="input-group">
                            <span>{{form.createTime}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="修改信息" name="3" >
                <div class="flex-panel detail-box">
                    <div class="detail-item half">
                        <label class="control-label">最后修改人</label>
                        <div class="input-group">
                            <span>{{form.lastName}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">最后修改时间</label>
                        <div class="input-group">
                            <span>{{form.lastTime}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="备注" name="4" >
                <div class="flex-panel detail-box">
                    <div class="detail-item big">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{form.remark}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import UploadPanel from '@/components/UploadPanel/index'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'

    export default {
        name: "trafficCleanDetail",
        components:{ ApprovalFlow, FileDetail,UploadPanel },
        data: function () {
            return {
                activeNames: ['1','2','3','4','5'],
                form : {},
                imgs:[],
                invoiceImg:[],
                refundDetail:{
                    serviceId:"",
                },
            }

        },
        beforeMount: function () {//载入前
        },
        mounted: function () {//载入后
            const id = this.$route.params.id;
            this.detail(id);
        },
        methods: {
            //自定义方法
            detail(id){
                ajax.get("app/appDriverReimburseWash/"+id).then(result =>{
                    this.form = result.data;
                    if(result.data.invoiceImg!=null && result.data.invoiceImg!=''){
                        var invoiceImg=JSON.parse(result.data.invoiceImg);
                       /* this.form.invoiceImg=invoiceImg.filedomain+invoiceImg.path*/
                        if(invoiceImg){
                            this.invoiceImg=[invoiceImg];
                        }
                    }

                });
            },
        }

    }
</script>
