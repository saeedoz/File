<template>
  <v-container>
    <v-select
      v-model="selectedFileType"
      :items="fileTypes"
      label="نوع الملف"
      item-title="text"
      item-value="value"
      :loading="loading"
    ></v-select>
    <v-select
      v-model="selectedPoliceDepartment"
      :items="policeDepartments"
      label="قسم الشرطة"
      item-title="text"
      item-value="value"
      :loading="loading"
    ></v-select>
    <v-select
      v-model="selectedPoliceStation"
      :items="policeStations"
      label="مركز الشرطة"
      item-title="text"
      item-value="value"
      :loading="loading"
    ></v-select>
    <v-file-input
      v-model="selectedFile"
      label="اختيار الملف"
      :loading="uploadLoading"
      @change="onFileChange"
    ></v-file-input>
    <v-text-field
      v-model="fileName"
      label="اسم الملف"
    ></v-text-field>
    <v-btn :loading="uploadLoading" @click="onUpload">رفع</v-btn>
    <v-alert v-if="errorMessage" type="error" dismissible>
      {{ errorMessage }}
    </v-alert>
    <v-alert v-if="successMessage" type="success" dismissible>
      {{ successMessage }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { useDataStore } from '~/stores/data';
import { onMounted, ref, computed } from 'vue';

const store = useDataStore();
const selectedFileType = ref<string | null>(null);
const selectedPoliceDepartment = ref<string | null>(null);
const selectedPoliceStation = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
const fileName = ref<string>('');
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

onMounted(async () => {
  await store.fetchEnums();
});

const fileTypes = computed(() => store.fileTypes);
const policeDepartments = computed(() => store.policeDepartments);
const policeStations = computed(() => store.policeStations);
const loading = computed(() => store.loading);
const uploadLoading = computed(() => store.uploadLoading);

const onFileChange = (file: File) => {
  selectedFile.value = file;
};

const onUpload = async () => {
  errorMessage.value = null;
  successMessage.value = null;

  if (selectedFile.value && fileName.value) {
    try {
      await store.uploadFile(selectedFile.value, fileName.value);
      successMessage.value = 'تم رفع الملف بنجاح!';
    } catch (error) {
      errorMessage.value = 'حدث خطأ أثناء رفع الملف: ';
    }
  } else {
    errorMessage.value = 'يرجى اختيار ملف وإدخال اسم الملف';
  }
};
</script>

<style scoped>
.v-select {
  margin-bottom: 20px;
}
</style>
