<template>
  <v-container>
    <!-- حقل البحث -->
    <v-text-field
      v-model="search"
      label="بحث"
      variant="outlined"
      class="mb-4"
    ></v-text-field>

    <!-- DataTable لعرض الملفات -->
    <v-data-table
      :headers="headers"
      :items="filteredFiles"
      class="elevation-1"
      item-key="name"
    >
      <!-- تعريف الأعمدة والإجراءات -->
      <template v-slot:[`item.index`]="{ index }">
        {{ index + 1 }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="confirmDownload(item)">
          mdi-download
        </v-icon>
        <v-icon small class="mr-2" @click="showDetails(item)">
          mdi-information
        </v-icon>
        <v-icon small @click="confirmDelete(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <!-- Dialog لتأكيد التنزيل -->
    <v-dialog v-model="downloadDialogVisible" max-width="290">
      <v-card>
        <v-card-title class="headline">تأكيد التنزيل</v-card-title>
        <v-card-text>
          هل أنت متأكد أنك تريد تنزيل الملف "{{ fileToDownload?.name }}"؟
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-1" text @click="downloadFile">نعم</v-btn>
          <v-btn color="red darken-1" text @click="closeDownloadDialog">لا</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog لعرض تفاصيل الملف -->
    <v-dialog v-model="detailsDialogVisible" max-width="500">
      <v-card>
        <v-card-title class="headline">تفاصيل الملف</v-card-title>
        <v-card-text>
          <div><strong>اسم الملف:</strong> {{ selectedFile?.name }}</div>
          <div><strong>حجم الملف:</strong> {{ formatSize(selectedFile?.size) }}</div>
          <div><strong>تاريخ التحميل:</strong> {{ formatDate(selectedFile?.uploadedAt) }}</div>
          <div><strong>نوع الملف:</strong> {{ selectedFile?.type }}</div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="closeDetailsDialog">إغلاق</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog لتأكيد الحذف -->
    <v-dialog v-model="dialogVisible" max-width="290">
      <v-card>
        <v-card-title class="headline">تأكيد الحذف</v-card-title>
        <v-card-text>
          هل أنت متأكد أنك تريد حذف الملف "{{ fileToDelete?.name }}"؟
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-1" text @click="deleteFile">نعم</v-btn>
          <v-btn color="red darken-1" text @click="closeDialog">لا</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const headers = ref([
  { text: 'رقم', value: 'index', width: '80' },
  { text: 'اسم الملف', value: 'name' },
  { text: 'نوع الملف', value: 'type' },
  { text: 'حجم الملف', value: 'size' },
  { text: 'تاريخ التحميل', value: 'uploadedAt' },
  { text: 'الإجراءات', value: 'actions', sortable: false },
])

const files = ref([])
const dialogVisible = ref(false) // لمربع الحذف
const downloadDialogVisible = ref(false) // لمربع التنزيل
const detailsDialogVisible = ref(false) // لمربع تفاصيل الملف
const fileToDelete = ref(null)
const fileToDownload = ref(null)
const selectedFile = ref(null)
const search = ref('') // مقياس البحث

const fetchFiles = async () => {
  try {
    const response = await fetch('/api/files')
    files.value = await response.json()
  } catch (error) {
    console.error('Error fetching files:', error)
  }
}

// حقل البحث: تصفية الملفات بناءً على البحث
const filteredFiles = computed(() => {
  if (!search.value) {
    return files.value
  }
  const searchTerm = search.value.toLowerCase()
  return files.value.filter(file => file.name.toLowerCase().includes(searchTerm))
})

const confirmDownload = (file) => {
  fileToDownload.value = file
  downloadDialogVisible.value = true
}

const downloadFile = () => {
  if (fileToDownload.value) {
    const link = document.createElement('a')
    link.href = `/api/files/${encodeURIComponent(fileToDownload.value.name)}/download`
    link.download = fileToDownload.value.name
    link.click()
    fileToDownload.value = null
    closeDownloadDialog()
  }
}

const showDetails = (file) => {
  selectedFile.value = file
  detailsDialogVisible.value = true
}

const formatSize = (size) => {
  if (!size) return 'غير متوفر'
  const units = ['بايت', 'ك.ب', 'م.ب', 'ج.ب']
  let i = 0
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }
  return `${size.toFixed(2)} ${units[i]}`
}

const formatDate = (dateString) => {
  if (!dateString) return 'غير متوفر'
  const date = new Date(dateString)
  return date.toLocaleString()
}

const confirmDelete = (file) => {
  fileToDelete.value = file
  dialogVisible.value = true
}

const deleteFile = async () => {
  if (fileToDelete.value) {
    try {
      const response = await fetch(`/api/files/${encodeURIComponent(fileToDelete.value.name)}`, { method: 'DELETE' });

      if (response.ok) {
        files.value = files.value.filter(f => f.name !== fileToDelete.value.name);
        fileToDelete.value = null;
        closeDialog();
      } else {
        console.error('Error deleting file:', await response.json());
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
}

const closeDialog = () => {
  dialogVisible.value = false
}

const closeDownloadDialog = () => {
  downloadDialogVisible.value = false
}

const closeDetailsDialog = () => {
  detailsDialogVisible.value = false
}

onMounted(fetchFiles)
</script>

<style scoped>
.v-icon {
  cursor: pointer;
}
</style>
