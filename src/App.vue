<template>
  <div id="app">
    <h3>Firebase Data</h3>
    {{ firebaseData }}

    <h3>Form Data</h3>
    {{ formData }}

    <form @submit.prevent="updateFirebase">
      <input type="text" name="name" v-model="formData.name" />
      <input type="email" name="email" v-model="formData.email" />
      <input type="tel" name="phone" v-model="formData.phone" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import { db } from './firebase'
const documentPath = 'contacts/jeff'

export default {
  data() {
    return {
      firebaseData: null,
      formData: {}
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
    }
  },
  created: async function() {
    const docRef = db.doc(documentPath)

    let data = (await docRef.get()).data()
    if (!data) {
      data = { name: '', phone: '', email: '' }
    }
  }
}
</script>

<style></style>
