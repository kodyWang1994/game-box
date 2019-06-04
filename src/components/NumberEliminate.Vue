<template>
  <div>
    <div class="source-wrap">得分：{{source}}</div>
    <div class="game-panel"
      @touchstart="start"
      @touchmove="move"
      @touchend="end">
      <div class="col-wrap" v-for="(index) in (blockCount * blockCount)" :key="index">
        <div class="col" :class="'num-' + blockNumbers[index]" v-if="blockNumbers[index]" :data-index="index">{{blockNumbers[index]}}</div>
      </div>
    </div>

    <div class="rule-wrap">
      <div>游戏规则：</div>
      <div>移动数字，三个及以上相邻的数字会消除</div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  data () {
    return {
      source: 0,
      blockCount: 5,
      startIndex: '',
      initNumber: [1, 2, 3, 4, 5, 6],
      blockNumbers: {}
    }
  },
  created () {
    this.init()
  },
  methods: {
    start (e) {
      this.startX = e.changedTouches[0].pageX
      this.startY = e.changedTouches[0].pageY
      this.startIndex = parseInt(e.target.dataset.index)
    },
    move (e) {
      e.preventDefault()
    },
    end (e) {
      this.endX = e.changedTouches[0].pageX
      this.endY = e.changedTouches[0].pageY

      let moveX = this.endX - this.startX
      let moveY = this.endY - this.startY

      if (Math.abs(moveX) > Math.abs(moveY)) {
        if (moveX > 0) {
          console.log('右')
          this.moveBlock(this.startIndex + 1)
        } else if (moveX < 0) {
          console.log('左')
          this.moveBlock(this.startIndex - 1)
        }
      } else if (Math.abs(moveX) < Math.abs(moveY)) {
        if (moveY > 0) {
          console.log('下')
          this.moveBlock(this.startIndex + this.blockCount)
        } else if (moveY < 0) {
          console.log('上')
          this.moveBlock(this.startIndex - this.blockCount)
        }
      }
    },
    moveBlock (targetIndex) {
      if (this.cleaning) {
        return
      }
      let xIndex = this.startIndex % this.blockCount
      if (xIndex === 0 && targetIndex % this.blockCount === 1) {
        return
      } else if (xIndex === 1 && targetIndex % this.blockCount === 0) {
        return
      } else if (targetIndex > (this.blockCount * this.blockCount) || targetIndex < 1) {
        return
      }

      var blockNumbers = Object.assign({}, this.blockNumbers)
      let startNumber = blockNumbers[this.startIndex]
      blockNumbers[this.startIndex] = blockNumbers[targetIndex]
      blockNumbers[targetIndex] = startNumber

      this.blockNumbers = blockNumbers

      this.cleaning = true
      setTimeout(() => {
        this.checkNearBlock()
      }, 400)
    },
    checkNearBlock () {
      let hasNeedClearBlock = false
      for (let index = 1; index <= this.blockCount * this.blockCount; index++) {
        let nearBlock = [index]
        let blockStark = [index]
        do {
          let surroundBlocks = this.getSurroundBlock(blockStark.pop(), nearBlock)
          for (let blockIndex of surroundBlocks) {
            if (_.indexOf(nearBlock, blockIndex) === -1) {
              nearBlock.push(blockIndex)
              blockStark.push(blockIndex)
            }
          }
        } while (blockStark.length > 0)
        if (nearBlock.length >= 3) {
          hasNeedClearBlock = true
          this.cleanBlock(nearBlock)
          break
        }
      }
      if (!hasNeedClearBlock) {
        this.cleaning = false
      }
    },
    getSurroundBlock (index, needCleanBlock) {
      let number = this.blockNumbers[index]
      let surroundBlock = []
      if (index % this.blockCount !== 0 && _.indexOf(needCleanBlock, index + 1) === -1 && number === this.blockNumbers[index + 1]) {
        surroundBlock.push(index + 1)
      }
      if (index % this.blockCount !== 1 && _.indexOf(needCleanBlock, index - 1) === -1 && number === this.blockNumbers[index - 1]) {
        surroundBlock.push(index - 1)
      }
      if (_.indexOf(needCleanBlock, index + this.blockCount) === -1 && number === this.blockNumbers[index + this.blockCount]) {
        surroundBlock.push(index + this.blockCount)
      }
      if (_.indexOf(needCleanBlock, index - this.blockCount) === -1 && number === this.blockNumbers[index - this.blockCount]) {
        surroundBlock.push(index - this.blockCount)
      }
      return surroundBlock
    },
    cleanBlock (blocks) {
      console.log(blocks)
      let currentIndex = blocks[0]
      let number = this.blockNumbers[currentIndex] + 1
      for (let index of blocks) {
        this.$set(this.blockNumbers, index, '')
      }
      this.$set(this.blockNumbers, currentIndex, number)
      this.source += (blocks.length * number)
      this.fullBlock(blocks, currentIndex).then(
        () => {
          setTimeout(() => {
            this.checkNearBlock()
          }, 700)
        }
      )
    },
    fullBlock (blocks, currentIndex) {
      var blockNumbers = Object.assign({}, this.blockNumbers)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          for (let index of blocks) {
            if (index !== currentIndex) {
              blockNumbers[index] = _.sample(this.initNumber)
            }
          }
          this.blockNumbers = blockNumbers
          resolve()
        }, 700)
      })
    },
    init () {
      for (let w = 1; w <= this.blockCount * this.blockCount; w++) {
        this.blockNumbers[w] = _.sample(this.initNumber)
      }
      this.checkNearBlock()
      console.log(_.groupBy(this.blockNumbers))
    }
  }
}
</script>

<style scoped>
.source-wrap {
  padding: 30px;
  display: flex;
  align-items: center;
  color: #555;
  font-weight: 600;
  justify-content: center;
}

.rule-wrap {
  padding: 15px;
  color: #ccc;
  font-size: 15px;
}

.game-panel {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: auto;
  width: 80vw;
  height: 80vw;
  max-width: 375px;
  max-height: 375px;
  background-color: #444;
  box-shadow: 0 2px 10px #bbb;
}

.game-panel .col-wrap {
  background-color: #fff;
  width: 18%;
  height: 18%;
}

.game-panel .col {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.col:active {
  transform: scale(0.9)
}

.game-panel .num-1 {
  background-color: #FFE4B5;
  color: #fff;
  animation: trans-animation .5s;
}

.game-panel .num-2 {
  background-color: #FFC0CB;
  color: #fff;
  animation: trans-animation .5s;
}

.game-panel .num-3 {
  background-color: #FF1493;
  color: #E0E0E0;
  animation: trans-animation .5s;
}

.game-panel .num-4 {
  background-color: #EEB422;
  color: #FFF;
  animation: trans-animation .4s;
}

.game-panel .num-5 {
  background-color: #E0E0E0;
  color: #fff;
  animation: trans-animation .5s;
}

.game-panel .num-6 {
  background-color: #D8BFD8;
  color: #fff;
  animation: trans-animation .4s;
}

.game-panel .num-7 {
  background-color: #CDAD00;
  color: #FFF;
  animation: trans-animation .4s;
}

.game-panel .num-8 {
  background-color: #CFF5CD;
  color: #FFF;
  animation: trans-animation .3s;
}

.game-panel .num-9 {
  background-color: #CD5B45;
  color: #FFF;
  animation: trans-animation .3s;
}

.game-panel .num-10 {
  background-color: #B23AEE;
  color: #FFF;
  animation: trans-animation .3s;
}

@keyframes trans-animation {
  from {transform: translateY(-200%)}
  to {transform: translateY(0)}
}
</style>
