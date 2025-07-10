import { optimize } from './lib/svgo-node.js';

// Let's understand what the correct output should be
console.log("Understanding the correct accumulated error behavior:");
console.log("=================================================");

// Test with increments of 0.3 - this should alternate between 0 and 1 to maintain accuracy
const testPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M10 10 L10.3 10.3 L10.6 10.6 L10.9 10.9 L11.2 11.2 L11.5 11.5"/>
</svg>`;

console.log("Original path: M10 10 L10.3 10.3 L10.6 10.6 L10.9 10.9 L11.2 11.2 L11.5 11.5");
console.log("Should end at: 11.5, 11.5");
console.log("");

console.log("Expected behavior with perfect error correction:");
console.log("1. L10.3 10.3 -> l0.3 0.3 -> l0 0 (rounded, accumulates error of 0.3)");
console.log("2. L10.6 10.6 -> l0.3 0.3 -> l1 1 (corrected: 0.3 + 0.3 error = 0.6 -> 1)");
console.log("3. L10.9 10.9 -> l0.3 0.3 -> l0 0 (corrected: 0.3 - 0.4 error = -0.1 -> 0)");
console.log("4. L11.2 11.2 -> l0.3 0.3 -> l1 1 (corrected: 0.3 + 0.2 error = 0.5 -> 1)");
console.log("5. L11.5 11.5 -> l0.3 0.3 -> l0 0 (corrected: 0.3 - 0.2 error = 0.1 -> 0)");
console.log("Final position: (10, 10) + (0, 0) + (1, 1) + (0, 0) + (1, 1) + (0, 0) = (12, 12)");
console.log("Error: 0.5 pixels in both X and Y");
console.log("");

// Actual result
const result = optimize(testPath, {
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

console.log("Actual result with precision 0:");
console.log(result.data);
console.log("");

// Let's calculate what coordinates this actually produces
const pathMatch = result.data.match(/d="([^"]+)"/);
if (pathMatch) {
  const pathData = pathMatch[1];
  console.log(`Path data: ${pathData}`);
  
  // Parse the path manually to trace coordinates
  let x = 10, y = 10;
  console.log(`\nTracing actual coordinates:`);
  console.log(`Start: (${x}, ${y})`);
  
  // This is a rough parse - the actual path might be different
  // But based on the pattern we've seen, it's likely: m10 10 0 0 1 1 0 0 0 0 0 0
  const moves = pathData.replace(/m10 10 /, '').split(' ');
  for (let i = 0; i < moves.length; i += 2) {
    if (i + 1 < moves.length) {
      const dx = parseFloat(moves[i]);
      const dy = parseFloat(moves[i + 1]);
      x += dx;
      y += dy;
      console.log(`Move by (${dx}, ${dy}) -> (${x}, ${y})`);
    }
  }
  console.log(`Final position: (${x}, ${y})`);
  console.log(`Expected: (11.5, 11.5)`);
  console.log(`Error: (${x - 11.5}, ${y - 11.5})`);
}

console.log("");

// Let's also test what happens with a longer path
const longPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0 L0.3 0.3 L0.6 0.6 L0.9 0.9 L1.2 1.2 L1.5 1.5 L1.8 1.8 L2.1 2.1 L2.4 2.4 L2.7 2.7 L3.0 3.0 L3.3 3.3 L3.6 3.6 L3.9 3.9 L4.2 4.2 L4.5 4.5 L4.8 4.8 L5.1 5.1 L5.4 5.4 L5.7 5.7 L6.0 6.0"/>
</svg>`;

console.log("Testing with a longer path (should end at 6.0, 6.0):");
const longResult = optimize(longPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        removeUseless: false,
        convertToZ: false,
      }
    }
  ]
});

console.log("Long path result:");
console.log(longResult.data);