<template>
  <div class="loadcontent" ref="content">
    <div
      :style="style"
      @touchstart="touchStart($event)"
      @touchmove="touchMove($event)"
      @touchend="touchEnd($event)"
    >
      <!-- <div class="top" v-show="isRefreshing&&ispullOrdarg">
        松开重新加载数据
      </div> -->
      <slot></slot>
      <div v-show="isLoadmoreing && ispullOrdarg && !isfinished" class="bottom">
        松开加载更多数据
      </div>
      <div v-show="isLoading">加载中</div>
      <div v-show="isfinished">没有更多了</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    distance: {
      type: String,
      default: "100",
    },
    Refresh: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      reslist: [],
      style: {},
      isRefreshing: false,
      isLoadmoreing: false,
      isfinished: false,
      touchstart: "touchstart",
      touchmove: "touchmove",
      touchend: "touchend",
      startPageY: 0,
      offsetTop: 0,
      isBottom: false,
      isTop: false,
      ispullOrdarg: false,
      isLoading: false,
    };
  },
  computed: {},
  methods: {
    deviationElement(distance, isAnimation) {
      this.style = (isAnimation && {
        transform: `translate3d(0, ${distance}px, 0)`,
        transition: "transform .3s ease",
      }) || {
        transform: `translate3d(0, ${distance}px, 0)`,
      };
    },
    handleRefresh() {
      console.log("下拉刷新动作");
    },
    handleLoadMore() {
      console.log("上拉加载动作");
      if (this.reslist.length < 30) {
        this.isLoading = true;
        setTimeout(() => {
          this.reslist = [...this.reslist, ...[1, 2, 3, 4, 5]];
          this.$emit("update:list", this.reslist);
          this.isLoading = false;
          this.$nextTick(() => {
            this.contentDom.scrollTop = this.contentDom.scrollHeight;
          });
        }, 1000);
      } else {
        this.isfinished = true;
        this.$nextTick(() => {
        this.contentDom.scrollTop = this.contentDom.scrollHeight;
      });
      }

    },
    touchStart(e) {
      this.isBottom= Math.round(this.contentDom.scrollTop) + this.contentDom.offsetHeight === this.contentDom.scrollHeight
      if(!this.isBottom) return
      const target = this.$refs.content;

        this.startPageY = e.changedTouches[0].pageY; //从手指触到屏幕时的Y坐标的赋值
        this.ispullOrdarg = true;
      
    },
    touchMove(e) {
      if(!this.isBottom || this.isfinished) return
      this.offsetTop = e.changedTouches[0].pageY - this.startPageY;
      if (this.isBottom && Math.abs(this.offsetTop) < this.distance) {
        this.deviationElement(this.offsetTop, false);
      } else {
        this.isLoadmoreing = true;
      }
    },
    touchEnd(e) {
      if(!this.isBottom) return
      //是否大于下拉的距离的触发点
      const target = this.$refs.content;
      if (
        this.isBottom &&
        this.offsetTop < 0 &&
        Math.abs(this.offsetTop) >= this.distance
      ) {
        !this.isfinished&&this.handleLoadMore();
      }
      if (!this.isfinished&&this.isBottom) {
        this.$nextTick(() => {
          this.contentDom.scrollTop = this.contentDom.scrollHeight;
        });
      }

      this.isLoadmoreing = false;
      this.ispullOrdarg = false;
      this.deviationElement(0, true);
    },

  },
  mounted() {
    //获取容器
    this.contentDom = this.$refs.content;
    setTimeout(() => {
      for (let i = 0; i < 20; i++) {
        this.reslist = [...this.reslist, i];
        this.$emit("update:list", this.reslist);
      }
    }, 1000);
  },
  destroyed() {
  },
};
</script>

<style lang="less">
.loadcontent {
  height: 100%;
  overflow: scroll;
  position: relative;
  .top {
    position: absolute;
    top: -50px;
  }
  .bottom {
    position: absolute;
    bottom: -50px;
  }
}
</style>
