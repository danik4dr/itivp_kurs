import axios from "axios";

export const BASE_URL = "http://localhost/backend";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: true, 
});

instance.interceptors.response.use(
  (response) => {
    return response.data || response;
  },
  (error) => {
    console.error("API Error:", error.response || error);
    
    if (error.response) {
      const message = error.response.data?.error || 
                     error.response.data?.message || 
                     `HTTP Error ${error.response.status}`;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(new Error("No response from server. Check your connection."));
    } else {
      return Promise.reject(new Error(error.message));
    }
  }
);

export default {
  get: (url, config) => instance.get(url, config),
  post: (url, data, config) => instance.post(url, data, config),
  put: (url, data, config) => instance.put(url, data, config),
  delete: (url, config) => instance.delete(url, config),
  
  upload: (url, formData) => {
    return instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  getPhotoUrl: (photoPath) => {
    if (!photoPath) return null;
    
    const cleanPath = photoPath.startsWith("/") 
      ? photoPath.substring(1) 
      : photoPath;
    
    const cleanBaseUrl = BASE_URL.endsWith("/") 
      ? BASE_URL.slice(0, -1) 
      : BASE_URL;
    
    return `${cleanBaseUrl}/${cleanPath}`;
  },
  
  deleteTrainerPhoto: async (trainerId) => {
    try {
      const response = await instance.post('trainers/delete_photo.php', { id: trainerId });
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  baseURL: BASE_URL,
  instance: instance,
};
