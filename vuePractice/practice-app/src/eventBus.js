class Bus{
    constructor(){
        this.pool={}
    }

    on(name,fn){
        this.pool[name]=[]|| this.pool[name]
        this.pool[name].push(fn)
    }

    emit(name,args){
        if(this.pool[name].length){
            this.pool[name].map(fn=>{
                fn(args)
            })
        }
    }
}
const bus = new Bus()

export default bus