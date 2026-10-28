import { useState } from "react";
import { initializePaddle, getPaddlePriceId } from "@/lib/paddle";

export interface CheckoutOptions {
  priceId: string;
  quantity?: number;
  customerEmail?: string;
  customData?: Record<string, string>;
  successUrl?: string;
}

export function usePaddleCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCheckout = async (options: CheckoutOptions) => {
    setLoading(true);
    setError(null);
    try {
      await initializePaddle();
      const paddlePriceId = await getPaddlePriceId(options.priceId);

      window.Paddle.Checkout.open({
        items: [{ priceId: paddlePriceId, quantity: options.quantity ?? 1 }],
        customer: options.customerEmail ? { email: options.customerEmail } : undefined,
        customData: options.customData,
        settings: {
          displayMode: "overlay",
          successUrl: options.successUrl || `${window.location.origin}/dashboard?checkout=success`,
          allowLogout: false,
          variant: "one-page",
        },
      });
    } catch (e) {
      console.error("Checkout failed to open:", e);
      setError(e instanceof Error ? e.message : "Checkout could not be opened");
    } finally {
      setLoading(false);
    }
  };

  return { openCheckout, loading, error };
}
