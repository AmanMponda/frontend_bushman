<template>
  <div class="recent-activity">
    <div class="analytics-header">
      <div>
        <h6 class="analytics-title">Recent Activity</h6>
        <p class="analytics-subtitle">Latest quota actions</p>
      </div>
      <button class="refresh-btn" title="Refresh">
        <i class="bi bi-arrow-clockwise"></i>
      </button>
    </div>

    <div class="activity-list">
      <div class="activity-item">
        <div class="activity-dot" style="background: #10b981"></div>
        <div class="activity-content">
          <div class="activity-action">Quota Confirmed</div>
          <div class="activity-time">2 hours ago</div>
        </div>
        <div class="activity-badge" style="background: #d1fae5; color: #065f46">+15</div>
      </div>

      <div class="activity-item">
        <div class="activity-dot" style="background: #f59e0b"></div>
        <div class="activity-content">
          <div class="activity-action">Quota Provisioned</div>
          <div class="activity-time">4 hours ago</div>
        </div>
        <div class="activity-badge" style="background: #fef3c7; color: #92400e">+23</div>
      </div>

      <div class="activity-item">
        <div class="activity-dot" style="background: #ef4444"></div>
        <div class="activity-content">
          <div class="activity-action">Quota Cancelled</div>
          <div class="activity-time">6 hours ago</div>
        </div>
        <div class="activity-badge" style="background: #fee2e2; color: #7f1d1d">-8</div>
      </div>

      <div class="activity-item">
        <div class="activity-dot" style="background: #3b82f6"></div>
        <div class="activity-content">
          <div class="activity-action">Quota Taken</div>
          <div class="activity-time">1 day ago</div>
        </div>
        <div class="activity-badge" style="background: #dbeafe; color: #1e3a8a">+2</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.recent-activity {
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

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-action {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.activity-time {
  font-size: 12px;
  color: #999;
}

.activity-badge {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  flex-shrink: 0;
}
</style>
