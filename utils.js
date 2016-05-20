'use strict';

// complex multiplication
let multiply = function(a,b){
	return [a[0]*b[0] - a[1]*b[1], 
			a[0]*b[1] + a[1]*b[0]];
}

let add = function(a,b){
  return [a[0]+b[0], a[1]+b[1]];
}

let euler = function(kn, N){
	let x = -2*Math.PI*kn/N;
  return [Math.cos(x), Math.sin(x)];
}

module.exports={
	multiply: multiply,
  add: add,
  euler: euler
};