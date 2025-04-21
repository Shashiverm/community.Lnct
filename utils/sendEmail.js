import nodemailer from "nodemailer"

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "production", // Reject unauthorized in production
    },
  })

  // Define email options
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
    text: options.text || "", // Plain text version
    attachments: options.attachments || [],
  }

  // Retry logic
  const maxRetries = 3
  let retries = 0
  let lastError

  while (retries < maxRetries) {
    try {
      // Send email
      const info = await transporter.sendMail(mailOptions)
      console.log(`Email sent: ${info.messageId}`)
      return info
    } catch (error) {
      lastError = error
      retries++
      console.error(`Email sending failed (attempt ${retries}/${maxRetries}):`, error)

      // Wait before retrying (exponential backoff)
      if (retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, retries)))
      }
    }
  }

  // If we get here, all retries failed
  console.error("All email sending attempts failed:", lastError)
  throw lastError
}

export default sendEmail
