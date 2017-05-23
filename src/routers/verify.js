module.exports = app => {
    const Verify = app.models.verify;
    const Artist = app.models.artist;

    const sendVerification = app.configs.mailer.sendVerification;
    
    app.get('/verify/:token', async (req, res) => {
        try {
            const v = await Verify.findAndVerify(req.params.token);

            await Artist.verify(v.artist);

            await Verify.remove(v._id);

            res.redirect('/');

        } catch (err) {
            console.log(err);
            res.send({ 'message': 'failed, verification token expired.' });
        }
        
    });

    app.post('/verify/reset', async (req, res) => {
        const email = req.body.email || req.query.email;

        try {
            const token = await Verify.updateToken(email);
            
            await sendVerification(email, token);

            res.send({ 'message': 'success, verifacation reseted and mail sent.' });

        } catch (err) {
            console.log(err);
            res.status(400).send({ 'message': 'failed, no such user.' });
        }
    });
    
    return this;
};