"use server";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/app/utils/supabase/client";

const stripeSecret = process.env.STRIPE_SECRET_KEY!;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// ⚠️ Webhook secret is optional for now
if (!stripeSecret) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

if (!webhookSecret) {
  console.warn("⚠️ STRIPE_WEBHOOK_SECRET not set - webhooks will not work");
}

const stripe = new Stripe(stripeSecret, { apiVersion: "2025-10-29.clover" });

export async function GET(req: Request) {
  try {
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("DB fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (err: any) {
    console.error("GET /api/donations error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to fetch donations" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  // Return error if webhook secret is not set
  if (!webhookSecret) {
    console.error("Webhook secret not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 400 }
    );
  }

  const buf = await req.arrayBuffer();
  const rawBody = Buffer.from(buf);
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    // ✅ Verify webhook is from Stripe (signed)
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err?.message);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  try {
    // ✅ ADD TO DB ONLY when payment_intent.succeeded arrives
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;

      console.log(`[Webhook] Payment succeeded: ${pi.id}`);

      // Prevent duplicates
      const { data: existing } = await supabase
        .from("donations")
        .select("id")
        .eq("stripe_payment_intent_id", pi.id)
        .maybeSingle();

      if (existing) {
        console.log(`[Webhook] Donation already recorded for ${pi.id}`);
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // Fetch the charge ID from latest_charge
      let chargeId: string | null = null;
      if (pi.latest_charge && typeof pi.latest_charge === "string") {
        chargeId = pi.latest_charge;
      } else if (pi.latest_charge && typeof pi.latest_charge === "object") {
        chargeId = (pi.latest_charge as Stripe.Charge).id || null;
      }

      // ✅ INSERT TO DB (payment is confirmed by Stripe)
      const { error } = await supabase.from("donations").insert([
        {
          stripe_payment_intent_id: pi.id,
          name: pi.metadata?.donor_name || "Anonymous",
          amount: (pi.amount_received ?? pi.amount) / 100,
          amount_cents: pi.amount_received ?? pi.amount,
          stripe_charge_id: chargeId,
          is_disputed: false,
          is_refunded: false,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("[Webhook] DB insert error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log(`[Webhook] Donation inserted: ${pi.id}`);
    }

    // Handle disputes
    if (event.type === "charge.dispute.created") {
      const dispute = event.data.object as Stripe.Dispute;
      console.log(`[Webhook] Dispute created for charge ${dispute.charge}`);

      await supabase
        .from("donations")
        .update({ is_disputed: true })
        .eq("stripe_charge_id", dispute.charge as string);
    }

    // Handle refunds
    if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      console.log(`[Webhook] Charge refunded: ${charge.id}`);

      await supabase
        .from("donations")
        .update({ is_refunded: true })
        .eq("stripe_charge_id", charge.id);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("[Webhook] Processing error:", err);
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}