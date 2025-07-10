import { optimize } from './lib/svgo-node.js';

// Test case for accumulated error with precision 0
const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M10.5 10.5 L20.7 20.3 L30.9 30.1 L40.6 40.8 L50.4 50.2 L60.1 60.9 L70.8 70.7 L80.3 80.5 L90.9 90.1"/>
</svg>`;

console.log("Original SVG:");
console.log(testSvg);
console.log("\n");

// Test with precision 0 - should round to integers
const result0 = optimize(testSvg, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0
      }
    }
  ]
});

console.log("Result with precision 0:");
console.log(result0.data);
console.log("\n");

// Test with precision 1 for comparison
const result1 = optimize(testSvg, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 1
      }
    }
  ]
});

console.log("Result with precision 1:");
console.log(result1.data);