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
          next({ path: '/' })
        }
      } else {
        if (isAuthenticated) {
          next({ path: '/Principal' })
        } else {
          next()
        }
      }
    })
  })
}
