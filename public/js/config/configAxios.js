const port = 3000;

const url = `https://test.pruttika.run.place/api`

const axiosInstance = axios.create({
  baseURL: url,
  timeout: 20000,
  withCredentials: true,
});