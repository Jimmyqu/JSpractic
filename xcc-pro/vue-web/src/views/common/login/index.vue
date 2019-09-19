<template>
    <component :is="login"></component>
</template>

<script>
    import DefaultLogin from './components/DefaultLogin'
    import NmLogin from './components/NmLogin'
    import SzLogin from './components/SzLogin'
    import GdLogin from './components/GdLogin'
    
    const service = [{
        name:'NmLogin',
        path:'nm.cjj.szyciov.com'
    },{
        name:'GdLogin',
        path:'gdgd.cjj.szyciov.com'
    },{
        name:'SzLogin',
        path:'szjlzl.cjj.szyciov.com'
    }]

    export default {
        name: 'login',
        components:{ DefaultLogin, NmLogin, SzLogin, GdLogin},
        data(){
            return {
                login:'',
            }
        },
        created(){
            const host = location.host
            for(let i = 0;i<service.length;i++){
                const S = service[i]
                if(host.indexOf(S.path) != -1){
                    this.login = S.name
                    break;
                }
            }
            if(!this.login){
                this.login = 'DefaultLogin'
            }
        },
    }
</script>
