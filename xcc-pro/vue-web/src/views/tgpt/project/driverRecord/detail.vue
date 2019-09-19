<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="更换司机记录" name="1">
                <div class="flex-panel detail-box">
                    <!--更换司机记录-->
                    <div class="detail-item half">
                        <label class="control-label">原司机姓名</label>
                        <div class="input-group">
                            <span>{{data.oldDriver}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">原司机手机号</label>
                        <div class="input-group">
                            <span>{{data.oldPhone}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">新司机姓名</label>
                        <div class="input-group">
                            <span>{{data.newDriver}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">新司机手机号</label>
                        <div class="input-group">
                            <span>{{data.newPhone}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">更换日期</label>
                        <div class="input-group">
                            <span>{{data.startTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">结束日期</label>
                        <div class="input-group">
                            <span>{{data.endTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">更换司机操作时间</label>
                        <div class="input-group">
                            <span>{{data.createTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">更换司机操作人</label>
                        <div class="input-group">
                            <span>{{data.replaceName}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">更换费用</label>
                        <div class="input-group">
                            <span>{{data.fee}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">项目订单号</label>
                        <div class="input-group">
                            <span>{{data.orderNumber}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="备注" name="2">
                <div class="flex-panel detail-box">
                    <!--备注-->
                    <div class="detail-item big">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{data.remark}}</span>
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
        name: "projectDriverRecordDetail",
        components:{ ApprovalFlow, FileDetail },
        data(){
            return {
                activeNames: ['1','2'],
                data : {},
            }
        },
        mounted(){
            let id = this.$route.params.id;
            this.detail(id);
        },
        methods:{
            detail(id){
                ajax.get("core/changeDriver/detail?id="+id).then(res =>{
                    this.data = res.data;
                });
            }
        }

    }
</script>
