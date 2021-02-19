<template>
  <div class="card-container">
    <div class="card-row" :style="'width:' + contentWidth + 'px'">
      <div class="card-col" :style="'width:' + cardWidth + 'px'" v-for="(cardList, rowIndex) in contentCards" :key="rowIndex">
        <div
          :ref="'' + rowIndex + colIndex"
          class="card-item"
          :style="'top: -' + colIndex * cardHalfHeight + 'px;width:' + cardWidth + 'px;height:' + cardHeight + 'px'"
          v-for="(card, colIndex) in cardList"
          :key="colIndex"
          @touchstart.stop="start($event, rowIndex, colIndex)"
          @touchmove.stop="move($event, card)"
          @touchend.stop="end($event, card)"
          @mousedown.stop="mouseStart($event, rowIndex, colIndex, card)"
          @mouseup.stop="mouseEnd($event, card)">
          <card :card="card"></card>
        </div>
      </div>
    </div>

    <!-- 发牌区 -->
    <div class="ready-cards-wrap" @click="pushNewCards">
      <div class="card-item" :style="'width:' + cardWidth + 'px;height:' + cardHeight + 'px'" v-for="(item, index) in readyCards" :key="index">
        <div v-for="(carditem, i) in item" :key="i" class="ready-card-item" :style="'width:' + cardWidth + 'px;height:' + cardHeight + 'px'" :ref="'ready' + index">
          <img class="card" src="@/assets/cards/back_blue.png" />
        </div>
      </div>
    </div>

    <div class="option-btns">
      <div class="step">操作：{{stepMaps.length ? stepMaps.length - 1 : 0}} </div>
      <div class="flex">
        <div class="back-step-btn" @click="showLevelPopup = true">关卡</div>
        <div class="back-step-btn" @click="backPrevStep">撤销</div>
      </div>
    </div>

    <div class="A-K-anim-panel" v-show="successAnimCards.length > 0">
      <div class="A-K-anim-wrap">
        <div v-for="(card, index) in successAnimCards" :key="index" class="card-item A-K-anim-card-item"
          :style="'width:' + cardWidth + 'px;height:' + cardHeight + 'px'"
          :ref="'anim' + index">
          <card :card="card"></card>
        </div>
      </div>
    </div>

    <div v-if="success" class="success-panel">
      <div class="success-title">恭喜！全部完成了</div>
      <div class="restart" @click="openSelectLevelPanel">再来一局</div>
      <div class="restart back" @click="back">更多游戏</div>
    </div>

    <div v-if="showLevelPopup" class="success-panel" @click="showLevelPopup = false">
      <div class="success-title">请选择关卡</div>
      <div class="restart" @click.stop="selectLevel(0)">初级</div>
      <div class="restart" @click.stop="selectLevel(1)">中级</div>
      <div class="restart" @click.stop="selectLevel(2)">高级</div>
      <div class="restart" @click.stop="selectLevel(3)">大师</div>
    </div>
  </div>
</template>

<script>
import Card from './card'
import _ from 'underscore'

const cardNameMaps = {
  'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
}

