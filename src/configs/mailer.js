const nodemailer = require('nodemailer');
module.exports = () => {

    // TODO: Solve the mail problem until production.
    const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: 'hamzali',
            pass: '1954lotr'
        }       
    });

    this.sendVerification = (to, link) => {
        return new Promise((resolve, reject) => {
            transporter.sendMail({
                from: 'openart',
                to: to,
                subject: 'Verify your account',
                html: `<p>please click this link ${link} to activate your account.</p>`
            }, (err, info) => {
                if (err) reject(err);

                resolve(info);
            });
        });        
    };

    this.sendResetPassword = (to, link) => {
        return new Promise((resolve, reject) => {
            transporter.sendMail({
                from: 'openart',
                to: to,
                subject: 'Password reset request',
                html: `<p>please click this link ${link} to reset your password.</p>`
            }, (err, info) => {
                if (err) reject(err);

                resolve(info);
            });
        });
    };

    return this;
};