<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const user = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get('/auth/me')
    user.value = res.data
  } catch (err) {
    ElMessage.error('You are not logged in')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container">

    <el-card shadow="hover">

      <!-- Loading -->
      <template v-if="loading">
        <el-skeleton :rows="5" animated />
      </template>

      <!-- Not logged in -->
      <template v-else-if="!user">
        <el-empty description="Not logged in" />
      </template>

      <!-- User data -->
      <template v-else>
        
        <h2>User Profile</h2>

        <el-descriptions border column="2" size="large" class="left-text">
          <el-descriptions-item label="Email">
            {{ user.email }}
          </el-descriptions-item>

          <el-descriptions-item label="Correct Questions">
            {{ user.correctQuestions.length }}
          </el-descriptions-item>

          <el-descriptions-item label="Joined">
            {{ new Date(user.createdAt).toLocaleString() }}
          </el-descriptions-item>

          <el-descriptions-item label="Last Login">
            {{ new Date(user.lastLoginAt).toLocaleString() }}
          </el-descriptions-item>
        </el-descriptions>

        <h3>Correctly Answered Questions</h3>

        <el-empty
          v-if="user.correctQuestions.length === 0"
          description="No correct questions yet"
        />

        <el-collapse v-else accordion class="left-text">
          <el-collapse-item
            v-for="q in user.correctQuestions"
            :key="q._id"
            :title="q.title"
          >
            <div class="item-block">
              <strong>Language:</strong> {{ q.language }}
            </div>

            <div class="item-block">
              <strong>Code:</strong>
              <pre class="code-block">{{ q.code }}</pre>
            </div>

            <div class="item-block">
              <strong>Options:</strong>
              <ul class="options-list">
                <li
                  v-for="(opt, i) in q.options"
                  :key="i"
                >
                  <span
                    :class="{
                      correct: i === q.correctIndex,
                      normal: i !== q.correctIndex
                    }"
                  >
                    {{ opt }}
                    <span v-if="i === q.correctIndex">(correct)</span>
                  </span>
                </li>
              </ul>
            </div>

            <div class="item-block">
              <strong>Explanation:</strong>
              <p>{{ q.explanation }}</p>
            </div>

          </el-collapse-item>
        </el-collapse>

      </template>
    </el-card>

  </div>
</template>

<style scoped>
/* Main container */
.container {
  max-width: 900px;
  margin: 2rem auto;
}

/* Force ALL content left */
.left-text {
  text-align: left !important;
}

/* Collapse item spacing */
.item-block {
  margin-bottom: 1rem;
  text-align: left;
}

/* Code block styling */
.code-block {
  background: #111;
  color: #eee;
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 0.5rem;
  white-space: pre-wrap;
  overflow-x: auto;
  border: 1px solid #333;
}

/* Options list */
.options-list {
  margin-top: 0.5rem;
  padding-left: 1.2rem;
}

.correct {
  color: #4ade80;
  font-weight: 600;
}

.normal {
  color: #ddd;
}
</style>
