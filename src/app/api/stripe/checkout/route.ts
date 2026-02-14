import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// 20% retainer amounts (in cents)
const packagePricing = {
  essential: {
    name: "Essential Collection",
    fullAmount: 180000,
    retainerAmount: 36000, // 20% of $1,800
    description: "4 hours of wedding coverage - 20% retainer",
  },
  signature: {
    name: "Signature Collection",
    fullAmount: 260000,
    retainerAmount: 52000, // 20% of $2,600
    description: "8 hours of wedding coverage - 20% retainer",
  },
  luxury: {
    name: "Luxury Collection",
    fullAmount: 340000,
    retainerAmount: 68000, // 20% of $3,400
    description: "Full-day wedding coverage - 20% retainer",
  },
} as const;

type PackageId = keyof typeof packagePricing;

export async function POST(request: Request) {
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe secret key is not configured." },
      { status: 500 }
    );
  }

  const { packageId } = (await request.json()) as {
    packageId?: string;
  };

  if (!packageId || !(packageId in packagePricing)) {
    return NextResponse.json(
      { error: "Invalid package selection." },
      { status: 400 }
    );
  }

  const { name, retainerAmount, description } =
    packagePricing[packageId as PackageId];

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2023-10-16",
  });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: retainerAmount,
      currency: "usd",
      description,
      metadata: {
        packageId,
        packageName: name,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      packageId,
      amount: retainerAmount,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
