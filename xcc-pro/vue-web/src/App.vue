<template>
    <div id="app" v-loading.fullscreen.lock="loading">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {
                loading: false,
            }
        }
    }
</script>
