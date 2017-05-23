const bcrypt = require('bcrypt'), 
jwt = require('jsonwebtoken');

describe('Art Routers', function () {
    
    let artId, artistId, token;

    beforeEach(function (done) {
        bcrypt
        .hash('secret', 10)
        .then((hash) => {

            let newArtist = new Artist({
            name: 'artiz',
            nick: 'artiznearar',
            email: 'artiz@nearar.com',
            password: hash,
            createdAt: Number(Date.now())
            });

            newArtist.save()
            .then(data => {
                artistId = data.id;
                delete data.password;

                token = jwt.sign(data, 'secret');

                let newArt = new Art({
                    title: 'arty party',
                    description: 'this is the description of the art',
                    content: 'content should be image but for now it is just a text',
                    artist: artistId,
                    createdAt: Number(Date.now())
                });

                newArt.save()
                .then(data => {
                    artId = data.id;
                    done();
                }).catch(err => {
                    console.log(err);
                    done();
                });

            }).catch(err => {
                console.log(err);
                done();
            });
        });

        

        
    });

    afterEach(function (done) {
        Art.collection.drop();
        Artist.collection.drop();
        done();
    });

    it('should list ALL arts on /api/art GET', function (done) {
        chai.request(app)
            .get('/api/art')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('array');
                done();
            });
    });   

    it('should add a SINGLE art on /api/art POST', function (done) {
        chai.request(app)
            .post('/api/art')
            .send({ 
                'title': 'arty party',
                'description': 'this is the description of the art',
                'content': 'content should be image but for now it is just a text',
                'artist': artistId,
                'token': token
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;

                res.body.should.be.an('object');
                res.body.should.have.property('id');
                res.body.id.should.be.a('string');

                done();
            });

            
    });

    it('POST /api/art should throw error with invalid input', function (done) {
        chai.request(app)
            .post('/api/art')
            .send({
                'title': 'bla bla bla',
                'description': 'bla bla bla bla',
                'artist': artistId,
                'token': token
            })
            .end(function (err, res) {
                res.should.have.status(403);
                res.should.be.json;

                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.be.a('object');
                done();
            });
    });

    it('should list a SINGLE art on /api/art/<id> GET', function (done) {
        chai.request(app)
        .get('/api/art/' + artId)
        .end(function (err, res) {
            
            res.should.have.status(200);
            res.should.be.json;

            res.body.should.be.a('object');

            res.body.should.have.property('title');
            res.body.title.should.be.a('string');

            res.body.should.have.property('description');
            res.body.description.should.be.a('string');

            res.body.should.have.property('content');
            res.body.content.should.be.a('string');

            res.body.should.have.property('createdAt');
            res.body.createdAt.should.be.a('string');
            done();
        });

    });

    it('should update a SINGLE art on /api/art/<id> PUT', function (done) {

        chai.request(app)
        .put('/api/art/' + artId)
        .send({
            'title': 'this is the test version',
            'description': 'this is the test description of the art',
            'content': 'content should be image but this is a test so for now it is just a text',
            'token': token
        })
        .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');

            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal(`success, art with id: ${artId} updated.`);

            done();
        });


    });

    it('should delete a SINGLE art on /api/art/<id> DELETE', function (done) {
        chai.request(app)
        .delete('/api/art/' + artId)
        .set({ 'x-access-token': token })
        .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');

            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal(`success, art with id: ${artId} removed.`);

            done();
        });
    });
});

