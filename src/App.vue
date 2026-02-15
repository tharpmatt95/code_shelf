<script setup>
import { useRouter, useRoute } from 'vue-router'
import { Cpu, Football, VideoCamera, Cloudy, DocumentCopy, User, UserFilled, InfoFilled } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const tiles = [
  { title: 'Engineering', route: '/engineering', icon: Cpu },
  { title: 'Sports', route: '/sports', icon: Football },
  { title: 'Entertainment', route: '/movies', icon: VideoCamera },
  { title: 'AWS', route: '/aws', icon: Cloudy },
  { title: 'Python', route: '/python', icon: DocumentCopy },
  { title: 'Login', route: '/login', icon: User },
  { title: 'User', route: '/user', icon: UserFilled },
  { title: 'About', route: '/about', icon: InfoFilled }
]

const handleTileClick = (routePath) => {
  if (route.path !== routePath) {
    router.push(routePath)
  }
}
</script>

<template>
  <el-container style="height: 100vh;">
    <el-header height="60px" style="display: flex; align-items: center; background: #f5f5f5;">
      <el-menu 
        mode="horizontal" 
        router
        :default-active="$route.path"
      >
        <el-menu-item index="/">Dashboard</el-menu-item>
        <el-menu-item index="/engineering">Engineering</el-menu-item>  
        <el-menu-item index="/sports">Sports</el-menu-item>
        <el-menu-item index="/movies">Entertainment</el-menu-item>  
        <el-menu-item index="/aws">AWS</el-menu-item>
        <el-menu-item index="/python">Python</el-menu-item>
        <el-menu-item index="/login">Login</el-menu-item>
        <el-menu-item index="/user">User</el-menu-item>
        <el-menu-item index="/about">About</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <div v-if="route.path === '/'" class="dashboard-grid">
        <div
          v-for="tile in tiles"
          :key="tile.route"
          class="tile-card"
          @click="handleTileClick(tile.route)"
        >
          <component :is="tile.icon" class="tile-icon" />
          <span class="tile-title">{{ tile.title }}</span>
        </div>
      </div>
      <router-view v-else />
    </el-main>
  </el-container>
</template>

<style scoped>
.dashboard-grid {
  display: grid;
  width: 75vw;
  height: 50vh;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  grid-auto-rows: 1fr;
  gap: 0;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  background: #f5f5f5;
}
.tile-card {
  background: white;
  height: 80%;
  width: 80%;
  border-radius: 0;
  box-shadow: none;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: box-shadow .15s, transform .14s;
}
.tile-card:hover {
  transform: scale(1.03);
  box-shadow: 0 2px 12px rgba(54,113,199,0.08);
}
.tile-icon {
  font-size: 2.2rem;
  color: #409EFF;
  margin-bottom: 1rem;
}
.tile-title {
  font-size: 1.13rem;
  font-weight: 600;
  color: #222;
  letter-spacing: 0.5px;
}
</style>