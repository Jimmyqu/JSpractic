<template>
    <div class="num-change" :class="{'type':type}">
        <div class="num-icon" v-for="(num,i) in arr" :key="i" :class="'num'+num"></div>
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
                        this.arr = ['00'];
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
    }
    .num-icon {
        width: 25px;
        height: 30px;
        background-size: auto 100%;
        background-repeat: no-repeat;
        background-position: center;
        margin: 0 3px;
    }
    .num00 {
        background-image: url("~img/workbench/ss0.png");
    }
    .num1{
        background-image: url("~img/workbench/1.png");
    }
    .num2{
        background-image: url("~img/workbench/2.png");
    }
    .num3{
        background-image: url("~img/workbench/3.png");
    }
    .num4{
        background-image: url("~img/workbench/4.png");
    }
    .num5{
        background-image: url("~img/workbench/5.png");
    }
    .num6{
        background-image: url("~img/workbench/6.png");
    }
    .num7{
        background-image: url("~img/workbench/7.png");
    }
    .num8{
        background-image: url("~img/workbench/8.png");
    }
    .num9{
        background-image: url("~img/workbench/9.png");
    }
    .num0{
        background-image: url("~img/workbench/0.png");
    }
    .type{
        .num-icon {
            width: 11px;
            height: 14px;
        }
        .num1{
            background-image: url("~img/workbench/s1.png");
        }
        .num2{
            background-image: url("~img/workbench/s2.png");
        }
        .num3{
            background-image: url("~img/workbench/s3.png");
        }
        .num4{
            background-image: url("~img/workbench/s4.png");
        }
        .num5{
            background-image: url("~img/workbench/s5.png");
        }
        .num6{
            background-image: url("~img/workbench/s6.png");
        }
        .num7{
            background-image: url("~img/workbench/s7.png");
        }
        .num8{
            background-image: url("~img/workbench/s8.png");
        }
        .num9{
            background-image: url("~img/workbench/s9.png");
        }
        .num0{
            background-image: url("~img/workbench/s0.png");
        }
    }
</style>
