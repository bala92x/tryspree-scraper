require('dotenv').config();

const nodemailer = require('nodemailer');

const sendMail = async (body) => {
    let transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    });

    let mailOptions = {
        from: `Tryspree scraper <${process.env.MAIL_FROM}>`,
        to: `${process.env.MAIL_TO}`,
        subject: 'New deal available!',
        html: body
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: ', info.messageId);
        
        const testMessage = nodemailer.getTestMessageUrl(info);

        if (testMessage) {
            console.log('Preview URL: ', nodemailer.getTestMessageUrl(info));
        }
    } catch (err) {
        console.log('Cannot send email:', err)
    }
}

module.exports = sendMail;