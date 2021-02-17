import { reactive  } from 'vue';
const Child = ({
  props: {
    count: Number
  },
  // setup 组件选项在创建组件之前执行，一旦props被解析，充当合成 API 的入口点 setup 选项中没有 this
  setup(props) {
    console.log(props.count)
    return {} // setup返回的内容可以用于组件的其余部分
  },
  render({count}) {
    return <div>
      <div>child{count}</div>
    </div>
  }
})
export default Child