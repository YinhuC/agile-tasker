import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL;
export const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

if (!API_URL) {
  axiosClient.interceptors.request.use(() =>
    Promise.reject(new Error('No API URL is set; only the frontend is hosted.'))
  );
}
