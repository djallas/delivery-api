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
describe('Errors testing', () => {
    // error 404
    it('Page not fount: Error 404', (done) => { 
        chai
        .request(app)
        .get('/faketable')
        .end((err, res) =>{ 
            res.should.have.status(404);
            done();
        })
    });
    

});

module.exports = app;