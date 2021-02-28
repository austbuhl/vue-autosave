<template>
  <div id="app">
    <div class="notification is-success" v-if="state === 'synced'">
      Form is synced with Firestore
    </div>
    <div class="notification is-link" v-else-if="state === 'modified'">
      From data changed, will sync with Firebase
    </div>
    <div class="notification is-warning" v-else-if="state === 'revoked'">
      From data and Firebase revoked to original data
    </div>
    <div class="notification is-danger" v-else-if="state === 'error'">
      Failed to save to Firestore. {{ errorMessage }}
    </div>
    <div class="notification is-info" v-else-if="state === 'loading'">
      Loading...
    </div>
    <hr />

    <div class="columns">
      <div class="column">
        <h3>Form Data</h3>
        <br />
        {{ formData }}
      </div>
      <div class="column">
        <h3>Firebase Data</h3>
        <br />
        {{ firebaseData }}
      </div>
    </div>

    <form @submit.prevent="updateFirebase" @input="fieldUpdate">
      <div class="field is-horizontal">
        <div class="field label is-normal">
          <label class="label">Contact</label>
        </div>

        <div class="field-body">
          <div class="field">
            <p class="control is-expanded has-icons-left">
              <input
                class="input"
                type="text"
                name="name"
                v-model="formData.name"
              />
              <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
              </span>
            </p>
          </div>
          <div class="field">
            <p class="control is-expanded has-icons-left has-icons-right">
              <input
                class="input"
                type="email"
                name="email"
                v-model="formData.email"
              />
              <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Phone</label>
        </div>
        <div class="field-body">
          <div class="field is-expanded">
            <div class="field has-addons">
              <p class="control">
                <a class="button is-static">+1</a>
              </p>
              <p class="control is-expanded">
                <input
                  class="input"
                  type="tel"
                  name="phone"
                  v-model="formData.phone"
                />
              </p>
            </div>
            <p class="help">Do not enter the first zero</p>
          </div>
        </div>
      </div>
      <hr />
      Vue Form State: {{ state == '' ? 'waiting for changes' : state }}
      <hr />
      <button
        class="button is-success"
        type="submit"
        v-if="state === 'modified'"
      >
        Save Changes
      </button>
    </form>
    <button class="button is-warning is-rounded" @click="revokeData">
      <span class="icon">
        <i class="fas fa-undo"></i>
      </span>
      <span>Revoke to original data</span>
    </button>
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
    revokeData() {
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

<style>
h1,
h2,
h3 {
  font-weight: 600;
}
#app {
  font-family: 'sofia-pro', sans-serif;
  text-align: center;
  padding: 10vh 15vw;
}
p.help {
  text-align: left;
}
</style>
