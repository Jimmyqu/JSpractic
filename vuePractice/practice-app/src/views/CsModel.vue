<template>
  <div>
    <template v-show='isShow'>
      <child v-model="msg" :other="other"></child>
      <button @click="handleChang">father chang props</button>
    </template>
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
      isShow:false,
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
