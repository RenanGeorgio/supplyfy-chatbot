import axios from "axios";

const graphApi = axios.create({
  baseURL: "https://graph.facebook.com/v19.0",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 3000,
});

export default graphApi;
