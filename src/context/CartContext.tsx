"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { useAuth } from '@/context/AuthContext';
import { validateCoupon, type Coupon } from '@/lib/coupons';

type CartItem = {
  cart_item_id: string;
  variant_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  cartLoading: boolean;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  finalPrice: number;
  applyCoupon: (code: string) => { success: boolean; error?: string };
  removeCoupon: () => void;
  addToCart: (item: Omit<CartItem, 'quantity' | 'cart_item_id'>, quantity?: number) => Promise<void>;
  removeFromCart: (cart_item_id: string) => Promise<void>;
  updateQuantity: (cart_item_id: string, quantity: number) => Promise<void>;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function authHeaders(userId: string) {
  return { 'x-user-id': userId, 'Content-Type': 'application/json' };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Load cart from DB when user logs in
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    setCartLoading(true);
    fetch('/api/cart', { headers: { 'x-user-id': user.id } })
      .then((r) => r.json())
      .then(({ data }) => {
        if (!data) return;
        const mapped: CartItem[] = data.map((row: any) => {
          const variant = row.product_variants;
          const product = variant?.products;
          const primaryImage =
            product?.product_images?.find((img: any) => img.is_primary)?.url ??
            product?.product_images?.[0]?.url ??
            '';
          return {
            cart_item_id: row.id,
            variant_id: variant?.id ?? '',
            product_id: product?.id ?? '',
            product_name: product?.name ?? '',
            price: (product?.base_price ?? 0) + (variant?.extra_price ?? 0),
            quantity: row.quantity,
            image: primaryImage,
          };
        });
        setItems(mapped);
      })
      .finally(() => setCartLoading(false));
  }, [user?.id]);

  const addToCart = useCallback(
    async (item: Omit<CartItem, 'quantity' | 'cart_item_id'>, quantity = 1) => {
      if (!user) {
        console.warn('[Cart] addToCart called but user is null — not logged in?');
        return;
      }

      // Snapshot for rollback
      setItems((prev) => {
        const existing = prev.find((i) => i.variant_id === item.variant_id);
        if (existing) {
          return prev.map((i) =>
            i.variant_id === item.variant_id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { ...item, cart_item_id: 'temp', quantity }];
      });

      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: authHeaders(user.id),
          body: JSON.stringify({ variant_id: item.variant_id, quantity }),
        });
        const json = await res.json();

        if (!res.ok || json.error) {
          console.error('[Cart] POST /api/cart failed:', json.error ?? res.status);
          // Rollback optimistic update
          setItems((prev) =>
            prev
              .map((i) =>
                i.variant_id === item.variant_id
                  ? { ...i, quantity: i.quantity - quantity }
                  : i
              )
              .filter((i) => i.quantity > 0)
          );
          return;
        }

        // Replace temp id with real DB id
        if (json.data?.id) {
          setItems((prev) =>
            prev.map((i) =>
              i.variant_id === item.variant_id && i.cart_item_id === 'temp'
                ? { ...i, cart_item_id: json.data.id }
                : i
            )
          );
        }
      } catch (err) {
        console.error('[Cart] Network error on addToCart:', err);
      }
    },
    [user]
  );

  const removeFromCart = useCallback(
    async (cart_item_id: string) => {
      if (!user) return;
      setItems((prev) => prev.filter((i) => i.cart_item_id !== cart_item_id));
      await fetch(`/api/cart?cart_item_id=${cart_item_id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id },
      });
    },
    [user]
  );

  const updateQuantity = useCallback(
    async (cart_item_id: string, quantity: number) => {
      if (!user) return;
      if (quantity <= 0) {
        await removeFromCart(cart_item_id);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.cart_item_id === cart_item_id ? { ...i, quantity } : i
        )
      );
      await fetch('/api/cart', {
        method: 'PATCH',
        headers: authHeaders(user.id),
        body: JSON.stringify({ cart_item_id, quantity }),
      });
    },
    [user, removeFromCart]
  );

  const clearCart = useCallback(() => {
    if (!user) return;
    setItems([]);
    fetch(`/api/cart?clear=true`, {
      method: 'DELETE',
      headers: { 'x-user-id': user.id },
    });
  }, [user]);

  const applyCoupon = useCallback(
    (code: string): { success: boolean; error?: string } => {
      const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const result = validateCoupon(code, totalPrice);
      if (!result.valid) return { success: false, error: result.error };
      setAppliedCoupon(result.coupon);
      return { success: true };
    },
    [items]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = appliedCoupon
    ? Math.round((totalPrice * appliedCoupon.discount) / 100)
    : 0;
  const finalPrice = totalPrice - discountAmount;

  return (
    <CartContext.Provider
      value={{
        items, totalItems, totalPrice, cartLoading,
        appliedCoupon, discountAmount, finalPrice,
        applyCoupon, removeCoupon,
        addToCart, removeFromCart, updateQuantity, clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
