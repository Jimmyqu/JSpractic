import Vue from 'vue'

class Store{
    constructor(option={}){
        this.state = new Vue({
            data:option.state||{}
        })
        this.mutation = option.mutation||{}
    }
    commit(type,args){
        this.mutation[type](this.state,args)
    }
}

function install(){
    //Vue.use(store)会先调用install方法 
    Vue.mixin({ 
        //Vue.mixin中能取到 所有实例对象挂载的属性 
        beforeCreate(){
            //只取挂载在root组件的store
            if(this.$options.store){
                Vue.prototype.$myStore = this.$options.store
            }
        }
    })
}

export default {
    Store,
    install
}