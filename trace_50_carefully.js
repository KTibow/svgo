import { optimize } from './lib/svgo-node.js';

// Let's manually trace the exact coordinates for the 50 increment case
const testPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0${Array.from({length: 50}, (_, i) => ` L${(i + 1) * 0.1} ${(i + 1) * 0.1}`).join('')}"/>
</svg>`;

console.log("Testing 50 increments of 0.1 (should end at 5.0, 5.0):");

const result = optimize(testPath, {
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

console.log("Result:");
console.log(result.data);
console.log("");

// Parse the result more carefully
const pathMatch = result.data.match(/d="([^"]+)"/);
if (pathMatch) {
  const pathData = pathMatch[1].trim();
  console.log(`Path data: ${pathData}`);
  
  // Manual trace of M0 0h0l1 1h0l1 1h0l1 1h0l1 1h0l1 1h0
  let x = 0, y = 0;
  console.log("\nManual trace:");
  console.log(`Start: M0 0 -> (${x}, ${y})`);
  
  if (pathData === "m0 0 1 1 1 1 1 1 1 1 1 1") {
    // Format: m0 0 1 1 1 1 1 1 1 1 1 1
    const moves = pathData.split(' ').slice(3); // Skip "m0 0"
    for (let i = 0; i < moves.length; i += 2) {
      if (i + 1 < moves.length) {
        const dx = parseInt(moves[i]);
        const dy = parseInt(moves[i + 1]);
        x += dx;
        y += dy;
        console.log(`l${dx} ${dy} -> (${x}, ${y})`);
      }
    }
  } else if (pathData.includes("h0") && pathData.includes("l1 1")) {
    // Format: M0 0h0l1 1h0l1 1h0...
    // Let's count manually
    const matches = pathData.match(/l1 1/g);
    const horizontalZeros = pathData.match(/h0/g);
    console.log(`Found ${matches ? matches.length : 0} "l1 1" commands`);
    console.log(`Found ${horizontalZeros ? horizontalZeros.length : 0} "h0" commands`);
    
    x = matches ? matches.length : 0;
    y = matches ? matches.length : 0;
    console.log(`Final estimated position: (${x}, ${y})`);
  }
  
  console.log(`Expected: (5.0, 5.0)`);
  console.log(`Error: (${x - 5.0}, ${y - 5.0})`);
}

console.log("");
console.log("Testing comparison cases:");

// Compare with 30 and 40 to see the pattern
console.log("30 increments:");
const test30 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0${Array.from({length: 30}, (_, i) => ` L${(i + 1) * 0.1} ${(i + 1) * 0.1}`).join('')}"/>
</svg>`;

const result30 = optimize(test30, {
  plugins: [{ name: 'convertPathData', params: { floatPrecision: 0, convertToZ: false } }]
});

console.log(result30.data);

console.log("40 increments:");
const test40 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0${Array.from({length: 40}, (_, i) => ` L${(i + 1) * 0.1} ${(i + 1) * 0.1}`).join('')}"/>
</svg>`;

const result40 = optimize(test40, {
  plugins: [{ name: 'convertPathData', params: { floatPrecision: 0, convertToZ: false } }]
});

console.log(result40.data);

console.log("60 increments:");
const test60 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0${Array.from({length: 60}, (_, i) => ` L${(i + 1) * 0.1} ${(i + 1) * 0.1}`).join('')}"/>
</svg>`;

const result60 = optimize(test60, {
  plugins: [{ name: 'convertPathData', params: { floatPrecision: 0, convertToZ: false } }]
});

console.log(result60.data);