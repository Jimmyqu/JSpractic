export default ({
    props: {
      count: Number
    },
    data(){
        return {
            inputVal:''
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
      return <>
          <div></div>
      </>
    }
  })