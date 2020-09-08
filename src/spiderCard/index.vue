<template>
  <div>
    <div class="card-row">
      <div class="card-col" v-for="(cardList, rowIndex) in contentCards" :key="rowIndex">
        <div
          :ref="'' + rowIndex + colIndex"
          :data-rowindex="rowIndex"
          :data-colindex="colIndex"
          class="card-item"
          :style="'top:' + colIndex * 20 + 'px'"
          v-for="(card, colIndex) in cardList"
          :key="colIndex"
          @touchstart="start"
          @touchmove="move"
          @touchend="end">
          <template v-if="card.showCard">{{card.name}}</template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from './card'
import _ from 'underscore'

export default {
  name: 'spiderCard',
  components: {
    Card
  },
  data () {
    return {
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
    this.initCard()
  },
  methods: {
    initCard () {
      const cardsData = []
      for (let i = 0; i <= 104; i++) {
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
      console.log(this.contentCards)
    },
    start (e) {
      console.log(e)
      this.rowIndex = e.target.dataset.rowindex
      this.colIndex = e.target.dataset.colindex
      const ref = this.rowIndex + '' + this.colIndex
      this.moveCard = this.$refs[ref][0]
    },
    move (e) {
      e.preventDefault()
      this.moveCard.style.position = 'fixed'
      this.moveCard.style.top = e.touches[0].pageY - 30 + 'px'
      this.moveCard.style.left = e.touches[0].pageX - 15 + 'px'
      this.moveCard.style.zIndex = 100
    },
    end (e) {
      let index = Math.floor((e.changedTouches[0].pageX - (window.innerWidth - 350) / 2) / 35)
      console.log(index)
      this.pushCard(index)
    },
    pushCard (index) {
      if (index >= 0 && index <= 9) {
        const rowCards = this.contentCards[this.rowIndex]
        const movedCards = rowCards.splice(this.colIndex, rowCards.length - this.colIndex)
        const needShowCard = rowCards.pop()
        if (needShowCard) {
          needShowCard.showCard = true
          rowCards.push(needShowCard)
        }
        console.log(rowCards, movedCards)
        this.$set(this.contentCards, this.rowIndex, rowCards)
        // this.contentCards[this.rowIndex] = rowCards

        let addedCardsCol = this.contentCards[index]
        addedCardsCol = addedCardsCol.concat(movedCards)
        // console.log(addedCardsCol)
        this.$set(this.contentCards, index, addedCardsCol)
      }
    }
  }
}
</script>

<style scoped>
.card-row {
  width: 350px;
  margin: auto;
  position: relative;
  display: flex;
  justify-content: space-around;
}
.card-col {
  position: relative;
  width: 32px;
}
.card-item {
  position: absolute;
  width: 30px;
  height: 60px;
  /* line-height: 60px;
  text-align: center; */
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #eee;
}
</style>
