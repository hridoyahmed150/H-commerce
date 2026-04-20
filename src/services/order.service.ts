import type { CreateOrderInput, Order } from "@/types/order.types";

/**
 * Phase 1: returns a synthetic order from cart lines. Later, implement real checkout
 * behind this module without changing cart UI.
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  return {
    id: crypto.randomUUID(),
    status: "pending",
    lines: input.lines,
    subtotal: input.lines.reduce(
      (sum, line) => sum + line.product.price * line.quantity,
      0,
    ),
    currency: "USD",
    createdAt: new Date().toISOString(),
    shippingAddress: input.shippingAddress,
  };
}

export async function getOrder(_orderId: string): Promise<Order | null> {
  return null;
}
