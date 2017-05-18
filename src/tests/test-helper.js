
const chai = require('chai'),
sinon = require('sinon'),
sinonChai = require('sinon-chai'),
chaiHttp = require('chai-http'),
app = require('../../index');

chai.use(sinonChai);
chai.use(chaiHttp);

global.expect = chai.expect;
global.sinon = sinon;
global.should = chai.should();
global.chai = chai;

global.Art = app.models.art.model;
global.Artist = app.models.artist.model;
global.app = app;



