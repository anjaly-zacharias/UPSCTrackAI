import { api } from './api';

const demoMode = import.meta.env.VITE_DEMO_MODE !== 'false';

export async function persistItem(collection, item, existing = false) {
  try {
    const response = existing
      ? await api.put(`/${collection}/${item.id}`, item)
      : await api.post(`/${collection}`, item);
    return response.data;
  } catch (error) {
    if (demoMode && !error.response) return item;
    throw error;
  }
}

export async function removeItem(collection, id) {
  try {
    await api.delete(`/${collection}/${id}`);
  } catch (error) {
    if (!(demoMode && !error.response)) throw error;
  }
}
