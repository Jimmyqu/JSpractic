let fooTemplate =
    `<div class="foo">
        <div></div>
        <div></div>
        <div></div>
    </div>`


const foo=Vue.component('foo', {
    template: fooTemplate,
    data: function () {
        return {
            foo:'1111111'
        }
    },
    methods: {
    }

});