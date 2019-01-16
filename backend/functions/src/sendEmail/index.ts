import { EmailData } from "@sendgrid/helpers/classes/email-address"
import { MailData } from "@sendgrid/helpers/classes/mail"
import sendgridMail from "@sendgrid/mail"
import * as functions from "firebase-functions"

async function sendEmail(mailData: MailData) {
  const apiKey: string = functions.config().sendgrid.apikey
  const name: string = functions.config().sendgrid.name
  const email: string = functions.config().sendgrid.email

  if (apiKey === undefined) {
    throw new Error("Sendgrid API key missing from config")
  } else if (name === undefined) {
    throw new Error("Sendgrid name missing from config")
  } else if (email === undefined) {
    throw new Error("Sendgrid email missing from config")
  }

  sendgridMail.setApiKey(apiKey)

  const from: EmailData = {
    email,
    name,
  }

  mailData.from = from

  await sendgridMail.send(mailData)
  console.log("Sendte", mailData)
}

export default sendEmail
