<template>
  <div id="app">
    <h3>Firebase Data</h3>
    {{ firebaseData }}

    <h3>Form Data</h3>
    {{ formData }}

    <div v-if="state === 'synced'">
      Form is synced with Firestore
    </div>
    <div v-else-if="state === 'modified'">
      Form data changed, will sync with Firebase
    </div>
    <div v-else-if="state === 'error'">
      Failed to save to Firestore. {{ errorMessage }}
    </div>
    <div v-else-if="state === 'loading'">
      Loading...
    </div>

    <form @submit.prevent="updateFirebase" @input="fieldUpdate">
      <input type="text" name="name" v-model="formData.name" />
      <input type="email" name="email" v-model="formData.email" />
      <input type="tel" name="phone" v-model="formData.phone" />
      <button type="submit">Submit</button>
    </form>
    <button @click="revertToOriginal">Revert to original data</button>
  </div>
</template>

<script>
import { db } from './firebase'
import { debounce } from 'debounce'
const documentPath = 'contacts/jeff'

export default {
  data() {
    return {
      firebaseData: null,
      formData: {},
      state: 'loading',
      errorMessage: '',

      originalData: null
    }
  },
  firestore() {
    return {
      firebaseData: db.doc(documentPath)
    }
  },
  methods: {
    async updateFirebase() {
      try {
        await db.doc(documentPath).set(this.formData)
        this.state = 'synced'
      } catch (err) {
        this.errorMessage = JSON.stringify(err)
        this.state = 'error'
      }
    },
    fieldUpdate() {
      this.state = 'modified'
      this.debounceUpdate()
    },
    debounceUpdate: debounce(function() {
      this.updateFirebase()
    }, 1500),
    revertToOriginal() {
      this.state = 'revoked'
      this.formData = { ...this.originalData }
    }
  },
  created: async function() {
    const docRef = db.doc(documentPath)

    let data = (await docRef.get()).data()
    if (!data) {
      data = { name: '', phone: '', email: '' }
      docRef.set(data)
    }
    this.formData = data
    this.originalData = { ...data }
    this.state = 'synced'
  }
}
</script>

<style></style>
