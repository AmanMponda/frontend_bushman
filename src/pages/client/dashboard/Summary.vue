<template>
  <div class="summary-card">
    <div class="analytics-header">
      <div>
        <h6 class="analytics-title">Summary</h6>
        <p class="analytics-subtitle">Quota overview 2024-2025</p>
      </div>
      <button class="refresh-btn" title="Refresh">
        <i class="bi bi-arrow-clockwise"></i>
      </button>
    </div>

    <div class="summary-stats">
      <div class="summary-item">
        <span class="summary-label">Utilization</span>
        <span class="summary-value" style="color: #3b82f6">85.4%</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Pending</span>
        <span class="summary-value" style="color: #f59e0b">35</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Available</span>
        <span class="summary-value" style="color: #10b981">297</span>
      </div>
    </div>

    <div class="summary-progress">
      <div class="progress-label">
        <span>Usage Rate</span>
        <span class="progress-percent">73%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 73%; background: #3b82f6"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.summary-card {
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

.summary-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.summary-label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.summary-value {
  font-size: 18px;
  font-weight: 700;
}

.summary-progress {
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
}

.progress-percent {
  color: #3b82f6;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}
</style>
