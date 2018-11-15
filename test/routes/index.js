'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

describe('Index', () => {
  describe('Index Page', () => {
    it('should respond to GET with status 200', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
