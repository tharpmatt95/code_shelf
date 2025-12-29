<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const sports = ref([])
const selectedIndex = ref(null)
const showAnswer = ref(false)

// persistent correct count (stored in DB for user)
const totalCorrect = ref(0)

// always use sports[0]
const currentSport = computed(() =>
  sports.value.length ? sports.value[0] : null
)

// -----------------------------------------------------
// INITIAL LOAD
// -----------------------------------------------------
onMounted(async () => {
  await loadUserCorrectCount()
  await loadInitialSports()
})

// Load initial unseen sports trivia questions
async function loadInitialSports() {
  try {
    const res = await axios.get('/api/sports/new')
    sports.value = shuffle(res.data)
  } catch (_) {
    const res = await axios.get('/api/sports')
    sports.value = shuffle(res.data)
  }
}

// -----------------------------------------------------
// Shuffle Helper
// -----------------------------------------------------
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// -----------------------------------------------------
// Load persistent correct count from server
// -----------------------------------------------------
async function loadUserCorrectCount() {
  try {
    const res = await axios.get('/auth/me')
    totalCorrect.value = res.data.correctSports.length
  } catch (_) {
    totalCorrect.value = 0
  }
}

// -----------------------------------------------------
// Selecting an option
// -----------------------------------------------------
function selectOption(index) {
  if (showAnswer.value) return
  selectedIndex.value = index
}

// -----------------------------------------------------
// Submit answer + update persistent correct count
// -----------------------------------------------------
async function submitAnswer() {
  if (!currentSport.value) return

  const isCorrect =
    selectedIndex.value === currentSport.value.correctIndex

  showAnswer.value = true

  if (isCorrect) {
    try {
      await axios.post('/api/sports/mark-correct', {
        sportsId: currentSport.value._id
      })

      await loadUserCorrectCount()
    } catch (err) {
      console.log('Failed to mark correct:', err)
    }
  }
}

// -----------------------------------------------------
// Load NEXT sports question
// -----------------------------------------------------
async function nextSport() {
  sports.value.shift()

  if (sports.value.length === 0) {
    try {
      const res = await axios.get('/api/sports/new')
      sports.value = shuffle(res.data)
    } catch (err) {
      const res = await axios.get('/api/sports')
      sports.value = shuffle(res.data)
    }
  }

  selectedIndex.value = null
  showAnswer.value = false
}
</script>

<template>
  <div class="quiz-card" v-if="currentSport">
    <header class="quiz-header">
      <h2>Sports</h2>
      <p class="score">Correct: {{ totalCorrect }}</p>
    </header>

    <section class="question">
      <p class="question-title">{{ currentSport.title }}</p>

      <ul class="options">
        <li
          v-for="(option, index) in currentSport.options"
          :key="index"
        >
          <button
            class="option-btn"
            :class="{
              selected: selectedIndex === index,
              correct: showAnswer && index === currentSport.correctIndex,
              incorrect:
                showAnswer &&
                selectedIndex === index &&
                index !== currentSport.correctIndex
            }"
            @click="selectOption(index)"
          >
            {{ option }}
          </button>
        </li>
      </ul>

      <div class="actions">
        <button
          class="primary"
          @click="submitAnswer"
          :disabled="selectedIndex === null || showAnswer"
        >
          Check answer
        </button>

        <button
          class="secondary"
          @click="nextSport"
          :disabled="!showAnswer"
        >
          Next
        </button>
      </div>

      <p v-if="showAnswer" class="feedback">
        <span v-if="selectedIndex === currentSport.correctIndex">
          Correct!
        </span>
        <span v-else>
          Not quite.  
          Correct answer:
          "{{ currentSport.options[currentSport.correctIndex] }}".
        </span>
      </p>
    </section>
  </div>

  <div v-else class="quiz-card">
    <p>No sports questions left 🎉</p>
  </div>
</template>

<style scoped>
/* DARK THEME */

.quiz-card {
  max-width: 640px;
  margin: 2rem auto;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  background: #0d0d0d;
  border: 1px solid #252525;
  color: #e5e5e5;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;
}

.quiz-header h2 {
  margin: 0;
  color: #fafafa;
}

.score {
  font-size: 0.9rem;
  color: #bbbbbb;
}

.question-title {
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #dddddd;
}

.code {
  background: #111111;
  color: #e0e0e0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1rem;
  border: 1px solid #333;
}

.options {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
}

.option-btn {
  width: 100%;
  text-align: left;
  padding: 0.6rem 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  border: 1px solid #3a3a3a;
  background: #1b1b1b;
  color: #e5e5e5;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.option-btn:hover {
  border-color: #6666ff;
  background: #232323;
}

.option-btn.selected {
  border-color: #818cf8;
  background: #252559;
}

.option-btn.correct {
  background: #0f3d24;
  border-color: #16a34a;
}

.option-btn.incorrect {
  background: #4b0f16;
  border-color: #dc2626;
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.actions button {
  flex: 1;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.primary {
  background: #4f46e5;
  color: white;
}

.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secondary {
  background: #333;
  color: #ddd;
}

.feedback {
  margin-top: 0.25rem;
}

.explanation {
  font-size: 0.9rem;
  margin-top: 0.25rem;
  color: #bbbbbb;
}

.quiz-card {
  text-align: left;
}
</style>
