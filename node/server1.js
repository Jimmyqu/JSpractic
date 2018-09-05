/**
 * Created by Administrator on 2018/9/3.
 */
const Koa = require('koa')

//koa基于express
const app = new Koa();
app.use( async ( ctx ) => {
    //ctx应用上下文
    console.log(ctx)
    ctx.body = 'hello koa2'
});
app.listen(3000);
console.log('[demo] start-quick is starting at port 3000');