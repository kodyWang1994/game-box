<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html{
  /* 禁止浏览器左右滑动行为 */
  touch-action: none;
  touch-action: pan-y;
}
body {
  margin: 0;
}
</style>
