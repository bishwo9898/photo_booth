import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const packagePricing = {
  essential: {
    name: "Essential Collection",
    retainerAmount: 18000,
  },
  signature: {
    name: "Signature Collection",
    retainerAmount: 26000,
  },
  luxury: {
    name: "Luxury Collection",
    retainerAmount: 34000,
  },
} as const;

type PackageId = keyof typeof packagePricing;

export async function POST(request: Request) {
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe secret key is not configured." },
      { status: 500 },
    );
  }

  const body = await request.json();
  const { packageId, customerEmail, customerName } = body as {
    packageId?: string;
    customerEmail?: string;
    customerName?: string;
  };

  if (!packageId || !(packageId in packagePricing)) {
    return NextResponse.json(
      { error: "Invalid package selection." },
      { status: 400 },
    );
  }

  if (!customerEmail || !customerName) {
    return NextResponse.json(
      { error: "Customer email and name are required." },
      { status: 400 },
    );
  }

  const pkg = packagePricing[packageId as PackageId];
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2023-10-16",
  });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: pkg.retainerAmount,
      currency: "usd",
      description: `${pkg.name} - 10% Wedding Photography Retainer`,
      receipt_email: customerEmail,
      metadata: {
        packageId,
        customerName,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create payment intent",
      },
      { status: 500 },
    );
  }
}
