<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const user = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get('/auth/me')
    user.value = res.data
  } catch (err) {
    console.log('Not logged in')
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

      <!-- Logged-in user -->
      <template v-else>
        <h2>User Profile</h2>

        <el-descriptions border column="2" size="large" class="left-text">
          <el-descriptions-item label="Email">
            {{ user.email }}
          </el-descriptions-item>

          <el-descriptions-item label="Python Correct">
            {{ user.correctPython.length }}
          </el-descriptions-item>

          <el-descriptions-item label="Film & TV Correct">
            {{ user.correctMovies.length }}
          </el-descriptions-item>

          <el-descriptions-item label="AWS Correct">
            {{ user.correctAWS.length }}
          </el-descriptions-item>

          <el-descriptions-item label="Joined">
            {{ new Date(user.createdAt).toLocaleString() }}
          </el-descriptions-item>

          <el-descriptions-item label="Last Login">
            {{ new Date(user.lastLoginAt).toLocaleString() }}
          </el-descriptions-item>
        </el-descriptions>

        <h3>Correctly Answered Questions</h3>

        <el-tabs type="border-card" class="left-text">

          <!-- PYTHON TAB -->
          <el-tab-pane label="Python">
            <template v-if="user.correctPython.length === 0">
              <el-empty description="No Python questions yet" />
            </template>

            <template v-else>
              <el-collapse accordion>
                <el-collapse-item
                  v-for="q in user.correctPython"
                  :key="q._id"
                  :title="q.title"
                >
                  <div class="item-block">
                    <strong>Code:</strong>
                    <pre class="code-block">{{ q.code }}</pre>
                  </div>

                  <div class="item-block">
                    <strong>Options:</strong>
                    <ul class="options-list">
                      <li v-for="(opt, i) in q.options" :key="i">
                        <span :class="{ correct: i === q.correctIndex }">
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
          </el-tab-pane>

          <!-- MOVIES TAB -->
          <el-tab-pane label="Movies">
            <template v-if="user.correctMovies.length === 0">
              <el-empty description="No movie questions yet" />
            </template>

            <template v-else>
              <el-collapse accordion>
                <el-collapse-item
                  v-for="q in user.correctMovies"
                  :key="q._id"
                  :title="q.title"
                >
                  <div class="item-block">
                    <strong>Options:</strong>
                    <ul class="options-list">
                      <li v-for="(opt, i) in q.options" :key="i">
                        <span :class="{ correct: i === q.correctIndex }">
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
          </el-tab-pane>

          <!-- AWS TAB -->
          <el-tab-pane label="AWS">
            <template v-if="user.correctAWS.length === 0">
              <el-empty description="No AWS questions yet" />
            </template>

            <template v-else>
              <el-collapse accordion>
                <el-collapse-item
                  v-for="q in user.correctAWS"
                  :key="q._id"
                  :title="q.title"
                >
                  <div class="item-block">
                    <strong>Options:</strong>
                    <ul class="options-list">
                      <li v-for="(opt, i) in q.options" :key="i">
                        <span :class="{ correct: i === q.correctIndex }">
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
          </el-tab-pane>

        </el-tabs>
      </template>
    </el-card>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 2rem auto;
}

.left-text {
  text-align: left !important;
}

.item-block {
  margin-bottom: 1rem;
  text-align: left;
}

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

.options-list {
  margin-top: 0.5rem;
  padding-left: 1.2rem;
}

.correct {
  color: #4ade80;
  font-weight: 600;
}
</style>
