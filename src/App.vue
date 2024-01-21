<template>
  <v-app>
    <v-app-bar>
      <!-- 如果用container的話會跑版 要自己補display flex -->
      <v-container class="d-flex align-center">
        <v-app-bar-title>
          <i></i>
          小鬼鐘
        </v-app-bar-title>
        <v-btn prepend-icon="mdi-home" to="/">首頁</v-btn>
        <v-btn prepend-icon="mdi-list-status" to="/list">事項</v-btn>
        <v-btn prepend-icon="mdi-cog" to="/settings">設定</v-btn>
      </v-container>
    </v-app-bar>
    <!-- 網頁主體 -->
    <v-main>
      <!-- Component = 目前該顯示的路由元件 -->
      <router-view v-slot="{ Component }">
        <!--
          keep-alive 保持被包住的元件不被銷毀
          使用 include 指定快取 只有HomeView這個元件不被銷毀
        -->
        <!--
          component = 動態元件
          會使用/顯示 is 綁定的元件
        -->
        <keep-alive include="HomeView">
          <component :is="Component"></component>
        </keep-alive>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>

</script>
