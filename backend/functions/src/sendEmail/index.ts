import { EmailData } from "@sendgrid/helpers/classes/email-address"
import { MailData } from "@sendgrid/helpers/classes/mail"
import sendgridMail from "@sendgrid/mail"
import * as functions from "firebase-functions"

async function sendEmail(mailData: MailData) {
  const apiKey: string = functions.config().sendgrid.apikey
  const name: string = functions.config().sendgrid.name
  const email: string = functions.config().sendgrid.email

  if (apiKey === undefined || name === undefined || email === undefined) {
    console.warn("Sendgrid not set up correctly, skipping e-mail")
    return
  }

  sendgridMail.setApiKey(apiKey)

  const from: EmailData = {
    email,
    name,
  }

  mailData.from = from

  await sendgridMail.send(mailData)
}

export default sendEmail
