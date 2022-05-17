import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Snake from '@/components/Snake'
import Eliminate from '@/components/Eliminate'
import PopBlock from '@/components/PopBlock'
import DragBlock from '@/components/DragBlock'
import Draw from '@/components/Draw'
import Color from '@/components/Color'
import Picture from '@/components/Picture'
import NumberEliminate from '@/components/NumberEliminate'
import Date from '@/components/DateSelect'
import AbortUs from '@/components/AbortUs'
import SpiderCard from '@/spiderCard/index'
import MineSweeping from '@/mineSweeping/index'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/snake',
      name: 'Snake',
      component: Snake
    },
    {
      path: '/eliminate',
      name: 'Eliminate',
      component: Eliminate
    },
    {
      path: '/pop-block',
      name: 'PopBlock',
      component: PopBlock
    },
    {
      path: '/drag-block',
      name: 'DragBlock',
      component: DragBlock
    },
    {
      path: '/draw',
      name: 'Draw',
      component: Draw
    },
    {
      path: '/color',
      name: 'Color',
      component: Color
    },
    {
      path: '/picture',
      name: 'Picture',
      component: Picture
    },
    {
      path: '/number-eliminate',
      name: 'NumberEliminate',
      component: NumberEliminate
    },
    {
      path: '/date',
      name: 'Date',
      component: Date
    },
    {
      path: '/spider-card',
      name: 'SpiderCard',
      component: SpiderCard
    },
    {
      path: '/mine-sweeping',
      name: 'MineSweeping',
      component: MineSweeping
    },
    {
      path: '/abort-us',
      name: 'AbortUs',
      component: AbortUs
    }
  ]
})
