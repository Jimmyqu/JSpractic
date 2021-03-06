/**
 * Created by Administrator on 2018/8/16.
 */

let barTemplate = `
    <div class="bar">
        <div>
            <h1 @click="handlerClick">{{bar}}</h1>
             <p v-for="i in [1,2,3,4,5]">{{i}}</p>
        </div>
        <div class="bar-2th">
            <div></div><div></div><div></div>
        </div>
    </div>`


const bar=Vue.component('bar', {
    template: barTemplate,
    data: function () {
        return {
            bar:'barbarbarbarbarbarbar'
        }
    },
    methods: {
        handlerClick(){
            console.log('h1 clicked')
        }
    }

});