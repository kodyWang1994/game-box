<template>
  <div class="color-container">
    <div class="size-wrap">
      <div>选择密度</div>
      <div @click="selectSize(size * 10)" :class="'size-' + size" v-for="size in 5" :key="size">{{size * 10}}</div>
    </div>

    <div class="step-wrap">
      <div>当前关卡</div>
      <div class="step">{{blockCount / 10}}</div>
      <div>剩余步数</div>
      <div class="step">{{step}}</div>
    </div>

    <div class="game-panel">
      <div v-for="(index, col) in (blockCount * blockCount)" :key="col" :style="'width: ' + blockSize + '; height: ' + blockSize + ';'">
        <div class="col-item" :class="blockColors[index]"></div>
      </div>
    </div>
    <div class="color-btn-wrap">
      <div v-for="color in colors" :key="color" class="color-btn" :class="color" @click="clearBlock(color)"></div>
    </div>

    <div class="rule-wrap">
      <div>游戏规则：</div>
      <div>点击下方色块，以左上角为原点，逐步吞噬相邻颜色，直到所有颜色统一</div>
    </div>

    <div v-show="isSuccess" class="success-panel">
      <div class="success-text">闯关成功</div>
      <span @click="nextPass" class="next-pass">下一关</span>
    </div>

    <div v-show="isOver" class="over-panel">
      <div class="over-text">游戏结束</div>
      <span @click="init" class="restart">重新开始</span>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  data () {
    return {
      isOver: false,
      isSuccess: false,
      step: 0,
      blockCount: 10,
      colors: ['red', 'yellow', 'blue', 'green'],
      blockColors: {}
    }
  },
  created () {
    this.init()
  },
  computed: {
    blockSize () {
      return (1 / this.blockCount) * 100 + '%'
    }
  },
  methods: {
    clearBlock (color) {
      if (color === this.blockColors[1]) {
        return
      }
      this.step = this.step - 1
      this.selectedColor = color
      console.log(Date.now())
      this.getNeedCleanBlock(1)
      this.changeSelectColor()
    },
    changeSelectColor () {
      var blockColors = Object.assign({}, this.blockColors)
      for (const key of this.needCleanBlock) {
        blockColors[key] = this.selectedColor
      }
      this.blockColors = blockColors

      this.checkGameStatus()
    },
    getNeedCleanBlock (index) {
      this.needCleanBlock = [index]
      let blockStark = [index]
      do {
        let surroundBlocks = this.getSurroundBlock(blockStark.pop())
        for (let blockIndex of surroundBlocks) {
          if (_.indexOf(this.needCleanBlock, blockIndex) === -1) {
            this.needCleanBlock.push(blockIndex)
            blockStark.push(blockIndex)
          }
        }
      } while (blockStark.length > 0)
      console.log('finished', this.needCleanBlock, Date.now())
    },
    getSurroundBlock (index) {
      let color = this.blockColors[index]
      let surroundBlock = []
      if (index % this.blockCount !== 0 && _.indexOf(this.needCleanBlock, index + 1) === -1 && color === this.blockColors[index + 1]) {
        surroundBlock.push(index + 1)
      }
      if (index % this.blockCount !== 1 && _.indexOf(this.needCleanBlock, index - 1) === -1 && color === this.blockColors[index - 1]) {
        surroundBlock.push(index - 1)
      }
      if (_.indexOf(this.needCleanBlock, index + this.blockCount) === -1 && color === this.blockColors[index + this.blockCount]) {
        surroundBlock.push(index + this.blockCount)
      }
      if (_.indexOf(this.needCleanBlock, index - this.blockCount) === -1 && color === this.blockColors[index - this.blockCount]) {
        surroundBlock.push(index - this.blockCount)
      }
      return surroundBlock
    },
    selectSize (size) {
      this.blockCount = size
      this.init()
    },
    checkGameStatus () {
      let colors = _.groupBy(this.blockColors)
      if (_.size(colors) === 1) {
        this.isSuccess = true
        return
      }
      if (this.step <= 0) {
        this.isOver = true
      }
    },
    nextPass () {
      this.selectSize(this.blockCount + 10)
    },
    init () {
      this.isOver = false
      this.isSuccess = false
      this.step = this.blockCount * 1.2
      for (let w = 1; w <= this.blockCount * this.blockCount; w++) {
        this.blockColors[w] = _.sample(this.colors)
      }
    }
  }
}
</script>

<style scoped>
.color-container {
  margin: auto;
  max-width: 380px;
}

.size-wrap {
  padding: 15px 15px 0;
  display: flex;
  justify-content: space-around;
  color: #333;
  font-weight: 600;
}

.size-wrap .size-1 {
  color: #eee;
}

.size-wrap .size-2 {
  color: #ddd;
}

.size-wrap .size-3 {
  color: #ccc;
}

.size-wrap .size-4 {
  color: #bbb;
}

.size-wrap .size-5 {
  color: #aaa;
}

.step-wrap {
  padding-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  justify-content: center;
}

.step-wrap .step {
  margin: 0 10px;
  font-weight: 600;
  color: #555;
}

.game-panel {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 20px auto;
  position: relative;
  width: 90vw;
  height: 90vw;
  max-width: 380px;
  max-height: 380px;
  overflow: hidden;
}

.col-item {
  width: 100%;
  height: 100%;
  display: inline-block;
}

.red {
  background-color: #FFC1C1;
}

.yellow {
  background-color: #EEEE00;
}

.blue {
  background-color: #1E90FF;
}

.green {
  background-color: #66CD00;
}

.color-btn-wrap {
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.color-btn {
  border-radius: 10px;
  width: 10vw;
  height: 20vw;
  max-width: 80px;
  max-height: 120px;
}

.rule-wrap {
  padding: 15px;
  color: #ccc;
  font-size: 15px;
}

.over-panel {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.2);
}

.over-text {
  font-size: 18px;
  color: #4B0082;
  margin-top: 150px;
  font-weight: bold;
  animation: trans-animation 2s linear .1s infinite alternate;
}

.restart {
  margin-top: 30px;
  padding: 10px 15px;
  background-color: #B0E2FF;
  border-radius: 15px;
  display: inline-block;
  color: #fff;
}

.success-panel {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.2);
}

.success-text {
  font-size: 18px;
  color: #333;
  margin-top: 150px;
  font-weight: bold;
  animation: trans-animation 2s linear .1s infinite alternate;
}

.next-pass {
  margin-top: 30px;
  padding: 10px 15px;
  background-color: #BCEE68;
  border-radius: 15px;
  display: inline-block;
  color: #fff;
}

@keyframes trans-animation {
  from {transform: scale(0.9)}
  to {transform: scale(1.3)}
}
</style>
