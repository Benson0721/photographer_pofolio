<script setup lang="ts">
import { ref } from "vue";

// 社交媒體連結數據
const socialMediaLinks = ref([
  { name: "Instagram", url: "https://www.instagram.com/paicheng0902/" },
  { name: "Github", url: "https://github.com/Benson0721" },
]);
</script>

<template>
  <footer class="footer">
    <div class="footer__content">
      <!-- 左側版權信息 -->
      <div class="footer__copyright font-noto">© 2025 by Mpass.</div>
      <!-- 右側社交媒體連結 -->

      <div class="footer__social font-noto">
        <a
          v-for="link in socialMediaLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__social-link"
        >
          {{ link.name }}
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background-color: #000; /* 黑色背景 */
  color: #fff; /* 白色文字 */
  padding: 3rem 2rem; /* 內邊距 */
  width: 100%;
}

.footer__content {
  display: flex;
  justify-content: space-around; /* 左右對齊 */
  align-items: center;
  max-width: 1200px; /* 最大寬度，根據需求調整 */
  margin: 0 auto; /* 居中 */
  font-size: 0.875rem; /* 字體大小，約 14px */
  font-family: Arial, sans-serif; /* 簡單字體 */
}

.footer__copyright {
  opacity: 0.8; /* 版權信息略透明 */
}

.footer__social {
  display: flex;
  gap: 1.5rem; /* 社交媒體連結之間的間距 */
}

.footer__social-link {
  color: #fff; /* 白色文字 */
  text-decoration: none; /* 移除下劃線 */
  opacity: 0.8; /* 略透明 */
  transition: opacity 0.3s ease; /* 懸停過渡效果 */

  &:hover {
    opacity: 1; /* 懸停時完全不透明 */
  }
}
</style>
