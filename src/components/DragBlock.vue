<template>
  <div class="container">
    <div class="game-panel">
      <div class="row" v-for="row in 10" :key="row + 'row'">
        <div class="col" v-for="col in 10" :key="col + 'col'" :class="{active: hasColor(row * 10 +  col - 1)}"></div>
      </div>
    </div>

    <div class="game-panel">得分：{{source}}</div>

    <div class="game-panel move-panel">
      <div
        class="drag-wrap"
        ref="moveBlock"
        @touchstart="start($event, '')"
        @touchmove="move"
        @touchend="end($event, 0)">
        <div class="row" v-for="row in 5" :key="row + 'drag-row'">
          <div class="col white" v-for="col in 5" :key="col + 'drag-col'" :class="{active: dragHasColor(row * 10 + col - 1)}"></div>
        </div>
      </div>
    </div>

    <div class="game-panel move-panel">
      <div
        class="drag-wrap"
        ref="moveBlock1"
        @touchstart="start($event, '1')"
        @touchmove="move"
        @touchend="end($event, 1)">
        <div class="row" v-for="row in 5" :key="row + 'drag-row'">
          <div class="col white" v-for="col in 5" :key="col + 'drag-col'" :class="{active: dragHasColor1(row * 10 + col - 1)}"></div>
        </div>
      </div>
    </div>

    <div v-show="isOver" class="over-panel">
      <div class="over-text">无处安放</div>
      <div>最终得分： {{source}}</div>
      <span @click="restart" class="restart">重新开始</span>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'

function getType () {
  return _.sample([
    'row-line',
    'col-line',
    'square',
    'square-bend-top-left',
    'square-bend-top-right',
    'square-bend-bottom-left',
    'square-bend-bottom-right'
  ])
}

