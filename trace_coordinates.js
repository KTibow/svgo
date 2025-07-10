import { optimize } from './lib/svgo-node.js';

// Let's trace through the exact coordinates
console.log("Tracing coordinates with precision 0:");
console.log("====================================");

// Simple test case with just a few steps
const testPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M10 10 L10.3 10.3 L10.6 10.6 L10.9 10.9 L11.2 11.2"/>
</svg>`;

console.log("Original: M10 10 L10.3 10.3 L10.6 10.6 L10.9 10.9 L11.2 11.2");
console.log("Should end at: 11.2, 11.2");
console.log("");

// Test with precision 0
const result = optimize(testPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        removeUseless: false,
        convertToZ: false,
        lineShorthands: false  // Disable h/v shorthands to see l commands
      }
    }
  ]
});

console.log("Result with precision 0:");
console.log(result.data);
console.log("");

// Now let's manually calculate the coordinates:
console.log("Manual calculation of the result path:");
let x = 10, y = 10;
console.log(`Start: M${x} ${y}`);

// Parse the result to understand what's happening
const pathMatch = result.data.match(/d="([^"]+)"/);
if (pathMatch) {
  const pathData = pathMatch[1];
  console.log(`Path data: ${pathData}`);
  
  // Let's manually interpret this
  // The result appears to be something like: M10 10l0 0l1 1l0 0l1 1
  // Let's trace through this
  console.log("\nTracing through the actual result:");
  console.log("(This is a rough interpretation - the actual path might be different)");
}

console.log("\nLet's try a different approach - disable more optimizations:");

const result2 = optimize(testPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        removeUseless: false,
        convertToZ: false,
        lineShorthands: false,
        collapseRepeated: false,
        utilizeAbsolute: false
      }
    }
  ]
});

console.log("Result with more optimizations disabled:");
console.log(result2.data);