<template>
    <div class="app-container white-bg list-panel" v-cloak>

    </div>
</template>

<script>
    import ConfirmForm from '@/views/tgpt/project/contract/confirm'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'setupProvince',
        mixins: [tool],
        components: { ConfirmForm },

    }
</script>

