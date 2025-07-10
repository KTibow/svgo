// Let's manually simulate the accumulated error algorithm for 50 steps of 0.1
// to understand where the bug is

console.log("Manual simulation of accumulated error algorithm:");
console.log("==============================================");

// Initial values
let relSubpoint = [0, 0];  // Accumulated rounded position
let pathBase = [0, 0];     // Start of current subpath
const precision = 0;
const error = 1e-2;  // 0.01

// Function to simulate rounding with precision 0
function round(value) {
  return Math.round(value);
}

console.log("Starting simulation:");
console.log(`relSubpoint: [${relSubpoint[0]}, ${relSubpoint[1]}]`);
console.log(`pathBase: [${pathBase[0]}, ${pathBase[1]}]`);
console.log("");

// Process each step
for (let step = 1; step <= 50; step++) {
  const absoluteX = step * 0.1;
  const absoluteY = step * 0.1;
  const prevAbsoluteX = (step - 1) * 0.1;
  const prevAbsoluteY = (step - 1) * 0.1;
  
  // Calculate relative move (this is what would be stored in data initially)
  let relativeX = absoluteX - prevAbsoluteX; // Should be 0.1
  let relativeY = absoluteY - prevAbsoluteY; // Should be 0.1
  
  // Apply error correction (this is the key part)
  const itemBaseX = prevAbsoluteX; // item.base[0]
  const itemBaseY = prevAbsoluteY; // item.base[1]
  
  relativeX += itemBaseX - relSubpoint[0];
  relativeY += itemBaseY - relSubpoint[1];
  
  // Round the data
  const roundedX = round(relativeX);
  const roundedY = round(relativeY);
  
  // Update relSubpoint with the rounded data
  relSubpoint[0] += roundedX;
  relSubpoint[1] += roundedY;
  
  // Also round relSubpoint (this might be the bug!)
  relSubpoint[0] = round(relSubpoint[0]);
  relSubpoint[1] = round(relSubpoint[1]);
  
  if (step <= 10 || step % 10 === 0 || step >= 45) {
    console.log(`Step ${step}:`);
    console.log(`  Absolute: (${absoluteX.toFixed(1)}, ${absoluteY.toFixed(1)})`);
    console.log(`  Item base: (${itemBaseX.toFixed(1)}, ${itemBaseY.toFixed(1)})`);
    console.log(`  Raw relative: (${(0.1).toFixed(1)}, ${(0.1).toFixed(1)})`);
    console.log(`  Error correction: (${(itemBaseX - relSubpoint[0] + roundedX).toFixed(1)}, ${(itemBaseY - relSubpoint[1] + roundedY).toFixed(1)})`);
    console.log(`  Corrected relative: (${relativeX.toFixed(1)}, ${relativeY.toFixed(1)})`);
    console.log(`  Rounded: (${roundedX}, ${roundedY})`);
    console.log(`  relSubpoint after: [${relSubpoint[0]}, ${relSubpoint[1]}]`);
    console.log(`  Expected position: (${absoluteX.toFixed(1)}, ${absoluteY.toFixed(1)})`);
    console.log(`  Actual position: (${relSubpoint[0]}, ${relSubpoint[1]})`);
    console.log(`  Error: (${(relSubpoint[0] - absoluteX).toFixed(1)}, ${(relSubpoint[1] - absoluteY).toFixed(1)})`);
    console.log("");
  }
}

console.log(`Final result:`);
console.log(`Expected end: (5.0, 5.0)`);
console.log(`Actual end: (${relSubpoint[0]}, ${relSubpoint[1]})`);
console.log(`Total error: (${relSubpoint[0] - 5.0}, ${relSubpoint[1] - 5.0})`);