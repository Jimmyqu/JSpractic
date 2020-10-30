<template>
  <div class="container">
    <div class="thumbBox" :style="{
        transform: 'scale(' + seatScale + ')',
        height: thumbnailBoxHeight + 'vw',
        width: thumbnailBoxWidth + 'vw',
      }">
      <template v-for="seatItem in seatList">
        <div
          class="thumbnailSeatClass"
          :key="'thumbnail' + seatItem.id"
          :style="{
            height: thumbnailHeight + 'vw',
            width: thumbnailWidth + 'vw',
            background: thumbnailBackgroud(seatItem),
            top: seatItem.gRow * thumbnailPositionDistin + 'vw',
            left: seatItem.gCol * thumbnailPositionDistin + 'vw',
          }"
        ></div>
      </template>
    </div>
    <div
      class="seatBox"
      :style="{
        transform: 'scale(' + seatScale + ')',
        height: seatBoxHeight + 'vw',
        width: seatBoxWidth + 'vw',
        marginLeft: seatBoxCenterMargin + 'vw',
      }"
    >
      <!-- 数字条 -->
      <div
        class="num-bar"
        :style="{
          height: seatBoxHeight - 2 * seatHeight + 'vw',
          width: seatDis + 'vw',
          top: seatDis + 'vw',
        }"
      >
        <div
          v-for="num in seatToolArr"
          :key="num"
          :style="{ height: seatDis + 'vw' }"
        >
          {{ num }}
        </div>
      </div>
      <!--中轴线-->
      <div
        v-show="seatList.length > 0"
        class="middle-line"
        :style="{
          height: seatBoxHeight + 'vw',
          left: -seatBoxCenterMargin + 'vw',
        }"
      />
      <template v-for="(seatItem, index) in seatList">
        <div
          class="seatClass"
          @click="clickSeat(index)"
          :key="seatItem.id"
          :style="{
            height: seatHeight + 'vw',
            width: seatWidth + 'vw',
            top: seatItem.gRow * seatDis + 'vw',
            left: seatItem.gCol * seatDis + 'vw',
          }"
        >
          <img
            class="seatImgClass"
            :seatId="seatItem.id"
            :seatIndex="index"
            :src="seatItem.nowIcon"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      seatList: [],
      selectedSeatList: [], // 已选座位
      seatWidth: 5, //单个座位宽度
      seatHeight: 5,
      seatDis: 5, // 间距
      thumbnailWidth: 1.5, // 缩略图每个座位的宽
      thumbnailHeight: 1.5, // 缩略图每个座位的高
      thumbnailPositionDistin:1.8, // 缩略图每个座位偏移距离
    };
  },
  computed: {
     // 缩略图宽
    thumbnailBoxWidth() {
      return ((this.maxX + 2) * this.thumbnailPositionDistin + this.thumbnailWidth)
    },
    // 缩略图高
    thumbnailBoxHeight() {
      return ((this.maxY + 2) * this.thumbnailPositionDistin + this.thumbnailHeight)
    },  
    seatBoxHeight() {
      // +2 是留空2排
      return this.seatHeight * (this.maxY + 2);
    },
    seatBoxWidth() {
      // +2 是留空2排
      return this.seatWidth * (this.maxX + 2);
    },
    // 让影厅居中展示的偏移值
    seatBoxCenterMargin() {
      return -(this.seatBoxWidth * this.seatScale) / 2;
    },
    maxX() {
      // 取最大横坐标（横排座位个数包括空排）
      let i = 0;
      for (let index in this.seatList) {
        if (this.seatList[index].gCol > i) {
          i = this.seatList[index].gCol;
        }
      }
      return i;
    },
    maxY() {
      // 取最大纵坐标（竖排座位个数包括空排）
      let i = 0;
      for (let index in this.seatList) {
        if (this.seatList[index].gRow > i) {
          i = this.seatList[index].gRow;
        }
      }
      return i;
    },
    // 根据影厅的大小缩放比例(需要把影厅全部显示出来)
    seatScale() {
      let seatScale = 1;
      seatScale = 100 / this.seatBoxWidth; //100vw和盒子宽度比
      return seatScale;
    },
    // 座位左边栏的数组
    seatToolArr() {
      let seatToolArr = [];
      let yMax = this.maxY;
      for (let i = 1; i <= yMax; i++) {
        let el = this.seatList.find((item) => item.gRow === i);
        if (el) {
          seatToolArr.push(el.row);
        } else {
          seatToolArr.push("");
        }
      }
      return seatToolArr;
    },
  },
  mounted() {
    this.getSeatList();
  },
  methods: {
    clickSeat(index) {
      if (this.seatList[index].canClick) {
        if (
          this.seatList[index].nowIcon === this.seatList[index].selectedIcon
        ) {
          // 不可选
          this.$set(
            this.seatList[index],
            "nowIcon",
            this.seatList[index].defautIcon
          );
          for (const key in this.selectedSeatList) {
            if (this.selectedSeatList[key].id === this.seatList[index].id) {
              this.selectedSeatList.splice(key, 1);
            }
          }
        } else {
          // 可选
          // 改变这些座位的图标为已选择图标
          this.$set(
            this.seatList[index],
            "nowIcon",
            this.seatList[index].selectedIcon
          ); // 触发不了视图更新？？
          this.selectedSeatList.push(this.seatList[index]);
        }
        this.$forceUpdate();
      }
    },
    // 缩略图背景色
    thumbnailBackgroud(seatItem) {
      if (seatItem.nowIcon === seatItem.selectedIcon) {
        return 'green'
      } else if (seatItem.nowIcon === seatItem.soldedIcon) {
        return 'red'
      } else if (seatItem.nowIcon === seatItem.fixIcon) {
        return 'red'
      } else {
        return 'white'
      }
    },
    async getSeatList() {
      let response = await this.$axios.get("mock.json");
      this.seatList = response.data.seatList;

      this.seatList.forEach((element) => {
        // 获取座位的类型的首字母
        let firstNumber = element.type.substr(0, 1);

        // 加载座位的图标
        for (const item of response.data.seatTypeList) {
          // 加载每个座位的初始图标defautIcon 和 当前图标 nowIcon
          if (element.type === item.type) {
            element.nowIcon = item.icon;
            element.defautIcon = item.icon;
          }
          // 根据首字母找到对应的被选中图标
          if (firstNumber + "-1" === item.type) {
            element.selectedIcon = item.icon;
          }
          // 根据首字母找到对应的被选中图标
          if (firstNumber + "-2" === item.type) {
            element.soldedIcon = item.icon;
          }
          // 根据首字母找到对应的被选中图标
          if (firstNumber + "-3" === item.type) {
            element.fixIcon = item.icon;
          }
        }
        // 如果座位是已经售出 和 维修座位 加入属性canClick 判断座位是否可以点击
        if (
          element.defautIcon === element.soldedIcon ||
          element.defautIcon === element.fixIcon
        ) {
          element.canClick = false;
        } else {
          element.canClick = true;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container{
    position: relative;
    width: 100vw;
}
.thumbBox {
  position: absolute;
  z-index: 3;
  top: 0;
  right: 2.4vw;
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;
  transform-origin:0 0;
  .thumbnailSeatClass{
      position: absolute;
  }
}
.seatBox {
  position: absolute;
  left: 50%;
  transform-origin: 0 0 0;
  margin-top: 30vw;
  .num-bar {
    position: absolute;
    opacity: 0.5;
    background-color: #000;
    border-radius: 10vw;
    div {
      color: #fff;
      text-align: center;
    }
  }
  .middle-line {
    position: absolute;
    border-right: 1px rgba(0, 0, 0, 0.2) dashed;
  }
  .seatClass {
    position: absolute;
  }
  .seatImgClass {
    height: 100%;
  }
}
</style>
