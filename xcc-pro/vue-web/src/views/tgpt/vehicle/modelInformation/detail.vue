<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <!--车型资料-->
            <el-collapse-item title="车型资料" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">车型名称</label>
                        <div class="input-group">
                            <span>{{model.modelInfo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">品牌</label>
                        <div class="input-group">
                            <span>{{model.brandName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">系列</label>
                        <div class="input-group">
                            <span>{{model.seriesName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">款式</label>
                        <div class="input-group">
                            <span>{{model.style}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车厢数</label>
                        <div class="input-group">
                            <span>{{model.vehicleNumberName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">排量</label>
                        <div class="input-group">
                            <span>{{model.displacement}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">变速箱</label>
                        <div class="input-group">
                            <span>{{model.transmissionName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车身尺寸</label>
                        <div class="input-group">
                            <span>{{model.vehicleSize}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">版型名</label>
                        <div class="input-group">
                            <span>{{model.versionName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">座位数</label>
                        <div class="input-group">
                            <span>{{model.seating}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车身结构</label>
                        <div class="input-group">
                            <span>{{model.vehicleStructureName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">燃油类型</label>
                        <div class="input-group">
                            <span>{{model.fuelTypeName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">油箱容量</label>
                        <div class="input-group">
                            <span>{{model.fuelCapacity}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">环保标准</label>
                        <div class="input-group">
                            <span>{{model.protectionStandardName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">能源类型</label>
                        <div class="input-group">
                            <span>{{model.energyTypeName}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">综合油耗</label>
                        <div class="input-group">
                            <span>{{model.combined}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">整车质保（年）</label>
                        <div class="input-group">
                            <span>{{model.vehicleWarrantyYear}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">整车质保（公里）</label>
                        <div class="input-group">
                            <span>{{model.vehicleWarrantyKm}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">轮胎尺寸</label>
                        <div class="input-group">
                            <span>{{model.tireSize}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">备胎规格</label>
                        <div class="input-group">
                            <span>{{model.spareTireTypeName}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>

            <!--图片-->
            <el-collapse-item title="车型图片" name="2">
                <upload-panel :size="1"  disabled :file-list.sync="pics" :show-img="true"></upload-panel>
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
        name: "vehicleModelInformationDetail",
        components:{ ApprovalFlow, FileDetail,UploadPanel },
        data(){
            return {
                activeNames: ['1', '2'],
                pics:[],
                model:{
                },
            }
        },mounted: function () {
            this.detail();
        },
        watch: {

        },
        methods: {
            detail:function () {
                ajax.get('base/baseVehicleModelInfo/getDetail?id=' + this.$route.params.id).then(rs => {
                    if (rs.status == 0) {
                        this.model=rs.data;
                        if(rs.data && rs.data.pic && rs.data.pic.length>0)//转换图片
                            this.pics=JSON.parse(rs.data.pic);

                    } else {
                        this.$message.error(rs.message);
                        console.log(rs.message);
                    }
                });
            },  numberFormat(number){
                return number_format(number, 2, '.', ',');
            },
        }

    }
</script>