export default {
  name: 'spiderCard',
  components: {
    Card
  },
  data () {
    return {
      padding: 20, // content据左右距离
      contentWidth: 360,
      cardWidth: 35,
      cardHeight: 60,
      cardHalfHeight: 30,
      success: false,
      showLevelPopup: true,
      level: 0, // 难度：0,初级；1,中级
      cardsData: [ // 所有牌的数据
        'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
        'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
        'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
        'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
        'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
        'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
        'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
        'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'
      ],
      readyCards: [[], [], [], [], []], // 发牌区
      contentCards: [[], [], [], [], [], [], [], [], [], []], // 保存面板上的牌的数据
      stepMaps: [],
      successAnimCards: []
    }
  },
  created () {
    this.getCardSize()
    this.initCard()
    document.body.onresize = this.getCardSize
  },
  methods: {
    getCardSize () {
      console.log('getCardSize')
      this.contentWidth = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth - (20 * 2)
      this.padding = (window.innerWidth - this.contentWidth) / 2
      this.cardWidth = this.contentWidth / 10 - 2
      this.cardHeight = this.cardWidth * 10 / 7 // 卡牌长宽比为10：7
      this.cardHalfHeight = this.cardHeight / 2
    },
    selectLevel (level) {
      this.level = level
      this.restart()
      this.showLevelPopup = false
    },
    openSelectLevelPanel () {
      this.showLevelPopup = true
      this.success = false
    },
    restart () {
      this.stepMaps = []
      this.readyCards = [[], [], [], [], []]
      this.contentCards = [[], [], [], [], [], [], [], [], [], []]
      this.success = false
      this.initCard()
    },
    initCard () {
      const cardsData = []
      // 共104张牌，index为 0-103
      for (let i = 0; i < 104; i++) {
        let type = 'red_card' // 红桃
        if (this.level !== 0) {
          switch (this.level) {
            case 0:
              type = 'red_card' // 红桃
              break
            case 1:
              if (i <= 51) {
                type = 'black_card' // 黑桃
              }
              break
            case 2:
              if (i <= 25) {
                type = 'black_card' // 黑桃
              } else if (i <= 51) {
                type = 'club_card' // 梅花
              }
              break
            case 3:
              if (i <= 25) {
                type = 'black_card' // 黑桃
              } else if (i <= 51) {
                type = 'diamond_card' // 方块
              } else if (i <= 77) {
                type = 'club_card' // 梅花
              }
              break
            default:
              break
          }
        }
        cardsData.push({
          type,
          showCard: false,
          name: this.cardsData[i]
        })
      }
      const cardsList = _.shuffle(cardsData)
      const contentCards = cardsList.slice(0, 54)
      const readyCards = cardsList.slice(54, 104)
      console.log(contentCards, readyCards)
      for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
        let colCount = rowIndex < 4 ? 6 : 5
        for (let colIndex = 0; colIndex < colCount; colIndex++) {
          let card = contentCards[rowIndex + (10 * (colIndex))]
          if (colIndex === colCount - 1) {
            card.showCard = true
          }
          this.contentCards[rowIndex].push(card)
        }
      }
      for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
        while (readyCards.length > 0) {
          const card = readyCards.pop()
          this.readyCards[rowIndex].push(card)
          if (this.readyCards[rowIndex].length === 10) {
            break
          }
        }
      }
      console.log(this.contentCards, this.readyCards)
      // init完成后，记录当前状态
      this.saveStep()
      // this.handleSuccessAnim(0, 1)
    },
    getAllNeedMoveCards () {
      const maxIndex = this.contentCards[this.rowIndex].length - 1
      this.moveCards = []
      for (let i = maxIndex; i >= this.colIndex; i--) {
        // 从下往上获取需要移动的卡片
        const card = this.contentCards[this.rowIndex][i]
        // 如果当前卡片不是用户点击的卡片
        if (i !== this.colIndex) {
          // 获取上一个卡片并比较，如果不符合规则，则清空moveCards且return
          const prevCard = this.contentCards[this.rowIndex][i - 1]
          if (cardNameMaps[card.name] + 1 !== cardNameMaps[prevCard.name] || card.type !== prevCard.type) {
            this.moveCards = []
            return
          }
        }
        const ref = this.rowIndex + '' + i
        const moveCard = this.$refs[ref][0]
        const moveCardTemp = {
          colIndex: i,
          card: moveCard
        }
        this.moveCards.push(moveCardTemp)
      }
    },
    start (e, rowIndex, colIndex) {
      console.log(rowIndex, colIndex)
      this.rowIndex = rowIndex
      this.colIndex = colIndex
      this.getAllNeedMoveCards()
    },
    move (e, card) {
      e.preventDefault()
      if (card.showCard) {
        const cardsCount = this.moveCards.length
        if (!cardsCount) {
          return
        }
        for (let i in this.moveCards) {
          let cardPosition = cardsCount > 1 ? ((cardsCount - 1) * this.cardHalfHeight - this.cardHalfHeight) : -this.cardHalfHeight
          const moveCard = this.moveCards[i]
          moveCard.card.style.position = 'fixed'
          moveCard.card.style.top = (e.touches[0].pageY + cardPosition) - (i * this.cardHalfHeight) + 'px'
          moveCard.card.style.left = e.touches[0].pageX - 15 + 'px'
          moveCard.card.style.zIndex = 100
        }
      }
    },
    end (e, card) {
      let index = Math.floor((e.changedTouches[0].pageX - this.padding) / (this.contentWidth / 10))
      console.log(index)
      if (card.showCard && this.moveCards.length > 0) {
        this.pushCard(index, card)
      }
    },
    mouseStart (e, rowIndex, colIndex, card) {
      console.log('Start', e)
      this.rowIndex = rowIndex
      this.colIndex = colIndex
      this.getAllNeedMoveCards()
      this.mouseMoveCard = card
      document.addEventListener('mousemove', this.mouseMove)
    },
    mouseMove (e) {
      console.log('move')
      e.preventDefault()
      if (this.mouseMoveCard.showCard) {
        const cardsCount = this.moveCards.length
        if (!cardsCount) {
          return
        }
        for (let i in this.moveCards) {
          let cardPosition = cardsCount > 1 ? ((cardsCount - 1) * this.cardHalfHeight - this.cardHalfHeight) : -this.cardHalfHeight
          const moveCard = this.moveCards[i]
          moveCard.card.style.position = 'fixed'
          moveCard.card.style.top = (e.pageY + cardPosition) - (i * this.cardHalfHeight) + 'px'
          moveCard.card.style.left = e.pageX - 15 + 'px'
          moveCard.card.style.zIndex = 100
        }
      }
    },
    mouseEnd (e, card) {
      console.log('end', e, card, this.mouseMoveCard)
      document.removeEventListener('mousemove', this.mouseMove)
      let index = Math.floor((e.pageX - this.padding) / (this.contentWidth / 10))
      console.log(index)
      if (this.mouseMoveCard.showCard && this.moveCards.length > 0) {
        this.pushCard(index, this.mouseMoveCard)
      }
    },
    pushCard (index, card) {
      console.log(this.rowIndex, index, index !== this.rowIndex)
      if (index >= 0 && index <= 9 && index !== this.rowIndex) {
        // 获取新行卡片列表
        let addedCardsCol = this.contentCards[index]
        // 获取新行最后一张卡片，可能为空行
        const prevCard = addedCardsCol[addedCardsCol.length - 1]
        // 判断是否达到可移动的条件
        if (prevCard) {
          // 不是空行
          if (cardNameMaps[prevCard.name] - 1 !== cardNameMaps[card.name]) {
            // 不满足条件，reset
            this.resetMoveCard()
            return
          }
        }

        // 获取原有行卡片列表
        const rowCards = this.contentCards[this.rowIndex]
        // 从原有行中删除正在移动的卡片以及该卡片后的所有卡片
        const needMoveCards = rowCards.splice(this.colIndex, rowCards.length - this.colIndex)

        // 更新新行
        addedCardsCol = addedCardsCol.concat(needMoveCards)
        this.$set(this.contentCards, index, addedCardsCol)

        const needShowCard = rowCards.pop()
        // 将原有行最后一张卡片展示出来
        if (needShowCard) {
          needShowCard.showCard = true
          rowCards.push(needShowCard)
        }
        // 更新原有行
        this.$set(this.contentCards, this.rowIndex, rowCards)

        this.checkSuccess(index)
      } else {
        this.resetMoveCard()
      }
    },
    resetMoveCard () {
      if (!this.moveCards.length) {
        return
      }
      for (const moveCard of this.moveCards) {
        moveCard.card.style.position = 'relative'
        moveCard.card.style.top = '-' + moveCard.colIndex * this.cardHalfHeight + 'px'
        moveCard.card.style.left = 'unset'
        moveCard.card.style.zIndex = 'unset'
      }
    },
    // 保存步骤
    saveStep () {
      this.stepMaps.push({
        readyCards: JSON.parse(JSON.stringify(this.readyCards)),
        contentCards: JSON.parse(JSON.stringify(this.contentCards))
      })
      console.log(this.stepMaps)
    },
    // 撤销上一步
    backPrevStep () {
      console.log('backPrevStep', this.stepMaps)
      if (this.stepMaps.length <= 1) {
        return
      }
      // 先删掉当前步数的状态
      this.stepMaps.pop()
      // 取出上一步的状态
      const step = this.stepMaps[this.stepMaps.length - 1]
      if (!step) {
        return
      }

      // 恢复
      this.$set(this, 'readyCards', JSON.parse(JSON.stringify(step.readyCards)))
      this.$set(this, 'contentCards', JSON.parse(JSON.stringify(step.contentCards)))
    },
    // 检查是否满足成功要求，A-K
    checkSuccess (index, isSaveStep = true) {
      const cards = this.contentCards[index]
      const cardsMaxIndex = cards.length - 1
      // 首先判断最后一张是否是A
      if (cards[cardsMaxIndex].name !== 'A') {
        if (isSaveStep) {
          this.saveStep()
        }
        return
      }
      // 从下向上开始逐个检查
      for (let i = cardsMaxIndex; i >= 0; i--) {
        const card = cards[i]
        // 如果不展示卡片，则return
        if (!card.showCard) {
          if (isSaveStep) {
            this.saveStep()
          }
          return
        }
        if (i !== 0) {
          const prevCard = cards[i - 1]
          // 如果顺序不对或不是同一个花色，则return
          if (card.name !== 'K' && (cardNameMaps[card.name] + 1 !== cardNameMaps[prevCard.name] || card.type !== prevCard.type)) {
            if (isSaveStep) {
              this.saveStep()
            }
            return
          }
        }
        if (card.name === 'K') {
          this.successA_K(index, i, isSaveStep)
          return
        }
      }
    },
    handleSuccessAnim (rowIndex, colIndex) {
      // 获取卡片列表
      const cards = this.contentCards[rowIndex]
      const animCards = JSON.parse(JSON.stringify(cards))
      const successCards = animCards.splice(colIndex, animCards.length - colIndex)
      this.successAnimCards = successCards
      setTimeout(() => {
        this.startSuccessAnim(0)
      }, 200)
    },
    // 开始播放成功收集A-K的动画
    startSuccessAnim (index) {
      if (index > 12) {
        this.successAnimCards = []
        return
      }
      const refs = this.$refs['anim' + index]
      if (_.isEmpty(refs)) {
        return
      }
      const successCardRefs = refs[0]
      successCardRefs.style.transition = 'all 0.2s'
      successCardRefs.style.transform = 'scale(1.2)'
      successCardRefs.style.top = '20%'
      successCardRefs.style.left = 0
      successCardRefs.style.right = 0
      successCardRefs.style.margin = 'auto'
      setTimeout(() => {
        successCardRefs.style.position = 'fixed'
        successCardRefs.style.top = '100vh'
        setTimeout(() => {
          this.startSuccessAnim(index + 1)
        }, 100)
      }, 50)
    },
    successA_K (rowIndex, colIndex, isSaveStep) {
      // TODO 销毁卡片动画不完善
      this.handleSuccessAnim(rowIndex, colIndex)
      this.handleDestoryCards(rowIndex, colIndex, isSaveStep)
    },
    handleDestoryCards (rowIndex, colIndex, isSaveStep) {
      // 获取卡片列表
      const cards = this.contentCards[rowIndex]
      // 从列表中删除正在移动的卡片以及该卡片后的所有卡片
      const successCards = cards.splice(colIndex, cards.length - colIndex)
      if (cards.length > 0) {
        const card = cards.pop()
        card.showCard = true
        cards.push(card)
      }
      // 更新卡片
      this.$set(this.contentCards, rowIndex, cards)
      console.log(successCards)
      if (isSaveStep) {
        this.saveStep()
      }
      this.checkAllSuccess()
    },
    // 检查是否全部完成
    checkAllSuccess () {
      for (const cards of this.contentCards) {
        if (cards.length > 0) {
          return
        }
      }
      this.success = true
    },
    getContentCardsHeight () {
      let heights = []
      for (let i in this.contentCards) {
        heights.push(this.contentCards[i].length)
      }
      return heights
    },
    // 开始播放发牌动画
    startAnimForPushNewCards (readyCardRefs, contentCardsHeights, refIndex) {
      if (refIndex >= readyCardRefs.length) {
        this.startPushNewCards()
        return
      }
      const ref = readyCardRefs[refIndex]
      setTimeout(() => {
        ref.style.position = 'fixed'
        ref.style.bottom = window.innerHeight - (contentCardsHeights[refIndex] * this.cardHalfHeight) - this.cardHeight + 'px'
        ref.style.left = (refIndex * (this.contentWidth / 10)) + this.padding + 'px'
        setTimeout(() => {
          this.startAnimForPushNewCards(readyCardRefs, contentCardsHeights, refIndex + 1)
        }, 150)
      }, 0)
    },
    // 发牌
    pushNewCards () {
      const readyCardRefs = this.$refs['ready' + (this.readyCards.length - 1)]
      const contentCardsHeights = this.getContentCardsHeight()
      this.startAnimForPushNewCards(readyCardRefs, contentCardsHeights, 0)
    },
    // 进行牌面替换工作
    startPushNewCards () {
      const cards = this.readyCards.shift()
      for (const row of this.contentCards) {
        const card = cards.pop()
        card.showCard = true
        row.push(card)
      }
      // 发完牌后开始检查是否成功集齐
      for (let i = 0; i < this.contentCards.length; i++) {
        this.checkSuccess(i, i === this.contentCards.length - 1)
      }
    },
    back () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.card-container {
  background-color: rgba(169, 179, 189, 60%);
  min-height: 100vh;
}
.card-row {
  width: 360px;
  margin: auto;
  position: relative;
  display: flex;
  justify-content: space-around;
  /* background-color: #f6f6f6; */
}
.card-col {
  position: relative;
  width: 35px;
  min-height: 80vh;
  background-color: #fff;
}
.card-col:nth-child(2n) {
  background-color: #f2f2f2;
}
.card-item {
  position: relative;
  width: 34px;
  height: 60px;
  font-weight: 600;
  background-color: #fff;
  box-sizing: border-box;
  color: #14195a;
}

