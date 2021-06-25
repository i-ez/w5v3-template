<template>
  <div>
    <h1>webpack5+Vue3</h1>
    <p>{{name}}</p>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  setup() {
    const name = ref("解析Vue文件");

    return {
      name,
    };
  },
});
</script>
