<template>
    <div>
        <el-slider
            v-model="value9"
            range
            :show-stops="true"
            :max="10">
        </el-slider>
        <div style="width: 100px">
            <BrandSelect v-model="value" level="2"></BrandSelect>
            <BrandSelect v-model="value1" level="3"></BrandSelect>
        </div>

    </div>
</template>

<script>
    import BrandSelect from '@/components/BrandSelect/index'

    export default {
        name: "demoTest",
        components:{
            BrandSelect
        },
        data(){
            return {
                value:[ "3", "1"],
                value1:[ "3", "1", "4"],
                value9:[4,8]
            }
        }

    }
</script>
