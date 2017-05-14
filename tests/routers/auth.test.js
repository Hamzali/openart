const server = require('../../index.js');
const app = server.app;
const Artist = server.Artist;

describe('JWT Auth', function () {

    beforeEach(function (done) {
        (new Artist({
            name: 'artiz',
            nickname: 'artizneararlabazarda',
            email: 'artiz@arar.com',
            password: 'gizli',
            createdAt: Number(Date.now())
        })).save()
        .then(d => {

            done();
        }).catch(err => {
            console.log(err);
            done();
        });
    });

    afterEach(function (done) {
        Artist.collection.drop();
        done();
    });

    it('POST /auth returns token with true information', function (done) {
        chai.request(app)
        .post('/auth')
        .send({
            'email': 'artiz@arar.com',
            'password': 'gizli'
        })
        .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;

            // message of the response.
            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal('success, token generated.');

            // token
            res.body.should.have.property('token');
            res.body.token.should.be.a('string');
            // res.token.should.equal('success, auth token generated.');
            done();
        });
       
    });

    it('POST /auth fails with false information', function (done) {
        chai.request(app)
        .post('/auth')
        .send({
            'email': 'artiz@arar.com',
            'password': 'mama'
        })
        .end(function (err, res) {
            res.should.have.status(403);
            res.should.be.json;

            // message of the response.
            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal('failed, email or password invalid.');

            done();
        });
        
    });
});