<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="基本资料" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{driverInfo.organizationName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">司机姓名</label>
                        <div class="input-group">
                            <span>{{driverInfo.name}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">性别</label>
                        <div class="input-group">
                            <span>{{driverInfo.sexText}}</span>
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
                </div>
            </el-collapse-item>
            <el-collapse-item title="驾驶信息" name="2">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">驾驶证号</label>
                        <div class="input-group">
                            <span>{{driverInfo.driverNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">驾驶证申领日期</label>
                        <div class="input-group">
                            <span>{{driverInfo.driveDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">准驾车型</label>
                        <div class="input-group">
                            <span>{{driverInfo.driveType}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">驾龄</label>
                        <div class="input-group">
                            <span>{{driverInfo.driveAge}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="在职状态" name="4">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">在职状态</label>
                        <div class="input-group">
                            <span>{{driverInfo.workStatusText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务城市</label>
                        <div class="input-group">
                            <span>{{driverInfo.serviceCity}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">任务状态</label>
                        <div class="input-group">
                            <span>{{driverInfo.taskStatusText}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="证照" name="5">
                <div class="flex-panel detail-box">
                    <div class="detail-item half">
                        <label class="control-label">身份证正面</label>
                            <upload-panel :size="1"  disabled :file-list.sync="idCardFrontPhoto" :show-img="true"></upload-panel>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">身份证反面</label>
                            <upload-panel :size="1"  disabled :file-list.sync="idCardBackPhoto" :show-img="true"></upload-panel>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">驾驶证照片</label>
                            <upload-panel :size="1"  disabled :file-list.sync="driverCardPhoto" :show-img="true"></upload-panel>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">其他</label>
                            <upload-panel :size="1"  disabled :file-list.sync="otherPhoto" :show-img="true"></upload-panel>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'

    export default {
        name: "appDriverDetail",
        components:{ ApprovalFlow, FileDetail,UploadPanel },
        data() {
            return {
                activeNames:["1","2","3","4","5"],
                driverInfo: {},
                idCardFrontPhoto: [],
                idCardBackPhoto: [],
                driverCardPhoto: [],
                otherPhoto: []
            }
        },
        mounted: function () {
            let id = this.$route.params.id;
            this.initData(id);
        },
        methods: {
            initData(id) {
                var $this = this;
                ajax.get("operation_base/driver/detail/"+id+"?time=" + new Date().getTime()).then(result =>{
                    result.data.age = $this.getAges(result.data.birthday);
                    $this.driverInfo = result.data;
                    if(result.data.idCardFrontPhoto)
                        $this.idCardFrontPhoto=JSON.parse(result.data.idCardFrontPhoto);
                    if(result.data.idCardBackPhoto)
                        $this.idCardBackPhoto=JSON.parse(result.data.idCardBackPhoto);
                    if(result.data.driverCardPhoto)
                        $this.driverCardPhoto=JSON.parse(result.data.driverCardPhoto);
                    if(result.data.otherPhoto)
                        $this.otherPhoto=JSON.parse(result.data.otherPhoto);
                });
            },
            getAges(str) {
                var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
                if (r == null) return false;
                var d = new Date(r[1], r[3] - 1, r[4]);
                if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
                    var Y = new Date().getFullYear();
                    return Y - r[1];
                }
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
