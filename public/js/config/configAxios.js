const port = 3001;
const url = `http://test.pruttika.run.place:/api`

const axiosInstance = axios.create({
  baseURL: url,
  timeout: 10000,
  withCredentials: true,
});
