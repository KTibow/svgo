import { optimize } from './lib/svgo-node.js';

console.log("Understanding the accumulated error issue:");
console.log("=====================================");
console.log("");

// Simple test case that should expose the issue
const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0 L0.4 0.4 L0.8 0.8 L1.2 1.2 L1.6 1.6 L2.0 2.0 L2.4 2.4 L2.8 2.8 L3.2 3.2 L3.6 3.6 L4.0 4.0"/>
</svg>`;

console.log("Original path:");
console.log("M0 0 L0.4 0.4 L0.8 0.8 L1.2 1.2 L1.6 1.6 L2.0 2.0 L2.4 2.4 L2.8 2.8 L3.2 3.2 L3.6 3.6 L4.0 4.0");
console.log("Should end at: 4.0, 4.0");
console.log("");

// Test with precision 0
const result0 = optimize(testSvg, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        removeUseless: false
      }
    }
  ]
});

console.log("With precision 0 (removeUseless=false):");
console.log(result0.data);
console.log("");

// Let's manually trace what should happen:
console.log("Manual trace of what should happen:");
console.log("1. M0 0 -> M0 0 (no change needed)");
console.log("2. L0.4 0.4 -> l0.4 0.4 -> l0 0 (rounded) -> this should be corrected!");
console.log("3. L0.8 0.8 -> l0.4 0.4 -> l1 1 (corrected because we lost 0.4 in step 2)");
console.log("4. L1.2 1.2 -> l0.4 0.4 -> l0 0 (corrected because we're back on track)");
console.log("5. L1.6 1.6 -> l0.4 0.4 -> l1 1 (corrected because we lost 0.4 in step 4)");
console.log("And so on...");
console.log("");

// Let's test with a simpler case
const simpleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0 L0.4 0.4 L0.8 0.8 L1.2 1.2"/>
</svg>`;

console.log("Simpler test case:");
const simpleResult = optimize(simpleSvg, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        removeUseless: false
      }
    }
  ]
});

console.log("Result:", simpleResult.data);
console.log("");

// Let's also test with precision 1 to see how it differs
const result1 = optimize(simpleSvg, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 1,
        removeUseless: false
      }
    }
  ]
});

console.log("Same test with precision 1:");
console.log("Result:", result1.data);