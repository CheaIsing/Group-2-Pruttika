const port = 3000;

const url = `http://localhost:${port}/api`

const axiosInstance = axios.create({
  baseURL: url,
  timeout: 10000,
  withCredentials: true,
});
