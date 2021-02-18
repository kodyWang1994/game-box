<template>
  <div class="container">
    <canvas id="myCanvas" @click="click"></canvas>
    <div class="game-panel">
      <div>第{{ step }}关</div>
      <div>目标分数： {{targetSource}}</div>
      <div>当前分数： {{currentSource}}</div>
      <div class="tip font-20 padding-top-6" v-if="showTip">消除{{clearCount}}个，获得{{source}}分</div>
    </div>

    <div class="mask" v-show="showStepOverTip">
      <div class="white font-22">剩余{{lessCount}}个，奖励{{stepOverSource}}分</div>
    </div>

    <div v-if="over" class="game-over">
      <div class="over-text">游戏结束</div>
      <div class="restart" @click="restartGame">重新开始</div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  name: 'popBlock',
  data () {
    return {
      x: 20,
      y: 120,
      blockColors: {},
      colors: ['#FFC1C1', '#EEEE00', '#1E90FF', '#66CD00'],
      currentSource: 0,
      targetSource: 1500,
      step: 1,
      showTip: false,
      clearCount: 0,
      source: 0,
      showStepOverTip: false,
      lessCount: 0,
      stepOverSource: 0,
      over: false
    }
  },
  mounted () {
    console.warn('Design by Kody Wang, Thank you, play my game!')
    let width = window.innerWidth
    let height = window.innerHeight
    this.x = (width - 320) / 2
    this.y = (height - 320) / 2
    this.canvas = document.getElementById('myCanvas')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = width
    this.canvas.height = height
    this.ctx.fillStyle = '#FFF8DC'
    this.ctx.fillRect(0, 0, width, height)
    this.init()
  },
  methods: {
    click (e) {
      if (this.clearing) {
        return
      }
      let x = parseInt((e.clientX - this.x) / 32)
      let y = parseInt(parseInt((e.clientY - this.y) / 32))
      if (x < 0 || x > 9 || y < 0 || y > 9) {
        return
      }
      let index = parseInt(y + '' + x)
      if (_.has(this.blockColors, index)) {
        this.getNeedCleanBlock(index, [index])
        if (this.needCleanBlock.length >= 2) {
          let audio = new Audio()
          audio.src = 'http://data.huiyi8.com/2017/gha/03/17/1702.mp3'
          audio.play()
          this.clean(this.needCleanBlock)
        }
      }
    },
    clean (needCleanBlock) {
      for (const key of needCleanBlock) {
        this.ctx.clearRect(this.x + (parseInt(key % 10) * 32), this.y + (parseInt(key / 10) * 32), 30, 30)
        delete this.blockColors[key]
      }
      this.addSource(needCleanBlock)
      this.clearing = true
      setTimeout(() => {
        this.blockDown(needCleanBlock)
        window.requestAnimationFrame(this.draw)
        this.clearing = false
      }, 300)
    },
    draw () {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      this.ctx.fillStyle = '#FFF8DC'
      this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      this.ctx.strokeStyle = '#ccc'
      this.ctx.rect(this.x, this.y, 320, 320)
      this.ctx.stroke()

      for (const i in _.range(10)) {
        for (const j in _.range(10)) {
          let index = parseInt(i + j)
          if (_.has(this.blockColors, index)) {
            this.ctx.fillStyle = this.blockColors[index]
            // this.blockColors[index] = this.ctx.fillStyle
            this.ctx.fillRect(this.x + (j * 32), this.y + (i * 32), 30, 30)
          }
        }
      }
    },
    addSource (needCleanBlock) {
      let num = needCleanBlock.length
      this.source = num * num * 5
      this.clearCount = num
      this.showTip = true
      this.currentSource += this.source
    },
    blockDown (needCleanBlock) {
      let colBlock = _.groupBy(needCleanBlock, num => {
        return num % 10
      })
      for (const col in colBlock) {
        let colCleanValue = colBlock[col]
        let colMax = _.max(colCleanValue)
        let colValue = []
        for (let i = colMax; i >= 0; i -= 10) {
          colValue.push(i)
        }
        let needDownBlocks = _.difference(colValue, colCleanValue)
        for (const index of colValue) {
          if (!_.isEmpty(needDownBlocks)) {
            let needDownIndex = needDownBlocks.shift()
            if (_.has(this.blockColors, needDownIndex)) {
              let color = this.blockColors[needDownIndex]
              this.blockColors[index] = color
              this.ctx.fillStyle = color
              this.ctx.fillRect(this.x + (parseInt(index % 10) * 32), this.y + (parseInt(index / 10) * 32), 30, 30)
            } else {
              this.ctx.clearRect(this.x + (parseInt(index % 10) * 32), this.y + (parseInt(index / 10) * 32), 30, 30)
              delete this.blockColors[index]
            }
          } else {
            this.ctx.clearRect(this.x + (parseInt(index % 10) * 32), this.y + (parseInt(index / 10) * 32), 30, 30)
            delete this.blockColors[index]
          }
        }
      }
      this.leftMove()
    },
    leftMove () {
      let colBlock = _.groupBy(this.blockColors, (color, index) => {
        return index % 10
      })
      if (_.size(colBlock) < 10) {
        let leftMoveCols = []
        for (let i of _.range(10)) {
          if (!_.has(colBlock, i)) {
            leftMoveCols.push(i)
          }
        }
        leftMoveCols = _.sortBy(leftMoveCols, num => {
          return -num
        })
        for (let index of leftMoveCols) {
          for (let col = index + 1; col <= 9; col++) {
            for (let colIndex of _.range(col, 100, 10)) {
              if (_.has(this.blockColors, colIndex)) {
                let color = this.blockColors[colIndex]
                let lastIndex = colIndex - 1
                this.blockColors[lastIndex] = color
                this.ctx.fillStyle = color
                this.ctx.fillRect(this.x + (parseInt(lastIndex % 10) * 32), this.y + (parseInt(lastIndex / 10) * 32), 30, 30)
                this.ctx.clearRect(this.x + (parseInt(colIndex % 10) * 32), this.y + (parseInt(colIndex / 10) * 32), 30, 30)
                delete this.blockColors[colIndex]
              }
            }
          }
        }
      }
      this.checkIsCanClear()
    },
    checkIsCanClear () {
      for (const key in this.blockColors) {
        if (this.hasNearbyBlock(key)) {
          return
        }
      }
      this.gameOver()
    },
    hasNearbyBlock (index) {
      let color = this.blockColors[index]
      let hasNearby = false
      if (parseInt((index + 1) / 10) === parseInt(index / 10) && color === this.blockColors[index + 1]) {
        hasNearby = true
      }
      if (parseInt((index - 1) / 10) === parseInt(index / 10) && color === this.blockColors[index - 1]) {
        hasNearby = true
      }
      if (color === this.blockColors[index + 10]) {
        hasNearby = true
      }
      if (color === this.blockColors[index - 10]) {
        hasNearby = true
      }
      return hasNearby
    },
    getNeedCleanBlock (index, needCleanBlock) {
      let color = this.blockColors[index]
      let hasNeedClearBlock = false
      if (parseInt((index + 1) / 10) === parseInt(index / 10) && _.indexOf(needCleanBlock, index + 1) === -1 && color === this.blockColors[index + 1]) {
        hasNeedClearBlock = true
        needCleanBlock.push(index + 1)
        this.getNeedCleanBlock(index + 1, needCleanBlock)
      }
      if (parseInt((index - 1) / 10) === parseInt(index / 10) && _.indexOf(needCleanBlock, index - 1) === -1 && color === this.blockColors[index - 1]) {
        hasNeedClearBlock = true
        needCleanBlock.push(index - 1)
        this.getNeedCleanBlock(index - 1, needCleanBlock)
      }
      if (_.indexOf(needCleanBlock, index + 10) === -1 && color === this.blockColors[index + 10]) {
        hasNeedClearBlock = true
        needCleanBlock.push(index + 10)
        this.getNeedCleanBlock(index + 10, needCleanBlock)
      }
      if (_.indexOf(needCleanBlock, index - 10) === -1 && color === this.blockColors[index - 10]) {
        hasNeedClearBlock = true
        needCleanBlock.push(index - 10)
        this.getNeedCleanBlock(index - 10, needCleanBlock)
      }
      if (!hasNeedClearBlock) {
        this.needCleanBlock = needCleanBlock
        return needCleanBlock
      }
    },
    startGame () {
      this.ctx.strokeStyle = '#ccc'
      this.ctx.rect(this.x, this.y, 320, 320)

      for (const i in _.range(10)) {
        for (const j in _.range(10)) {
          let index = parseInt(i + j)
          this.ctx.fillStyle = _.sample(this.colors)
          this.blockColors[index] = this.ctx.fillStyle
          this.ctx.fillRect(this.x + (j * 32), this.y + (i * 32), 30, 30)
        }
      }
      this.ctx.stroke()
      this.ctx.beginPath()
    },
    restartGame () {
      this.currentSource = 0
      this.step = 1
      this.targetSource = 1500
      this.showStepOverTip = false
      this.over = false
      this.startGame()
    },
    gameOver () {
      this.lessCount = _.size(this.blockColors)
      this.stepOverSource = this.lessCount > 10 ? 0 : (10 - this.lessCount) * 100
      this.showStepOverTip = true
      this.currentSource += this.stepOverSource
      if (this.currentSource < this.targetSource) {
        this.over = true
      } else {
        this.step += 1
        this.targetSource = 1500 + (this.step - 1) * 3000
        setTimeout(() => {
          this.showStepOverTip = false
          this.startGame()
        }, 2000)
      }
    },
    init () {
      this.startGame()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  overflow: hidden;
}

.mask,
.game-over {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  background-color: rgba(0, 0, 0, .5);
}

.mask {
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
}

.tip {
  color: tomato;
}

.white {
  color: #fff;
}

.font-20 {
  font-size: 20px;
}

.font-22 {
  font-size: 22px;
}

.padding-top-6 {
  padding-top: 6px;
}

.over-text {
  margin-top: 150px;
  font-weight: bold;
  animation: over-animation 2s linear .1s infinite alternate;
}

.restart {
  margin-top: 30px;
  padding: 10px 15px;
  background-color: tomato;
  border-radius: 15px;
  display: inline-block;
  color: #fff;
}

@keyframes over-animation {
  from {font-size: 15px;}
  to {font-size: 25px;}
}
</style>
