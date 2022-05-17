<template>
  <div class="color-container">
    <div class="size-wrap">
      <div>选择棋盘大小</div>
      <div @click="selectSize(9)">9</div>
      <div @click="selectSize(16)">16</div>
      <div @click="selectSize(20)">20</div>
    </div>

    <div class="game-panel">
      <div v-for="(index, col) in (blockCount * blockCount)" :key="col" :style="'width: ' + blockSize + '; height: ' + blockSize + ';'">
        <div class="col-item" :class="blockColors[index].isDisplay ? 'white' : ''" @click="clickBlock(index)">
          {{handleMineStatus(index)}}
        </div>
      </div>
    </div>

    <div class="over-panel">
      <div class="over-text" v-if="isOver">很遗憾，失败了～</div>
      <div class="over-text blue" v-else-if="isSuccess">恭喜！成功啦～</div>
      <span @click="init" class="restart">重新开始</span>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  data () {
    return {
      mineTotalCount: 0,
      isOver: false,
      isSuccess: false,
      step: 0,
      blockCount: 9,
      mine: [true, false, false, false, false], // 出现雷的概率，1/5
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
    selectSize (size) {
      this.blockCount = size
      this.init()
    },
    nextPass () {
      this.selectSize(16)
    },
    handleMineStatus (index) {
      if (this.blockColors[index].isDisplay) {
        if (this.blockColors[index].hasMine) {
          return '💣'
        } else if (this.blockColors[index].mineCount) {
          return this.blockColors[index].mineCount
        }
      } else {
        return ''
      }
    },
    handleArountBlockDisplay (index) {
      // 假如不是第一行，检测上方方块
      if (index > this.blockCount && this.blockColors[index - this.blockCount].mineCount >= 0 && !this.blockColors[index - this.blockCount].isDisplay) {
        this.blockColors[index - this.blockCount].isDisplay = true
        this.blockColors[index - this.blockCount].mineCount === 0 && this.handleArountBlockDisplay(index - this.blockCount)
      }
      // 假如不是最后一行，检测下方方块
      if (index <= (this.blockCount * (this.blockCount - 1)) && this.blockColors[index + this.blockCount].mineCount >= 0 && !this.blockColors[index + this.blockCount].isDisplay) {
        this.blockColors[index + this.blockCount].isDisplay = true
        this.blockColors[index + this.blockCount].mineCount === 0 && this.handleArountBlockDisplay(index + this.blockCount)
      }
      // 假如不是最右一行，检测右方方块
      if (index % this.blockCount !== 0 && this.blockColors[index + 1].mineCount >= 0 && !this.blockColors[index + 1].isDisplay) {
        this.blockColors[index + 1].isDisplay = true
        this.blockColors[index + 1].mineCount === 0 && this.handleArountBlockDisplay(index + 1)
      }
      // 假如不是最左一行，检测左方方块
      if (index % this.blockCount !== 1 && this.blockColors[index - 1].mineCount >= 0 && !this.blockColors[index - 1].isDisplay) {
        this.blockColors[index - 1].isDisplay = true
        this.blockColors[index - 1].mineCount === 0 && this.handleArountBlockDisplay(index - 1)
      }
    },
    displayAllMine () {
      for (let index in this.blockColors) {
        this.blockColors[index].hasMine && (this.blockColors[index].isDisplay = true)
      }
    },
    checkSuccess () {
      // 如果未翻开的个数等于炸弹的个数，则表示成功
      const displayGroup = _.groupBy(this.blockColors, 'isDisplay')
      if (displayGroup[false].length === this.mineTotalCount) {
        this.isSuccess = true
      }
    },
    clickBlock (index) {
      if (this.isOver) return
      this.blockColors[index].isDisplay = true
      if (this.blockColors[index].hasMine) {
        this.isOver = true
        this.displayAllMine()
        return
      }
      this.blockColors[index].mineCount === 0 && this.handleArountBlockDisplay(index)
      this.checkSuccess()
    },
    getAroundMineCount (index) {
      if (this.blockColors[index].hasMine) return -1
      let count = 0
      // 假如不是第一行，检测上方方块
      if (index > this.blockCount && this.blockColors[index - this.blockCount].hasMine) {
        count = count + 1
      }
      // 假如不是最后一行，检测下方方块
      if (index <= (this.blockCount * (this.blockCount - 1)) && this.blockColors[index + this.blockCount].hasMine) {
        count = count + 1
      }
      // 假如不是最右一行，检测右方方块
      if (index % this.blockCount !== 0 && this.blockColors[index + 1].hasMine) {
        count = count + 1
      }
      // 假如不是最左一行，检测左方方块
      if (index % this.blockCount !== 1 && this.blockColors[index - 1].hasMine) {
        count = count + 1
      }
      // 假如不是第一行且不是最左行，检测左上方方块
      if (index > this.blockCount && index % this.blockCount !== 1 && this.blockColors[index - this.blockCount - 1].hasMine) {
        count = count + 1
      }
      // 假如不是第一行且不是最右行，检测右上方方块
      if (index > this.blockCount && index % this.blockCount !== 0 && this.blockColors[index - this.blockCount + 1].hasMine) {
        count = count + 1
      }
      // 假如不是最后一行且不是最左行，检测左下方方块
      if (index <= (this.blockCount * (this.blockCount - 1)) && index % this.blockCount !== 1 && this.blockColors[index + this.blockCount - 1].hasMine) {
        count = count + 1
      }
      // 假如不是最后一行且不是最右行，检测右下方方块
      if (index <= (this.blockCount * (this.blockCount - 1)) && index % this.blockCount !== 0 && this.blockColors[index + this.blockCount + 1].hasMine) {
        count = count + 1
      }
      return count
    },
    init () {
      this.isOver = false
      this.isSuccess = false
      this.mineTotalCount = 0
      for (let w = 1; w <= this.blockCount * this.blockCount; w++) {
        const hasMine = _.sample(this.mine)
        if (hasMine) this.mineTotalCount += 1
        this.$set(this.blockColors, w, {
          hasMine,
          isDisplay: false
        })
      }
      for (let index in this.blockColors) {
        const count = this.getAroundMineCount(parseInt(index))
        if (count >= 0) {
          this.blockColors[index].mineCount = count
        }
      }
    }
  }
}
</script>

<style scoped>
.color-container {
  margin: auto;
  max-width: 680px;
}

.size-wrap {
  padding: 15px 15px 0;
  display: flex;
  justify-content: space-around;
  color: #333;
  font-weight: 600;
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
  max-width: 680px;
  max-height: 680px;
  overflow: hidden;
  box-shadow: 9px 9px 10px 0px rgb(0 0 0 / 50%);
  background-color: #333;
}

.col-item {
  width: 100%;
  height: 100%;
  display: inline-block;
  background-color: #ddd;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.white {
  background-color: #FFF;
}

.red {
  background-color: #FFC1C1;
}

.yellow {
  background-color: #EEEE00;
}

.blue {
  color: #1E90FF;
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
  text-align: center;
}

.over-text {
  font-size: 18px;
  color: #4B0082;
  font-weight: bold;
}

.restart {
  margin-top: 30px;
  padding: 10px 15px;
  background-color: #66CD00;
  border-radius: 15px;
  display: inline-block;
  color: #fff;
}
</style>
