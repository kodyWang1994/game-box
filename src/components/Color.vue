<template>
  <div class="color-container">
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
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  data () {
    return {
      blockCount: 20,
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
      this.selectedColor = color
      console.log(Date.now())
      this.getNeedCleanBlock(1, [1], this.changeSelectColor)
    },
    changeSelectColor () {
      var blockColors = Object.assign({}, this.blockColors)
      for (const key of this.needCleanBlock) {
        blockColors[key] = this.selectedColor
      }
      this.blockColors = blockColors
    },
    getNeedCleanBlock (index, needCleanBlock, callback) {
      let color = this.blockColors[index]
      let hasNeedClearBlock = false
      if (index % this.blockCount !== 0 && _.indexOf(needCleanBlock, index + 1) === -1 && color === this.blockColors[index + 1]) {
        hasNeedClearBlock = true
        needCleanBlock.push(index + 1)
        this.getNeedCleanBlock(index + 1, needCleanBlock, callback)
      }
      if (index % this.blockCount !== 1 && _.indexOf(needCleanBlock, index - 1) === -1 && color === this.blockColors[index - 1]) {
        hasNeedClearBlock = true
        needCleanBlock.push(index - 1)
        this.getNeedCleanBlock(index - 1, needCleanBlock, callback)
      }
      if (_.indexOf(needCleanBlock, index + this.blockCount) === -1 && color === this.blockColors[index + this.blockCount]) {
        hasNeedClearBlock = true
        needCleanBlock.push(index + this.blockCount)
        this.getNeedCleanBlock(index + this.blockCount, needCleanBlock, callback)
      }
      if (_.indexOf(needCleanBlock, index - this.blockCount) === -1 && color === this.blockColors[index - this.blockCount]) {
        hasNeedClearBlock = true
        needCleanBlock.push(index - this.blockCount)
        this.getNeedCleanBlock(index - this.blockCount, needCleanBlock, callback)
      }
      if (!hasNeedClearBlock) {
        this.needCleanBlock = needCleanBlock
        console.log('finished', needCleanBlock, Date.now())
        callback()
      }
    },
    init () {
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
  background-color: red;
}

.yellow {
  background-color: yellow;
}

.blue {
  background-color: blue;
}

.green {
  background-color: green;
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
</style>
