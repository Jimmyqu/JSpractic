<template>
    <div class="date-time-picker-content">
        <el-date-picker
            v-model="dateValue"
            type="date"
            placeholder="选择日期"
            @change="changeDate"
            >
        </el-date-picker>
        &nbsp;
        <el-time-select
            v-model="timeValue"
            :picker-options="{
                start: '00:00',
                step: '00:10',
                end: '23:50'
            }"
            @change='changeTime'
            placeholder="选择时间">
        </el-time-select>
    </div>
</template>

<script>
    export default {
        name: 'hamburger',
        props: {
            value:String
        },
        watch:{
            value: {
                handler(val, oldVal) {
                    if(val){
                        this.dateValue = val.split(' ')[0]
                        this.timeValue = val.split(' ')[1]
                    }
                },
                deep: true,
                immediate: true
            },
        },
        data(){
            return {
                dateValue:'',
                timeValue:'',
            }
        },
        methods:{
            changeDate(value){
                this.dateValue = value;
                this.emit();
            },
            changeTime(value){
                this.timeValue = value;
                this.emit();
            },
            emit(){
                if(this.timeValue && this.dateValue){
                    this.$emit('change',new Date(this.dateValue).format('yyyy-MM-dd') + ' ' + this.timeValue)
                }else if(!this.timeValue || !this.dateValue){
                    this.$emit('change','')
                }
            }
        }
    }
</script>

<style lang="scss">
    .date-time-picker-content{
        display: flex;
    }
</style>
