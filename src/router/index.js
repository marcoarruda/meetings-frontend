import Vue from 'vue'
import VueRouter from 'vue-router'
import Calendario from '../views/Calendario.vue'
import Relatorio from '../views/Relatorio.vue'
import Login from '../views/Login.vue'
import Erro404 from '../views/Erro404.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'calendario',
    component: Calendario
  },
  {
    path: '/relatorio',
    name: 'relatorio',
    component: Relatorio
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '*',
    name: 'erro404',
    component: Erro404
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
