// stores/data.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDataStore = defineStore('data', () => {
  const fileTypes = ref<Array<{ value: string, text: string }>>([]);
  const policeDepartments = ref<Array<{ value: string, text: string }>>([]);
  const policeStations = ref<Array<{ value: string, text: string }>>([]);
  const loading = ref(false);
  const uploadLoading = ref(false); // حالة تحميل الرفع

  const fetchEnums = async () => {
    loading.value = true; // بدء التحميل
    try {
      const response = await fetch('https://filee.runasp.net/api/Media/GetEnumsValues');
      const data = await response.json();
      console.log('Received data:', data);

      if (data.Filetype) {
        fileTypes.value = Object.keys(data.Filetype).map(key => ({ value: key, text: data.Filetype[key] }));
        console.log('fileTypes:', fileTypes.value);
      }

      if (data.PoliceDepartment) {
        policeDepartments.value = Object.keys(data.PoliceDepartment).map(key => ({ value: key, text: data.PoliceDepartment[key] }));
        console.log('policeDepartments:', policeDepartments.value);
      }

      if (data.PoliceStation) {
        policeStations.value = Object.keys(data.PoliceStation).map(key => ({ value: key, text: data.PoliceStation[key] }));
        console.log('policeStations:', policeStations.value);
      }
    } catch (error) {
      console.error('Failed to fetch enums:', error);
    } finally {
      loading.value = false; // انتهاء التحميل
    }
  };

  const uploadFile = async (file: File, fileName: string) => {
    uploadLoading.value = true;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);

    try {
      const response = await fetch('https://filee.runasp.net/api/Media/Upload', {
        method: 'POST',
        body: formData,
      });

      // تحقق من حالة الاستجابة
      if (!response.ok) {
        const errorText = await response.text(); // الحصول على نص الاستجابة
        console.error('Raw response:', errorText);
        throw new Error(`Failed to upload file: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response from server');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      uploadLoading.value = false;
    }
  };

  return { fileTypes, policeDepartments, policeStations, loading, fetchEnums, uploadFile, uploadLoading };
});
