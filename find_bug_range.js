import { optimize } from './lib/svgo-node.js';

console.log("Testing values around 50 to find the bug:");
console.log("=========================================");

// Test values from 45 to 55
for (let steps = 45; steps <= 55; steps++) {
  const testPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M0 0${Array.from({length: steps}, (_, i) => ` L${(i + 1) * 0.1} ${(i + 1) * 0.1}`).join('')}"/>
  </svg>`;

  const result = optimize(testPath, {
    plugins: [{ name: 'convertPathData', params: { floatPrecision: 0, convertToZ: false } }]
  });

  const pathMatch = result.data.match(/d="([^"]+)"/);
  if (pathMatch) {
    const pathData = pathMatch[1].trim();
    
    // Count the number of "1 1" moves
    const moves = pathData.split(' ').slice(3); // Skip "m0 0"
    const moveCount = moves.length / 2;
    const expectedEnd = steps * 0.1;
    const actualEnd = moveCount;
    const error = actualEnd - expectedEnd;
    
    console.log(`${steps} steps: Expected ${expectedEnd}, Got ${actualEnd}, Error ${error.toFixed(1)}`);
  }
}

console.log("");
console.log("Let's also test some larger numbers:");

// Test some larger values
for (let steps of [70, 80, 90, 100, 110, 120]) {
  const testPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M0 0${Array.from({length: steps}, (_, i) => ` L${(i + 1) * 0.1} ${(i + 1) * 0.1}`).join('')}"/>
  </svg>`;

  const result = optimize(testPath, {
    plugins: [{ name: 'convertPathData', params: { floatPrecision: 0, convertToZ: false } }]
  });

  const pathMatch = result.data.match(/d="([^"]+)"/);
  if (pathMatch) {
    const pathData = pathMatch[1].trim();
    
    // Count the number of "1 1" moves
    const moves = pathData.split(' ').slice(3); // Skip "m0 0"
    const moveCount = moves.length / 2;
    const expectedEnd = steps * 0.1;
    const actualEnd = moveCount;
    const error = actualEnd - expectedEnd;
    
    console.log(`${steps} steps: Expected ${expectedEnd}, Got ${actualEnd}, Error ${error.toFixed(1)}`);
  }
}