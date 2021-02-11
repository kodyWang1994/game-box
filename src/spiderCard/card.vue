<template>
  <div class="card-box">
    <template v-if="card.showCard && card.type === 'red_card'">
      <img v-if="card.name == 'A'" class="card" src="@/assets/cards/red_cards/A.png" />
      <img v-else-if="card.name == '2'" class="card" src="@/assets/cards/red_cards/2.png" />
      <img v-else-if="card.name == '3'" class="card" src="@/assets/cards/red_cards/3.png" />
      <img v-else-if="card.name == '4'" class="card" src="@/assets/cards/red_cards/4.png" />
      <img v-else-if="card.name == '5'" class="card" src="@/assets/cards/red_cards/5.png" />
      <img v-else-if="card.name == '6'" class="card" src="@/assets/cards/red_cards/6.png" />
      <img v-else-if="card.name == '7'" class="card" src="@/assets/cards/red_cards/7.png" />
      <img v-else-if="card.name == '8'" class="card" src="@/assets/cards/red_cards/8.png" />
      <img v-else-if="card.name == '9'" class="card" src="@/assets/cards/red_cards/9.png" />
      <img v-else-if="card.name == '10'" class="card" src="@/assets/cards/red_cards/10.png" />
      <img v-else-if="card.name == 'J'" class="card" src="@/assets/cards/red_cards/J.png" />
      <img v-else-if="card.name == 'Q'" class="card" src="@/assets/cards/red_cards/Q.png" />
      <img v-else-if="card.name == 'K'" class="card" src="@/assets/cards/red_cards/K.png" />
    </template>
    <template v-else-if="card.showCard && card.type === 'black_card'">
      <img v-if="card.name == 'A'" class="card" src="@/assets/cards/black_cards/A.png" />
      <img v-else-if="card.name == '2'" class="card" src="@/assets/cards/black_cards/2.png" />
      <img v-else-if="card.name == '3'" class="card" src="@/assets/cards/black_cards/3.png" />
      <img v-else-if="card.name == '4'" class="card" src="@/assets/cards/black_cards/4.png" />
      <img v-else-if="card.name == '5'" class="card" src="@/assets/cards/black_cards/5.png" />
      <img v-else-if="card.name == '6'" class="card" src="@/assets/cards/black_cards/6.png" />
      <img v-else-if="card.name == '7'" class="card" src="@/assets/cards/black_cards/7.png" />
      <img v-else-if="card.name == '8'" class="card" src="@/assets/cards/black_cards/8.png" />
      <img v-else-if="card.name == '9'" class="card" src="@/assets/cards/black_cards/9.png" />
      <img v-else-if="card.name == '10'" class="card" src="@/assets/cards/black_cards/10.png" />
      <img v-else-if="card.name == 'J'" class="card" src="@/assets/cards/black_cards/J.png" />
      <img v-else-if="card.name == 'Q'" class="card" src="@/assets/cards/black_cards/Q.png" />
      <img v-else-if="card.name == 'K'" class="card" src="@/assets/cards/black_cards/K.png" />
    </template>
    <template v-else-if="card.showCard && card.type === 'diamond_card'">
      <img v-if="card.name == 'A'" class="card" src="@/assets/cards/diamond_cards/A.png" />
      <img v-else-if="card.name == '2'" class="card" src="@/assets/cards/diamond_cards/2.png" />
      <img v-else-if="card.name == '3'" class="card" src="@/assets/cards/diamond_cards/3.png" />
      <img v-else-if="card.name == '4'" class="card" src="@/assets/cards/diamond_cards/4.png" />
      <img v-else-if="card.name == '5'" class="card" src="@/assets/cards/diamond_cards/5.png" />
      <img v-else-if="card.name == '6'" class="card" src="@/assets/cards/diamond_cards/6.png" />
      <img v-else-if="card.name == '7'" class="card" src="@/assets/cards/diamond_cards/7.png" />
      <img v-else-if="card.name == '8'" class="card" src="@/assets/cards/diamond_cards/8.png" />
      <img v-else-if="card.name == '9'" class="card" src="@/assets/cards/diamond_cards/9.png" />
      <img v-else-if="card.name == '10'" class="card" src="@/assets/cards/diamond_cards/10.png" />
      <img v-else-if="card.name == 'J'" class="card" src="@/assets/cards/diamond_cards/J.png" />
      <img v-else-if="card.name == 'Q'" class="card" src="@/assets/cards/diamond_cards/Q.png" />
      <img v-else-if="card.name == 'K'" class="card" src="@/assets/cards/diamond_cards/K.png" />
    </template>
    <template v-else-if="card.showCard && card.type === 'club_card'">
      <img v-if="card.name == 'A'" class="card" src="@/assets/cards/club_cards/A.png" />
      <img v-else-if="card.name == '2'" class="card" src="@/assets/cards/club_cards/2.png" />
      <img v-else-if="card.name == '3'" class="card" src="@/assets/cards/club_cards/3.png" />
      <img v-else-if="card.name == '4'" class="card" src="@/assets/cards/club_cards/4.png" />
      <img v-else-if="card.name == '5'" class="card" src="@/assets/cards/club_cards/5.png" />
      <img v-else-if="card.name == '6'" class="card" src="@/assets/cards/club_cards/6.png" />
      <img v-else-if="card.name == '7'" class="card" src="@/assets/cards/club_cards/7.png" />
      <img v-else-if="card.name == '8'" class="card" src="@/assets/cards/club_cards/8.png" />
      <img v-else-if="card.name == '9'" class="card" src="@/assets/cards/club_cards/9.png" />
      <img v-else-if="card.name == '10'" class="card" src="@/assets/cards/club_cards/10.png" />
      <img v-else-if="card.name == 'J'" class="card" src="@/assets/cards/club_cards/J.png" />
      <img v-else-if="card.name == 'Q'" class="card" src="@/assets/cards/club_cards/Q.png" />
      <img v-else-if="card.name == 'K'" class="card" src="@/assets/cards/club_cards/K.png" />
    </template>
    <template v-else>
      <transition name="fade" leave-active-class="flop-anim">
        <img class="card" src="@/assets/cards/back_blue.png" />
      </transition>
    </template>
  </div>
</template>

<script>
export default {
  name: 'card',
  props: {
    card: {
      type: Object
    }
  }
}
</script>

<style scoped>
.card-box {
  width: 100%;
  height: 100%;
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
</style>
