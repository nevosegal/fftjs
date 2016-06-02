'use strict';
let dft = require('./dft');
let utils = require('./utils');

let fft = function(signal){
	let N = signal.length;
	let bitReversedIndices = utils.bitReverseArray(N);
	let logN = Math.log2(N);

	// sort array and store as complex
	let ordered = [];
	for(let i=0; i<N; i++) ordered[bitReversedIndices[i]] = signal[i];
	for(let i=0; i<N; i++) signal[i] = [ordered[i], 0];


	// iterate over the number of stages
	for(let n=1; n<=logN; n++){
		let currN = Math.pow(2,n);

		// find twiddle factors
		for(let k=0; k<currN/2; k++){
			let twiddle = utils.euler(k, currN);

			// on each block of FT, implement the butterfly diagram
			for(let m=0; m<N/currN; m++){
				let currEvenIndex = (currN*m) + k;
				let currOddIndex = (currN*m) + k + (currN/2);
				let odd = utils.multiply(twiddle, signal[currOddIndex]);

				signal[currOddIndex] = utils.subtract(signal[currEvenIndex], odd);
				signal[currEvenIndex] = utils.add(odd, signal[currEvenIndex]);
			}
		}
	}

	return signal;
}


module.exports = fft;