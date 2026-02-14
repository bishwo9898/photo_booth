import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const { packageId, packageName, fullName, email, weddingDate, signature } =
    (await request.json()) as {
      packageId: string;
      packageName: string;
      fullName: string;
      email: string;
      weddingDate: string;
      signature: string;
    };

  if (!fullName || !email || !weddingDate || !signature) {
    return NextResponse.json(
      { error: "All fields are required, including signature." },
      { status: 400 }
    );
  }

  const emailHost = process.env.EMAIL_HOST;
  const emailPort = parseInt(process.env.EMAIL_PORT ?? "587", 10);
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailFrom = process.env.EMAIL_FROM ?? emailUser;
  const notificationEmail = "suziz9898@gmail.com";

  if (!emailHost || !emailUser || !emailPass) {
    return NextResponse.json(
      { error: "Email is not configured." },
      { status: 500 }
    );
  }

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
          hr { border: none; border-top: 1px solid #efe5d8; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>New Contract Submission</h1>
          <p style="color: #8b7a66; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;">Ever After Photography</p>
          <hr />
          <div>
            <p class="label">Package Selected</p>
            <p class="value">${packageName}</p>
          </div>
          <div style="margin-top: 16px;">
            <p class="label">Customer Name</p>
            <p class="value">${fullName}</p>
          </div>
          <div style="margin-top: 16px;">
            <p class="label">Customer Email</p>
            <p class="value">${email}</p>
          </div>
          <div style="margin-top: 16px;">
            <p class="label">Wedding Date</p>
            <p class="value">${weddingDate}</p>
          </div>
          <div class="signature-box">
            <p class="label">Customer Signature</p>
            <img src="${signature}" alt="Customer Signature" />
          </div>
          <hr />
          <p style="font-size: 12px; color: #8b7a66;">
            This contract was submitted on ${new Date().toLocaleDateString("en-US", {
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

  try {
    await transporter.sendMail({
      from: `"Ever After Booking" <${emailFrom}>`,
      to: `${notificationEmail}, ${email}`,
      subject: `New Contract: ${packageName} - ${fullName}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: "Failed to send email notification." },
      { status: 500 }
    );
  }
}
