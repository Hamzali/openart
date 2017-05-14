var chai = require('chai'),
sinon = require('sinon'),
sinonChai = require('sinon-chai'),
chaiHttp = require('chai-http');

chai.use(sinonChai);
chai.use(chaiHttp);

global.expect = chai.expect;
global.sinon = sinon;
global.should = chai.should();
global.chai = chai;