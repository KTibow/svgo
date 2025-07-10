import { optimize } from './lib/svgo-node.js';

// Create a test case that demonstrates the fix
const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0${Array.from({length: 50}, (_, i) => ` L${(i + 1) * 0.1} ${(i + 1) * 0.1}`).join('')}"/>
</svg>`;

console.log("Final test of accumulated error fix:");
console.log("==================================");
console.log("Testing 50 increments of 0.1 (should end at 5.0, 5.0)");

const result = optimize(testSvg, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0
      }
    }
  ]
});

console.log("Result:", result.data);

// Parse result
const pathMatch = result.data.match(/d="([^"]+)"/);
if (pathMatch) {
  const pathData = pathMatch[1].trim();
  
  if (pathData.startsWith('m0 0')) {
    const moves = pathData.split(' ').slice(3); // Skip "m0 0"
    let x = 0, y = 0;
    
    for (let i = 0; i < moves.length; i += 2) {
      if (i + 1 < moves.length) {
        const dx = parseInt(moves[i]);
        const dy = parseInt(moves[i + 1]);
        x += dx;
        y += dy;
      }
    }
    
    console.log(`Final position: (${x}, ${y})`);
    console.log(`Expected: (5, 5)`);
    console.log(`Error: (${x - 5}, ${y - 5})`);
    
    if (Math.abs(x - 5) <= 1 && Math.abs(y - 5) <= 1) {
      console.log("✓ Error is within acceptable range for precision 0");
    } else {
      console.log("✗ Error is too large");
    }
  }
}