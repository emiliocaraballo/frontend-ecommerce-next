export interface User {
  id: number;
  name: string;
  password: string;
  documentNumber: string;
  documentType: string;
  lastName: string;
  email: string;
  phone: string;
  rol: "CLIENT" | "ADMIN";
  token?: string;
}
