<template>
  <div class="home-container">
    <div class="title">小游戏集合</div>
    <div class="menu-wrap">
      <!-- <a href="/snake" class="menu-item">贪吃蛇</a>
      <a href="/eliminate" class="menu-item">消消乐</a>
      <a href="/pop-block" class="menu-item">消灭方块</a>
      <a href="/drag-block" class="menu-item">拖动方块</a>
      <a href="/draw" class="menu-item">画板</a> -->
      <a href="index.html#/snake" class="menu-item">贪吃蛇</a>
      <a href="index.html#/eliminate" class="menu-item">消消乐</a>
      <a href="index.html#/pop-block" class="menu-item">消灭方块</a>
      <a href="index.html#/drag-block" class="menu-item">拖动方块</a>
      <a href="index.html#/draw" class="menu-item">画板</a>
    </div>
    <div class="abort-us">
      <!-- <a href="/abort-us">关于作品</a> -->
      <a href="index.html#/abort-us">关于作品</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
    }
  }
}
</script>

<style scoped>
.home-container{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528104173978&di=6b0ea00e6e08c88f6c7404aeb69d41c9&imgtype=0&src=http%3A%2F%2Fpic3.16pic.com%2F00%2F07%2F65%2F16pic_765494_b.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.abort-us {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
}

.abort-us a {
  text-decoration-line: none;
  color: #888;
}

.title {
  text-align: center;
  font-size: 28px;
  margin: 75px 0;
  color: #fff;
}

.menu-wrap {
  width: 60%;
  margin: auto;
}

.menu-item {
  display: block;
  text-decoration-line: none;
  border-radius: 25px;
  background-color: #7777d8;
  height: 40px;
  line-height: 40px;
  margin-bottom: 15px;
  text-align: center;
  color: #fff;
  box-shadow: #999 0 0 6px 0px;
}
</style>
