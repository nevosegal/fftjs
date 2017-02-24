'use strict';

let utils = require('./utils');

// real to complex fft
let fft = function(signal){
  const N = signal.length;
  const logN = Math.log2(N);

  if(Math.round(logN) != logN) throw new Error('Input size must be a power of 2.');

  const bitReversedIndices = utils.bitReverseArray(N);

  // sort array
  let ordered = {};
  for(let i = 0; i < N; i++){
    ordered[bitReversedIndices[i]] = signal[i];
  }

  for(let i = 0; i < N; i++){
    signal[i] = ordered[i];
  }

  // iterate over the number of stages
  for(let n = 1; n <= logN; n++){
    let currN = Math.pow(2, n);

    // find twiddle factors
    for(let k = 0; k < currN / 2; k++){
      let twiddle = utils.euler(k, currN);

      // on each block of FT, implement the butterfly diagram
      for(let m = 0; m < N / currN; m++){
        let currEvenIndex = (currN * m) + k;
        let currOddIndex = (currN * m) + k + (currN / 2);
        let odd = utils.multiply(twiddle, signal[currOddIndex]);

        signal[currOddIndex] = utils.subtract(signal[currEvenIndex], odd);
        signal[currEvenIndex] = utils.add(odd, signal[currEvenIndex]);
      }
    }
  }

  return signal;
}

// complex to real ifft
let ifft = function(signal){
  const N = signal.length;

  //take complex conjugate in order to be able to use the regular FFT for IFFT
  for(let i = 0; i < N; i++) signal[i] = utils.conj(signal[i]);

  //compute
  let X = fft(signal);

  // normalize and take only real part of result
  signal = X.map((val) => {
    return {
      'real': val.real / N,
      'imag': val.imag / N
    }
  }
  );

  return signal;
}


module.exports = {
  fft: fft,
  ifft: ifft
};
