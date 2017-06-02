const bcrypt = require('bcrypt');

// TODO: Write tests for Reset Password.
describe('Reset Password', () => {
    const email = 'artiz@arar.com';
    const pass = 'gizli';

    beforeEach(function (done) {
        
        bcrypt
        .hash(pass, 10)
        .then((hash) => {
            let newArtist = new Artist({
                name: 'artiz',
                nick: 'artizneararlabazarda',
                email: email,
                password: hash,
                createdAt: Number(Date.now()),
                isVerified: true
            });

            newArtist.save()
            .then(() => {
                done();
            })
            .catch(err => {
                console.log(err);
                done();
            });
        });
        
    });

    afterEach(function (done) {
        Artist.collection.drop().catch(err => err);
        Verify.collection.drop().catch(err => err);
        done();
    });
    
    
    it('POST /forgotpassword should create token and send link and update password', (done) => {
        chai
        .request(app)
        .post('/forgotpassword')
        .send({ 'email': email })
        .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.html;
            
            // test it if it has the token placed.
            Verify.findOne({ artist: email })
            .then(v => {
                if (!v) throw Error('no token!');
                
                // test the token link
                chai.request(app)
                .post('/forgotpassword/' + v.token)
                .send({ 'password': 'newpass' })
                .end((err, res) => {
                    if (err) done(err);

                    res.should.have.status(200);
                    // check if pass changed for the user.
                    Artist.findOne({ email: email }).then(d => {
                        if (!d) throw Error('no artist found!');
                        
                        // compare the passwords.
                        bcrypt.compare('newpass', d.password).then(isAuth => {
                            if (isAuth) done();
                            else done(Error('Password did not changed!'));
                        });

                    })
                    .catch(err => done(err));
                });
                
            }).catch(err => {
                done(err);
            });
            
        });
    });

    it('POST /forgotpassword should not allow invalid email', (done) => {
        chai
        .request(app)
        .post('/forgotpassword')
        .send({ 'email': 'nouser@about.com' })
        .end(function (err, res) {
            res.should.have.status(400);
            res.should.be.html;
            done();
        });
    });
    


});