<template>
    <div class="num-change" :class="{'type':type}">
        <div :class="arr.length && arr[0] > 0 ? 'num-icon num-red':'num-icon num-green'"  v-for="(num,i) in arr" :key="i">{{num}}</div>
    </div>
</template>

<script>

    export default {
        name: 'num-change',
        props:{
            value:null,
            type:null
        },
        data() {
            return {
                size:0,
                curData:0,
                arr:[],
            };
        },
        watch:{
            value:{
                handler() {
                    if(this.value && !isNaN(this.value)) {
                        this.size = Math.ceil(this.value/30);
                        this.init();
                    }else{
                        this.arr = ['0'];
                    }
                },
                immediate:true
            },

        },
        methods: {
            init() {
                let timer = window.setInterval(() => {
                    this.curData = this.curData*1+this.size;
                    if(this.curData>=this.value) {
                        this.curData = this.value;
                        window.clearInterval(timer);
                    }
                    this.setArr(this.curData.toString());
                },100)
            },
            setArr(num){
                this.arr = [];
                for (let i=0;i<num.length;i++) {
                    this.arr.push(num[i]);
                }
            }
        },
        mounted() {

        },
    }
</script>
<style scoped lang="scss">
    .num-change {
        display: flex;
        justify-content: center;
        cursor: pointer;
        width:140px;
        height:50px;
        background: 
        url("~img/workbench/left-top.png") top left no-repeat, 
        url("~img/workbench/right-top.png") top right no-repeat, 
        url("~img/workbench/left-bottom.png") bottom left no-repeat, 
        url("~img/workbench/right-bottom.png") bottom right no-repeat;
        background-color:rgba(113,139,197,0.3);
    }
    .num-icon {
        font-size: 36px;
        line-height: 50px;
    }
    .type{
        background: none;
        width:0;
        height:0;
        .num-icon {
            font-size: 18px;
            line-height: 20px;
        }
        .num-red{
           color: #FF5656;
        }
        .num-green{
           color: #5AECFF;
        }
    }
</style>
