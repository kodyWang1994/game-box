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
      this.$forceUpdate()
      this.$nextTick(() => {
        setTimeout(() => {
          // 将被删除的区块按列分类
          var colBlock = _.groupBy(needCleanBlock, num => {
            return num % 10
          })
          for (const col in colBlock) {
            var colCleanValue = colBlock[col]
            let colMax = _.max(colCleanValue)
            var colValue = [] // 将有变动的列，从大到小全部找出来
            for (let i = colMax; i > 10; i -= 10) {
              colValue.push(i)
            }
            // 找到仍然存在的区块，需要将它们下放到被消除的区块中
            var needDownBlocks = _.difference(colValue, colCleanValue)
            for (const index in colValue) {
              if (!_.isEmpty(needDownBlocks)) {
                this.blockColors[colValue[index]] = this.blockColors[needDownBlocks.shift()]
              } else {
                // 如果消除的是最顶部的方块，则该needDownBlocks数组为空，需要随机方块填充
                this.fullBlock(colValue[index])
              }
            }
          }
          this.$forceUpdate()
        }, 500)
      })
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

.rule-text  {
  color: #aaa;
  text-align: center;
}

@keyframes blockClean {
  from {background: #ccc;}
  to {background: #fff;}
}
</style>
