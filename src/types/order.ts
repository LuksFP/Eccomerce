import { Product } from "./product";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  product: Product;
  quantity: number;
  priceAtPurchase: number;
};

export type ShippingAddress = {
  fullName: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
};

export type PaymentMethod = "credit_card" | "pix" | "boleto";

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "Pendente",
  processing: "Processando",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  credit_card: "Cartão de Crédito",
  pix: "PIX",
  boleto: "Boleto",
};
