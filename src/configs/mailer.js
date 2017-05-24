const nodemailer = require('nodemailer');
module.exports = () => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'kurohigeali@gmail.com',
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