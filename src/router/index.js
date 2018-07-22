import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Snake from '@/components/Snake'
import Eliminate from '@/components/Eliminate'
import PopBlock from '@/components/PopBlock'
import DragBlock from '@/components/DragBlock'
import Draw from '@/components/Draw'
import Date from '@/components/date-select'
import AbortUs from '@/components/AbortUs'

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
      path: '/date',
      name: 'Date',
      component: Date
    },
    {
      path: '/abort-us',
      name: 'AbortUs',
      component: AbortUs
    }
  ]
})
