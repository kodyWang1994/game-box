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
      <div @click="gotoChineseChess" class="menu-item">中国象棋</div>
      <a href="index.html#/spider-card" class="menu-item">蜘蛛卡牌</a>
      <a href="index.html#/pop-block" class="menu-item">消灭方块</a>
      <a href="index.html#/drag-block" class="menu-item">拖动方块</a>
      <a href="index.html#/color" class="menu-item">烧脑颜色</a>
      <a href="index.html#/picture" class="menu-item">拼图</a>
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
  },
  methods: {
    gotoChineseChess () {
      window.location.href = 'https://kodywang1994.github.io/chinese-chess/dist/index.html'
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
  color: #fff;
  text-shadow: #7777d8 2px 2px 10px;
}

.title {
  text-align: center;
  font-size: 28px;
  margin: 75px 0;
  color: #fff;
  text-shadow: #333 4px 4px 4px;
}

.menu-wrap {
  width: 80%;
  margin: auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-around;
}

.menu-item {
  width: 35%;
  display: block;
  text-decoration-line: none;
  border-radius: 5px;
  background-color: #7777d8;
  height: 50px;
  line-height: 50px;
  margin-bottom: 25px;
  text-align: center;
  color: #fff;
  box-shadow: #333 1px 6px 10px 1px;
  font-size: 14px;
}
</style>
