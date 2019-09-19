<template>
    <div :class="className" ref="box" @scroll="scroll">
        <i v-show="showIconTop" class="el-icon-arrow-up scrollTop" @click="event=>scrollTo(event,true)"></i>
        <slot/>
        <i v-show="showIconBtum" class="el-icon-arrow-down scrollButoom" @click="scrollTo"></i>
    </div>
</template>

<script>
export default {
    name: "arrow-icon",
    props: {
        rName: String,
        className: null,
    },
    watch: {
    },
    data() {
        return {
            showIconBtum: false,
            showIconTop: false,
            scrollTop: 20,
            isInit: false
        };
    },
    methods: {
        scroll(el){
            if(el.target.scrollTop == this.$refs.box.scrollHeight - this.$refs.box.clientHeight){
                this.showIconBtum = false
            }else{
                this.showIconBtum = true
            }
            if(el.target.scrollTop > 0){
                this.showIconTop = true
            }else{
                this.showIconTop = false
            }
        },
        scrollTo(el,type){
            if(type){
                if( this.scrollTop <= 0 ) {
                    this.scrollTop = 0
                }else{
                    this.scrollTop -= 40
                }
            }else{
                if( this.scrollTop >= this.$refs.box.scrollHeight - this.$refs.box.clientHeight ) {
                    this.scrollTop = this.$refs.box.scrollHeight - this.$refs.box.clientHeight
                }else{
                    this.scrollTop += 40
                }
            }
            this.$refs.box.scrollTop = this.scrollTop
        },
        init(){
            if(this.$refs.box){
                this.showIconBtum = this.$refs.box.scrollHeight > this.$refs.box.clientHeight
                this.showIconTop = this.$refs.box.scrollHeight > this.$refs.box.clientHeight && this.$refs.box.scrollTop > 0
                this.isInit = true
            }
        },
    },
    mounted(){
        this.init()
    },
};
</script>

<style scoped lang="scss">
    @keyframes move {
        0% { transform: scale(1) }
        10% { transform: scale(.9) }
        20% { transform: scale(.8) }
        30% { transform: scale(.7) }
        40% { transform: scale(.6) }
        50% { transform: scale(.5) }
        60% { transform: scale(.6) }
        70% { transform: scale(.7) }
        80% { transform: scale(.8) }
        90% { transform: scale(.9) }
        100% { transform: scale(1) }
    }
    .scrollTop,.scrollButoom{
            font-size: 30px;
            font-weight: bold;
            cursor: pointer;
            position: absolute;
            z-index: 2001;
            opacity: .7;
            transition: .2s;
            color: #46fceb;
            // display: block;
            // width: 15%;
            left: 0;
            right: 0;
            // margin:0 auto;
            // border-radius: 50%;
            text-align: center;
            animation: move 2s infinite;
        }
    .scrollTop{
        top: 35px;
    }
    .scrollButoom{
        bottom: 10px;
    }
    .scrollTop:hover,.scrollButoom:hover{
        opacity: 1;
    }
</style>