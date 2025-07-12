/* eslint-disable quotes */
import { transporter, nodeMailer } from '../config/email.config.js'

const sendEmail = async (email, endpoint, name, lastname, subject) => {
  try {
    const info = await transporter.sendMail({
      from: '"purpleCommerce" <no-reply@demomailtrap.co>',
      to: email,
      subject,
      text: `Hello ${name} ${lastname}!!!`,
      html: `<a href = "${endpoint}"><b>Click here</b></a> to continue with the process`
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
