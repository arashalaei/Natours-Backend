const nodemailer = require('nodemailer');
const AppError = require('./AppError');

const sendEmail = async ({to, subject, text}) => {
    try {
        
        const transporter = nodemailer.createTransport({
            port: process.env.EMAIL_HOST, 
            host: process.env.EMAIL_PORT, 
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

    } catch (error) {
        return new AppError(error.message, 500);
    }
}

module.exports = sendEmail;