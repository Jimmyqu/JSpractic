<template>
  <div class="input-group">
    <input type="text" v-on:keyup.enter="addItem" v-model="newItem" placeholder="add shopping list item" class="form-control">
    <span class="input-group-btn">
      <button v-on:click="addItem" class="btn btn-default" type="button">Add!</button>
    </span>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        newItem: ''
      }
    },
    methods: {
      addItem () {  //定义触发函数
        let text;
        text = this.newItem.trim()
        if (text) {
          this.$emit('add', this.newItem)  //自定义事件add 并传递数据
          this.newItem = ''
        }
      }
    }
  }
</script>

<style scoped>
</style>