export default {
  name: 'DragBlock',
  data () {
    return {
      blockColor: [],
      dragColor: [],
      dragColor1: [],
      dragColor2: [],
      dragBlock: {
        size: 2,
        type: 'square'
      },
      dragBlock1: {
        size: 2,
        type: 'square'
      },
      source: 0,
      isOver: false
    }
  },
  created () {
    console.warn('Design by Kody Wang, enjoy my game! Thank you!')
    this.changeDragBlock()
  },
  methods: {
    restart () {
      this.isOver = false
      this.blockColor = []
      this.source = 0
      this.changeDragBlock()
    },
    hasColor (index) {
      return _.indexOf(this.blockColor, index) > -1
    },
    dragHasColor (index) {
      return _.indexOf(this.dragColor, index) > -1
    },
    dragHasColor1 (index) {
      return _.indexOf(this.dragColor1, index) > -1
    },
    changeDragBlock (type) {
      if (typeof type === 'undefined' || type === 0) {
        this.dragColor = []
        this.dragBlock.type = getType()
        if (this.dragBlock.type.indexOf('line') > -1) {
          this.dragBlock.size = _.random(1, 5)
        } else {
          this.dragBlock.size = _.random(2, 3)
        }
        this.dragColor = this.getIndexs(this.dragBlock, 10)
      }
      if (typeof type === 'undefined' || type === 1) {
        this.dragColor1 = []
        this.dragBlock1.type = getType()
        if (this.dragBlock1.type.indexOf('line') > -1) {
          this.dragBlock1.size = _.random(1, 5)
        } else {
          this.dragBlock1.size = _.random(2, 3)
        }
        this.dragColor1 = this.getIndexs(this.dragBlock1, 10)
      }

      this.checkIsOver()
    },
    start (e, type) {
      this.moveBlock = this.$refs['moveBlock' + type]
    },
    move (e) {
      e.preventDefault()
      this.moveBlock.style.position = 'fixed'
      this.moveBlock.style.top = e.touches[0].pageY - 60 + 'px'
      this.moveBlock.style.left = e.touches[0].pageX - 30 + 'px'
    },
    end (e, type) {
      let x = Math.round((e.changedTouches[0].pageX - (window.innerWidth - 320) / 2) / 32)
      let y = Math.round((e.changedTouches[0].pageY) / 32) * 10
      let index = y + x - 1 - 10
      this.pushBlock(index, type)
      this.moveBlock.style.position = 'static'
    },
    pushBlock (num, type) {
      let dragBlock = type === 0 ? this.dragBlock : (type === 1 ? this.dragBlock1 : this.dragBlock2)
      let indexs = this.getIndexs(dragBlock, num)
      let canPush = true

      if (!_.isEmpty(indexs)) {
        for (const index of indexs) {
          if (this.hasColor(index) || index < 10 || index > 109) {
            canPush = false
          }
        }
        if (canPush) {
          for (const index of indexs) {
            this.blockColor.push(index)
          }
          this.source += indexs.length
          this.checkIsLine()
          this.changeDragBlock(type)
        }
      }
    },
    checkIsLine () {
      let cols = _.groupBy(this.blockColor, function (index) {
        return index % 10
      })
      let rows = _.groupBy(this.blockColor, function (index) {
        return parseInt(index / 10)
      })
      _.each(cols, col => {
        if (col.length === 10) {
          this.blockColor = _.difference(this.blockColor, col)
          this.source += 10
        }
      })
      _.each(rows, row => {
        if (row.length === 10) {
          this.blockColor = _.difference(this.blockColor, row)
          this.source += 10
        }
      })
    },
    checkIsOver () {
      const allIndexs = _.range(10, 110)
      let blankIndexs = _.difference(allIndexs, this.blockColor)
      for (const index of blankIndexs) {
        let canPush = true
        let indexs = this.getIndexs(this.dragBlock, index)
        let indexs1 = this.getIndexs(this.dragBlock1, index)

        if (_.isEmpty(indexs)) {
          canPush = false
        } else {
          for (const index of indexs) {
            if (this.hasColor(index) || index < 10 || index > 109) {
              canPush = false
            }
          }
        }

        if (_.isEmpty(indexs1)) {
          canPush = false
        } else {
          for (const index of indexs1) {
            if (this.hasColor(index) || index < 10 || index > 109) {
              canPush = false
            }
          }
        }
        if (canPush) {
          return
        }
      }
      this.isOver = true
    },
    getIndexs (dragBlock, num) {
      let indexs = []
      if (dragBlock.type === 'row-line') {
        for (let i = 0; i < dragBlock.size; i++) {
          if (parseInt((num + i) / 10) !== parseInt((num) / 10)) {
            return []
          }
          indexs.push(num + i)
        }
      }

      if (dragBlock.type === 'col-line') {
        for (let i = 0; i < dragBlock.size * 10; i += 10) {
          indexs.push(num + i)
        }
      }

      if (dragBlock.type.indexOf('square') > -1) {
        if (10 - (num % 10) < dragBlock.size) {
          return []
        }
      }

      if (dragBlock.type === 'square') {
        for (let i = 0; i < dragBlock.size * 10; i += 10) {
          for (let j = 0; j < dragBlock.size; j++) {
            indexs.push(num + i + j)
          }
        }
      }

      if (dragBlock.type === 'square-bend-top-left') {
        for (let i = 0; i < dragBlock.size; i++) {
          indexs.push(num + i)
        }
        for (let i = 0; i < dragBlock.size * 10; i += 10) {
          indexs.push(num + i)
        }
      }

      if (dragBlock.type === 'square-bend-top-right') {
        for (let i = 0; i < dragBlock.size; i++) {
          indexs.push(num + i)
        }
        for (let i = 0; i < dragBlock.size * 10; i += 10) {
          indexs.push(num + dragBlock.size - 1 + i)
        }
      }

      if (dragBlock.type === 'square-bend-bottom-left') {
        for (let i = 0; i < dragBlock.size; i++) {
          indexs.push(num + (dragBlock.size - 1) * 10 + i)
        }
        for (let i = 0; i < dragBlock.size * 10; i += 10) {
          indexs.push(num + i)
        }
      }

      if (dragBlock.type === 'square-bend-bottom-right') {
        for (let i = 0; i < dragBlock.size; i++) {
          indexs.push(num + (dragBlock.size - 1) * 10 + i)
        }
        for (let i = 0; i < dragBlock.size * 10; i += 10) {
          indexs.push(num + dragBlock.size - 1 + i)
        }
      }

      return _.uniq(indexs)
    }
  }
}
</script>

<style scoped>
.game-panel {
  width: 320px;
  margin: auto;
}

.move-panel {
  margin-top: 50px;
  height: 160px;
}

.drag-wrap {
  width: 160px;
  margin: auto;
}

.row {
  display: flex;
}

.col {
  width: 30px;
  height: 30px;
  background-color: #ccc;
  border: 1px solid #fff;
}

.active {
  background-color: #FFC125 !important;
  border: 1px solid #fff !important;
}

.white {
  background-color: transparent;
  border: 1px solid transparent;
}

.row-line {
  display: flex;
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
