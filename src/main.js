import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import TodoList from './components/TodoList.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: TodoList
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
