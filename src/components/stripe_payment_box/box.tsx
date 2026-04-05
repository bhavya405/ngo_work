"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  CardElementProps,
} from "@stripe/react-stripe-js";

type SuccessPayload = {
  id: string;
  name: string | null;
  amount: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  initialAmount: number | 0;
  onSuccess: (result: SuccessPayload) => void;
};

const StripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function InnerStripeForm({
  initialAmount,
  onSuccess,
  onClose,
}: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<number | "">(initialAmount ?? "");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const previouslyFocused = useRef<Element | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    setTimeout(() => firstInputRef.current?.focus(), 0);
    return () => {
      (previouslyFocused.current as HTMLElement | null)?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const container = containerRef.current;
        if (!container) return;
        const focusables = Array.from(
          container.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled"));
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const cardOptions: CardElementProps["options"] = useMemo(
    () => ({
      style: {
        base: {
          color: "#0f172a",
          fontSize: "16px",
          "::placeholder": { color: "#94a3b8" },
        },
        invalid: { color: "#ef4444" },
      },
    }),
    []
  );

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    const parsed =
      typeof amount === "string" ? (amount === "" ? NaN : Number(amount)) : amount;
    if (!parsed || Number.isNaN(parsed) || parsed <= 0) {
      setError("Enter a valid amount greater than 0.");
      return;
    }
    if (!stripe || !elements) {
      setError("Stripe is not loaded yet.");
      return;
    }
    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Card element not found.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1) Create PaymentIntent on server
      const payload = {
        amount_cents: Math.round(parsed * 100),
        currency: "cad",
        name: name || undefined,
      };
      console.log("create-payment-intent payload:", payload);
      
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "server error");
        throw new Error(text);
      }

      const data = await res.json();
      const clientSecret = data?.client_secret ?? data?.clientSecret ?? null;
      if (!clientSecret) {
        throw new Error("Missing client_secret from server response.");
      }

      // 2) Confirm card payment on client
      const confirmResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: { name: name || "Anonymous" },
        },
      });

      if ((confirmResult as any).error) {
        throw new Error(confirmResult.error?.message ?? "Payment confirmation failed.");
      }

      const paymentIntent = (confirmResult as any).paymentIntent ?? null;
      
      // 3) Send properly typed payload to onSuccess
      if (paymentIntent && ["succeeded", "processing", "requires_capture"].includes(paymentIntent.status)) {
        const successPayload: SuccessPayload = {
          id: paymentIntent.id,
          name: name || null,
          amount: parsed,
        };
        
        console.log("Payment confirmed, sending payload:", successPayload);
        onSuccess?.(successPayload);
        onClose();
        setName("");
        setAmount("");
      } else {
        throw new Error("Payment was not successful. Status: " + paymentIntent?.status);
      }
    } catch (err: any) {
      console.error("Stripe payment error:", err);
      setError(err?.message ?? "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full max-w-md p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-lg">
        <header className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium">Donate (Stripe sandbox)</h3>
            <p className="text-sm text-gray-600 mt-1">
              Use Stripe test cards (e.g. 4242 4242 4242 4242)
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="text-black/50 hover:text-black"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <div className="space-y-3">
          <label className="sr-only" htmlFor="stripe-name">
            Name
          </label>
          <input
            id="stripe-name"
            ref={firstInputRef}
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />

          <label className="sr-only" htmlFor="stripe-amount">
            Amount
          </label>
          <input
            id="stripe-amount"
            placeholder="Amount (CAD)"
            type="number"
            step="0.01"
            value={amount as any}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full rounded border px-3 py-2 text-sm"
            required
          />

          <div className="rounded border p-3">
            <label className="text-xs text-gray-600 mb-2 block">
              Card details
            </label>
            <div className="py-2">
              <CardElement options={cardOptions} />
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-3 py-2 rounded border text-sm"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-emerald-600 text-white text-sm disabled:opacity-60"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Pay $${Number(amount || 0).toFixed(2)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function StripePaymentModal({
  open,
  onClose,
  initialAmount,
  onSuccess,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <Elements stripe={StripePromise}>
        <InnerStripeForm
          open={open}
          initialAmount={initialAmount}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </Elements>
    </div>
  );
}
