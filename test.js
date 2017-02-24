var fft = require('./fft.js').fft;
var ifft = require('./fft.js').ifft;

var x = [
          {
            'real': 0,
            'imag': 0
          },
          {
            'real': 0.4,
            'imag': 0
          },
          {
            'real': 0.9,
            'imag': 0
          },
          {
            'real': 0.3,
            'imag': 0
          },
          {
            'real': -0.3,
            'imag': 0
          },
          {
            'real': -1.0,
            'imag': 0
          },
          {
            'real': -0.6,
            'imag': 0
          },
          {
            'real': 0,
            'imag': 0
          }
];

console.log(x);

var X = fft(x);
console.log(X);
//
var y = ifft(X);
console.log(y)
