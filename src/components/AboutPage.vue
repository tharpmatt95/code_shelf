<script setup>
</script>

<template>
  <div class="about-wrapper">
    <el-card class="about-card" shadow="hover">
      <div class="content">
        <h2>About This Project</h2>

        <p>
          This web application helps developers improve their coding skills
          through interactive multiple-choice questions. Each question is crafted
          to reinforce programming fundamentals, with instant feedback and clear,
          concise explanations.
        </p>

        <p>
          When you're logged in, your progress is automatically tracked. Any
          question you answer correctly is removed from the rotation, ensuring
          each new question helps expand your knowledge rather than repeat what
          you already know.
        </p>

        <h3>Technology Stack</h3>
        <ul>
          <li><strong>Vue 3</strong> — frontend UI framework</li>
          <li><strong>Element Plus</strong> — modern component library</li>
          <li><strong>Express.js</strong> — backend API server</li>
          <li><strong>MongoDB</strong> — database for questions & user progress</li>
        </ul>

        <h3>Upcoming Features</h3>
        <ul>
          <li>Difficulty selection & topic filters</li>
          <li>Daily streaks and XP system</li>
          <li>Review page for missed or difficult questions</li>
          <li>Full question library browser</li>
        </ul>

        <p>
          Thank you for using this platform — more improvements are on the way!
        </p>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.about-wrapper {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.about-card {
  background: #0d0d0d;
  border: 1px solid #252525;
  color: #e5e5e5;
  padding: 24px;
}

.content {
  text-align: left; /* ← ensures everything is aligned left */
  line-height: 1.7;
}

h2, h3 {
  color: #fafafa;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

ul {
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

li {
  margin-bottom: 0.4rem;
}
</style>
