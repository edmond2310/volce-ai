// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

// ✅ 通用请求方法封装
export const request = async (method: string, url: string, data: Record<string, any>, config: Record<string, any> | null) => {
  try {
    const response = await api({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    // 🔴 统一错误处理
    console.error(`[API Error] ${method.toUpperCase()} ${url}:`, error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('响应错误:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('请求已发出，但没有响应:', error.request);
      } else {
        console.error('Axios 错误:', error.message);
      }
    } else {
      console.error('未知错误:', error);
    }

    throw error; // 继续抛出，方便上层处理
  }
};

// ✅ 按需导出封装后的接口函数
// export const createItem = (data) => request('post', '/api/create', data);
// export const getItem = (id) => request('get', `/api/item/${id}`);
// export const updateItem = (id, data) => request('put', `/api/item/${id}`, data);
// export const deleteItem = (id) => request('delete', `/api/item/${id}`);
