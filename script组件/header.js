/**
 * Created by Administrator on 2018/8/16.
 */
let headerTemplate = `
    <div>
        <h1>{{header}}</h1>
        <ul>
            <router-link tag="li" to="foo">tofoo</router-link>
            <router-link tag="li" to="bar">tobar</router-link>
        </ul>
    </div>`


Vue.component('my-header', {
    template: headerTemplate,
    data: function () {
        return {
            header:'Just for test'
        }
    },
    methods: {

    }

});