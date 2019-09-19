<template>
    <div>
        <template v-for="(recode) in tableHeader">
            <template v-if="recode.prop == 'plate'">
                <el-table-column :prop="recode.prop" sortable :label="recode.label" min-width="120" :key="recode.prop">
                    <template slot-scope="scope">
                        <a size="mini" @click="toVehicleDetail(scope.row.vehicleId)">{{scope.row.plate}}</a>
                    </template>
                </el-table-column>
            </template>
            <template v-else-if="!recode.children && recode.prop != 'plate'">
                <el-table-column :prop="recode.prop" sortable :label="recode.label" min-width="120" :key="recode.prop">
                </el-table-column>
            </template>
            <template v-else>
                <el-table-column sortable :label="recode.label" min-width="120" :key="recode.prop">
                    <el-table-column v-for="(children) in recode.children" :prop="children.prop" sortable :label="children.label" min-width="120" :key="children.prop"></el-table-column>
                </el-table-column>
            </template>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'table-header',
        data() {
            return {
                tableHeader:[]
            }
        },
        mounted() {
            setTimeout(()=>{
                this.tableHeader = [
                    {
                        label:'车牌',
                        prop:'plate'
                    },
                    {
                        label:'资产所属',
                        prop:'assetsTypeName'
                    },
                    {
                        label:'所属部门',
                        prop:'serviceRegionName'
                    },
                    {
                        label:'车型',
                        prop:'modelName'
                    },
                    {
                        label:'OBD里程(km)',
                        prop:'',
                        children:[
                            {
                                label:'累计里程',
                                prop:'obdTotalMileage',
                            },
                            {
                                label:'日均里程',
                                prop:'obdAvgMileage',
                            }
                        ]
                    },
                    {
                        label:'GPS里程(km)',
                        prop:'',
                        children:[
                            {
                                label:'累计里程',
                                prop:'gpsTotalMileage',
                            },
                            {
                                label:'日均里程',
                                prop:'gpsAvgMileage',
                            }
                        ]
                    },
                    {
                        label:'车速段里程(km)',
                        prop:'',
                        children:[
                            {
                                label:'0-20',
                                prop:'mileage0020',
                            },
                            {
                                label:'20-40',
                                prop:'mileage2040',
                            },
                            {
                                label:'40-60',
                                prop:'mileage4060',
                            },
                            {
                                label:'60-90',
                                prop:'mileage6090',
                            },
                            {
                                label:'90-120',
                                prop:'mileage90120',
                            },
                            {
                                label:'>120',
                                prop:'mileage120',
                            }
                        ]
                    },
                    {
                        label:'使用率',
                        prop:'utilizationRate'
                    }
                ]
            },300)
        }
    }
</script>