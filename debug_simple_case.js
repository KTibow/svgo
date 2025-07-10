import { optimize } from './lib/svgo-node.js';

// Simple test: 10 increments of 0.1
const testPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0 L0.1 0.1 L0.2 0.2 L0.3 0.3 L0.4 0.4 L0.5 0.5 L0.6 0.6 L0.7 0.7 L0.8 0.8 L0.9 0.9 L1.0 1.0"/>
</svg>`;

console.log("Testing 10 increments of 0.1:");
console.log("Original: Should end at 1.0, 1.0");

const result = optimize(testPath, {
  plugins: [{ name: 'convertPathData', params: { floatPrecision: 0 } }]
});

console.log("Result:", result.data);

// The current output is verbose but correct. Let me see what it actually produces.
const pathMatch = result.data.match(/d="([^"]+)"/);
if (pathMatch) {
  const pathData = pathMatch[1].trim();
  console.log("Path data:", pathData);
  
  // This is getting verbose output like "m0 0 .1.1.1.1..."
  // But that's not actually precision 0! It should be integers only.
  
  // The real issue might be that precision 0 is not being applied correctly.
}