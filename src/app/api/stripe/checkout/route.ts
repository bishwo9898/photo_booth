import { NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// 10% retainer amounts (in cents)
const packagePricing = {
  essential: {
    name: "Essential Collection",
    retainerAmount: 18000, // 10% of $1,800
  },
  signature: {
    name: "Signature Collection",
    retainerAmount: 26000, // 10% of $2,600
  },
  luxury: {
    name: "Luxury Collection",
    retainerAmount: 34000, // 10% of $3,400
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
  const { packageId, token, customerName, customerEmail, weddingDate, signature } = body as {
    packageId?: string;
    token?: string;
    customerName?: string;
    customerEmail?: string;
    weddingDate?: string;
    signature?: string;
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
      description: `${pkg.name} - 10% Wedding Photography Retainer`,
      metadata: {
        packageId,
        ...(customerName ? { customerName } : {}),
      },
    };

    if (customerEmail) {
      chargeParams.receipt_email = customerEmail;
    }

    const charge = await stripe.charges.create(chargeParams);

    // Send email notification after successful payment
    const emailHost = process.env.EMAIL_HOST;
    const emailPort = parseInt(process.env.EMAIL_PORT ?? "587", 10);
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailFrom = process.env.EMAIL_FROM ?? emailUser;
    const notificationEmail = "suziz9898@gmail.com";

    if (emailHost && emailUser && emailPass && customerEmail && customerName) {
      try {
        const transporter = nodemailer.createTransport({
          host: emailHost,
          port: emailPort,
          secure: emailPort === 465,
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });

        const emailHtml = `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; color: #161410; background: #f7f4f1; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 16px; border: 1px solid #e6d9c8; }
                h1 { font-family: Georgia, serif; color: #1b1915; font-size: 24px; margin-bottom: 8px; }
                p { margin: 6px 0; color: #5c5247; line-height: 1.5; }
                .label { font-weight: 600; color: #8b7a66; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em; }
                .value { font-size: 15px; color: #1b1915; margin-top: 4px; }
                .signature-box { margin-top: 16px; padding: 12px; border: 1px dashed #d8c8b1; border-radius: 12px; background: #fefbf7; }
                .signature-box img { max-width: 100%; border-radius: 8px; }
                .payment-badge { display: inline-block; background: #2ecc71; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 8px; }
                hr { border: none; border-top: 1px solid #efe5d8; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>New Booking with Payment</h1>
                <p style="color: #8b7a66; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;">Ever After Photography</p>
                <div class="payment-badge">✓ Payment Successful</div>
                <hr />
                <div>
                  <p class="label">Package Selected</p>
                  <p class="value">${pkg.name}</p>
                </div>
                <div style="margin-top: 16px;">
                  <p class="label">Customer Name</p>
                  <p class="value">${customerName}</p>
                </div>
                <div style="margin-top: 16px;">
                  <p class="label">Customer Email</p>
                  <p class="value">${customerEmail}</p>
                </div>
                ${weddingDate ? `
                <div style="margin-top: 16px;">
                  <p class="label">Wedding Date</p>
                  <p class="value">${weddingDate}</p>
                </div>
                ` : ''}
                <div style="margin-top: 16px;">
                  <p class="label">Payment Amount</p>
                  <p class="value">$${(pkg.retainerAmount / 100).toFixed(2)} (10% Retainer)</p>
                </div>
                <div style="margin-top: 16px;">
                  <p class="label">Transaction ID</p>
                  <p class="value" style="font-family: monospace; font-size: 13px;">${charge.id}</p>
                </div>
                ${signature ? `
                <div class="signature-box">
                  <p class="label">Customer Signature</p>
                  <img src="${signature}" alt="Customer Signature" />
                </div>
                ` : ''}
                <hr />
                <p style="font-size: 12px; color: #8b7a66;">
                  This booking was completed on ${new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}.
                </p>
              </div>
            </body>
          </html>
        `;

        await transporter.sendMail({
          from: `"Ever After Booking" <${emailFrom}>`,
          to: `${notificationEmail}, ${customerEmail}`,
          subject: `Payment Received: ${pkg.name} - ${customerName}`,
          html: emailHtml,
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the payment if email fails
      }
    }

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
