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
      <a href="index.html#/color" class="menu-item">烧脑颜色</a>
      <a href="index.html#/pictire" class="menu-item">拼图</a>
      <a href="index.html#/number-eliminate" class="menu-item">数字消消乐</a>
      <a href="index.html#/draw" class="menu-item">画板</a>
      <a href="index.html#/date" class="menu-item">日历</a>
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://images.pexels.com/photos/18174/reflection-pad-gaming-gamepad.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  overflow: scroll;
}

.abort-us {
  padding: 20px;
  text-align: center;
}

.abort-us a {
  text-decoration-line: none;
  color: #333;
  text-shadow: #7777d8 2px 2px 10px;
}

.title {
  text-align: center;
  font-size: 28px;
  margin: 75px 0;
  color: #fff;
  text-shadow: #7777d8 2px 2px 10px;
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
  box-shadow: #7777d9 0 0 6px 0px;
}
</style>
