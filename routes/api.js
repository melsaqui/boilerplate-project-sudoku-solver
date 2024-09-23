'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let val = (req.body.value);
      let coord = req.body.coordinate;
      let puzzle = (req.body.puzzle);
      let conflicts =[]
      if (puzzle==''|| puzzle==undefined || puzzle ==null || coord==''|| coord==undefined || coord==null ||
        val==''|| val==undefined || val ==null)
        return res.json({'error':'Required field(s) missing' })
      val =String(val)
      let isValid =solver.validate(puzzle)
      if(typeof(isValid)=='object'){
        return res.json(isValid)
      }
      if(val.length!=1 || val[0]>'9'||val[0]<'1'){
        return res.json({'error':'Invalid value' })

      }
      let validCoor = /^[aA-Zz]{1}\d{1}$/
      if (!coord.match(validCoor) || coord[0]>'I'|| coord[0]<'A'|| coord[1]>'9'|| coord[1]<'1')
        return res.json({ "error": "Invalid coordinate"})
      else{
        let row = coord[0]
        let col = coord[1]
        if (!solver.checkRowPlacement(puzzle,row,col,val)){
          conflicts.push('row')
        }
        if (!solver.checkColPlacement(puzzle,row,col,val)){
          conflicts.push('column')
        }
        if(!solver.checkRegionPlacement(puzzle,row,col,val)){
          conflicts.push('region')
        }
        if(conflicts.length!=0){
          return res.json({ "valid": false, "conflict": conflicts })
        }
        else{
          return res.json({ "valid": true, })
        }
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let val = req.body.value;
      let coord = req.body.coordinate;
      let puzzle = (req.body.puzzle);
      if (puzzle==''|| puzzle==undefined || puzzle ==null)
        return res.json({'error':'Required field missing' })
      let isValid =solver.validate(puzzle)
      if(typeof(isValid)=='object'){
        return res.json(isValid)
      }
      let solution =solver.solve(puzzle)
      if ( Object(solution).hasOwnProperty('error')){
        return res.json(solution)
      }
        
      return (res.json({solution:solution}))
    });
};
