import Child from "./components/HelloWorld"
import InputCom from "./components/InputCom"
import DisCom from "./components/DisCom"

const App = ({
  components:{
    Child,
    InputCom
  },
  data () {
    return {
      todoList:[]
    }
  },
  methods:{
  },
  render(){
    return <>
        <InputCom></InputCom>
        <DisCom ></DisCom>
      </>
  }
})
export default App
