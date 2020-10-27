<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="handleAdd">++++</button>
  </div>
</template>

<script>
   import { ref } from 'vue'
export default {
  setup() {
    const message = ref('Hello 3.0!');

    const handleAdd = ()=>{
      message.value +='1' 
    }
    return {
        message,
        handleAdd
    }
  }
};
</script>
