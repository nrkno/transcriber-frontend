import { MailData } from "@sendgrid/helpers/classes/mail"
import sendgridMail from "@sendgrid/mail"
import * as functions from "firebase-functions"

async function sendEmail(mailData: MailData) {
  const apiKey: string = functions.config().sendgrid.apikey

  if (apiKey === undefined) {
    throw new Error("Sendgrid API key missing from config")
  }

  sendgridMail.setApiKey(apiKey)

  await sendgridMail.send(mailData)
  console.log("Sendte", mailData)
}

export default sendEmail
