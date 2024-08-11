<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>عدد الملفات المرفوعة</v-card-title>
          <v-card-text>{{ stats.totalFiles }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>إجمالي المساحة المستخدمة</v-card-title>
          <v-card-text>{{ formatSize(stats.totalSize) }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>تاريخ آخر عملية رفع</v-card-title>
          <v-card-text>{{ formatDate(stats.lastUploaded) }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const stats = ref({
  totalFiles: 0,
  totalSize: 0,
  lastUploaded: null,
});

const fetchStats = async () => {
  try {
    const response = await fetch('/api/stats');
    stats.value = await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};

const formatSize = (size) => {
  if (!size) return 'غير متوفر';
  const units = ['بايت', 'ك.ب', 'م.ب', 'ج.ب'];
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)} ${units[i]}`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'غير متوفر';
  const date = new Date(dateString);
  return date.toLocaleString();
};

onMounted(fetchStats);
</script>

<style scoped>
.v-card-title {
  font-size: 1.2rem;
  font-weight: bold;
}
.v-card-text {
  font-size: 1rem;
}
</style>
