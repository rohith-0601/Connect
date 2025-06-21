const { default: axios } = require("axios");

export const BASE_URL = "https://connect-backend-hdst.onrender.com"

export const ClientServer = axios.create({
    baseURL:BASE_URL
})