import axios from 'axios';
import { type Product } from '../types';

// Set up the default URL point where our Spring Boot app runs
const API_BASE_URL = 'http://localhost:8082/api/products';

export const fetchProductsByTenant = async (tenantId: string): Promise<Product[]> => {
  const response = await axios.get<Product[]>(`${API_BASE_URL}/${tenantId}`);
  return response.data;
};

export const createProductForTenant = async (tenantId: string, productData: Omit<Product, 'id'>): Promise<Product> => {
  const response = await axios.post<Product>(`${API_BASE_URL}/${tenantId}`, productData);
  return response.data;
};
