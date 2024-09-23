const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver =new Solver();

suite('Unit Tests', () => {
    test("Logic handles a valid puzzle string of 81 characters",function(){
        let result= solver.validate('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..')
        assert.isBoolean(result)
        assert.isNotNull(result)
        assert.isTrue(result)
        assert.equal(result,true)
    });
    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)",function(){
        let result= solver.validate('..9..5.1.85.4....2432..a...1...69.83.9../..6.62.71...9......1945....4.37.4.3..6..')
        assert.isNotEmpty(result)
        assert.isNotBoolean(result)
        assert.isNotTrue(result)
        assert.property(result,'error')
        assert.equal(result['error'],"Invalid characters in puzzle" )
        
    });
    test("Logic handles a puzzle string that is not 81 characters in length",function(){
        let result= solver.validate('..9..5.1.85.4....2432..a...1...69.83.9../..6.62.71...9..1945....4.37.4.3..6..')
        assert.isNotEmpty(result)
        assert.isNotBoolean(result)
        assert.isNotTrue(result)
        assert.property(result,'error')
        assert.equal(result['error'],"Expected puzzle to be 81 characters long" )
        
    });
    test("Logic handles a valid row placement",function(){
        let result= solver.checkRowPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A',1,8)
        assert.isNotNull(result)
        assert.isBoolean(result)
        assert.isTrue(result)
      
    });
    test("Logic handles a invalid row placement",function(){
        let result= solver.checkRowPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','B',8,2)
        assert.isNotNull(result)
        assert.isBoolean(result)
        assert.isFalse(result)
      
    });
    test("Logic handles a valid column placement",function(){
        let result= solver.checkColPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','C',5,9)
        assert.isNotNull(result)
        assert.isBoolean(result)
        assert.isTrue(result)
      
    });
    test("Logic handles a invalid column placement",function(){
        let result= solver.checkColPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','D',4,7)
        assert.isNotNull(result)
        assert.isBoolean(result)
        assert.isFalse(result) 
    });

    test("Logic handles a valid region (3x3 grid) placement",function(){
        let result= solver.checkRegionPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','F',3,7)
        assert.isNotNull(result)
        assert.isBoolean(result)
        assert.isTrue(result)
      
    });
    test("Logic handles a invalid region (3x3 grid) placement",function(){
        let result= solver.checkRegionPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','E',3,9)
        assert.isNotNull(result)
        assert.isBoolean(result)
        assert.isFalse(result) 
    });
    test("Valid puzzle strings pass the solver",function(){
        let result= solver.solve('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..')
        assert.isString(result)
        assert.isNotNull(result)
    });
    test("Invalid puzzle strings pass the solver",function(){
        let result= solver.solve('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..666')
        assert.isNotString(result)
        assert.property(result,'error')
        assert.equal(result['error'],"Puzzle cannot be solved" )
    });
    test("Solver returns the expected solution for an incomplete puzzle",function(){
        let result= solver.solve('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..')
        assert.isString(result)
        assert.isNotNull(result)
        assert.equal(result,"769235418851496372432178956174569283395842761628713549283657194516924837947381625" )
    });
});
