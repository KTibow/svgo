import { optimize } from './lib/svgo-node.js';

const testPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0${Array.from({length: 50}, (_, i) => ` L${(i + 1) * 0.1} ${(i + 1) * 0.1}`).join('')}"/>
</svg>`;

console.log("Testing with collapseRepeated disabled:");
console.log("====================================");

const result = optimize(testPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        collapseRepeated: false
      }
    }
  ]
});

console.log("Result with collapseRepeated=false:");
console.log(result.data);

// Parse and count moves
const pathMatch = result.data.match(/d="([^"]+)"/);
if (pathMatch) {
  const pathData = pathMatch[1].trim();
  
  if (pathData.includes('h') || pathData.includes('v')) {
    console.log("Contains h/v commands - more complex parsing needed");
    console.log(`Path: ${pathData}`);
  } else {
    // Simple l commands
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
    
    console.log(`Moves: ${moves.length / 2}`);
    console.log(`Final: (${x}, ${y}), Expected: (5, 5), Error: (${x - 5}, ${y - 5})`);
  }
}

console.log("");
console.log("Now test with both collapseRepeated and removeUseless disabled:");

const result2 = optimize(testPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        collapseRepeated: false,
        removeUseless: false
      }
    }
  ]
});

console.log("Result with collapseRepeated=false, removeUseless=false:");
console.log(result2.data);

// Count moves in raw output
const pathMatch2 = result2.data.match(/d="([^"]+)"/);
if (pathMatch2) {
  const pathData = pathMatch2[1].trim();
  const moves = pathData.split(' ').slice(3); // Skip "m0 0"
  let x = 0, y = 0;
  let nonZeroMoves = 0;
  
  for (let i = 0; i < moves.length; i += 2) {
    if (i + 1 < moves.length) {
      const dx = parseInt(moves[i]);
      const dy = parseInt(moves[i + 1]);
      x += dx;
      y += dy;
      if (dx !== 0 || dy !== 0) {
        nonZeroMoves++;
      }
    }
  }
  
  console.log(`Total moves: ${moves.length / 2}, Non-zero moves: ${nonZeroMoves}`);
  console.log(`Final: (${x}, ${y}), Expected: (5, 5), Error: (${x - 5}, ${y - 5})`);
}