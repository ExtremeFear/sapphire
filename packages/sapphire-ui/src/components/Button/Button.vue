<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  foo: String
})
const text = ref(0)

</script>

<template>
  <div @click="increment">sssss {{ text }}</div>
</template>

<style lang="css" scoped>
button {
  cursor: pointer;
  line-height: 1.2;
}
</style>
