'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const User = require('../../models/user');

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
  before( () => {
    User.remove({}, (err) => {});
  });

  describe('Sign Up Page', () => {
    it('should respond to GET with status 200', (done) => {
      chai.request(server)
        .get('/signup')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
    it('should resond to a valid POST request with status 200', (done) => {
      chai.request(server)
        .post('/signup')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'testEmail',
          password: 'password',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
    it('should have successfully created a user', (done) => {
      User.findOne({email: 'testEmail'}, (err, user) => {
        expect(err).to.equal(null);
        expect(user.firstName).to.equal('firstName');
        expect(user.lastName).to.equal('lastName');
        done();
      });
    });
    it('should return an error if user info is duplicated', (done) => {
      chai.request(server)
        .post('/signup')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'testEmail',
          password: 'password',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });
  describe('Sign In Page', () => {
    it('should respond to GET with status 200', (done) => {
      chai.request(server)
        .get('/signin')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
    it('should respond to a valid POST request with status 200', (done) => {
      chai.request(server)
        .post('/signin')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          email: 'testEmail',
          password: 'password',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
    it('should respond to a POST request with an invalid email with status 400', (done) => {
      chai.request(server)
        .post('/signin')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          email: 'invalidEmail',
          password: 'password',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
    it('should respond to a POST request with an invalid password with status 400', (done) => {
      chai.request(server)
        .post('/signin')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          email: 'testEmail',
          password: 'invalidPassword',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });
});
