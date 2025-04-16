"use server"

import nodemailer from "nodemailer"

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST || "smtp.example.com",
  port: Number.parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "user@example.com",
    pass: process.env.EMAIL_PASSWORD || "password",
  },
}

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
  cc?: string | string[]
  bcc?: string | string[]
  attachments?: any[]
}

// Check if we're in a preview environment
const isPreviewEnvironment = () => {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
    typeof window !== "undefined"
  ) // Client-side is always considered preview for email
}

// Mock email function for preview environments
async function mockSendEmail(options: EmailOptions) {
  const { to, subject, html, from } = options
  console.log("📧 MOCK EMAIL SENT")
  console.log(`From: ${from || process.env.EMAIL_FROM || "noreply@example.com"}`)
  console.log(`To: ${Array.isArray(to) ? to.join(", ") : to}`)
  console.log(`Subject: ${subject}`)
  console.log("Content: [HTML Email Content]")

  return {
    success: true,
    messageId: `mock-email-${Date.now()}`,
    mock: true,
  }
}

// Real email sending function
async function realSendEmail(options: EmailOptions) {
  try {
    // Create transporter - only when needed
    const transporter = nodemailer.createTransport(emailConfig)

    const { to, subject, html, from, cc, bcc, attachments } = options

    const mailOptions = {
      from: from || process.env.EMAIL_FROM || "Project Management <noreply@projectmanagement.com>",
      to,
      cc,
      bcc,
      subject,
      html,
      attachments,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Main email sending function that decides which implementation to use
export async function sendEmail(options: EmailOptions) {
  // Use mock implementation in preview environments
  // if (isPreviewEnvironment()) {
  //   return mockSendEmail(options)
  // }

  // Use real implementation in production
  return realSendEmail(options)
}

// Test email connection
export async function testEmailConnection() {
  if (isPreviewEnvironment()) {
    console.log("📧 MOCK EMAIL CONNECTION TEST: Success")
    return { success: true, message: "Email connection successful (mock)", mock: true }
  }

  try {
    // Create transporter just for testing
    const transporter = nodemailer.createTransport(emailConfig)
    await transporter.verify()
    return { success: true, message: "Email connection successful" }
  } catch (error) {
    console.error("Email connection failed:", error)
    return { success: false, error: (error as Error).message }
  }
}
