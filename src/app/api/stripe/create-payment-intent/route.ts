"use server";

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY!;
if (!stripeSecret) {
  throw new Error("Missing STRIPE_SECRET_KEY in server environment");
}

const stripe = new Stripe(stripeSecret, { apiVersion: "2025-10-29.clover" });
console.info("Stripe initialized with API version:", "2025-10-29.clover");

type Body = {
  amount_cents?: number;
  amount?: number;
  currency?: string;
  name?: string;
  receipt_email?: string;
  metadata?: Record<string, string>;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Body;
    let amountofCents: number | undefined;

    if (Number.isFinite(body.amount_cents)) {
      amountofCents = Math.floor(body.amount_cents!);
    } else if (Number.isFinite(body.amount)) {
      amountofCents = Math.round(body.amount! * 100);
    }

    if (!amountofCents || amountofCents <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const currency = (body.currency || "cad").toLowerCase();

    // ✅ ONLY create PaymentIntent — NO DB insert here
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountofCents,
      currency: currency,
      payment_method_types: ["card"],
      receipt_email: body.receipt_email,
      metadata: {
        donor_name: body.name || "Anonymous",
        ...body.metadata,
      },
    });

    return NextResponse.json(
      {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    console.error("create-payment-intent error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}