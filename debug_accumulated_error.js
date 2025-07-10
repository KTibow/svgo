import { optimize } from './lib/svgo-node.js';

// Let's create a test case that better matches the issue description
// The issue mentions that the output is "notably more than 1 pixel off" with precision 0
// This suggests that what should be small errors are becoming large errors

console.log("Testing accumulated error with precision 0:");
console.log("==========================================");

// Create a path with many small increments that should accumulate to significant values
const testPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M10 10 L10.3 10.3 L10.6 10.6 L10.9 10.9 L11.2 11.2 L11.5 11.5 L11.8 11.8 L12.1 12.1 L12.4 12.4 L12.7 12.7 L13.0 13.0 L13.3 13.3 L13.6 13.6 L13.9 13.9 L14.2 14.2 L14.5 14.5 L14.8 14.8 L15.1 15.1 L15.4 15.4 L15.7 15.7 L16.0 16.0"/>
</svg>`;

console.log("Original path: Should end at 16.0, 16.0");
console.log("Steps of 0.3, 0.3 each (20 steps total)");
console.log("");

// Test with precision 0
const result0 = optimize(testPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        removeUseless: false,
        convertToZ: false  // Disable convertToZ to avoid confusion
      }
    }
  ]
});

console.log("Result with precision 0:");
console.log(result0.data);
console.log("");

// Test with precision 1 for comparison
const result1 = optimize(testPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 1,
        removeUseless: false,
        convertToZ: false
      }
    }
  ]
});

console.log("Result with precision 1:");
console.log(result1.data);
console.log("");

// Test with no convertPathData to see the original
const resultOriginal = optimize(testPath, {
  plugins: []
});

console.log("Original (no optimization):");
console.log(resultOriginal.data);
console.log("");

// Let's calculate what the error should be
console.log("Expected behavior with precision 0:");
console.log("- Each 0.3 increment should alternate between 0 and 1 to maintain accuracy");
console.log("- 0.3 -> 0, 0.3 -> 1 (correction), 0.3 -> 0, 0.3 -> 1 (correction), etc.");
console.log("- After 20 steps, we should still be close to 16.0, 16.0");