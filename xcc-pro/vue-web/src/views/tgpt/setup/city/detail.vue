<template>
    <div class="detail-panel">

    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'

    export default {
        name: "setupCityDetail",
        components:{ ApprovalFlow, FileDetail },


    }
</script>
