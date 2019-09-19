<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="合同信息" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">合同编号</label>
                        <div class="input-group">
                            <span>{{detailForm.contractNumber}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">承租人</label>
                        <div class="input-group">
                            <span>{{detailForm.renter}}</span>
                        </div>
                    </div>
					<div class="detail-item">
						<label class="control-label">承租人手机号</label>
						<div class="input-group">
							<span>{{detailForm.phone}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">所属组织</label>
						<div class="input-group">
							<span>{{detailForm.organizationName}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">所需车辆台数</label>
						<div class="input-group">
							<span>{{detailForm.vehicleNum}}</span>
						</div>
					</div>
                    <div class="detail-item">
                        <label class="control-label">合同状态</label>
                        <div class="input-group">
                            <span>{{detailForm.contractStatusText}}</span>
                        </div>
                    </div>

                </div>
            </el-collapse-item>
            <el-collapse-item title="已交车辆" name="2" >
                <div class="table-box">
                    <el-table border :data="detailForm.deliveryRegistrationDetails" style="width: 100%">
                        <el-table-column min-width="140" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="交车日期" prop="deliveryDate" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="交车人" prop="deliveryPerson" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="交车里程(km)" prop="deliveryMileage" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="备注" prop="remark" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="附件" sortable show-overflow-tooltip>
                            <template slot-scope="{row,$index}">
                                <upload-panel :size="9"  disabled :file-list.sync="row.files"></upload-panel>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-collapse-item>


        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import FileDetail from '@/components/FileDetail/index'
    import UploadPanel from '@/components/UploadPanel/index'

    export default {
        name: "contractDeliveryDetail",
        components:{ FileDetail ,UploadPanel},
        data() {
            return {
                openCollapse: ["1","2"],
                show: true,
                detailForm: {
                    deliveryRegistrationDetails:[
                        {
                            plate:'',
                            deliveryDate:'',
                            deliveryPerson:'',
                            deliveryMileage:'',
                            remark:'',
                            files:[],
                        }
                    ]
                },
                id: this.$route.params.id,
                }
        },
        methods: {
            open() {
                this.show = true;
            },
        }
        ,
        mounted() {
            ajax.get('traffic/trafficDeliveryRegistration/' + this.id,).then(rs => {
                for(var i=0;i<rs.data.deliveryRegistrationDetails.length;i++){
                   if(rs.data.deliveryRegistrationDetails[i].attachment){
                       rs.data.deliveryRegistrationDetails[i].files = JSON.parse(rs.data.deliveryRegistrationDetails[i].attachment);
                   }
                }
                this.detailForm = rs.data;
                this.detailForm.deliveryRegistrationDetails = rs.data.deliveryRegistrationDetails;

            });
        }

    }
</script>
