<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="基本资料" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">姓名</label>
                        <div class="input-group">
                            <span>{{customerInfo.name}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">性别</label>
                        <div class="input-group">
                            <span>{{customerInfo.sexName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">手机号</label>
                        <div class="input-group">
                            <span>{{customerInfo.phone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{customerInfo.companyId}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">身份证号</label>
                        <div class="input-group">
                            <span>{{customerInfo.idCard}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">婚姻状况</label>
                        <div class="input-group">
                            <span>{{customerInfo.maritalStatusName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">民族</label>
                        <div class="input-group">
                            <span>{{customerInfo.nationality}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">出生日期</label>
                        <div class="input-group">
                            <span>{{customerInfo.birthday}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">年龄</label>
                        <div class="input-group">
                            <span>{{customerInfo.age}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">现住地址</label>
                        <div class="input-group">
                            <span>{{customerInfo.currentAddress}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">户口所在地</label>
                        <div class="input-group">
                            <span>{{customerInfo.accountLocation}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{customerInfo.remark}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">征信</label>
                        <div class="input-group">
                            <span>{{customerInfo.credit}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="驾驶证信息" name="2">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">驾驶证号</label>
                        <div class="input-group">
                            <span>{{customerInfo.driverNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">准驾车型</label>
                        <div class="input-group">
                            <span>{{customerInfo.driveType}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">驾驶证申领日期</label>
                        <div class="input-group">
                            <span>{{customerInfo.driveDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">驾龄</label>
                        <div class="input-group">
                            <span>{{customerInfo.driveAge}}</span>
                        </div>
                    </div>
                    <div class="detail-item small">
                        <label class="control-label">驾驶经历</label>
                        <div class="input-group">
                            <span>{{customerInfo.driveExperience}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="家庭联系人" name="3">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">家庭联系人</label>
                        <div class="input-group">
                            <span>{{customerInfo.familyContact}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">家庭联系人关系</label>
                        <div class="input-group">
                            <span>{{customerInfo.familyContactRelation}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label" style="font-size: 12px">家庭联系人手机号</label>
                        <div class="input-group">
                            <span>{{customerInfo.familyContactPhoneNo}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="银行卡信息" name="4">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">银行卡账号</label>
                        <div class="input-group">
                            <span>{{customerInfo.bankCard}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">开户行</label>
                        <div class="input-group">
                            <span>{{customerInfo.openBank}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">开户人</label>
                        <div class="input-group">
                            <span>{{customerInfo.bankOwner}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="证照" name="5">
                <div class="flex-panel detail-box">
                    <div class="detail-item half">
                        <label class="control-label">身份证正面</label>
                        <div class="input-group">
                            <!--<img :src="customerInfo.idCardFrontPhoto" @click="showBigImg($event)">-->
                            <upload-panel :size="1" style="width: 60px;height: 60px;"  disabled :file-list.sync="customerInfo.idCardFrontPhoto" :show-img="true"></upload-panel>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">身份证反面</label>
                        <div class="input-group">
                            <!--<img :src="customerInfo.idCardBackPhoto" @click="showBigImg($event)">-->
                            <upload-panel :size="1" style="width: 60px;height: 60px;"  disabled :file-list.sync="customerInfo.idCardBackPhoto" :show-img="true"></upload-panel>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">驾驶证照片</label>
                        <div class="input-group">
                            <!--<img :src="customerInfo.driverCardPhoto" @click="showBigImg($event)">-->
                            <upload-panel :size="1" style="width: 60px;height: 60px;"  disabled :file-list.sync="customerInfo.driverCardPhoto" :show-img="true"></upload-panel>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">其他</label>
                        <div class="input-group">
                            <!--<img :src="customerInfo.otherPhoto" @click="showBigImg($event)">-->
                            <upload-panel :size="1" style="width: 60px;height: 60px;"  disabled :file-list.sync="customerInfo.otherPhoto" :show-img="true"></upload-panel>
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
    import UploadPanel from '@/components/UploadPanel/index'

    export default {
        name: "customerPersonalDetail",
        components:{ ApprovalFlow, FileDetail,UploadPanel },
        data() {
            return {
                activeNames:["1","2","3","4","5"],
                customerInfo: {
                    idCardFrontPhoto:[],
                    idCardBackPhoto:[],
                    driverCardPhoto:[],
                    otherPhoto:[]
                }
            }
        },
        mounted: function () {
            let id = this.$route.params.id;
            this.initData(id);
        },
        methods: {
            initData(id) {
                var $this = this;
                ajax.get("core/personal/selectDeatilCustomerById/" + id ).then(result =>{
                    $this.customerInfo = result.data;
                  if( $this.customerInfo.idCardFrontPhoto){
                      $this.customerInfo.idCardFrontPhoto = [JSON.parse($this.customerInfo.idCardFrontPhoto)];
                  }else{
                      $this.customerInfo.idCardFrontPhoto = [];
                  }
                  if( $this.customerInfo.idCardBackPhoto){
                      $this.customerInfo.idCardBackPhoto = [JSON.parse($this.customerInfo.idCardBackPhoto)];
                  }else {
                      $this.customerInfo.idCardBackPhoto = [];
                  }
                  if( $this.customerInfo.driverCardPhoto){
                      $this.customerInfo.driverCardPhoto = [JSON.parse($this.customerInfo.driverCardPhoto)];
                  }else {
                      $this.customerInfo.driverCardPhoto = [];
                  }
                  if( $this.customerInfo.otherPhoto){
                      $this.customerInfo.otherPhoto = [JSON.parse($this.customerInfo.otherPhoto)];
                  }else {
                      $this.customerInfo.otherPhoto = [];
                  }
                });
            },

        }
    }
</script>
