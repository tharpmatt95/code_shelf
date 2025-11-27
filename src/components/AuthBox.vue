<script setup>
import axios from 'axios'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const message = ref('')

async function signup() {
  console.log('BASE URL:', axios.defaults.baseURL)

  try {
    await axios.post(
      '/auth/signup',
      {
        email: email.value,
        password: password.value
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    )

    message.value = 'Signup successful'

  } catch (err) {
    console.log(err)
    message.value =
      err.response?.data?.error ||
      err.message ||
      'Signup failed'
  }
}

async function login() {
  try {
    await axios.post(
      '/auth/login',
      {
        email: email.value,
        password: password.value
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    )

    message.value = 'Login successful'

  } catch (err) {
    console.log(err)
    message.value =
      err.response?.data?.error ||
      err.message ||
      'Login failed'
  }
}

async function logout() {
  try {
    await axios.post(
      '/auth/logout',
      {},
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    )

    message.value = 'Logged out'

  } catch (err) {
    console.log(err)
    message.value =
      err.response?.data?.error ||
      err.message ||
      'Logout failed'
  }
}
</script>

<template>
  <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc;">
    <h3>Auth</h3>

    <input v-model="email" type="email" placeholder="Email" />
    <br />
    <input v-model="password" type="password" placeholder="Password" />
    <br /><br />

    <button @click="signup">Sign Up</button>
    <button @click="login">Log In</button>
    <button @click="logout">Log Out</button>

    <p>{{ message }}</p>
  </div>
</template>
