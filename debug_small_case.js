import { optimize } from './lib/svgo-node.js';

// Let's create a smaller test case to debug
const testPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0 L0.1 0.1 L0.2 0.2 L0.3 0.3 L0.4 0.4 L0.5 0.5"/>
</svg>`;

console.log("Debugging with smaller case (6 steps):");
console.log("Original: M0 0 L0.1 0.1 L0.2 0.2 L0.3 0.3 L0.4 0.4 L0.5 0.5");
console.log("Should end at: 0.5, 0.5");
console.log("");

const result = optimize(testPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        convertToZ: false,
        removeUseless: false
      }
    }
  ]
});

console.log("Result:");
console.log(result.data);

// Parse the result
const pathMatch = result.data.match(/d="([^"]+)"/);
if (pathMatch) {
  const pathData = pathMatch[1].trim();
  console.log(`Path data: ${pathData}`);
  
  // Let's manually trace this
  if (pathData.includes("m0 0")) {
    const moves = pathData.split(' ').slice(3); // Skip "m0 0"
    let x = 0, y = 0;
    console.log(`Start: (${x}, ${y})`);
    
    for (let i = 0; i < moves.length; i += 2) {
      if (i + 1 < moves.length) {
        const dx = parseInt(moves[i]);
        const dy = parseInt(moves[i + 1]);
        x += dx;
        y += dy;
        console.log(`Move by (${dx}, ${dy}) -> (${x}, ${y})`);
      }
    }
    
    console.log(`Final: (${x}, ${y}), Expected: (0.5, 0.5), Error: (${x - 0.5}, ${y - 0.5})`);
  }
}

console.log("");
console.log("Let's also check what happens with 5 steps vs 6 steps:");

// Test 5 steps
const test5 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0 L0.1 0.1 L0.2 0.2 L0.3 0.3 L0.4 0.4"/>
</svg>`;

const result5 = optimize(test5, {
  plugins: [{ name: 'convertPathData', params: { floatPrecision: 0, convertToZ: false } }]
});

console.log("5 steps (should end at 0.4, 0.4):");
console.log(result5.data);

// Test 7 steps
const test7 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0 L0.1 0.1 L0.2 0.2 L0.3 0.3 L0.4 0.4 L0.5 0.5 L0.6 0.6"/>
</svg>`;

const result7 = optimize(test7, {
  plugins: [{ name: 'convertPathData', params: { floatPrecision: 0, convertToZ: false } }]
});

console.log("7 steps (should end at 0.7, 0.7):");
console.log(result7.data);