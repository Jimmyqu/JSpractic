<template>
    
</template>

<script>
    import {tool} from '@/utils/common'

    export default {
        name: 'autoLogin',
        mixins: [tool],
        mounted(){
            this.login()
        },
        methods: {
            login: function () {
                const data = {
                    account: this.$route.query.account,
                    password: this.$route.query.password,
                    platform: 1,
                    loginType: 1
                };
                this.$store.dispatch('Login', data).then(() => {
                    this.$router.push({path: '/'})
                }).catch(res => {
                    this.$router.push({path: '/login'})
                });
            },
        }
    }
</script>
