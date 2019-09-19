<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="基本信息" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">供应商名称</label>
                        <div class="input-group">
                            <span>{{formData.name}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">状态</label>
                        <div class="input-group">
                            <span v-if="formData.supplierStatus == 1">正常</span>
                            <span v-if="formData.supplierStatus == 2">停用</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{formData.companyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">供应商类型</label>
                        <div class="input-group">
                            <span v-for="item in supplierTypes" :key="item.value" v-if="formData.supplierType == item.value">{{item.text}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">联系人</label>
                        <div class="input-group">
                            <span>{{formData.contact}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">联系手机号</label>
                        <div class="input-group">
                            <span>{{formData.phoneNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">联系电话</label>
                        <div class="input-group">
                            <span>{{formData.contactPhone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">联系地址</label>
                        <div class="input-group">
                            <span>{{formData.contactAddress}}</span>
                        </div>
                    </div>

                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'

    export default {
        name: "supplierInformationDetail",
        components:{ ApprovalFlow, FileDetail },
        data(){
            return {
                activeNames: ['1'],
                formData: {
                    name: "",
                    supplierStatus: "",
                    companyId: "",
                    supplierType: "",
                    contact: "",
                    phoneNo: "",
                    contactPhone: "",
                    contactAddress: "",
                },
                /*供应商类型*/
                supplierTypes: [],
            }
        },
        mounted(){
            let id = this.$route.params.id;
            this.initFormData(id);
        },
        methods:{
            initFormData(id) {
                let $this = this;
                //获取供应商详情数据
                ajax.get("base/supplier/detail/" + id).then(result =>{
                    if(result.status == 0) {
                        $this.formData = result.data;
                        ajax.get("admin/dict/type/供应商类型?time=" + new Date().getTime()).then(result => {
                            if (result.length > 0) {
                                $this.supplierTypes = result;
                            } else {
                                $this.supplierTypes = [];
                            }
                        });

                    }else {
                        $this.$message.error(result.message);
                    }
                });
            }
        }
    }
</script>
