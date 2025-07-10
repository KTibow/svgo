import { optimize } from './lib/svgo-node.js';

// Let's analyze the raw output from test 1 in detail
const testPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0${Array.from({length: 50}, (_, i) => ` L${(i + 1) * 0.1} ${(i + 1) * 0.1}`).join('')}"/>
</svg>`;

console.log("Analyzing raw output from accumulated error algorithm:");
console.log("=================================================");

const result = optimize(testPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        applyTransforms: false,
        makeArcs: false,
        straightCurves: false,
        convertToQ: false,
        lineShorthands: false,
        convertToZ: false,
        curveSmoothShorthands: false,
        removeUseless: false,
        collapseRepeated: false,
        utilizeAbsolute: false,
        smartArcRounding: false
      }
    }
  ]
});

const pathMatch = result.data.match(/d="([^"]+)"/);
if (pathMatch) {
  const pathData = pathMatch[1].trim();
  console.log("Raw path data:");
  console.log(pathData);
  console.log("");
  
  // Parse the moves carefully
  const moves = pathData.split(' ').slice(3); // Skip "m0 0"
  console.log("Individual moves:");
  
  let x = 0, y = 0;
  let moveNumber = 0;
  
  for (let i = 0; i < moves.length; i += 2) {
    if (i + 1 < moves.length) {
      const dx = parseInt(moves[i]);
      const dy = parseInt(moves[i + 1]);
      x += dx;
      y += dy;
      moveNumber++;
      
      if (dx !== 0 || dy !== 0) {
        console.log(`Move ${moveNumber}: ${dx} ${dy} -> (${x}, ${y}) [non-zero]`);
      } else if (moveNumber <= 10 || moveNumber % 10 === 0) {
        console.log(`Move ${moveNumber}: ${dx} ${dy} -> (${x}, ${y})`);
      }
    }
  }
  
  console.log(`\nFinal position: (${x}, ${y})`);
  console.log(`Expected: (5.0, 5.0)`);
  console.log(`Error: (${x - 5.0}, ${y - 5.0})`);
  
  // Count non-zero moves
  const nonZeroMoves = [];
  let moveNum = 0;
  for (let i = 0; i < moves.length; i += 2) {
    if (i + 1 < moves.length) {
      const dx = parseInt(moves[i]);
      const dy = parseInt(moves[i + 1]);
      moveNum++;
      if (dx !== 0 || dy !== 0) {
        nonZeroMoves.push({move: moveNum, dx, dy});
      }
    }
  }
  
  console.log(`\nNon-zero moves: ${nonZeroMoves.length}`);
  nonZeroMoves.forEach(m => {
    console.log(`  Move ${m.move}: ${m.dx} ${m.dy}`);
  });
}

console.log("");
console.log("Now let's test the issue with removeUseless in more detail:");

const resultUseless = optimize(testPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        applyTransforms: false,
        makeArcs: false,
        straightCurves: false,
        convertToQ: false,
        lineShorthands: false,
        convertToZ: false,
        curveSmoothShorthands: false,
        removeUseless: true,
        collapseRepeated: false,
        utilizeAbsolute: false,
        smartArcRounding: false
      }
    }
  ]
});

const pathMatchUseless = resultUseless.data.match(/d="([^"]+)"/);
if (pathMatchUseless) {
  const pathData = pathMatchUseless[1].trim();
  console.log("With removeUseless:");
  console.log(pathData);
  
  const moves = pathData.split(' ').slice(3); // Skip "m0 0"
  let x = 0, y = 0;
  
  for (let i = 0; i < moves.length; i += 2) {
    if (i + 1 < moves.length) {
      const dx = parseInt(moves[i]);
      const dy = parseInt(moves[i + 1]);
      x += dx;
      y += dy;
      console.log(`Move: ${dx} ${dy} -> (${x}, ${y})`);
    }
  }
  
  console.log(`Final: (${x}, ${y}), Expected: (5.0, 5.0), Error: (${x - 5.0}, ${y - 5.0})`);
}