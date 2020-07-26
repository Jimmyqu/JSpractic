
<template>
  <div class="about">
    <div class="container">
      <div
        :class="['awards'+item.id,item.id===currentIndex?'active':'']"
        v-for="item in awards"
        :key="item.id"
      >{{item.name}}</div>
      <div class="start" @click="handleStart">开始</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "casino",
  data() {
    return {
      awards: [
        // 奖品数组
        { id: 1, name: "空" },
        { id: 2, name: "眼镜" },
        { id: 3, name: "包" },
        { id: 4, name: "笨驴" },
        { id: 5, name: "书" },
        { id: 6, name: "美女" },
        { id: 7, name: "手链" },
        { id: 8, name: "iphone" }
      ],
      isRunning: false,
      currentIndex: 1,
      pos: null,
      diff: 100,
      speed: 100,
      timer: null
    };
  },
  methods: {
    handleStart() {
      if (this.isRunning) {
        return;
      }

      this.move();
      setTimeout(() => {
        this.pos = 1;
      }, 4000);
    },
    move() {
      this.isRunning = true;
      this.timer = setTimeout(() => {
        this.currentIndex > 7 ? (this.currentIndex = 1) : this.currentIndex++;
        console.log(this.speed)
        if (this.pos) {
          this.speed += this.diff;
          if (this.speed > 1000 && this.currentIndex == this.pos) {
            console.log("stop");
            this.isRunning = false;
            this.speed = 100;
            this.pos =null
            clearTimeout(this.timer);
          } else {
            this.move();
          }
        } else {
          this.speed -= 0.5;
          this.move();
        }
      }, this.speed);
    }
  }
};
</script>

<style lang="less" scoped>
.active {
  background-color: rosybrown;
}

.container {
  position: relative;
  width: 300px;
  height: 300px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rebeccapurple;
  & > div {
    position: absolute;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
  }

  .start {
    top: 100px;
    left: 100px;
  }
  .awards1 {
    top: 0;
    left: 0;
  }
  .awards2 {
    top: 0;
    left: 100px;
  }
  .awards3 {
    top: 0;
    left: 200px;
  }
  .awards4 {
    top: 100px;
    left: 200px;
  }
  .awards5 {
    top: 200px;
    left: 200px;
  }
  .awards6 {
    top: 200px;
    left: 100px;
  }
  .awards7 {
    top: 200px;
    left: 0;
  }
  .awards8 {
    top: 100px;
    left: 0;
  }
}
</style>>


