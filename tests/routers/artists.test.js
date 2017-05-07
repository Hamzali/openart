const server = require('../../index.js');
const app = server.app;
const Artist = server.Artist;

describe('Artists Routers', function () {
    let artistId;

    Artist.collection.drop();

    beforeEach(function (done) {
        let newArtist = new Artist({
            name: 'artiz',
            nickname: 'artizneararlabazarda',
            email: 'artiz@arar.com',
            password: 'gizli',
            createdAt: Number(Date.now())
        });

        newArtist.save(function (err, data) {
            if (err) console.log(err);
            artistId = data.id;
            done();
        });
    });

    afterEach(function (done) {
        Artist.collection.drop();
        done();
    });

    it('GET api/artists should return all artists', function (done) {
        
        chai.request(app)
        .get('/api/artists')
        .end(function (error, res) {
           res.should.have.status(200);
           res.should.be.json;

           res.body.should.be.an('array');

           res.body[0].should.be.an('object');
           res.body[0].should.have.property('name');
           res.body[0].name.should.be.a('string');
           res.body[0].should.have.property('nickname');
           res.body[0].nickname.should.be.a('string');
           res.body[0].should.have.property('email');
           res.body[0].email.should.be.a('string');
           res.body[0].should.have.property('password');
           res.body[0].password.should.be.a('string');
           res.body[0].should.have.property('createdAt');
           res.body[0].createdAt.should.be.a('string');
           
           done();
        });
         
    });


});

