const server = require('../../index.js');
const app = server.app;
const Art = server.Art;

describe('Arts Routers', function () {
    
    let artId;

    beforeEach(function (done) {
        let newArt = new Art({
            title: 'arty party',
            description: 'this is the description of the art',
            content: 'content should be image but for now it is just a text',
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
    });

    afterEach(function (done) {
        Art.collection.drop();
        done();
    });

    it('should list ALL arts on /api/arts GET', function (done) {
        chai.request(app)
            .get('/api/arts')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('array');
                done();
            });
    });   

    it('should add a SINGLE art on /api/arts POST', function (done) {
        chai.request(app)
            .post('/api/arts')
            .send({ 
                'title': 'arty party',
                'description': 'this is the description of the art',
                'content': 'content should be image but for now it is just a text'
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

    it('should throw error when input is wrong /api/arts POST', function (done) {
        chai.request(app)
            .post('/api/arts')
            .send({
                'title': 'bla bla bla',
                'description': 'bla bla bla bla'
            })
            .end(function (err, res) {
                res.should.have.status(403);
                res.should.be.json;

                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.be.a('array');
                done();
            });
    });

    it('should list a SINGLE art on /api/arts/<id> GET', function (done) {
        chai.request(app)
        .get('/api/arts/' + artId)
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

    it('should update a SINGLE art on /api/arts/<id> PUT', function (done) {

        chai.request(app)
        .put('/api/arts/' + artId)
        .send({
            'title': 'this is the test version',
            'description': 'this is the test description of the art',
            'content': 'content should be image but this is a test so for now it is just a text'
        })
        .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');

            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal('SUCCESS');

            done();
        });


    });

    it('should delete a SINGLE art on /api/arts/<id> DELETE', function (done) {
        chai.request(app)
        .delete('/api/arts/' + artId)
        .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');

            res.body.should.have.property('message');
            res.body.message.should.be.a('string');
            res.body.message.should.equal('SUCCESS');

            done();
        });
    });
});

