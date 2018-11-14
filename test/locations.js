process.env.NODE_ENV = 'test';
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let app = require('../app');
let should = chai.should();
let locations = require('../v1/routes/locations');


chai.use(chaiHttp);


//Our parent block
describe('Locations records', () => {
  // clearn data before any testing 
    // get all parcels /GET /parcels
    describe('/GET locations', () => {
        it('it should GET all locations records', (done) => {
          chai.request(app)
            .get('/api/v1/locations')
            .end((err, res) => {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.be.a('object');;
            done();
            });
        });
    });

    // Get location id /GET 
    describe('/GET location details', () => {
        it('it should GET a location by parcel', (done) => {
            const id = 1;
            chai
            .request(app)
            .get(`/api/v1/locations/${id}`)
            .end((err, res) => {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
            });              
        });
    });
});

module.exports = app;