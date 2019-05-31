<template>
  <div>
    <div class="size-wrap">
      <div>选择关卡</div>
      <div @click="selectSize(size + 2)" :class="'size-' + size" v-for="size in 4" :key="size">{{size}}</div>
    </div>

    <div class="step-wrap">
      <div>当前关卡</div>
      <div class="step">{{blockCount - 2}}</div>
      <div>您已走了<span class="step">{{step}}</span>步</div>
    </div>

    <div class="game-panel"
      @touchstart="start"
      @touchmove="move"
      @touchend="end">
      <div class="col-wrap" :style="'width:' + (1 / blockCount) * 100 + '%;height:' + (1 / blockCount) * 100 + '%;'" v-for="(index) in (blockCount * blockCount)" :key="index">
        <div class="col" :data-index="index" :style="'background-image: url(' + imgSrc + ');background-position:' + getPicturePosition(blockPictures[index])"></div>
      </div>
    </div>

    <div class="imgs-title">可选背景：</div>
    <div class="img-wrap">
      <img :src="img" v-for="(img, index) in imgList" :key="index" class="img" @click="changeBgImg(img)"/>
    </div>

    <div class="success-panel" v-if="isSuccess">
      <div class="panel">
        <div class="success-text">闯关成功</div>
        <div>您只用了<span class="success-text">{{step}}</span>步闯过此关！</div>
        <img :src="imgSrc" class="success-img"/>
        <span @click="nextPass" class="next-pass">下一关</span>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  data () {
    return {
      step: 0,
      isSuccess: false,
      imgSrc: 'https://imgcdn.mywhfm.com/1557998044984F0025251c562083b300f40ce12117d637',
      imgList: [
        'https://imgcdn.mywhfm.com/1557998044984F0025251c562083b300f40ce12117d637',
        'https://imgcdn.mywhfm.com/1557122603504F8a2462145ad4aa500c8bf49b9ab9be4f',
        'https://imgcdn.mywhfm.com/1559276280275F18e38f1b257400a499168da147854143'
      ],
      blockCount: 3,
      blockPictures: {}
    }
  },
  created () {
    this.init()
  },
  methods: {
    selectSize (size) {
      this.blockCount = size
      this.init()
    },
    nextPass () {
      this.selectSize(this.blockCount + 1)
    },
    changeBgImg (img) {
      this.imgSrc = img
    },
    getPicturePosition (index) {
      let y = ((parseInt((index - 1) / this.blockCount)) / (this.blockCount - 1)) * 100 + '%'
      let x = ((((index - 1) % this.blockCount)) / (this.blockCount - 1)) * 100 + '%'
      return x + ' ' + y
    },
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
      let xIndex = this.startIndex % this.blockCount
      if (xIndex === 0 && targetIndex % this.blockCount === 1) {
        return
      } else if (xIndex === 1 && targetIndex % this.blockCount === 0) {
        return
      } else if (targetIndex > (this.blockCount * this.blockCount) || targetIndex < 1) {
        return
      }

      this.step += 1

      var blockPictures = Object.assign({}, this.blockPictures)
      let startNumber = blockPictures[this.startIndex]
      blockPictures[this.startIndex] = blockPictures[targetIndex]
      blockPictures[targetIndex] = startNumber

      this.blockPictures = blockPictures
      this.checkSuccess()
    },
    checkSuccess () {
      let isSuccess = true
      for (let i = 1; i <= this.blockCount * this.blockCount; i++) {
        console.log(this.blockPictures[i + 1], this.blockPictures[i] + 1, this.blockPictures[i + 1])
        if (this.blockPictures[i + 1] && this.blockPictures[i] + 1 !== this.blockPictures[i + 1]) {
          isSuccess = false
          break
        }
      }
      this.isSuccess = isSuccess
      console.log(isSuccess)
    },
    init () {
      this.step = 0
      this.isSuccess = false
      let blockPictures = {}
      let indexs = []
      for (let w = 1; w <= this.blockCount * this.blockCount; w++) {
        indexs.push(w)
      }
      indexs = _.shuffle(indexs)
      for (let i = 1; i <= this.blockCount * this.blockCount; i++) {
        blockPictures[i] = indexs[i - 1]
      }
      this.blockPictures = blockPictures
      console.log(this.blockPictures)
    }
  }
}
</script>

<style scoped>
.size-wrap {
  padding: 15px 15px 0;
  display: flex;
  justify-content: space-around;
  color: #333;
  font-weight: 600;
}

.step-wrap {
  padding: 20px;
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
  justify-content: space-around;
  margin: 0 auto 20px;
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
  color: #fff;
  background-repeat: no-repeat;
  background-size: 80vw 80vw;
}

@media screen and (min-width: 468px) {
  .game-panel .col {
    background-size: 375px 375px;
  }
}

.imgs-title {
  padding-left: 30px;
  font-size: 20px;
}

.img-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-around;
}

.img {
  padding-top: 20px;
  display: block;
  width: 30vw;
  height: 30vw;
  max-width: 150px;
  max-height: 150px;
  margin: auto;
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

.panel {
  padding: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  width: 70vw;
  box-sizing: border-box;
  border-radius: 10px;
}

.success-img {
  margin: 10px auto;
  width: 60vw;
  height: 60vw;
}

.success-text {
  font-size: 18px;
  color: #FF7F00;
  font-weight: bold;
  animation: trans-animation 2s linear .1s infinite alternate;
}

.next-pass {
  margin-top: 10px;
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
