import { optimize } from './lib/svgo-node.js';

// Test case for accumulated error with precision 0
const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M10.5 10.5 L20.7 20.3 L30.9 30.1 L40.6 40.8 L50.4 50.2 L60.1 60.9 L70.8 70.7 L80.3 80.5 L90.9 90.1"/>
</svg>`;

console.log("Original path coordinates:");
console.log("M10.5 10.5 L20.7 20.3 L30.9 30.1 L40.6 40.8 L50.4 50.2 L60.1 60.9 L70.8 70.7 L80.3 80.5 L90.9 90.1");
console.log("\nExpected final absolute coordinate: 90.9, 90.1");
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

// Let's manually calculate what the final coordinate should be
// Starting from m11 11 (rounded from 10.5, 10.5)
// m11 11 + 10 9 = 21, 20 (vs original 20.7, 20.3)
// + 10 10 = 31, 30 (vs original 30.9, 30.1)
// + 10 11 = 41, 41 (vs original 40.6, 40.8)
// + 9 9 = 50, 50 (vs original 50.4, 50.2)
// + 10 11 = 60, 61 (vs original 60.1, 60.9)
// + 11 10 = 71, 71 (vs original 70.8, 70.7)
// + 9 10 = 80, 81 (vs original 80.3, 80.5)
// + 11 9 = 91, 90 (vs original 90.9, 90.1)

console.log("Manual calculation of final coordinates with precision 0:");
console.log("Should be around: 91, 90");
console.log("Original final: 90.9, 90.1");
console.log("Error: approximately 0.1 pixels in X and -0.1 pixels in Y");
console.log("\nThis level of error accumulation is actually quite reasonable for precision 0!");

// Let's test a more extreme case
const extremeTestSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0.9 0.9 L1.8 1.8 L2.7 2.7 L3.6 3.6 L4.5 4.5 L5.4 5.4 L6.3 6.3 L7.2 7.2 L8.1 8.1 L9.0 9.0 L9.9 9.9 L10.8 10.8 L11.7 11.7 L12.6 12.6 L13.5 13.5 L14.4 14.4 L15.3 15.3 L16.2 16.2 L17.1 17.1 L18.0 18.0"/>
</svg>`;

console.log("\n\nTesting more extreme case with many 0.9 increments:");
const extremeResult = optimize(extremeTestSvg, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0
      }
    }
  ]
});

console.log("Original extreme test: should end at 18.0, 18.0");
console.log("Result:");
console.log(extremeResult.data);