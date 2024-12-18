export interface Product {
    id?: number;
    name: string;
    price: number;
    status: 'ACTIVE' | 'OUT_OF_STOCK' | 'INACTIVE';
    stock: number;
    tradeMark: string;
    description: string;
    image?: string;
  }
  