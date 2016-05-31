'use strict';

let utils = require('./utils');
let X = [];

function dft(signal){
  let N = signal.length;

  for (var k = 0; k < N; k++) {
  	//real and imaginary.
    X[k] = [0.0, 0.0];

    // compute dft.
    signal.map((sample, n) => {
      let temp = utils.multiply([sample, 0.0], utils.euler(k*n, N));
      X[k] = utils.add(X[k], temp);
    });
  }

  return X;
}

module.exports = dft;