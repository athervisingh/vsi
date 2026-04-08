export type Coupon = {
  code: string;
  discount: number;       // percentage e.g. 20 = 20%
  label: string;         // display name
  description: string;
  minOrder?: number;     // minimum cart value required
};

export const COUPONS: Record<string, Coupon> = {
  CRICKET20: {
    code: "CRICKET20",
    discount: 20,
    label: "Cricket Special",
    description: "20% off on Cricket gear",
    minOrder: 500,
  },
  BALL15: {
    code: "BALL15",
    discount: 15,
    label: "Ball Deal",
    description: "15% off on Balls",
    minOrder: 300,
  },
  SHOES25: {
    code: "SHOES25",
    discount: 25,
    label: "Footwear Fest",
    description: "25% off on Sports Shoes",
    minOrder: 800,
  },
};

export function validateCoupon(
  code: string,
  cartTotal: number
): { valid: true; coupon: Coupon } | { valid: false; error: string } {
  const coupon = COUPONS[code.toUpperCase().trim()];
  if (!coupon) return { valid: false, error: "Invalid coupon code." };
  if (coupon.minOrder && cartTotal < coupon.minOrder) {
    return {
      valid: false,
      error: `Minimum order ₹${coupon.minOrder} required for this coupon.`,
    };
  }
  return { valid: true, coupon };
}
