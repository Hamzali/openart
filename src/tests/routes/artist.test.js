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
            nickname: 'artizneararlabazarda',
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
           res.body[0].should.have.property('nickname');
           res.body[0].nickname.should.be.a('string');
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
            res.body.should.have.property('nickname');
            res.body.nickname.should.be.a('string');
            res.body.should.have.property('email');
            res.body.email.should.be.a('string');
            res.body.should.have.property('createdAt');
            res.body.createdAt.should.be.a('string');

            done();
            
        });
    });


    it('GET api/artist/:id should fail if id is not found', function (done) {
        chai.request(app)
        .get('/api/artist/thisisnoid')
        .end(function (error, res) { 
            res.should.have.status(400);
            res.should.be.json;

            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal('Id is not found, please send a valid id.');

            done();
        });
    });

    it('POST api/artist should create SINGLE artist', function (done) {
        chai.request(app)
        .post('/api/artist')
        .send({
            'name': 'mamut kollariyandan',
            'nickname': 'yandankollu',
            'email': 'mamut@yanli.com',
            'password': 'gizlimamut'
        })
        .end(function (error, res) { 
            res.should.have.status(200);
            res.should.be.json;

            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal('success, new artist created.');

            res.body.should.have.property('id');
            res.body.id.should.be.a('string');

            done();
        });
    });

    it('POST api/artist should give invalid error', function (done) {
        chai.request(app)
        .post('/api/artist')
        .send({
            'name': 'mamut kollariyandan',
            'nickname': 'yandankollu',
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
            res.body.errors.should.be.a('array');

            done();
        });
    });


    it('POST api/artist should not save same email', function (done) {
        chai.request(app)
        .post('/api/artist')
        .send({
            'name': 'mamut kollariyandan',
            'nickname': 'yandankollu',
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


    it('POST api/artist should not save same nickname', function (done) {
        chai.request(app)
        .post('/api/artist')
        .send({
            'name': 'mamut kollariyandan',
            'nickname': 'artizneararlabazarda',
            'email': 'baba@ana.com',
            'password': 'gizlimamut'
        })
        .end(function (error, res) { 
            res.should.have.status(400);
            res.should.be.json;

            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal('fail, nickname already exists');
            
            done();
        });
    });

    it('PUT api/artist/:id should update with the given info', function (done) {
        const newData = {
            'name': 'new name',
            'nickname': 'newnick',
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

                let { name, nickname, email } = res.body;

                name.should.equal(newData.name);
                nickname.should.equal(newData.nickname);
                email.should.equal(newData.email);

                done();
            });

        });
    });

    it('PUT api/artist/:id should update only the given info', function (done) {
        const newData = {
            'nickname': 'newnick',
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

                let { name, nickname, email } = res.body;

                name.should.be.a('string');
                email.should.be.a('string');

                nickname.should.equal(newData.nickname);
                
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
            res.body.message.should.equal('success');

            chai.request(app)
            .get('/api/artist/' + artistId)
            .end(function (error, res) {
                res.should.have.status(400);
                res.should.be.json;

                res.body.should.be.an('object');
                res.body.should.have.property('message');
                res.body.message.should.be.a('string');
                res.body.message.should.equal('Id is not found, please send a valid id.');

                done();
            });
        });
    });


});

