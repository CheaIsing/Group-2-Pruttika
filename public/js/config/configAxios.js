const port = 3000;

const axiosInstance = axios.create({
  baseURL: `http://localhost:${port}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
