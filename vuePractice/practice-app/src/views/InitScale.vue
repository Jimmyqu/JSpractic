<template>
  <div>
    <div class="thumb-box">
      <div class="thumb-border" :style="{
          width: `${thumbW*borderScale}px`,
          height: `${thumbH*borderScale}px`,
          top: `${borderY*borderScale*0.3}px`,
          left: `${borderX*borderScale*0.3}px`,
        }"></div>
       <div class="thumb" :style="{
          width: `${thumbW}px`,
          height: `${thumbH}px`,
        }">
        <div
          v-for="seat in seatList"
            :key="seat.seatDataId"
            class="seatItem"
            :style="{
              top: `${seatWidth * constScale * (seat.seatTop)*0.3}px`,
              left: `${seatWidth * constScale * (seat.seatLeft)*0.3}px`,
              width: `${seatWidth * constScale*0.3}px`,
              height: `${seatWidth * constScale*0.3}px`,
            }"
        >
        </div>
      </div>
    </div>
   
    <div class="seatContainer" :style="{
              height: `${initH}px`,
            }" ref="container" @scroll="handleScroll" @touchmove="handleScroll">
      <div
        class="seatBox"
        v-pinch="handlePinch"
        v-pinchend="handlePinchEnd"
        ref="box"
        :style="{
          width: `${boxComputedWidth}px`,
          height: `${boxComputedtHeight}px`,
        }"
      >
        <div
          v-for="seat in seatList"
          :key="seat.seatDataId"
          class="seatItem"
          :style="{
            top: `${seatWidth * nowScale * (seat.seatTop)}px`,
            left: `${seatWidth * nowScale * (seat.seatLeft)}px`,
            width: `${seatWidth * nowScale}px`,
            height: `${seatWidth * nowScale}px`,
          }"
          @click="handleSrollTo(seat.seatTop, seat.seatLeft)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
const mapData = {
  width: 200,
  height: 200,
  seatWidth: 40,
  seatList: [
    {
      seatTop: 10,
      seatLeft: 4,
      seatDataId: 1,
    },
    {
      seatTop: 30,
      seatLeft: 4,
      seatDataId: 5,
    },
    {
      seatTop: 50,
      seatLeft: 3,
      seatDataId: 2,
    },
    {
      seatTop: 50,
      seatLeft: 50,
      seatDataId: 3,
    },
    {
      seatTop: 150,
      seatLeft: 150,
      seatDataId: 4,
    },
    {
      seatTop: 80,
      seatLeft: 4,
      seatDataId: 6,
    },
    {
      seatTop: 120,
      seatLeft: 4,
      seatDataId: 7,
    },
  ],
};
export default {
  data() {
    return {
      nowScale: null,
      minScale: null,
      constScale: null,
      seatWidth: 40,
      seatHeight: null,
      originWidth: null,
      originHeight: null,
      seatList: [],
      thumbW:0,
      thumbH:0,
      borderX:0,
      borderY:0,
      initH:0,
    };
  },
  computed: {
    borderScale(){
      return this.constScale/this.nowScale
    },
    boxComputedWidth() {
      return this.originWidth * this.nowScale;
    },
    boxComputedtHeight() {
      return this.originHeight * this.nowScale;
    },
    
  },
  watch:{

  },
  mounted() {
    this.seatList = mapData.seatList;
    this.originWidth = 200 * mapData.seatWidth; 
    this.originHeight =200 * mapData.seatWidth; // 原始座位图 模板不能减
    // this.originWidth = (151-3) * mapData.seatWidth;  // 最大left 和最小left 之差
    // this.originHeight =(151-10) * mapData.seatWidth; // 最大Top 和最小top 之差  之后在模板减去最小top 画出没有余量的座位图
    this.minScale =
      this.$refs.container.getBoundingClientRect().width / this.originWidth;
    this.constScale = this.nowScale = this.minScale
    setTimeout(() => {
      this.thumbW = this.$refs.box.getBoundingClientRect().width*0.3
      this.thumbH = this.$refs.box.getBoundingClientRect().height*0.3
      this.initH = this.$refs.box.getBoundingClientRect().width
    }, 0);
   
  },
  methods: {
    handleScroll(){
      this.$nextTick(()=>{
        this.borderY = this.$refs.container.scrollTop
        this.borderX = this.$refs.container.scrollLeft
      })
    },
    handlePinchEnd(scale) {  
      if(this.nowScale >= 1) {
        this.minScale = 1
      }else if (this.nowScale <= this.constScale) {
        this.minScale = this.nowScale
      }else {
        this.minScale = this.minScale * scale
      } 
    },
    handlePinch(scale, center) { 
      var rectX = this.$refs.box.getBoundingClientRect().left;
      var rectY = this.$refs.box.getBoundingClientRect().top;
      let x = (-rectX + center.x)/this.$refs.box.getBoundingClientRect().height*200  // 中心点 在200份中等比点
      let y = (-rectY + center.y)/this.$refs.box.getBoundingClientRect().width*200
      this.$nextTick(() => {
        this.nowScale = this.minScale * scale 
        if(this.nowScale >= 1) {
          this.nowScale = 1
        }else if (this.nowScale <= this.constScale) {
          this.nowScale = this.constScale
        }
        console.log('before', this.$refs.container.scrollTop,this.$refs.container.scrollLeft)
        this.$refs.container.scrollTop = x*this.nowScale*40-
          this.$refs.container.getBoundingClientRect().height / 2;
        this.$refs.container.scrollLeft =y*this.nowScale*40 - 
          this.$refs.container.getBoundingClientRect().height / 2;
        console.log('after', this.$refs.container.scrollTop,this.$refs.container.scrollLeft)  
      });
    },          
    handleSrollTo( top, left) {
      this.nowScale = this.minScale = 1;
      this.$nextTick(() => {
        this.borderY = this.$refs.container.scrollTop =
          top * this.nowScale * 40 -
          this.$refs.container.getBoundingClientRect().height / 2;
        this.borderX = this.$refs.container.scrollLeft =
          left * this.nowScale * 40 -
          this.$refs.container.getBoundingClientRect().width / 2;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.thumb-box {
  position: relative;
}
.thumb-border{
  border: 1px solid red;
  position: absolute;
}
.thumb {
  position: relative;
  background-color: rgba(0,0,0,0.6);
  div{
    position: absolute;
    background-color: #fff;
  }
}
.seatContainer::-webkit-scrollbar {
  display: none;
}
.seatContainer {
  overflow: auto;
  .seatBox {
    position: relative;
    background-color: red;
    .seatItem {
      position: absolute;
      background-color: rebeccapurple;
    }
  }
}

</style>
