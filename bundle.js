/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let utils = __webpack_require__(1);

	// real to complex fft
	let fft = function(signal){
	  const N = signal.length;
	  const logN = Math.log2(N);

	  if(Math.round(logN) != logN) throw new Error('Input size must be a power of 2.');

	  const bitReversedIndices = utils.bitReverseArray(N);

	  // sort array
	  let ordered = [];
	  for(let i = 0; i < N; i++) ordered[bitReversedIndices[i]] = signal[i];
	  for(let i = 0; i < N; i++){
	    signal[i].length === undefined ? signal[i] = [ordered[i], 0] : signal[i] = ordered[i];
	  }


	  // iterate over the number of stages
	  for(let n = 1; n <= logN; n++){
	    let currN = Math.pow(2, n);

	    // find twiddle factors
	    for(let k = 0; k < currN / 2; k++){
	      let twiddle = utils.euler(k, currN);

	      // on each block of FT, implement the butterfly diagram
	      for(let m = 0; m < N/currN; m++){
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
	    return val[0] / N;
	  });

	  return signal;
	}


	module.exports = {
	  fft: fft,
	  ifft: ifft
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);