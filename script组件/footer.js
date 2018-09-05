/**
 * Created by Administrator on 2018/8/16.
 */
let footerTemplate = `
    <div class="footer">
            
        <h1>{{header}}</h1>
        <h2>footer</h2>
    </div>`


Vue.component('my-footer', {
    template:footerTemplate,
    data: function () {
        return {
            header:'Just for test'
        }
    },
    methods: {

    }

});
