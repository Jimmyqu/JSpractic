<template>
  <div>
    <div class="thumb-box">
      <div
        class="border"
        :style="{
          transform: `scale(${borderScale})`,
          transformOrigin: `${originX * 0.333}px ${originY * 0.333}px`,
          top: `${thumbX}px`,
          left: `${thumbY}px`,
        }"
      ></div>
      <img src="img.png" alt="" />
    </div>
    <v-touch  @pinchout="pinchout" @pinchin="pinchin" @panmove="panmove" @panstart="panstart" @panend="panend">
      <div class="img-box">
        <img
          :style="{
            transform: `scale(${scale})`,
            top: `${imgT}px`,
            left: `${imgL}px`,
            transformOrigin: `${originX}px ${originY}px`,
          }"
          @click="onScale($event)"
          src="img.png"
          alt=""
        />
      </div>
    </v-touch>
    <div>{{ leftDis }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isTouch: false,
      scale: 1,
      imgT: 0,
      imgL: 0,
      originX: 0,
      originY: 0,
      startX: 0, //起始位置
      startY: 0, //起始位置
      thumbX: 0,
      thumbY: 0,
    };
  },
  computed: {
    canMove() {
      return this.scale != 1 && this.isTouch;
    },
    borderScale() {
      return 1 / this.scale;
    },
    leftDis() {
      return (1 - this.borderScale) * this.originX * 0.3;
    },
    topDis() {
      return (1 - this.borderScale) * this.originY * 0.3;
    },
  },
  methods: {
    onScale(e) {
      this.originX = e.offsetX;
      this.originY = e.offsetY;
      // this.scale=this.scale===1?2:1
      if (this.scale == 1) {
        this.scale = 2;
      } else {
        this.scale = 1;
        this.imgT = 0;
        this.imgL = 0;
        this.thumbX = 0;
        this.thumbY = 0;
      }
    },
    // 放大的时候触发
    pinchout: function (e) {
      this.originX = e.center.x;
      this.originY = e.center.y;
      if (this.scale >= 0 && this.scale < 2) {
        this.scale += 0.1
      }
    },
    //  缩小的时候触发
    pinchin: function (e) {
      this.originX = e.center.x;
      this.originY = e.center.y;
      if (this.scale > 1) {
        this.scale -= 0.1
      }
    },
    // 当手指拖动开始的时候
    panstart: function(ev) {
      this.isTouch = true;
      // 获取上次记录的xy坐标作为起点
      this.startY = this.imgT;
      this.startX = this.imgL;
    },
    panend: function(ev) {
    //   console.log(this.thumbY, -this.leftDis);
      if (this.thumbY < -this.leftDis) {
        //超过左
        this.thumbY = -this.leftDis;
        this.imgL = this.originX;
      }

      if (this.thumbY > this.leftDis) {
        //超过右边
        this.thumbY = this.leftDis;
        this.imgL = -this.originX;
      }

      if (this.thumbX < -this.topDis) {
        //超过上
        this.thumbX = -this.topDis;
        this.imgT = this.originY;
      }

      if (this.thumbX > this.topDis) {
        //超过下
        this.thumbX = this.topDis;
        this.imgT = -this.originY;
      }
      this.isTouch = false;
    },
    // 当手指拖动的过程中
    panmove: function(ev) {
      if (this.canMove) {
        this.imgT = ev.deltaY + this.startY;
        this.imgL = ev.deltaX + this.startX;
        // 具体移动距离*边框缩小系数*大小盒之比
        this.thumbX = -(this.imgT * this.borderScale * 0.3);
        this.thumbY = -(this.imgL * this.borderScale * 0.3);
      }
    },
  },
};
</script>

<style lang="less">
.thumb-box {
  position: relative;
  width: 33.3vw;
  height: 33.3vw;
  .border {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 1px solid rebeccapurple;
  }
  img {
    width: 100%;
  }
}
.img-box {
  width: 100vw;
  height: 100vw;
  overflow: hidden;
  position: relative;
  img {
    position: absolute;
    width: 100%;
  }
}
</style>
