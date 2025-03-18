import axios from "axios";

const api = axios.create({
  baseURL: "https://hotelservices.godelivery.site/api", // URL base de la API
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
