<template>
  <div>
    <child v-model="msg" :other="other"></child>
    <button @click="handleChang">father chang props</button>
  </div>
</template>

<script>
import Child from "@/components/CsChild";
export default {
  components: {
    Child,
  },
  data() {
    return {
      msg: 123,
      other: "otherProps",
    };
  },
  methods: {
    handleChang() {
      this.msg = "father chang props";
    },
  },
};
</script>

<style></style>
