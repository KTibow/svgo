import { optimize } from './lib/svgo-node.js';

// Let's trace through the 0.1 increment case step by step
console.log("Tracing 0.1 increments case:");
console.log("============================");

// Start with just a few increments to understand the pattern
const testPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0 L0.1 0.1 L0.2 0.2 L0.3 0.3 L0.4 0.4 L0.5 0.5 L0.6 0.6 L0.7 0.7 L0.8 0.8 L0.9 0.9 L1.0 1.0"/>
</svg>`;

console.log("Path: M0 0 L0.1 0.1 L0.2 0.2 ... L1.0 1.0 (should end at 1.0, 1.0)");

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

// Let's manually calculate what should happen:
console.log("Manual calculation of what should happen:");
console.log("1. L0.1 0.1 -> l0.1 0.1 -> l0 0 (error: +0.1, +0.1)");
console.log("2. L0.2 0.2 -> l0.1 0.1 -> l0 0 (error: +0.2, +0.2)");
console.log("3. L0.3 0.3 -> l0.1 0.1 -> l0 0 (error: +0.3, +0.3)");
console.log("4. L0.4 0.4 -> l0.1 0.1 -> l0 0 (error: +0.4, +0.4)");
console.log("5. L0.5 0.5 -> l0.1 0.1 -> l1 1 (corrected, error: -0.4, -0.4)");
console.log("6. L0.6 0.6 -> l0.1 0.1 -> l0 0 (error: -0.3, -0.3)");
console.log("...");
console.log("Expected pattern: l0 0 l0 0 l0 0 l0 0 l1 1 l0 0 l0 0 l0 0 l0 0 l1 1");
console.log("Final position should be close to (1, 1)");
console.log("");

// Now let's test with more increments
const longerPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0${Array.from({length: 10}, (_, i) => ` L${(i + 1) * 0.1} ${(i + 1) * 0.1}`).join('')}"/>
</svg>`;

console.log("Testing 10 increments of 0.1 (should end at 1.0, 1.0):");

const longerResult = optimize(longerPath, {
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
console.log(longerResult.data);
console.log("");

// And even more
const evenLongerPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0${Array.from({length: 20}, (_, i) => ` L${(i + 1) * 0.1} ${(i + 1) * 0.1}`).join('')}"/>
</svg>`;

console.log("Testing 20 increments of 0.1 (should end at 2.0, 2.0):");

const evenLongerResult = optimize(evenLongerPath, {
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
console.log(evenLongerResult.data);
console.log("");

// Parse and trace the coordinates
const parseAndTrace = (svg, expectedEnd) => {
  const pathMatch = svg.match(/d="([^"]+)"/);
  if (pathMatch) {
    const pathData = pathMatch[1].trim();
    console.log(`Path data: ${pathData}`);
    
    // Simple parsing for this specific case
    let x = 0, y = 0;
    if (pathData.startsWith('m0 0 ')) {
      const commands = pathData.substring(5).split(' ');
      console.log("Tracing coordinates:");
      console.log(`Start: (${x}, ${y})`);
      
      for (let i = 0; i < commands.length; i += 2) {
        if (i + 1 < commands.length) {
          const dx = parseFloat(commands[i]);
          const dy = parseFloat(commands[i + 1]);
          x += dx;
          y += dy;
          console.log(`+${dx},${dy} -> (${x}, ${y})`);
        }
      }
      
      console.log(`Final: (${x}, ${y}), Expected: (${expectedEnd}, ${expectedEnd})`);
      console.log(`Error: (${x - expectedEnd}, ${y - expectedEnd})`);
    }
  }
  console.log("");
};

parseAndTrace(longerResult.data, 1.0);
parseAndTrace(evenLongerResult.data, 2.0);