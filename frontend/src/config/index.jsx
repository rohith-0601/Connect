const { default: axios } = require("axios");

export const BASE_URL = "http://localhost:5001"

export const ClientServer = axios.create({
    baseURL:BASE_URL
})