import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/system/LoginView.vue'),
    },
    {
      path: '/display',
      name: 'display',
      component: () => import('../views/display/DisplayView.vue'),
      redirect: '/display/circle',
      children: [
        {
          path: 'publish',
          name: 'display-publish',
          component: () => import('../components/publish/index.vue'),
        },
        {
          path: 'circle',
          name: 'display-circle',
          component: () => import('../components/circle/index.vue'),
        },
        {
          path: 'social',
          name: 'display-social',
          component: () => import('../components/social/index.vue'),
        },
        {
          path: 'chat',
          name: 'display-chat',
          component: () => import('../components/chat/index.vue'),
        },
        {
          path: 'profile',
          name: 'display-profile',
          component: () => import('../components/profile/index.vue'),
        },
      ],
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/system/RegisterView.vue'),
    },
  ],
})
