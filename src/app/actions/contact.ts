"use server"

import { prisma } from "@/lib/prisma"

export async function submitContactMessage(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    if (!name || !email || !subject || !message) {
      throw new Error("All fields are required")
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email address")
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to submit message" }
  }
}
