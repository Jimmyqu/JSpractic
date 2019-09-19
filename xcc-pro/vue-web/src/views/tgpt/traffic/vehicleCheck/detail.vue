<template>
    <div class="app-container white-bg list-panel list-panel" v-cloak>
        <el-collapse v-model="activeNames">
            <el-collapse-item title="检查记录" name="1" >

                <div class="search-box min" style="background: transparent">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">时间范围</label>
                            <div class="input-group">
                                <el-date-picker
                                    v-model="checkTime"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" size="small" @click="getList()">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>

                <el-table :data="list" style="width: 100%">
                    <el-table-column prop="time" label="检查日期" width="150"></el-table-column>
                    <el-table-column label="外观检查">
                        <el-table-column prop="a" label="车身、灯光、仪表、雨刮、轮胎、水、油、电路等" min-width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="发动机">
                        <el-table-column prop="b" label="启动性能良好、运转平稳、无异响、怠速稳定、机油压力正常" min-width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="转向系">
                        <el-table-column prop="c" label="转向灵活、有效，横、直拉杆及球头性能良好" min-width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="制动系">
                        <el-table-column prop="d" label="行车、驻车制动工作正常、安全有效" min-width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="传动系">
                        <el-table-column prop="e" label="离合器、变速器、传动机构无异响、工作正常" min-width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column label="配备及证件">
                        <el-table-column prop="f" label="配件、附件及行车相关证件齐全有效" min-width="120"></el-table-column>
                    </el-table-column>
                    <el-table-column prop="updater" label="检查人员" width="150"></el-table-column>
                    <el-table-column prop="remark" label="备注" width="150"></el-table-column>
                    <el-table-column prop="pic" label="备注图片" width="150">
                        <template slot-scope="scope">
                            <img :src="scope.row.pic.filedomain + scope.row.pic.path" style="width: 50px" v-if="scope.row.pic">
                        </template>
                    </el-table-column>
                </el-table>

            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import {tool} from '@/utils/common'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import {secondsToTime, secondsToHour} from '@/utils/index'

    export default {
        name: "vehicleCheckDetail",
        mixins: [tool],
        components:{ ApprovalFlow },
        data() {
            return {
                activeNames: ["1"],
                show: true,
                detailForm: {},
                param:{
                    id : this.$route.params.id
                },

                checkTime: '',
                list: []
            }
        },
        methods: {
            open() {
                this.show = true;
            },
            getList(){
                var startTime = "";
                var endTime = "";
                if(this.checkTime && this.checkTime.length > 0){
                    startTime = this.checkTime[0];
                    endTime = this.checkTime[1];
                }
                ajax.get('traffic/coreVehicleCheck/detail?id=' + this.param.id + "&startTime=" + startTime + "&endTime=" + endTime).then(rs => {
                    if (rs && rs.length > 0) {
                        rs.forEach(
                            item => {
                                item.pic = JSON.parse(item.pic);
                            }
                        )
                        this.list = rs;
                    }else {
                        this.list = [];
                    }
                });
            },
            resetList(){
                this.checkTime = "";
                this.getList();
            }
        },
        mounted() {
            this.getList();
        }

    }
</script>
