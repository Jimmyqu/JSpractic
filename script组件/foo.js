/**
 * Created by Administrator on 2018/8/16.
 */
/**
 * Created by Administrator on 2018/8/16.
 */
let fooTemplate =
    `<div class="foo">
        <h1>{{foo}}</h1>
    </div>`


const foo=Vue.component('foo', {
    template: fooTemplate,
    data: function () {
        return {
            foo:'fooooooooooooooooooooooooo'
        }
    },
    methods: {
    }

});