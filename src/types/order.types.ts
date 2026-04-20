import type { CartLine } from "./cart.types";

export type OrderId = string;

export type OrderStatus =
  | "pending"
  | "paid"
  | "fulfilled"
  | "cancelled";

export type ShippingAddress = {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode: string;
  country: string;
};

export type Order = {
  id: OrderId;
  status: OrderStatus;
  lines: CartLine[];
  subtotal: number;
  currency: string;
  createdAt: string;
  shippingAddress?: ShippingAddress;
};

export type CreateOrderInput = {
  lines: CartLine[];
  shippingAddress: ShippingAddress;
};
