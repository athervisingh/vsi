"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "./cart.module.css";

export default function CartPage() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className={styles.emptyPage}>
        <div className={styles.emptyBox}>
          <CartEmptyIcon />
          <h1 className={styles.emptyTitle}>Your Cart is Empty</h1>
          <p className={styles.emptyDesc}>Koi bhi item cart mein nahi hai. Products dekhne ke liye home page par jayein.</p>
          <Link href="/" className={styles.shopBtn}>Shop Now</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Cart</h1>
          <span className={styles.itemCount}>{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
        </div>

        <div className={styles.layout}>
          {/* Cart Items */}
          <div className={styles.itemsList}>
            {items.map((item) => (
              <div key={item.cart_item_id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <Image src={item.image} alt={item.product_name} fill sizes="80px" style={{ objectFit: "cover", borderRadius: 8 }} />
                </div>

                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{item.product_name}</h3>
                  <p className={styles.itemPrice}>₹{item.price.toLocaleString("en-IN")}</p>
                </div>

                <div className={styles.itemControls}>
                  <div className={styles.qtyRow}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >−</button>
                    <span className={styles.qtyNum}>{item.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                  <p className={styles.itemTotal}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.cart_item_id)}
                    aria-label="Remove item"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}

            <button className={styles.clearBtn} onClick={clearCart}>Clear Cart</button>
          </div>

          {/* Order Summary */}
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRow}>
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={styles.freeShipping}>Free</span>
            </div>

            <div className={styles.summaryDivider} />

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>

            <button className={styles.orderBtn}>Place Order</button>

            <Link href="/" className={styles.continueLink}>← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function CartEmptyIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
