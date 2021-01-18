export default ({
    props: {
      count: Number
    },
    data(){
        return {
            inputVal:'',
            isShow:false,
        }
    },
    methods:{
        handleInput(e){
            this.inputVal = e.target.value
            console.log(this.inputVal)
        },
        handleAdd(){
            console.log(this.inputVal)
        }
    },
    render() {
      return <div>
          <input v-show={this.isShow}></input>
          <button onClick={()=>this.handleAdd()}>添加</button>
          </div>
    }
  })