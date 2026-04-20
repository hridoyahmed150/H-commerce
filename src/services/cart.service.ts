import type { Cart, CartLine, CartTotals } from "@/types/cart.types";
import type { ProductId } from "@/types/product.types";
import {
  getCartSnapshot,
  replaceCart,
} from "@/store/cart-store";
import { getProductById } from "@/services/products.service";

function newLineId(): string {
  return crypto.randomUUID();
}

export function getCart(): Cart {
  return getCartSnapshot();
}

export function getCartTotals(cart: Cart): CartTotals {
  const subtotal = cart.lines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );
  const itemCount = cart.lines.reduce((sum, line) => sum + line.quantity, 0);
  return { subtotal, itemCount, lineCount: cart.lines.length };
}

export async function addToCart(
  productId: ProductId,
  quantity = 1,
): Promise<void> {
  const product = await getProductById(productId);
  if (!product) throw new Error("Product not found");
  if (product.stock <= 0) throw new Error("Out of stock");

  const cart = getCartSnapshot();
  const existing = cart.lines.find((l) => l.productId === productId);
  const nextQty = (existing?.quantity ?? 0) + quantity;
  if (nextQty > product.stock) {
    throw new Error("Not enough stock");
  }

  const snapshot = {
    id: product.id,
    name: product.name,
    price: product.price,
    images: product.images,
  };

  let lines: CartLine[];
  if (existing) {
    lines = cart.lines.map((line) =>
      line.productId === productId
        ? { ...line, quantity: nextQty, product: snapshot }
        : line,
    );
  } else {
    const line: CartLine = {
      id: newLineId(),
      productId,
      quantity,
      product: snapshot,
    };
    lines = [...cart.lines, line];
  }

  replaceCart({ lines, updatedAt: cart.updatedAt });
}

export function removeLine(lineId: string): void {
  const cart = getCartSnapshot();
  replaceCart({
    lines: cart.lines.filter((l) => l.id !== lineId),
    updatedAt: cart.updatedAt,
  });
}

export function incrementLine(lineId: string): void {
  const cart = getCartSnapshot();
  const line = cart.lines.find((l) => l.id === lineId);
  if (!line) return;

  void getProductById(line.productId).then((product) => {
    if (!product) return;
    const latest = getCartSnapshot();
    const current = latest.lines.find((l) => l.id === lineId);
    if (!current) return;
    if (current.quantity + 1 > product.stock) return;
    replaceCart({
      lines: latest.lines.map((l) =>
        l.id === lineId
          ? {
              ...l,
              quantity: l.quantity + 1,
              product: {
                id: product.id,
                name: product.name,
                price: product.price,
                images: product.images,
              },
            }
          : l,
      ),
      updatedAt: latest.updatedAt,
    });
  });
}

export function decrementLine(lineId: string): void {
  const cart = getCartSnapshot();
  const line = cart.lines.find((l) => l.id === lineId);
  if (!line) return;
  if (line.quantity <= 1) {
    removeLine(lineId);
    return;
  }
  replaceCart({
    lines: cart.lines.map((l) =>
      l.id === lineId ? { ...l, quantity: l.quantity - 1 } : l,
    ),
    updatedAt: cart.updatedAt,
  });
}

export function clearCart(): void {
  replaceCart({ lines: [], updatedAt: new Date().toISOString() });
}
