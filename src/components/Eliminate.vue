<template>
  <div class="container">
    <div class="game-panel">
      <div v-for="(row, i) in gamePanel" :key="row + i" class="row">
        <div v-for="(col, index) in row" :key="'col' + index" class="col" :class="blockColors[i + 1 + '' + col]" @click="cleanBlock(i + 1 + '' + col)">
        </div>
      </div>
    </div>
    <div class="game-panel" style="margin-top: 10px;line-height: 1.6;">
      <div>得分： {{ source }}</div>
      <div class="rule-text">
        点击三个以上连续的同色方块即可消除方块
      </div>
      <div class="rule-text">
        Design By Kody & Vivien
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  name: 'eliminate',
  data () {
    return {
      gamePanel: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
      blockColors: {},
      colors: ['red', 'yellow', 'blue', 'green'],
      source: 0
    }
  },
  created () {
    this.init()
  },
  methods: {
    cleanBlock (index) {
      let color = this.blockColors[index]
      if (_.indexOf(this.colors, color) === -1) {
        return
      }
      this.getNeedCleanBlock(parseInt(index), [parseInt(index)])
      setTimeout(() => {
        if (this.needCleanBlock.length >= 3) {
          this.cleaning(this.needCleanBlock)
          let audio = new Audio()
          audio.src = 'http://data.huiyi8.com/2017/gha/03/17/1702.mp3'
          audio.play()
          this.source += this.needCleanBlock.length
        }
      }, 300)
    },
    cleaning (needCleanBlock) {
      var blockColors = Object.assign({}, this.blockColors)
      for (const key of needCleanBlock) {
        blockColors[key] = 'cleared'
      }
      this.blockColors = blockColors
      this.blockDown(needCleanBlock)
    },
    blockDown (needCleanBlock) {
      for (const key of needCleanBlock) {
        delete this.blockColors[key]
      }
      var colBlock = _.groupBy(needCleanBlock, num => {
        return num % 10
      })
      for (const col in colBlock) {
        var colCleanValue = colBlock[col]
        let colMax = _.max(colCleanValue)
        var colValue = []
        for (let i = colMax; i > 10; i -= 10) {
          colValue.push(i)
        }
        var needDownBlocks = _.difference(colValue, colCleanValue)
        for (const index in colValue) {
          if (!_.isEmpty(needDownBlocks)) {
            this.blockColors[colValue[index]] = this.blockColors[needDownBlocks.shift()]
          } else {
            this.fullBlock(colValue[index])
          }
        }
      }
    },
    fullBlock (index) {
      this.blockColors[index] = _.sample(this.colors)
    },
    getNeedCleanBlock (index, needCleanBlock) {
      let color = this.blockColors[index]
      let hasNeedClearBlock = false
      if (_.indexOf(needCleanBlock, index + 1) === -1 && color === this.blockColors[index + 1]) {
        hasNeedClearBlock = true
        needCleanBlock.push(index + 1)
        setTimeout(() => {
          this.getNeedCleanBlock(index + 1, needCleanBlock)
        }, 0)
      }
      if (_.indexOf(needCleanBlock, index - 1) === -1 && color === this.blockColors[index - 1]) {
        hasNeedClearBlock = true
        needCleanBlock.push(index - 1)
        setTimeout(() => {
          this.getNeedCleanBlock(index - 1, needCleanBlock)
        }, 0)
      }
      if (_.indexOf(needCleanBlock, index + 10) === -1 && color === this.blockColors[index + 10]) {
        hasNeedClearBlock = true
        needCleanBlock.push(index + 10)
        setTimeout(() => {
          this.getNeedCleanBlock(index + 10, needCleanBlock)
        }, 0)
      }
      if (_.indexOf(needCleanBlock, index - 10) === -1 && color === this.blockColors[index - 10]) {
        hasNeedClearBlock = true
        needCleanBlock.push(index - 10)
        setTimeout(() => {
          this.getNeedCleanBlock(index - 10, needCleanBlock)
        }, 0)
      }
      if (!hasNeedClearBlock) {
        this.needCleanBlock = needCleanBlock
        return needCleanBlock
      }
    },
    init () {
      for (const rowInx in this.gamePanel) {
        for (const col in _.range(this.gamePanel[rowInx])) {
          let index = (parseInt(rowInx) + 1) + '' + (parseInt(col) + 1)
          this.blockColors[index] = _.sample(this.colors)
        }
      }
    }
  }
}
</script>

<style scoped>
.game-panel {
  margin: auto;
  max-width: 380px;
}

.row {
  display: flex;
}

.col {
  width: 40px;
  height: 40px;
  border: 1px solid #fff;
  animation: blockClean 1s;
  background-position: center;
  background-size: cover;
  transition-duration: .3s;
}

.cleared {
  background: #ccc;
  animation: blockClean 1s;
}

.red {
  background-image: url('http://odotehbgw.bkt.clouddn.com/bear.jpg');
}

.yellow {
  background-image: url('http://odotehbgw.bkt.clouddn.com/cat.jpg');
}

.blue {
  background-image: url('http://odotehbgw.bkt.clouddn.com/chicken.jpg');
}

.green {
  background-image: url('http://odotehbgw.bkt.clouddn.com/snake.jpg');
}

.rule-text  {
  color: #aaa;
  text-align: center;
}

@keyframes blockClean {
  from {background: #ccc;}
  to {background: #fff;}
}
</style>
