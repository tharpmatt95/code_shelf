<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const user = ref(null)
const message = ref('Loading...')

onMounted(async () => {
  try {
    const res = await axios.get('/auth/me')
    user.value = res.data
    message.value = ''
  } catch (err) {
    message.value = 'Not logged in'
  }
})
</script>

<template>
  <div style="max-width: 600px; margin: 0 auto;">
    <h2>User Profile</h2>

    <el-card v-if="user">
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Correct Questions:</strong> {{ user.correctQuestions.length }}</p>
      <p><strong>Joined:</strong> {{ new Date(user.createdAt).toLocaleString() }}</p>
      <p><strong>Last Login:</strong> {{ new Date(user.lastLoginAt).toLocaleString() }}</p>
    </el-card>

    <p v-else>{{ message }}</p>
  </div>
</template>
