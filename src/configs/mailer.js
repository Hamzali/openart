const nodemailer = require('nodemailer');
module.exports = () => {

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            type: 'OAuth2',
            user: "hamzali.tas.95@gmail.com", // Your gmail address.
            clientId: "1022881397483-evftaplonoqo2pqmn2qbp303nlpeijrf.apps.googleusercontent.com",
            clientSecret: "mRJomWKvD2F52MABknpVZ0SQ",
            refreshToken: "1/xT9YwDh16tgcuoVtiBA_Tbn4r9UI9nwSmudtEGFirrbUNne4ZX-0XPYw9vq77JRt",
            accessToken: "ya29.GltVBDUiGtvUDZsrQvD4ErWijf0361mwQFvzqGkGkGHaPqwnvA8oyOvsRniGEpvEbCj0xuIWK3TBq1u6W8-GQcvyb2Nua8AKuzd0xWVs35tyytjq6Hg7d_U4We86", 
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