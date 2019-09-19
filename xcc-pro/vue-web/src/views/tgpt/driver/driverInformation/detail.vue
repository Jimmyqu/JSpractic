<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="基本资料" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">司机姓名</label>
                        <div class="input-group">
                            <span>{{driverInfo.name}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">性别</label>
                        <div class="input-group">
                            <span>{{driverInfo.sex}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">手机号</label>
                        <div class="input-group">
                            <span>{{driverInfo.phone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">身份证号</label>
                        <div class="input-group">
                            <span>{{driverInfo.idCard}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">婚姻状况</label>
                        <div class="input-group">
                            <span>{{driverInfo.maritalStatus}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">民族</label>
                        <div class="input-group">
                            <span>{{driverInfo.nationality}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">出生日期</label>
                        <div class="input-group">
                            <span>{{driverInfo.birthday}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">年龄</label>
                        <div class="input-group">
                            <span>{{driverInfo.age}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">籍贯</label>
                        <div class="input-group">
                            <span>{{driverInfo.nativePlace}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">学历</label>
                        <div class="input-group">
                            <span>{{driverInfo.education}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">英文水平</label>
                        <div class="input-group">
                            <span>{{driverInfo.englishLevel}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">政治面貌</label>
                        <div class="input-group">
                            <span>{{driverInfo.politicalStatus}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">现住地址</label>
                        <div class="input-group">
                            <span>{{driverInfo.currentAddress}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">户口所在地</label>
                        <div class="input-group">
                            <span>{{driverInfo.accountLocation}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{driverInfo.remark}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">征信</label>
                        <div class="input-group">
                            <span>{{driverInfo.credit}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="驾驶证信息" name="2">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">驾驶证号</label>
                        <div class="input-group">
                            <span>{{driverInfo.driverNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">准驾车型</label>
                        <div class="input-group">
                            <span>{{driverInfo.driveType}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">驾驶证申领日期</label>
                        <div class="input-group">
                            <span>{{driverInfo.driveDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">驾龄</label>
                        <div class="input-group">
                            <span>{{driverInfo.driveAge}}</span>
                        </div>
                    </div>
                    <div class="detail-item small">
                        <label class="control-label">驾驶经历</label>
                        <div class="input-group">
                            <span>{{driverInfo.driveExperience}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="家庭联系人" name="3">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">家庭联系人</label>
                        <div class="input-group">
                            <span>{{driverInfo.familyContact}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">家庭联系人关系</label>
                        <div class="input-group">
                            <span>{{driverInfo.familyContactRelation}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label" style="font-size: 12px">家庭联系人手机号</label>
                        <div class="input-group">
                            <span>{{driverInfo.familyContactPhoneNo}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="在职状态" name="4">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">关联用户</label>
                        <div class="input-group">
                            <span>{{driverInfo.relatedUserId}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所在所属组织</label>
                        <div class="input-group">
                            <span>{{driverInfo.companyId}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务城市</label>
                        <div class="input-group">
                            <span>{{driverInfo.serviceCityId}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">工龄</label>
                        <div class="input-group">
                            <span>{{driverInfo.workAge}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">在职状态</label>
                        <div class="input-group">
                            <span>{{driverInfo.workStatus}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">入职日期</label>
                        <div class="input-group">
                            <span>{{driverInfo.workDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">工作类型</label>
                        <div class="input-group">
                            <span>{{driverInfo.workType}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务状态</label>
                        <div class="input-group">
                            <span>{{driverInfo.serviceStatus}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服役状态</label>
                        <div class="input-group">
                            <span>{{driverInfo.escuageStatusText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">违章次数</label>
                        <div class="input-group">
                            <span>{{driverInfo.violationCount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">事故次数</label>
                        <div class="input-group">
                            <span>{{driverInfo.accidentCount}}</span>
                        </div>
                    </div>
                    <div class="detail-item small">
                        <label class="control-label">项目服务月数</label>
                        <div class="input-group">
                            <span>{{driverInfo.serviceMonths}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="证照" name="5">
                <div class="flex-panel detail-box">
                    <div class="detail-item half">
                        <label class="control-label">身份证正面</label>
                        <div class="input-group">
                            <img :src="driverInfo.idCardFrontPhoto" @click="showBigImg($event)">
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">身份证反面</label>
                        <div class="input-group">
                            <img :src="driverInfo.idCardBackPhoto" @click="showBigImg($event)">
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">驾驶证照片</label>
                        <div class="input-group">
                            <img :src="driverInfo.driverCardPhoto" @click="showBigImg($event)">
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">其他</label>
                        <div class="input-group">
                            <img :src="driverInfo.otherPhoto" @click="showBigImg($event)">
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
        name: "driverInformationDetail",
        components:{ ApprovalFlow, FileDetail },
        data() {
            return {
                activeNames:["1","2","3","4","5"],
                driverInfo: {}
            }
        },
        mounted: function () {
            let id = this.$route.params.id;
            this.initData(id);
        },
        methods: {
            initData(id) {
                var $this = this;
                ajax.get("base/driver/selectDriverDetail?id=" + id +"&time=" + new Date().getTime()).then(result =>{
                    $this.driverInfo = result;
                    $this.photoHandle(result.idCardFrontPhoto,1);
                    $this.photoHandle(result.idCardBackPhoto,2);
                    $this.photoHandle(result.driverCardPhoto,3);
                    $this.photoHandle(result.otherPhoto,4);
                });
            },
            photoHandle(object,num) {
                var $this = this;
                var result;
                if (object) {
                    var object1 = JSON.parse(object);
                    result = object1.filedomain + object1.path;
                    if (num == 1) {
                        $this.driverInfo.idCardFrontPhoto = result;
                    } else if (num == 2) {
                        $this.driverInfo.idCardBackPhoto = result;
                    } else if (num == 3) {
                        $this.driverInfo.driverCardPhoto = result;
                    } else if (num == 4) {
                        $this.driverInfo.otherPhoto = result;
                    }
                }
            }
        }
    }
</script>
