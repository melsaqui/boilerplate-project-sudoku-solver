class SudokuSolver {
  regionize(puzzleString){
    puzzleString=String(puzzleString)
    let m=0;
    let n=0;
    let k=0;
    let l=0;
    let regions= []
    for (m =0 ;m<27;m+=3){
       
      regions[n] = [puzzleString[m+l],puzzleString[m+1+l],puzzleString[m+2+l],
                    puzzleString[m+9+l],puzzleString[m+1+9+l],puzzleString[m+2+9+l],
                    puzzleString[m+18+l],puzzleString[m+1+18+l],puzzleString[m+2+18+l]
                  ]
      n++;
      k++;
      if(k==3){
        k=0
        l+=18;
      }
    
    }
    return regions;
  }
  puzzleArray(puzzleString){
    let m =0
    let puzzle= [];
    for(let j=0;j<9;j++){
      puzzle[j]=[]
      for(let k=0;k<9;k++){
        puzzle[j][k] = puzzleString[m];
        m+=1
      }
    }
    return puzzle
 
  }
  validate(puzzleString) {
    if(puzzleString.length !=81){
      return { "error": "Expected puzzle to be 81 characters long" }
    }
    else{
      for(let i=0;i<81;i++){
        if ((puzzleString[i]>'9'|| puzzleString[i]<'0') && puzzleString[i]!='.'){
          return { "error": "Invalid characters in puzzle" }

        }
      }
      
      return true;
    }
  }
  checkRowPlacement(puzzleString, row, column, value) {
    value= String(value)
    row = parseInt(row.toUpperCase().charCodeAt(0)) - 65
    let puzzle=this.puzzleArray(puzzleString)
    for (let i=0;i<9;i++){
      if (puzzle[row][i]==value && i+1!=column){
      
        return false;
      }
    }
    return true
  }

  checkColPlacement(puzzleString, row, column, value) {
    //console.log("checkCol")
    row = parseInt(row.toUpperCase().charCodeAt(0)) -65
    value= String(value)
    let puzzle=this.puzzleArray(puzzleString)
    for (let i=0;i<9;i++){
      
      if (puzzle[i][column-1]==value && row!=i){

        return false;
      }
    }
    return true
    //console.log(puzzle)
  }

  checkRegionPlacement(puzzleString, row, column, value) {
   // console.log("RegionPlacement")
    let puzzle=this.puzzleArray(puzzleString)
    let regions=this.regionize(puzzleString);
    row = parseInt(row.toUpperCase().charCodeAt(0)) -65
    value= String(value)
    column-=1;
    if (puzzle[row][column]==value)
      return true
    let RegNum=0;
    let regionR=Math.trunc(row/3);
    let regionC = Math.trunc(column/3);

    RegNum= regionR*3 + regionC;


    //console.log(regions[RegNum])
    if (regions[RegNum].includes(value))
      return false
    return true


  }
  ArraytoString (arr){
    let str = '';
    for(let i = 0; i < arr.length; i++){
       if(Array.isArray(arr[i])){
          str += `${this.ArraytoString(arr[i])}`;
       }else{
          str += `${arr[i]}`;
       };
    };
    return str;
 
  }
  solve(puzzleString) {
    let puzzle = this.puzzleArray(puzzleString);
    let puzzleCopy = puzzle;
    let puzzleStringCopy=puzzleString;
    let row ;
    let possibles =[]
    let j;
    let i;
    let checkVal=this.validate(puzzleString)
    if(Object(checkVal).hasOwnProperty('error')){
      return (checkVal)
    }
    for( i=0; i<9; i++){
      row = String.fromCharCode(i+65)
      for(j=0; j<9; j++){
        if (puzzle[i][j]=='.'){
        // found =false;
          for ( let m =1;m<=9 ;m++){
            if((this.checkRegionPlacement(puzzleStringCopy,row,j+1,m)) && (this.checkRowPlacement(puzzleStringCopy,row,j+1,m)) && (this.checkColPlacement(puzzleStringCopy,row,j+1,m))){
              possibles.push(m)
            }            
          }
          if(possibles.length==1){
            puzzleCopy[i][j] =possibles[0];
            puzzleStringCopy = this.ArraytoString (puzzleCopy)
            possibles=[]
          }
          
        }
        possibles=[]
      }
      
    }
    if (puzzleStringCopy.includes('.')){
      try{
        puzzleStringCopy=this.solve(puzzleStringCopy)
        return puzzleStringCopy
      }catch{
        return ({error: 'Puzzle cannot be solved' })
      }       
    }else{
      return puzzleStringCopy
    }

    
  }
}

module.exports = SudokuSolver;

