import { optimize } from './lib/svgo-node.js';

// Test with various optimization combinations to isolate the bug
const testPath = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M0 0${Array.from({length: 50}, (_, i) => ` L${(i + 1) * 0.1} ${(i + 1) * 0.1}`).join('')}"/>
</svg>`;

console.log("Testing 50 increments with different optimization settings:");
console.log("========================================================");

// Test 1: Only floatPrecision
const result1 = optimize(testPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        // Disable most other optimizations
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

console.log("1. Only floatPrecision=0 (all other optimizations disabled):");
console.log(result1.data);

// Test 2: Enable only removeUseless 
const result2 = optimize(testPath, {
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

console.log("2. floatPrecision=0 + removeUseless:");
console.log(result2.data);

// Test 3: Enable only collapseRepeated
const result3 = optimize(testPath, {
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
        collapseRepeated: true,
        utilizeAbsolute: false,
        smartArcRounding: false
      }
    }
  ]
});

console.log("3. floatPrecision=0 + collapseRepeated:");
console.log(result3.data);

// Test 4: Enable only lineShorthands
const result4 = optimize(testPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
        applyTransforms: false,
        makeArcs: false,
        straightCurves: false,
        convertToQ: false,
        lineShorthands: true,
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

console.log("4. floatPrecision=0 + lineShorthands:");
console.log(result4.data);

// Test 5: Default settings
const result5 = optimize(testPath, {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0
      }
    }
  ]
});

console.log("5. Default settings with floatPrecision=0:");
console.log(result5.data);

// Count moves in each result to see where the error comes from
const countMoves = (svg) => {
  const pathMatch = svg.match(/d="([^"]+)"/);
  if (pathMatch) {
    const pathData = pathMatch[1].trim();
    const lMoves = (pathData.match(/l\d+\s+\d+/g) || []).length;
    const hMoves = (pathData.match(/h\d+/g) || []).length;
    const vMoves = (pathData.match(/v\d+/g) || []).length;
    return { lMoves, hMoves, vMoves, total: lMoves + hMoves + vMoves };
  }
  return { lMoves: 0, hMoves: 0, vMoves: 0, total: 0 };
};

console.log("\nMove counts:");
console.log("1. Only precision:", countMoves(result1.data));
console.log("2. + removeUseless:", countMoves(result2.data));
console.log("3. + collapseRepeated:", countMoves(result3.data));
console.log("4. + lineShorthands:", countMoves(result4.data));
console.log("5. Default:", countMoves(result5.data));