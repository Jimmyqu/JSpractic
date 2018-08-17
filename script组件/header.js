/**
 * Created by Administrator on 2018/8/16.
 */
let headerTemplate = `
    <div>
        <h1>{{header}}</h1>
        <ul>
            <li @click="tofoo">1111</li>
            <li @click="tobar">2222</li>
        </ul>
    </div>`


Vue.component('my-header', {
    template: headerTemplate,
    data: function () {
        return {
            header:'headerheaderheaderheaderheaderheaderheader'
        }
    },
    methods: {
        tofoo(){
            this.$router.push('foo')
        },
        tobar(){
            this.$router.push('bar')
        }
    }

});