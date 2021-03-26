import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyA1gasrBv-5gVE--5xLhF0JVY-2yy_w1c0',
  authDomain: 'house-work-de13e.firebaseapp.com',
  databaseURL: 'https://house-work-de13e.firebaseio.com',
  projectId: 'house-work-de13e',
  storageBucket: 'house-work-de13e.appspot.com',
  messagingSenderId: '798230945370',
  appId: '1:798230945370:web:36f1925413f2348c9fc263'
}

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

export { db, firebase, firebaseApp }
