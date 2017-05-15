var chai = require('chai'),
sinon = require('sinon'),
sinonChai = require('sinon-chai'),
chaiHttp = require('chai-http');

const server = require('../../index.js');

chai.use(sinonChai);
chai.use(chaiHttp);

global.expect = chai.expect;
global.sinon = sinon;
global.should = chai.should();
global.chai = chai;

global.app = server.app;
global.Art = server.Art;
global.Artist = server.Artist;