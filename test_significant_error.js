import { optimize } from './lib/svgo-node.js';

// Let's try to create a test case that really shows significant error
console.log("Testing for cases with significant accumulated error:");
console.log("=================================================");

// Create a path that goes in a square and should return to the starting point
const squarePath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M10 10 L10.3 10 L10.6 10 L10.9 10 L11.2 10 L11.5 10 L11.8 10 L12.1 10 L12.4 10 L12.7 10 L13.0 10 L13.3 10.3 L13.6 10.6 L13.9 10.9 L14.2 11.2 L14.5 11.5 L14.8 11.8 L15.1 12.1 L15.4 12.4 L15.7 12.7 L16.0 13.0 L15.7 13.3 L15.4 13.6 L15.1 13.9 L14.8 14.2 L14.5 14.5 L14.2 14.8 L13.9 15.1 L13.6 15.4 L13.3 15.7 L13.0 16.0 L12.7 15.7 L12.4 15.4 L12.1 15.1 L11.8 14.8 L11.5 14.5 L11.2 14.2 L10.9 13.9 L10.6 13.6 L10.3 13.3 L10.0 13.0 L10.3 12.7 L10.6 12.4 L10.9 12.1 L11.2 11.8 L11.5 11.5 L11.8 11.2 L12.1 10.9 L12.4 10.6 L12.7 10.3 L13.0 10.0"/>
</svg>`;

console.log("Square path with many small increments (should form a rough square)");
console.log("");

const squareResult = optimize(squarePath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        convertToZ: false
      }
    }
  ]
});

console.log("Square path result:");
console.log(squareResult.data);
console.log("");

// Let's also try a case with many tiny increments in one direction
const longPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0${Array.from({length: 50}, (_, i) => ` L${(i + 1) * 0.1} ${(i + 1) * 0.1}`).join('')}"/>
</svg>`;

console.log("Path with 50 tiny increments of 0.1 (should end at 5.0, 5.0):");

const longResult = optimize(longPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        convertToZ: false
      }
    }
  ]
});

console.log("Long path result:");
console.log(longResult.data);
console.log("");

// Let's test with even tinier increments
const tinyPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0${Array.from({length: 20}, (_, i) => ` L${(i + 1) * 0.05} ${(i + 1) * 0.05}`).join('')}"/>
</svg>`;

console.log("Path with 20 tiny increments of 0.05 (should end at 1.0, 1.0):");

const tinyResult = optimize(tinyPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        convertToZ: false
      }
    }
  ]
});

console.log("Tiny path result:");
console.log(tinyResult.data);
console.log("");

// Test specifically what happens with 0.4 increments (which round to 0 but should accumulate)
const testPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0${Array.from({length: 10}, (_, i) => ` L${(i + 1) * 0.4} ${(i + 1) * 0.4}`).join('')}"/>
</svg>`;

console.log("Path with 10 increments of 0.4 (should end at 4.0, 4.0):");

const testResult = optimize(testPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        convertToZ: false
      }
    }
  ]
});

console.log("0.4 increment path result:");
console.log(testResult.data);