const bcrypt = require('bcrypt'), 
jwt = require('jsonwebtoken');


describe('Verify account', function () {
    const email = 'mamut@yanli.com';
    let token;
    let verifyToken, artistId;

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
            .then(data => {
                artistId = data.id;
                delete data.password;

                token = jwt.sign(data, 'secret');
                done();
            }).catch(err => {
                console.log(err);
                done();
            });
        });
        
    });

    afterEach(function (done) {
        Artist.collection.drop();
        // TODO: learn to drop verify collection.
        done();
    });

    it('POST /signup should create an artist and verify it.', function (done) {
        // TODO: test it more extensively.
        done();
    });

    // TODO: write tests for verify reset, expires and edge cases.

    it('POST /signup should give invalid error', function (done) {
        chai.request(app)
        .post('/signup')
        .send({
            'name': 'mamut kollariyandan',
            'nick': 'yandankollu',
            'password': 'gizlimamut'
        })
        .end(function (error, res) { 
            res.should.have.status(403);
            res.should.be.json;

            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal('Validation error.');

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