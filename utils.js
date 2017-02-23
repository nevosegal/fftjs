'use strict';

// memoization of the reversal of different lengths.
var memoizedReversal = {};

let bitReverseArray = function(N){
  if(memoizedReversal[N] === undefined){
    let maxBinaryLength = (N - 1).toString(2).length; //get the binary length of the largest index.
    let templateBinary = '0'.repeat(maxBinaryLength); //create a template binary of that length.
    let reversed = {};
    for(let n = 0; n < N; n++){
      let currBinary = n.toString(2); //get binary value of current index.

      //prepend zeros from template to current binary. This makes binary values of all indices have the same length.
      currBinary = templateBinary.substr(currBinary.length) + currBinary;

      currBinary = [...currBinary].reverse().join(''); //reverse
      reversed[n] = parseInt(currBinary, 2); //convert to decimal
    }
    memoizedReversal[N] = reversed; //save
  }
  return memoizedReversal[N];
}

// complex multiplication
let multiply = function(a,b){
  return [a[0] * b[0] - a[1] * b[1],
      a[0] * b[1] + a[1] * b[0]];
}

// complex addition
let add = function(a,b){
  return [a[0] + b[0], a[1] + b[1]];
}

// complex subtraction
let subtract = function(a,b){
  return [a[0] - b[0], a[1] - b[1]];
}

// euler's identity e^x = cos(x) + sin(x)
let euler = function(kn, N){
  let x = -2 * Math.PI * kn / N;
  return [Math.cos(x), Math.sin(x)];
}

// complex conjugate
let conj = function(a){
  a[1] *= -1;
  return a;
}

module.exports={
  bitReverseArray: bitReverseArray,
  multiply: multiply,
    add: add,
    subtract: subtract,
    euler: euler,
    conj: conj
};
