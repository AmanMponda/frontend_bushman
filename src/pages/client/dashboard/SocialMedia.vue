<template>
  <div class="social-media">
    <div class="analytics-header">
      <div>
        <h6 class="analytics-title">Social Media</h6>
        <p class="analytics-subtitle">Facebook page stats overview</p>
      </div>
      <button class="refresh-btn" title="Refresh">
        <i class="bi bi-arrow-clockwise"></i>
      </button>
    </div>

    <div class="social-stats">
      <div class="social-stat-item">
        <div class="social-icon likes">
          <i class="bi bi-hand-thumbs-up"></i>
        </div>
        <div class="social-value">306.5k</div>
        <div class="social-label">Likes</div>
      </div>

      <div class="social-stat-item">
        <div class="social-icon comments">
          <i class="bi bi-chat"></i>
        </div>
        <div class="social-value">27.5k</div>
        <div class="social-label">Comments</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.social-media {
  height: 100%;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.analytics-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.analytics-subtitle {
  font-size: 13px;
  color: #666;
  margin: 4px 0 0 0;
}

.refresh-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  cursor: pointer;
  color: #999;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover {
  background: #e5e7eb;
  color: #666;
}

.social-stats {
  display: flex;
  gap: 24px;
}

.social-stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.social-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
}

.social-icon.likes {
  background: #3b82f6;
}

.social-icon.comments {
  background: #3b82f6;
}

.social-value {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
}

.social-label {
  font-size: 13px;
  color: #666;
  text-align: center;
}
</style>
