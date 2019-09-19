<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="工时项目信息" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item half">
                        <label class="control-label">编号</label>
                        <div class="input-group">
                            <span>{{form.code}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">工时项目名称</label>
                        <div class="input-group">
                            <span>{{form.name}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">项目分类</label>
                        <div class="input-group">
                            <span>{{form.typeName}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">状态</label>
                        <div class="input-group">
                            <span>{{form.manhourStatusName}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">参考价格（元）</label>
                        <div class="input-group">
                            <span>{{form.referencPrice}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">参考说明</label>
                        <div class="input-group">
                            <span>{{form.advice}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">创建人</label>
                        <div class="input-group">
                            <span>{{form.creater}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">创建时间</label>
                        <div class="input-group">
                            <span>{{form.createTime}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { number_format } from '@/utils'

    export default {
        name: "trafficManhourDetail",
        data:function () {
            return {
                activeNames: ['1','2','3','4'],
                form : {}
            }
        },
        beforeMount:function () {

        },
        mounted:function () {
            this.detail(this.$route.params.id);
        },
        methods:{
            detail(id){
                let $this = this;
                ajax.get("base/manhour/getById?id="+id).then(result=>{
                    if(result.status == 0){
                        $this.form = result.data;
                    }
                });
            },
        }

    }
</script>
