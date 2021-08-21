const nodemailer = require('nodemailer');

const sendEmail = async ({to, subject, text}) => {        
        const transporter = nodemailer.createTransport({
            port: process.env.EMAIL_PORT, 
            host: process.env.EMAIL_HOST, 
            auth:{
                user: process.env.EMAIL_USERNAME , 
                pass: process.env.EMAIL_PASSWORD
            }
        })

        const mailOptions = {
            from: 'Arash Alaei <noreply@support.com>', 
            to, 
            subject, 
            text, 
            // HTML
        }

       await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;