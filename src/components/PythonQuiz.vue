<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const questions = ref([])
const selectedIndex = ref(null)
const showAnswer = ref(false)

// Persistent correct count stored in MongoDB
const totalCorrect = ref(0)

// Default language
const selectedLang = 'python'

// Always shows first question
const currentQuestion = computed(() =>
  questions.value.length ? questions.value[0] : null
)


// -----------------------------------------------------
// INITIAL LOAD
// -----------------------------------------------------
onMounted(async () => {
  await loadUserCorrectCount()
  await loadInitialQuestions()
})


// -----------------------------------------------------
// Load initial unseen questions (or fallback)
// UPDATED to use languageId
// -----------------------------------------------------
async function loadInitialQuestions() {
  try {
    const res = await axios.get('/api/python/new', {
      params: { languageId: selectedLang }
    })
    questions.value = shuffle(res.data)
  } catch (_) {
    // fallback if /new not available
    const res = await axios.get('/api/python', {
      params: { languageId: selectedLang }
    })
    questions.value = shuffle(res.data)
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
// Load user correct count
// -----------------------------------------------------
async function loadUserCorrectCount() {
  try {
    const res = await axios.get('/auth/me')
    totalCorrect.value = res.data.correctQuestions.length
  } catch (_) {
    totalCorrect.value = 0
  }
}


// -----------------------------------------------------
// Option selection
// -----------------------------------------------------
function selectOption(index) {
  if (showAnswer.value) return
  selectedIndex.value = index
}


// -----------------------------------------------------
// Submit answer + update persistent score
// -----------------------------------------------------
async function submitAnswer() {
  if (!currentQuestion.value) return

  const isCorrect =
    selectedIndex.value === currentQuestion.value.correctIndex

  showAnswer.value = true

  if (isCorrect) {
    try {
      await axios.post('/api/python/mark-correct', {
        questionId: currentQuestion.value._id
      })

      await loadUserCorrectCount()
    } catch (err) {
      console.log('Failed to mark correct:', err)
    }
  }
}


// -----------------------------------------------------
// Load NEXT question
// -----------------------------------------------------
async function nextQuestion() {
  questions.value.shift()

  if (questions.value.length === 0) {
    try {
      const res = await axios.get('/api/python/new', {
        params: { languageId: selectedLang }
      })
      questions.value = shuffle(res.data)
    } catch (err) {
      const res = await axios.get('/api/python', {
        params: { languageId: selectedLang }
      })
      questions.value = shuffle(res.data)
    }
  }

  selectedIndex.value = null
  showAnswer.value = false
}
</script>



<template>
  <div class="quiz-card" v-if="currentQuestion">
    <header class="quiz-header">
      <h2>Code Quiz</h2>
      <p class="score">
        Correct: {{ totalCorrect }}
      </p>
    </header>

    <section class="question">
      <p class="question-title">{{ currentQuestion.title }}</p>

      <pre class="code"><code>{{ currentQuestion.code }}</code></pre>

      <ul class="options">
        <li
          v-for="(option, index) in currentQuestion.options"
          :key="index"
        >
          <button
            class="option-btn"
            :class="{
              selected: selectedIndex === index,
              correct: showAnswer && index === currentQuestion.correctIndex,
              incorrect:
                showAnswer &&
                selectedIndex === index &&
                index !== currentQuestion.correctIndex
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
          @click="nextQuestion"
          :disabled="!showAnswer"
        >
          Next
        </button>
      </div>

      <p v-if="showAnswer" class="feedback">
        <span v-if="selectedIndex === currentQuestion.correctIndex">
          Correct!
        </span>
        <span v-else>
          Not quite.  
          Correct answer:
          "{{ currentQuestion.options[currentQuestion.correctIndex] }}".
        </span>
      </p>

      <p v-if="showAnswer" class="explanation">
        {{ currentQuestion.explanation }}
      </p>
    </section>
  </div>

  <div v-else class="quiz-card">
    <p>No questions left 🎉</p>
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
</style>
