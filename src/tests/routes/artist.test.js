const bcrypt = require('bcrypt'), 
jwt = require('jsonwebtoken');


describe('Artist', function () {
    let token, artistId;

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
        done();
    });

    it('GET api/artist should return all artists', function (done) {
        
        chai.request(app)
        .get('/api/artist')
        .end(function (error, res) {
           res.should.have.status(200);
           res.should.be.json;

           res.body.should.be.an('array');

           res.body[0].should.be.an('object');
           res.body[0].should.have.property('name');
           res.body[0].name.should.be.a('string');
           res.body[0].should.have.property('nick');
           res.body[0].nick.should.be.a('string');
           res.body[0].should.have.property('createdAt');
           res.body[0].createdAt.should.be.a('string');
           
           done();
        });
         
    });

    it('GET api/artist/:id should return a artist', function (done) {
        chai.request(app)
        .get('/api/artist/' + artistId)
        .end(function (error, res) {
            res.should.have.status(200);
            res.should.be.json;

            res.body.should.be.an('object');
            res.body.should.have.property('name');
            res.body.name.should.be.a('string');
            res.body.should.have.property('nick');
            res.body.nick.should.be.a('string');
            res.body.should.have.property('email');
            res.body.email.should.be.a('string');
            res.body.should.have.property('createdAt');
            res.body.createdAt.should.be.a('string');

            done();
            
        });
    });


    it('GET api/artist/:id should fail if id is not found', function (done) {
        const testId = 'thisisnoid';
        chai.request(app)
        .get('/api/artist/' + testId)
        .end(function (error, res) { 
            res.should.have.status(400);
            res.should.be.json;

            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal(`fail, no artist found with id: ${testId}.`);

            done();
        });
    });

    it('PUT api/artist/:id should update with the given info', function (done) {
        const newData = {
            'name': 'new name',
            'nick': 'newnick',
            'email': 'new@email.com',
            token: token
        };

        chai.request(app)
        .put('/api/artist/' + artistId)
        .send(newData)
        .end(function (error, res) {
            res.should.have.status(200);
            res.should.be.json;

            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal('success, artist data updated.');

            // Check if it is updated as we wanted.
            chai.request(app)
            .get('/api/artist/' + artistId)
            .end(function (error, res) {
                res.should.have.status(200);
                res.should.be.json;

                let { name, nick, email } = res.body;

                name.should.equal(newData.name);
                nick.should.equal(newData.nick);
                email.should.equal(newData.email);

                done();
            });

        });
    });

    it('PUT api/artist/:id should not update with same nick', function (done) {
        const newData = {
            'nick': 'artizneararlabazarda',
            token: token
        };

        chai.request(app)
        .put('/api/artist/' + artistId)
        .send(newData)
        .end(function (error, res) {
            res.should.have.status(400);
            res.should.be.json;

            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            // res.body.message.should.equal('fail, artist data cannot updated.');

            done();
            

        });
    });

    it('PUT api/artist/:id should update only the given info', function (done) {
        const newData = {
            'nick': 'newestnick',
            'password': 'pass123',
            token: token
        };

        chai.request(app)
        .put('/api/artist/' + artistId)
        .send(newData)
        .end(function (error, res) {
            res.should.have.status(200);
            res.should.be.json;

            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal('success, artist data updated.');

            // Check if it is updated as we wanted.
            chai.request(app)
            .get('/api/artist/' + artistId)
            .end(function (error, res) {
                res.should.have.status(200);
                res.should.be.json;

                let { nick } = res.body;

                nick.should.be.a('string');
                nick.should.equal(newData.nick);
                
                done();
            });

        });
    });

     it('PUT api/artist/:id should not update with empty or invalid body', function (done) {
        const newData = {
            'test': 'test it bitch',
            token: token
        };

        chai.request(app)
        .put('/api/artist/' + artistId)
        .send(newData)
        .end(function (error, res) {
            res.should.have.status(400);
            res.should.be.json;

            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal('the body is empty, please send a valid info.');
            done();
        });
    });


    it('DELETE api/artist/:id should delete an artists with given id', function (done) {
        chai.request(app)
        .delete('/api/artist/' + artistId)
        .set({ 'x-access-token': token })
        .end(function (error, res) {
            res.should.have.status(200);
            res.should.be.json;

            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal('success, artist removed.');

            chai.request(app)
            .get('/api/artist/' + artistId)
            .end(function (error, res) {
                res.should.have.status(400);
                res.should.be.json;

                res.body.should.be.an('object');
                res.body.should.have.property('message');
                res.body.message.should.be.a('string');
                res.body.message.should.equal(`fail, no artist found with id: ${artistId}.`);

                done();
            });
        });
    });


});

