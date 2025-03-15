const port = 3000;

const url = `${window.location.protocol}//${window.location.host}/api`
// const url = `http://test.pruttika.run.place/api`

const axiosInstance = axios.create({
  baseURL: url,
  timeout: 20000,
  withCredentials: true,
});