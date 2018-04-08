window.onload =()=>{
    var obj = {
        name : 'linxin'
    }

    function func(firstName, lastName){
        console.log(firstName + ' ' + this.name + ' ' + lastName);
    }

    //会使函数立即执行
    //两个参数：一个是作为函数上下文的对象，另外一个是作为函数参数所组成的数组。
    func.apply(obj, ['A', 'B']);    // A linxin B


    //bind 返回值是函数 改变函数上下文的对象
    func.bind(obj,'lily','lucy')()


    window.name = "The Window";
    var object = {
        name : "My Object",
        objName:function(){
            var that=this
            return function () {
                return that.name
            }
        },
        getNameFunc : function(){
            return function(){
                return this.name;
            };

        }

    };
    console.log(object.objName()());
    console.log(object.getNameFunc()());


}