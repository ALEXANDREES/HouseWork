const routes = [
  {
    path: '/',
    component: () => import('layouts/LayoutLogin.vue'),
    children: [
      { path: '/', component: () => import('src/pages/Login.vue') },
      { path: 'Usuario', component: () => import('src/pages/Usuario.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('src/layouts/LayoutTelas.vue'),
    children: [
      { path: 'Principal', meta: { authRequired: true }, component: () => import('src/pages/Principal.vue') },
      { path: 'Supermercado', meta: { authRequired: true }, component: () => import('pages/Supermercado.vue') }
    ]
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
