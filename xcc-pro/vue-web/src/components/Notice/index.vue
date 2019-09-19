<template>
    <div class="notice" :style="{width: 'calc(100% - 600px)'}">
        <div class="notice-box" >
            <SvgIcon v-if="content" class="notice-icon" iconClass="notice"></SvgIcon>
            <div class='notice-content'>
                <p v-if="content" @mouseenter="mouseenter" @mouseleave="mouseleave" :style="{transform: `translate(${trans}px)`} ">{{content}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import SvgIcon from '@/components/SvgIcon/index'
    import $ from 'jquery-slim'

    export default {
        name: 'notice',
        props:{
            value:null,
            url:String
        },
        components:{ SvgIcon },
        data() {
            return {
                content:'',
                nowTime:null,
                trans:0,
            };
        },
        methods: {
            getDetail(){
                ajax.get(this.url).then(res=>{
                    if(res.status == 0){
                        if(res.data){
                            this.content = res.data.content;
                            this.move();
                        }else{
                            if(this.nowTime){
                                this.mouseenter();
                            }
                        }
                    }
                })
            },
            mouseenter(){
                // 鼠标移入
                clearInterval(this.nowTime)
                // 清除定时器标识
                this.nowTime = null
            },
            mouseleave(){
                // 鼠标移出
                if(this.trans == 0) return;
                this.start();
            },
            move: function () {
                // 实现滚动
                this.trans = $('.notice-content').width();
                this.$nextTick(()=>{
                    this.start();
                })
            },
            start(){
                clearInterval(this.nowTime);
                this.nowTime = setInterval(()=>{
                    if(this.trans <= (this.content.length * 14-20)*-1){
                        this.trans = $('.notice-content').width();
                    }
                    this.trans -= 1;
                },20)
            }
        },
        beforeDestroy () {
            this.mouseenter();
        },
        mounted() {
            this.getDetail();
        },
    }
</script>
<style scoped lang="scss">
    .notice{
        width: calc(100% - 600px);
        display: inline-block;
        font-size: 12px;
        line-height: 50px;
        height: 50px;
        padding:0 30px;
        position: absolute;
        top:0;
        .notice-box{
            display: flex;
            align-items: center;
        }
        .notice-content{
            flex: 1;
            overflow: hidden;
            margin-left: 10px;
        }
        .notice-icon{
            font-size: 20px;
        }
        p{
            font-size: 16px;
            margin: 0;
            color: #FFD76D;
            white-space:nowrap; 
        }
    }
</style>
