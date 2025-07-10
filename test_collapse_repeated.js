import { optimize } from './lib/svgo-node.js';

const testPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0${Array.from({length: 50}, (_, i) => ` L${(i + 1) * 0.1} ${(i + 1) * 0.1}`).join('')}"/>
</svg>`;

console.log("Testing if collapseRepeated is the issue:");
console.log("========================================");

// Test with removeUseless but without collapseRepeated
const result = optimize(testPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        removeUseless: true,
        collapseRepeated: false
      }
    }
  ]
});

console.log("removeUseless=true, collapseRepeated=false:");
console.log(result.data);

// Parse and count moves
const pathMatch = result.data.match(/d="([^"]+)"/);
if (pathMatch) {
  const pathData = pathMatch[1].trim();
  console.log(`Path data: ${pathData}`);
  
  // Count different types of moves
  const moves = pathData.split(' ').slice(3); // Skip "m0 0"
  console.log(`Total move components: ${moves.length}`);
  
  let x = 0, y = 0;
  const moveDetails = [];
  
  for (let i = 0; i < moves.length; i += 2) {
    if (i + 1 < moves.length) {
      const dx = parseInt(moves[i]);
      const dy = parseInt(moves[i + 1]);
      x += dx;
      y += dy;
      moveDetails.push({dx, dy, x, y});
    }
  }
  
  console.log("Move details:");
  moveDetails.forEach((m, i) => {
    console.log(`  ${i + 1}: ${m.dx} ${m.dy} -> (${m.x}, ${m.y})`);
  });
  
  console.log(`Final: (${x}, ${y}), Expected: (5, 5), Error: (${x - 5}, ${y - 5})`);
}

console.log("");
console.log("Also test with lineShorthands disabled:");

const result2 = optimize(testPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        removeUseless: true,
        collapseRepeated: false,
        lineShorthands: false
      }
    }
  ]
});

console.log("removeUseless=true, collapseRepeated=false, lineShorthands=false:");
console.log(result2.data);