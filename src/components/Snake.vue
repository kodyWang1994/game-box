<template>
  <div class="snake-container">
    <div class="game-panel">
      <div v-for="col in 1536" :key="col" class="col-item" :class="{'snake': isSnake(col), 'food': food == col, 'snake-head': isHead(col)}"></div>
    </div>
    <div class="source-wrap">
      得分： {{ snakeBody.length - 1 }}
    </div>
    <div class="operation">
      <div class="operation-item operation-top-down" @click="changeDirection('TOP')">上</div>
      <div class="operation-left-right-col">
        <div class="operation-item" @click="changeDirection('LEFT')">左</div>
        <div class="operation-item-block"></div>
        <div class="operation-item" @click="changeDirection('RIGHT')">右</div>
      </div>
      <div class="operation-item operation-top-down" @click="changeDirection('DOWN')">下</div>
    </div>
    <div class="game-over" v-if="gameOver">
      <span class="game-over-text">GAME OVER</span>
      <br>
      <span class="restart" @click="restart">重新开始</span>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
export default {
  name: 'Snake',
  data () {
    return {
      snakeBody: [1],
      food: 0,
      direction: 'RIGHT',
      gameOver: false,
      speed: 400
    }
  },
  watch: {
    'snakeBody': 'checkRule'
  },
  created () {
    this.init()
  },
  mounted () {
    document.onkeydown = event => {
      this.keyUp(event)
    }
  },
  methods: {
    checkRule () {
      var uniqBady = _.uniq(this.snakeBody)
      if (uniqBady.length !== this.snakeBody.length) {
        this.stop()
      } else {
        switch (uniqBady.length) {
          case 3:
            this.changeSpeed(300)
            break
          case 6:
            this.changeSpeed(200)
            break
          case 10:
            this.changeSpeed(100)
            break
          case 20:
            this.changeSpeed(50)
            break
          default:
            break
        }
      }
    },
    changeSpeed (speed) {
      clearInterval(this.intId)
      this.speed = speed
      this.move()
    },
    restart () {
      this.snakeBody = [1]
      this.direction = 'RIGHT'
      this.gameOver = false
      this.speed = 400
      this.init()
    },
    stop () {
      clearInterval(this.intId)
      this.gameOver = true
    },
    isSnake (col) {
      return _.indexOf(this.snakeBody, col) > -1
    },
    isHead (col) {
      return _.last(this.snakeBody) === col
    },
    changeDirection (direction) {
      this.direction = direction
    },
    touch (event) {
      if (event.clientY < 168) {
        this.direction = 'TOP'
      } else if (event.clientY > 328 && event.clientY < 488) {
        this.direction = 'DOWN'
      } else if (event.clientX > window.innerWidth / 2) {
        this.direction = 'RIGHT'
      } else if (event.clientX < window.innerWidth / 2) {
        this.direction = 'LEFT'
      }
    },
    move () {
      this.intId = setInterval(() => {
        const last = _.last(this.snakeBody)
        var newBody = []
        if (last === this.food) {
          newBody = this.snakeBody
          this.food = _.random(1, 1536)
        } else {
          newBody = _.rest(this.snakeBody)
        }
        if (last > 1536) {
          newBody.push(last - 1536)
        } else if (last < 1) {
          newBody.push(1536 + last)
        } else {
          switch (this.direction) {
            case 'LEFT':
              newBody.push(last - 1)
              break
            case 'TOP':
              newBody.push(last - 32)
              break
            case 'RIGHT':
              newBody.push(last + 1)
              break
            case 'DOWN':
              newBody.push(last + 32)
              break
            default:
              newBody.push(last + 1)
              break
          }
        }
        this.snakeBody = newBody
      }, this.speed)
    },
    keyUp (event) {
      if (event.keyCode === 37) {
        this.direction = 'LEFT'
      } else if (event.keyCode === 38) {
        this.direction = 'TOP'
      } else if (event.keyCode === 39) {
        this.direction = 'RIGHT'
      } else if (event.keyCode === 40) {
        this.direction = 'DOWN'
      }
    },
    init () {
      this.food = _.random(1, 1536)
      this.move()
    }
  }
}
</script>

<style scoped>
.snake-container {
  margin-top: 8px;
}
.game-panel {
  position: relative;
  width: 320px;
  height: 480px;
  overflow: hidden;
  line-height: 0;
  margin: auto;
}
.col-item {
  background: #ccc;
  width: 10px;
  height: 10px;
  display: inline-block;
}
.snake {
  background: #1E90FF;
}
.snake-head {
  background: rgb(123, 23, 134);
}
.food {
  background: red;
}
.operation {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 190px;
  height: 190px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.operation-left-right-col {
  display: flex;
  width: 100%;
  height: 40px;
  line-height: 40px;
}
.operation-item {
  border: 1px solid;
  width: 50%;
  border-radius: 30px;
}
.operation-top-down {
  width: 40px;
  height: 70px;
  line-height: 70px;
}
.operation-item-block {
  width: 40px;
}
.game-over {
  position: fixed;
  top: 190px;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
.game-over-text {
  font-size: 20px;
}
.restart {
  font-size: 15px;
  color: red;
}
.source-wrap {
  padding-left: 50px;
}
</style>
