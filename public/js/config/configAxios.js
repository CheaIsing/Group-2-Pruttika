const port = 3000;

const url = `http://localhost:${port}/api`
// const url = `http://test.pruttika.run.place/api`

const axiosInstance = axios.create({
  baseURL: url,
  timeout: 20000,
  withCredentials: true,
});