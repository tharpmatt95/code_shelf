<script setup>
</script>

<template>
  <el-container style="height: 100vh;">
    <!-- TOP NAV BAR -->
    <el-header height="60px" style="display: flex; align-items: center; background: #f5f5f5;">
      <el-menu 
        mode="horizontal" 
        router
        :default-active="$route.path"
      >
      <el-menu-item index="/movies">Movies</el-menu-item>  
      <el-menu-item index="/python">Python</el-menu-item>
        <el-menu-item index="/login">Login</el-menu-item>
        <el-menu-item index="/user">User</el-menu-item>
        <el-menu-item index="/about">About</el-menu-item>
      </el-menu>
    </el-header>

    <!-- MAIN PAGE CONTENT -->
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>
