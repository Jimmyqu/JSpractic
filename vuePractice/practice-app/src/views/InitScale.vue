<template>
  <div>
    <div class="seatContainer" ref="container">
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
            top: `${seatWidth * nowScale * seat.seatTop}px`,
            left: `${seatWidth * nowScale * seat.seatLeft}px`,
            width: `${seatWidth * nowScale}px`,
            height: `${seatWidth * nowScale}px`,
          }"
          @click="handleSrollTo(seat.seatTop, seat.seatLeft)"
        ></div>
      </div>
    </div>
    <div @click="handleScale(0.05)">+</div>
    <div @click="handleScale(-0.05)">-</div>
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
  ],
};
export default {
  data() {
    return {
      nowScale: null,
      seatWidth: 40,
      seatHeight: null,
      originWidth: null,
      originHeight: null,
      seatList: [],
    };
  },
  computed: {
    boxComputedWidth() {
      return this.originWidth * this.nowScale;
    },
    boxComputedtHeight() {
      return this.originHeight * this.nowScale;
    },
  },
  mounted() {
    this.seatList = mapData.seatList;
    this.originWidth = mapData.width * mapData.seatWidth;
    this.originHeight = mapData.height * mapData.seatWidth;
    this.minScale =
      this.$refs.container.getBoundingClientRect().width / this.originWidth;
    this.nowScale = this.minScale
  },
  methods: {
    handlePinchEnd(scale) {
      this.minScale = this.minScale * scale
    },
    handlePinch(scale, center) { 
      var rectX = this.$refs.box.getBoundingClientRect().left;
      var rectY = this.$refs.box.getBoundingClientRect().top;
      console.log('rectX', rectX,rectY)
      console.log(this.$refs.container.scrollTop,this.$refs.container.scrollLeft)
      console.log(center.x,center.y)
      this.nowScale = this.minScale * scale
      this.$nextTick(() => {
        this.$refs.container.scrollTop =
          (center.y - rectY) * this.nowScale * 40 -
          this.$refs.container.getBoundingClientRect().height / 2;
        this.$refs.container.scrollLeft =
          (center.x - rectX) * this.nowScale * 40 -
          this.$refs.container.getBoundingClientRect().width / 2;
      });
    },
    handleSrollTo( top, left) {
      this.nowScale = this.minScale = 1;
      this.$nextTick(() => {
        console.log(top * this.nowScale * 40);
        this.$refs.container.scrollTop =
          top * this.nowScale * 40 -
          this.$refs.container.getBoundingClientRect().height / 2;
        this.$refs.container.scrollLeft =
          left * this.nowScale * 40 -
          this.$refs.container.getBoundingClientRect().width / 2;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.seatContainer::-webkit-scrollbar {
  display: none;
}
.seatContainer {
  height: 80vh;
  overflow: auto;
  .seatBox {
    position: relative;
    background-color: red;
    .seatItem {
      position: absolute;
      background-color: rebeccapurple;
    }
  }
}</style
>>
