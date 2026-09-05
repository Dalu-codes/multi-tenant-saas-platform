export interface Tenant {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  tenantId: string; // The crucial link to our multi-tenant backend!
}
