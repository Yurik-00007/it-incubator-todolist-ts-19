import axios from "axios";

/**
 * Экземпляр Axios для взаимодействия с API.
 *
 * @type {import("axios").AxiosInstance}
 *
 * @property {string} baseURL - Базовый URL для запросов.
 * @property {boolean} withCredentials - Флаг указывающий на передачу куки с запросами.
 * @property {object} headers - Заголовки запроса.
 * @property {string} headers.API-KEY - Ключ API.
 */

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "1cdd9f77-c60e-4af5-b194-659e4ebd5d41",
  },
});
