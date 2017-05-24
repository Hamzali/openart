const bcrypt = require('bcrypt'), 
jwt = require('jsonwebtoken');


describe('Verify account', function () {
    const newUser = {
        'name': 'mamut kollariyandan',
        'nick': 'yandankollu',
        'email': 'mamut@yanli.com',
        'password': 'gizlimamut'
    };

    beforeEach(function (done) {
        
        bcrypt
        .hash('gizli', 10)
        .then((hash) => {

            let newArtist = new Artist({
                name: 'artiz',
                nick: 'artizneararlabazarda',
                email: 'artiz@arar.com',
                password: hash,
                createdAt: Number(Date.now())
            });

            newArtist.save()
            .then(() => {
                done();
            })
            .catch(err => {
                // console.log(err);
                done();
            });
        });
        
    });

    afterEach(function (done) {
        Artist.collection.drop().catch(err => err);
        Verify.collection.drop().catch(err => err);
        done();
    });

    it('POST /signup should create an artist and GET /verify/:token should verify user', function (done) {
        
        chai.request(app)
        .post('/signup')
        .send(newUser)
        .end(function (error, res) { 
            res.should.have.status(200);
            res.should.be.json;

            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal('success, registered and verification email sent.');
            
            Verify.findOne({ artist: newUser.email })
            .then(v => {
                if (!v) throw new Error('no token');
                chai.request(app)
                .get('/verify/' + v.token)
                .end(function (error, res) { 
                    res.should.have.status(200);
                    res.should.be.html;

                    Artist.findOne({ email: newUser.email })
                    .then(artist => {
                        artist.isVerified.should.equal(true);
                        done();
                    })
                    .catch(err => {
                        console.log(err);
                        done();
                    });
                    
                });

            }).catch(err => {
                console.log(err);
                done();
            });
            
            
        });
        
    });

    // TODO: write tests for verify reset, expires and edge cases.

    it('POST /signup should give invalid error', function (done) {
        chai.request(app)
        .post('/signup')
        .send()
        .end(function (error, res) { 
            res.should.have.status(403);
            res.should.be.json;

            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal('fail, validation error.');

            res.body.should.have.property('errors');
            res.body.errors.should.be.a('object');

            done();
        });
    });


    it('POST /signup should not save same email', function (done) {
        chai.request(app)
        .post('/signup')
        .send({
            'name': 'mamut kollariyandan',
            'nick': 'yandankollu',
            'email': 'artiz@arar.com',
            'password': 'gizlimamut'
        })
        .end(function (error, res) { 
            res.should.have.status(400);
            res.should.be.json;

            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal('fail, email already exists');

            done();
        });
    });


    it('POST /signup should not save same nick', function (done) {
        chai.request(app)
        .post('/signup')
        .send({
            'name': 'mamut kollariyandan',
            'nick': 'artizneararlabazarda',
            'email': 'baba@ana.com',
            'password': 'gizlimamut'
        })
        .end(function (error, res) { 
            res.should.have.status(400);
            res.should.be.json;

            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal('fail, nick already exists');
            
            done();
        });
    });


});