const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('/api/solve',()=>{
        test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
            chai
              .request(server)
              .keepOpen()
              .post('/api/solve')
              .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type,'application/json','Response should be json');
                assert.equal(res.body.solution,'769235418851496372432178956174569283395842761628713549283657194516924837947381625');
    
                done();
              });
        });
        test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
            chai
              .request(server)
              .keepOpen()
              .post('/api/solve')
              .send({puzzle:''})
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type,'application/json','Response should be json');
                assert.isNotNull(res.body.error)
                assert.equal(res.body.error,'Required field missing')
                done();
              });
        });
        test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
            chai
              .request(server)
              .keepOpen()
              .post('/api/solve')
              .send({puzzle:'..9..5.1.85.4....2432......a...6///3.9.....6.62.71...9......1945....4.37.4.3..6..'})
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type,'application/json','Response should be json');
                assert.isNotNull(res.body.error)
                assert.equal(res.body.error,'Invalid characters in puzzle')
                done();
              });
        });
   
        test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9..1945....4.37.4.3..6..'})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type,'application/json','Response should be json');
                assert.isNotNull(res.body.error)
                assert.equal(res.body.error,'Expected puzzle to be 81 characters long')
                done();
            });
        });
        test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: '..88.5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type,'application/json','Response should be json');
                assert.isNotNull(res.body.error)
                assert.equal(res.body.error,'Puzzle cannot be solved')
                done();
            });
        });

    });
    suite('/api/check',()=>{
        test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1',value: 7})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type,'application/json','Response should be json');
                assert.isBoolean(res.body.valid)
                assert.isTrue(res.body.valid)
                done();
            });
        });
        test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1',value: 6})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type,'application/json','Response should be json');
                assert.isBoolean(res.body.valid)
                assert.isFalse(res.body.valid)
                assert.isArray(res.body.conflict)
                assert.include(res.body.conflict,'column')

                done();
            });
        });
        test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'D2',value: 3})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type,'application/json','Response should be json');
                assert.isBoolean(res.body.valid)
                assert.isFalse(res.body.valid)
                assert.isArray(res.body.conflict)
                assert.equal(res.body.conflict.length,2)
                assert.include(res.body.conflict,'column')
                assert.include(res.body.conflict,'row')


                done();
            });
        });
        test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'B2',value: 2})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type,'application/json','Response should be json');
                assert.isBoolean(res.body.valid)
                assert.isFalse(res.body.valid)
                assert.isArray(res.body.conflict)
                assert.equal(res.body.conflict.length,3)
                assert.include(res.body.conflict,'column')
                assert.include(res.body.conflict,'row')
                assert.include(res.body.conflict,'region')

                done();
            });
        });
        test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: '',value: 2})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type,'application/json','Response should be json');
                assert.isNotNull(res.body.error)
                assert.equal(res.body.error,'Required field(s) missing')
            done();
            });
        });
        test('Check a puzzle placement with invalid coordinate: POST request to /api/check', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: '2B',value: 2})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type,'application/json','Response should be json');
                assert.isNotNull(res.body.error)
                assert.equal(res.body.error,'Invalid coordinate')
            done();
            });
        });
        test('Check a puzzle placement with invalid value: POST request to /api/check', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'B2',value: 'p'})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type,'application/json','Response should be json');
                assert.isNotNull(res.body.error)
                assert.equal(res.body.error,'Invalid value')
            done();
            });
        });
        test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....pp62.71...9......1945....4.37.4.3..6..', coordinate: '2B',value: 2})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type,'application/json','Response should be json');
                assert.isNotNull(res.body.error)
                assert.equal(res.body.error,'Invalid characters in puzzle')
            done();
            });
        });
        test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....0862.71...9...1945....4.37.4.3..6..', coordinate: '2B',value: 2})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type,'application/json','Response should be json');
                assert.isNotNull(res.body.error)
                assert.equal(res.body.error,'Expected puzzle to be 81 characters long')
            done();
            });
        });
    });
 
});

