'use strict';

var memoizedReversal = {};
let bitReverseArray = function(N){
	if(memoizedReversal[N] === undefined){
		let maxBinaryLength = (N-1).toString(2).length;
		let templateBinary = '0'.repeat(maxBinaryLength);
		let reversed = {};
		for(let n=0; n<N; n++){
			let currBinary = n.toString(2);
			currBinary = templateBinary.substr(currBinary.length) + currBinary;
			currBinary = [...currBinary].reverse().join('');
			reversed[n] = parseInt(currBinary, 2);
		}
		memoizedReversal[N] = reversed;
	}
	return memoizedReversal[N];
}

// complex multiplication
let multiply = function(a,b){
	return [a[0]*b[0] - a[1]*b[1], 
			a[0]*b[1] + a[1]*b[0]];
}

// complex addition
let add = function(a,b){
  return [a[0]+b[0], a[1]+b[1]];
}

// euler's identity e^x = cos(x) + sin(x)
let euler = function(kn, N){
	let x = -2*Math.PI*kn/N;
	return [Math.cos(x), Math.sin(x)];
}

module.exports={
	bitReverseArray: bitReverseArray,
	multiply: multiply,
  	add: add,
  	euler: euler
};