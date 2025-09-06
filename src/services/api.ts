import axios from "axios";

const api = axios.create({
  baseURL: "https://contest-api-api-dev-6kjhg.ondigitalocean.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
