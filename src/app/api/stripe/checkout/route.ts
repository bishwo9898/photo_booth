import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// 20% retainer amounts (in cents)
const packagePricing = {
  essential: {
    name: "Essential Collection",
    retainerAmount: 36000, // 20% of $1,800
  },
  signature: {
    name: "Signature Collection",
    retainerAmount: 52000, // 20% of $2,600
  },
  luxury: {
    name: "Luxury Collection",
    retainerAmount: 68000, // 20% of $3,400
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
  const { packageId, token, customerName, customerEmail } = body as {
    packageId?: string;
    token?: string;
    customerName?: string;
    customerEmail?: string;
  };

  if (!packageId || !(packageId in packagePricing)) {
    return NextResponse.json(
      { error: "Invalid package selection." },
      { status: 400 },
    );
  }

  if (!token) {
    return NextResponse.json(
      { error: "Payment token is required." },
      { status: 400 },
    );
  }

  const pkg = packagePricing[packageId as PackageId];
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2023-10-16",
  });

  try {
    const chargeParams: Stripe.ChargeCreateParams = {
      amount: pkg.retainerAmount,
      currency: "usd",
      source: token,
      description: `${pkg.name} - 20% Wedding Photography Retainer`,
      metadata: {
        packageId,
        ...(customerName ? { customerName } : {}),
      },
    };

    if (customerEmail) {
      chargeParams.receipt_email = customerEmail;
    }

    const charge = await stripe.charges.create(chargeParams);

    return NextResponse.json({
      success: true,
      chargeId: charge.id,
      amount: pkg.retainerAmount,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Payment processing failed",
      },
      { status: 500 },
    );
  }
}
