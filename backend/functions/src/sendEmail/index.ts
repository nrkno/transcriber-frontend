import { EmailData } from "@sendgrid/helpers/classes/email-address"
import { MailData } from "@sendgrid/helpers/classes/mail"
import sendgridMail from "@sendgrid/mail"
import * as functions from "firebase-functions"

async function sendEmail(mailData: MailData) {
  const sendgrid = functions.config().sendgrid

  if (sendgrid === undefined || sendgrid.apiKey === undefined || sendgrid.name === undefined || sendgrid.email === undefined) {
    console.warn("Sendgrid not set up, skipping e-mail")
    return
  }

  sendgridMail.setApiKey(sendgrid.apiKey)

  const from: EmailData = {
    email: sendgrid.email,
    name: sendgrid.name,
  }

  mailData.from = from

  await sendgridMail.send(mailData)
}

export default sendEmail
