import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { formType, formData } = await request.json();

    if (!["booking", "contact"].includes(formType)) {
      return NextResponse.json(
        { message: "Invalid form type." },
        { status: 400 },
      );
    }

    const { fullName, email, phone, message, ...otherFields } = formData;

    if (
      typeof fullName !== "string" ||
      !fullName.trim() ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof phone !== "string" ||
      !phone.trim() ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return NextResponse.json(
        { message: "Please provide valid required information." },
        { status: 400 },
      );
    }

    const recipient =
      formType === "booking"
        ? process.env.BOOKING_EMAIL
        : process.env.CONTACT_EMAIL;

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASSWORD ||
      !recipient
    ) {
      return NextResponse.json(
        { message: "Email configuration is incomplete." },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const details = Object.entries(otherFields)
      .filter(
        ([, value]) => value !== undefined && value !== null && value !== "",
      )
      .map(([key, value]) => {
        return `<tr>
          <td style="padding:10px;border:1px solid #ddd;"><strong>${key}</strong></td>
          <td style="padding:10px;border:1px solid #ddd;">${String(value)}</td>
        </tr>`;
      })
      .join("");

    const safe = (value: string) =>
      value.replace(
        /[&<>"']/g,
        (character) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[character]!,
      );

    const subject =
      formType === "booking"
        ? `New Booking Enquiry - ${fullName}`
        : `New Contact Enquiry - ${fullName}`;

    await transporter.sendMail({
      from: `"TESAZMARE Logistics Website" <${process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: email,
      subject,
      text: [
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Message: ${message}`,
        ...Object.entries(otherFields).map(
          ([key, value]) => `${key}: ${String(value)}`,
        ),
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;color:#172b45;">
          <h2>${formType === "booking" ? "New Booking Enquiry" : "New Contact Enquiry"}</h2>
          <p>You have received a new website enquiry.</p>
          <p><strong>Name:</strong> ${safe(fullName)}</p>
          <p><strong>Email:</strong> ${safe(email)}</p>
          <p><strong>Phone:</strong> ${safe(phone)}</p>
          <p><strong>Message:</strong> ${safe(message)}</p>
          <table style="border-collapse:collapse;width:100%;">
            ${details}
          </table>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Your enquiry has been sent successfully.",
    });
  } catch (error) {
    console.error("Email sending error:", error);

    return NextResponse.json(
      { message: "Unable to send your enquiry. Please try again." },
      { status: 500 },
    );
  }
}
