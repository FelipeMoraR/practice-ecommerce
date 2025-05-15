/* eslint-disable quotes */
import { transporter, nodeMailer } from '../config/email.config.js'

const sendEmail = async (email, endpoint, name, lastname) => {
  try {
    const info = await transporter.sendMail({
      from: '"Mi App (Mailtrap)" <no-reply@demomailtrap.co>',
      to: email,
      subject: 'Verify your email',
      text: `Hello ${name} ${lastname}!!!`,
      html: `<b> <a href = "${endpoint}">Click here</a> to verify your email </b>`
    })

    console.log('Message sent: %s', info.messageId)
    console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info))

    return true
  } catch (error) {
    console.error('Error while sending mail', error)

    throw new Error()
  }
}

export default sendEmail
