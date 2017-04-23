'use strict';

let utils = require('./utils');

// real to complex fft
let fft = function(signal){

  if(signal.real === undefined || signal.imag === undefined){
    signal = utils.constructComplexArray(signal);
  }

  const N = signal.real.length;
  const logN = Math.log2(N);

  if(Math.round(logN) != logN) throw new Error('Input size must be a power of 2.');

  if(signal.real.length != signal.imag.length){
    throw new Error('Real and imaginary components must have the same length.');
  }

  const bitReversedIndices = utils.bitReverseArray(N);

  // sort array
  let ordered = {
    'real': [],
    'imag': []
  };

  for(let i = 0; i < N; i++){
    ordered.real[bitReversedIndices[i]] = signal.real[i];
    ordered.imag[bitReversedIndices[i]] = signal.imag[i];
  }

  for(let i = 0; i < N; i++){
    signal.real[i] = ordered.real[i];
    signal.imag[i] = ordered.imag[i];
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

        let currEvenIndexSample = {
                          'real': signal.real[currEvenIndex],
                          'imag': signal.imag[currEvenIndex]
                        }
        let currOddIndexSample = {
                          'real': signal.real[currOddIndex],
                          'imag': signal.imag[currOddIndex]
                        }

        let odd = utils.multiply(twiddle, currOddIndexSample);

        let subtractionResult = utils.subtract(currEvenIndexSample, odd);
        signal.real[currOddIndex] = subtractionResult.real;
        signal.imag[currOddIndex] = subtractionResult.imag;

        let additionResult = utils.add(odd, currEvenIndexSample);
        signal.real[currEvenIndex] = additionResult.real;
        signal.imag[currEvenIndex] = additionResult.imag;
      }
    }
  }

  return signal;
}

// complex to real ifft
let ifft = function(signal){

  if(signal.real === undefined || signal.imag === undefined){
    throw new Error("IFFT only accepts a complex input.")
  }
  
  const N = signal.real.length;

  //take complex conjugate in order to be able to use the regular FFT for IFFT
  for(let i = 0; i < N; i++){
    let currentSample = {
      'real': signal.real[i],
      'imag': signal.imag[i]
    };

    let conjugateSample = utils.conj(currentSample);
    signal.imag[i] = conjugateSample.imag;
  }

  //compute
  let X = fft(signal);

  var complexSignal = {
    'real': [],
    'imag': []
  };

  //normalize
  complexSignal.real = X.real.map((val) => {
    return val / N;
  });

  complexSignal.imag = X.imag.map((val) => {
    return val / N;
  });

  return complexSignal;
}


module.exports = {
  fft: fft,
  ifft: ifft
};