.ready-cards-wrap {
  display: flex;
  position: fixed;
  left: 30px;
  bottom: 30px;
}
.ready-card-item {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 34px;
  height: 60px;
  transition: all 0.3s;
}

.success-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.success-title {
  font-size: 30px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;
}
.restart {
  margin: 20px auto 0;
  width: 120px;
  height: 40px;
  color: #fff;
  font-size: 20px;
  border-radius: 20px;
  background-color: #891e91;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back {
  background-color: #aaa;
}

.card {
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: 100% 100%;
  transition: all 0.5s;
}
.flop-anim {
  animation: card-anim 0.6s;
}
@keyframes card-anim {
  0% {
    transform: rotateY(0) translateY(-100%) scale(1);
  }
  100% {
    transform: rotateY(90deg) translateY(-100%) scale(1.2);
    opacity: 0;
  }
}

.option-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: fixed;
  right: 15px;
  bottom: 30px;
}
.option-btns .step {
  color: #333;
  font-size: 16px;
  font-weight: 500;
}
.option-btns .back-step-btn {
  margin-left: 6px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  background-color: #891e91;
  width: 50px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
}
.flex {
  display: flex;
}

.A-K-anim-panel {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, .5);
}
.A-K-anim-wrap {
  position: absolute;
  left: 20%;
  right: 20%;
  top: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.A-K-anim-card-item {
  background-color: transparent !important;
}
</style>
