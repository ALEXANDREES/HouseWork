import firebase from 'firebase'

export default ({ router, store }) => {
  router.beforeEach((to, from, next) => {
    const authRequired = to.matched.some(route => route.meta.authRequired)
    firebase.auth().onAuthStateChanged(function (user) {
      const isAuthenticated = !!user

      if (authRequired) {
        if (isAuthenticated) {
          next()
        } else {
          // console.log('isAuthenticated - Usuario não autenticado 1', isAuthenticated)
          next({ path: '/' })
        }
      } else {
        // console.log('authRequired - Rota não autenticada 1', authRequired)
        if (isAuthenticated) {
          // console.log('isAuthenticated - Usuario autenticado 2', isAuthenticated)
          next({ path: '/Principal' })
        } else {
          // console.log('isAuthenticated - Usuario não autenticado 3', isAuthenticated)
          next()
        }
      }
    })
  })
}
