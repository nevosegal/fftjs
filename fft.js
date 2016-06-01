'use strict';
let dft = require('./dft');
let utils = require('./utils');

let fft = function(signal){
	let N = signal.length;
	let bitReversedIndices = utils.bitReverseArray(N);
	let logN = Math.log2(N);

	for(let n=1; n<=logN; n++){
		let currN = Math.pow(2,n);
		for(let k=0; k<currN/2; k++){
			let twiddle = utils.euler(k, currN);
			for(let m=0; m<N/currN; m++){
				let currEvenIndex = bitReversedIndices[(currN*m) + k];
				let currOddIndex = bitReversedIndices[(currN*m) + k + (currN/2)];
				let odd = utils.multiply(twiddle, [signal[currOddIndex], 0]);

				signal[currOddIndex] = utils.subtract([signal[currEvenIndex],0], odd);
				signal[currEvenIndex] = utils.add(odd, [signal[currEvenIndex],0]);
			}
		}
	}

	return signal;
}


module.exports = fft;