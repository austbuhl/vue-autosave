import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyA4LbcUAs9umRQ8ILBJiwdPdMeU0lO39cA',
  authDomain: 'vue-autosave-26709.firebaseapp.com',
  projectId: 'vue-autosave-26709',
  storageBucket: 'vue-autosave-26709.appspot.com',
  messagingSenderId: '954221098074',
  appId: '1:954221098074:web:c5a3190a9ae43283245463',
  measurementId: 'G-EDGXM8VVST'
}

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()

export { db }
