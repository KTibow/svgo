import { optimize } from './lib/svgo-node.js';

// More focused test to understand the issue
const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0.4 0.4 L0.8 0.8 L1.2 1.2 L1.6 1.6 L2.0 2.0 L2.4 2.4 L2.8 2.8 L3.2 3.2 L3.6 3.6 L4.0 4.0"/>
</svg>`;

console.log("Original SVG (should end at 4.0, 4.0):");
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

// Let's manually calculate step by step
console.log("Manual calculation:");
console.log("Start: M0.4 0.4 -> M0 0 (rounded)");
console.log("L0.8 0.8 -> relative: l0.4 0.4 -> l0 0 (rounded)");
console.log("L1.2 1.2 -> relative: l0.4 0.4 -> l0 0 (rounded)");
console.log("...");
console.log("Each step should be l0 0, which would be removed as useless");
console.log("\n");

// Let's try a different approach - use larger increments
const testSvg2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0.8 0.8 L1.6 1.6 L2.4 2.4 L3.2 3.2 L4.0 4.0"/>
</svg>`;

console.log("Test 2 - larger increments (should end at 4.0, 4.0):");
const result2 = optimize(testSvg2, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0
      }
    }
  ]
});

console.log("Result 2:");
console.log(result2.data);
console.log("\n");

// Let's try to understand what's happening with error accumulation
const testSvg3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0.4 0.4 L0.8 0.8 L1.2 1.2 L1.6 1.6 L2.0 2.0"/>
</svg>`;

console.log("Test 3 - debugging error accumulation (should end at 2.0, 2.0):");
const result3 = optimize(testSvg3, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        removeUseless: false  // Don't remove useless commands to see what happens
      }
    }
  ]
});

console.log("Result 3 (with removeUseless disabled):");
console.log(result3.data);