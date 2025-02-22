<template>
  <div>
    <p>
      <input v-model="path" placeholder="请输入 TNotesDir 路径" />
    </p>
    <p>
      <button @click="savePath">确定</button>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const path = ref(localStorage.getItem('TNotesDir') || '');

const savePath = () => {
  localStorage.setItem('TNotesDir', path.value);
  alert(`\n${path.value}\n\nTNotesDir 路径已保存!`);
};
</script>

<style scoped>
input {
  padding: 8px;
  margin-right: 10px;
  width: 15rem;
}

button {
  padding: 8px 12px;
  cursor: pointer;
}
</style>
