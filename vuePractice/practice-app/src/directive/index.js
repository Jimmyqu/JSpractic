import Vue from 'vue'
// 注册一个全局自定义指令 `v-focus`
// 除了el之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的dataset.xx传递 
Vue.directive('image', {
    // 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
    bind:(el, binding)=>{
        el.setAttribute("src", 'https://via.placeholder.com/150')
    },
    // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
    inserted: function (el, bind) {
      console.log('inserted', el)
    },
    // 包括自己和父组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。
    update: function (el, bind) {
        console.log('update', el)
        if(bind.value){
          el.setAttribute("src", bind.value);
        }
    },
})