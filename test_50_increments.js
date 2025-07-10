import { optimize } from './lib/svgo-node.js';

// Let's carefully test the 50 increment case
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
        convertToZ: false,
        removeUseless: false
      }
    }
  ]
});

console.log("Result:");
console.log(result.data);
console.log("");

// Parse and trace the coordinates
const pathMatch = result.data.match(/d="([^"]+)"/);
if (pathMatch) {
  const pathData = pathMatch[1].trim();
  console.log(`Path data: ${pathData}`);
  
  // Count the number of "l1 1" vs other commands
  const commands = pathData.split(' ');
  let moveCount = 0;
  let x = 0, y = 0;
  
  console.log("Parsing commands:");
  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];
    if (cmd === 'M0') {
      console.log("M0 0 - start at (0, 0)");
      i++; // skip the 0
    } else if (cmd === 'h0') {
      console.log("h0 - horizontal line by 0");
    } else if (cmd === 'l1') {
      const next = commands[i + 1];
      if (next === '1') {
        console.log("l1 1 - line by (1, 1)");
        x += 1;
        y += 1;
        moveCount++;
        i++; // skip the 1
      }
    } else if (cmd.startsWith('l')) {
      console.log(`${cmd} - some other line command`);
    }
  }
  
  console.log(`Final position: (${x}, ${y})`);
  console.log(`Expected: (5.0, 5.0)`);
  console.log(`Error: (${x - 5.0}, ${y - 5.0})`);
  console.log(`Number of "l1 1" moves: ${moveCount}`);
  console.log(`Should be 5 moves total to reach (5, 5)`);
}

console.log("");
console.log("Let's also test some intermediate sizes:");

// Test 30 increments
const test30 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0${Array.from({length: 30}, (_, i) => ` L${(i + 1) * 0.1} ${(i + 1) * 0.1}`).join('')}"/>
</svg>`;

const result30 = optimize(test30, {
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

console.log("30 increments of 0.1 (should end at 3.0, 3.0):");
console.log(result30.data);

// Test 40 increments  
const test40 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0${Array.from({length: 40}, (_, i) => ` L${(i + 1) * 0.1} ${(i + 1) * 0.1}`).join('')}"/>
</svg>`;

const result40 = optimize(test40, {
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

console.log("40 increments of 0.1 (should end at 4.0, 4.0):");
console.log(result40.data);