import { ref } from "vue";

export function useUploadHandler(single = false) {
  const selectedFiles = ref([]);
  const previewUrls = ref([]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    selectedFiles.value.push(...files); // 儲存原始檔案
    previewUrls.value = selectedFiles.value.map((file) => ({
      file,
      src: URL.createObjectURL(file),
    }));
  };

  const resetUpload = () => {
    previewUrls.value.forEach((preview) => URL.revokeObjectURL(preview.src));
    previewUrls.value = [];
    selectedFiles.value = [];
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      // 模擬 change 事件，將拖放的檔案傳遞給 handleFileChange
      const fakeEvent = { target: { files } };
      handleFileChange(fakeEvent);
    }
  };

  return {
    selectedFiles,
    previewUrls,
    handleFileChange,
    resetUpload,
    handleDragOver,
    handleDrop,
  };
}
