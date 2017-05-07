var chai = require('chai'),
sinon = require('sinon'),
sinonChai = require('sinon-chai'),
supertest = require('supertest'),
chaiHttp = require('chai-http');

chai.use(sinonChai);
chai.use(chaiHttp);

global.expect = chai.expect;
global.sinon = sinon;
global.should = chai.should();
global.chai = chai;
global.api = supertest('http://localhost:3030');


