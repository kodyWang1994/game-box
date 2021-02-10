<template>
  <div>
    <div class="card-row" :style="'width:' + contentWidth + 'px'">
      <div class="card-col" :style="'width:' + cardWidth + 'px'" v-for="(cardList, rowIndex) in contentCards" :key="rowIndex">
        <div
          :ref="'' + rowIndex + colIndex"
          class="card-item"
          :style="'top: -' + colIndex * cardHalfHeight + 'px;width:' + cardWidth + 'px;height:' + cardHeight + 'px'"
          v-for="(card, colIndex) in cardList"
          :key="colIndex"
          @touchstart="start($event, rowIndex, colIndex)"
          @touchmove="move($event, card)"
          @touchend="end($event, card)">
          <template v-if="card.showCard">
            <img v-if="card.name == 'A'" class="card" src="@/assets/cards/A.png" />
            <img v-else-if="card.name == '2'" class="card" src="@/assets/cards/2.png" />
            <img v-else-if="card.name == '3'" class="card" src="@/assets/cards/3.png" />
            <img v-else-if="card.name == '4'" class="card" src="@/assets/cards/4.png" />
            <img v-else-if="card.name == '5'" class="card" src="@/assets/cards/5.png" />
            <img v-else-if="card.name == '6'" class="card" src="@/assets/cards/6.png" />
            <img v-else-if="card.name == '7'" class="card" src="@/assets/cards/7.png" />
            <img v-else-if="card.name == '8'" class="card" src="@/assets/cards/8.png" />
            <img v-else-if="card.name == '9'" class="card" src="@/assets/cards/9.png" />
            <img v-else-if="card.name == '10'" class="card" src="@/assets/cards/10.png" />
            <img v-else-if="card.name == 'J'" class="card" src="@/assets/cards/J.png" />
            <img v-else-if="card.name == 'Q'" class="card" src="@/assets/cards/Q.png" />
            <img v-else-if="card.name == 'K'" class="card" src="@/assets/cards/K.png" />
          </template>
          <template v-else>
            <transition name="fade" leave-active-class="flop-anim">
              <img class="card" src="@/assets/cards/back.png" />
            </transition>
          </template>
        </div>
      </div>
    </div>

    <!-- 发牌区 -->
    <div class="ready-cards-wrap" @click="pushNewCards">
      <div class="card-item" :style="'width:' + cardWidth + 'px;height:' + cardHeight + 'px'" v-for="(item, index) in readyCards" :key="index">
        <div v-for="(carditem, i) in item" :key="i" class="ready-card-item" :style="'width:' + cardWidth + 'px;height:' + cardHeight + 'px'" :ref="'ready' + index">
          <img class="card" src="@/assets/cards/back.png" />
        </div>
      </div>
    </div>

    <div v-if="success" class="success-panel">
      <div class="success-title">恭喜！全部完成了</div>
      <div class="restart" @click="restart">再来一局</div>
      <div class="restart back" @click="back">更多游戏</div>
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
      contentCards: [[], [], [], [], [], [], [], [], [], []] // 保存面板上的牌的数据
    }
  },
  created () {
    this.getCardSize()
    this.initCard()
  },
  methods: {
    getCardSize () {
      this.contentWidth = window.innerWidth - (this.padding * 2)
      this.cardWidth = this.contentWidth / 10 - 2
      this.cardHeight = this.cardWidth * 10 / 7 // 卡牌长宽比为10：7
      this.cardHalfHeight = this.cardHeight / 2
    },
    restart () {
      this.success = false
      this.initCard()
    },
    initCard () {
      const cardsData = []
      // 共104张牌，index为 0-103
      for (let i = 0; i < 104; i++) {
        cardsData.push({
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
          if (cardNameMaps[card.name] + 1 !== cardNameMaps[prevCard.name]) {
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
    // 检查是否满足成功要求，A-K
    checkSuccess (index) {
      const cards = this.contentCards[index]
      const cardsMaxIndex = cards.length - 1
      // 首先判断最后一张是否是A
      if (cards[cardsMaxIndex].name !== 'A') {
        return
      }
      // 从下向上开始逐个检查
      for (let i = cardsMaxIndex; i >= 0; i--) {
        const card = cards[i]
        // 如果不展示卡片，则return
        if (!card.showCard) {
          return
        }
        if (i !== 0) {
          const prevCard = cards[i - 1]
          // 如果顺序不对，则return
          if (card.name !== 'K' && cardNameMaps[card.name] + 1 !== cardNameMaps[prevCard.name]) {
            return
          }
        }
        if (card.name === 'K') {
          this.successA_K(index, i)
          return
        }
      }
    },
    // 开始播放成功收集A-K的动画
    startSuccessAnim (rowIndex, colIndex, count) {
      if (count > 12) {
        this.handleDestoryCards(rowIndex, colIndex)
        return
      }
      const refs = this.$refs['' + rowIndex + (colIndex + count)]
      if (_.isEmpty(refs)) {
        return
      }
      const successCardRefs = refs[0]
      setTimeout(() => {
        successCardRefs.style.transition = 'all 0.5s'
        successCardRefs.style.transform = 'scale(1.2)'
        successCardRefs.style.top = 0
        successCardRefs.style.left = 0
        successCardRefs.style.position = 'fixed'
        successCardRefs.style.top = '100vh'
        successCardRefs.style.left = '90vw'
        setTimeout(() => {
          this.startSuccessAnim(rowIndex, colIndex, count + 1)
        }, 150)
      }, 0)
    },
    successA_K (rowIndex, colIndex) {
      // TODO 销毁卡片动画有bug
      this.startSuccessAnim(rowIndex, colIndex, 0)
      // this.handleDestoryCards(rowIndex, colIndex)
    },
    handleDestoryCards (rowIndex, colIndex) {
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
        this.checkSuccess(i)
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
.card-row {
  width: 360px;
  margin: auto;
  position: relative;
  display: flex;
  justify-content: space-around;
}
.card-col {
  position: relative;
  width: 35px;
  min-height: 60px;
  background-color: #eee;
}
.card-item {
  position: relative;
  width: 34px;
  height: 60px;
  font-weight: 600;
  border: 1px solid #f1cdcd;
  border-radius: 5px;
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
  animation: card-anim 0.5s;
}
@keyframes card-anim {
  0% {
    transform: rotateY(0) translateY(-100%) scale(1);
  }
  0% {
    transform: rotateY(90deg) translateY(-100%) scale(1.5);
  }
  100% {
    transform: rotateY(180deg) translateY(-100%);
  }
}
.card-A {
  background-image: url('/static/cards/A.png');
}
.card-2 {
  background-image: url('/static/cards/2.png');
}
.card-3 {
  background-image: url('/static/cards/3.png');
}
.card-4 {
  background-image: url('/static/cards/4.png');
}
.card-5 {
  background-image: url('/static/cards/5.png');
}
.card-6 {
  background-image: url('/static/cards/6.png');
}
.card-7 {
  background-image: url('/static/cards/7.png');
}
.card-8 {
  background-image: url('/static/cards/8.png');
}
.card-9 {
  background-image: url('/static/cards/9.png');
}
.card-10 {
  background-image: url('/static/cards/10.png');
}
.card-J {
  background-image: url('/static/cards/J.png');
}
.card-Q {
  background-image: url('/static/cards/Q.png');
}
.card-K {
  background-image: url('/static/cards/K.png');
}
.card-back {
  background-image: url('/static/cards/back.png');
}
</style>
