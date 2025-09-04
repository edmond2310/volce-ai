import { request } from './request';

// ✅ 按需导出封装后的接口函数
export const createItem = (data: Record<string, any>) => request('post', '/api/create', data, {});
export const getVideo = (data: Record<string, any>) => request('post', '/api/getVideo', data, {});
// export const getItem = (id) => request('get', `/api/item/${id}`);
// export const updateItem = (id, data) => request('put', `/api/item/${id}`, data);
// export const deleteItem = (id) => request('delete', `/api/item/${id}`);
