export type Matrix = number[][];

const EPSILON = 1e-10;

function cleanFloat(value: number): number {
  if (Math.abs(value) < EPSILON) return 0;
  if (Math.abs(value - Math.round(value)) < EPSILON) return Math.round(value);
  return Math.round(value * 1e10) / 1e10;
}


function cleanMatrix(matrix: Matrix): Matrix {
  return matrix.map(row => row.map(cleanFloat));
}


function cloneMatrix(matrix: Matrix): Matrix {
  return matrix.map(row => [...row]);
}


function matrixToString(m: Matrix): string {
  return m.map(row => `[${row.map(n => cleanFloat(n)).join(', ')}]`).join('\n');
}


function validateMatrix(matrix: Matrix, name: string = "Matrix"): void {
  if (!matrix || matrix.length === 0) {
    throw new Error(`${name} is empty.`);
  }
  const cols = matrix[0].length;
  if (cols === 0) {
    throw new Error(`${name} has no columns.`);
  }
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i].length !== cols) {
      throw new Error(`${name} is not rectangular. Row ${i + 1} has ${matrix[i].length} columns, expected ${cols}.`);
    }
    for (let j = 0; j < cols; j++) {
      if (typeof matrix[i][j] !== 'number' || isNaN(matrix[i][j])) {
        throw new Error(`${name}[${i + 1}][${j + 1}] is not a valid number.`);
      }
    }
  }
}


export function dimensions(matrix: Matrix): [number, number] {
  return [matrix.length, matrix[0].length];
}

export function identityMatrix(n: number): Matrix {
  const result: Matrix = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = new Array(n).fill(0);
    row[i] = 1;
    result.push(row);
  }
  return result;
}

export function zeroMatrix(rows: number, cols: number): Matrix {
  return Array.from({ length: rows }, () => new Array(cols).fill(0));
}

export function transpose(matrix: Matrix): { result: Matrix, steps: string[] } {
  validateMatrix(matrix, "Matrix");
  const [rows, cols] = dimensions(matrix);
  const steps: string[] = ["Transpose operation: Flip rows and columns."];
  
  const result: Matrix = zeroMatrix(cols, rows);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i][j];
    }
  }
  
  steps.push(`Converted ${rows}×${cols} matrix to ${cols}×${rows}.`);
  steps.push("Example: Element at (1, 2) moved to (2, 1).");
  
  return { result: cleanMatrix(result), steps };
}


export function determinant(matrix: Matrix): { result: number, steps: string[] } {
  validateMatrix(matrix, "Matrix");
  const [rows, cols] = dimensions(matrix);
  if (rows !== cols) {
    throw new Error(`Determinant requires a square matrix. Got ${rows}×${cols}.`);
  }
  
  const steps: string[] = [`Starting determinant calculation for ${rows}×${cols} matrix.`];
  const n = rows;
  
  if (n === 1) {
    steps.push(`1×1 Matrix: Determinant is the value itself.`);
    return { result: cleanFloat(matrix[0][0]), steps };
  }
  
  if (n === 2) {
    const res = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    steps.push(`2×2 Formula: (a·d) - (b·c)`);
    steps.push(`(${cleanFloat(matrix[0][0])} · ${cleanFloat(matrix[1][1])}) - (${cleanFloat(matrix[0][1])} · ${cleanFloat(matrix[1][0])})`);
    steps.push(`= ${cleanFloat(res)}`);
    return { result: cleanFloat(res), steps };
  }

  steps.push("Using Gaussian Elimination to convert to Upper Triangular Form.");
  const m = cloneMatrix(matrix);
  let det = 1;
  let swaps = 0;

  for (let col = 0; col < n; col++) {
    let maxRow = col;
    let maxVal = Math.abs(m[col][col]);
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(m[row][col]) > maxVal) {
        maxVal = Math.abs(m[row][col]);
        maxRow = row;
      }
    }

    if (maxVal < EPSILON) {
      steps.push(`Column ${col+1} has all zeros (or near-zero). Determinant is 0.`);
      return { result: 0, steps };
    }

    if (maxRow !== col) {
      [m[col], m[maxRow]] = [m[maxRow], m[col]];
      det *= -1;
      swaps++;
      steps.push(`Swapped Row ${col+1} with Row ${maxRow+1}. Determinant sign flips.`);
    }

    const pivot = m[col][col];
    det *= pivot;
    
    for (let row = col + 1; row < n; row++) {
      const factor = m[row][col] / pivot;
      if (Math.abs(factor) > EPSILON) {
        steps.push(`R${row+1} = R${row+1} - (${cleanFloat(factor)}) * R${col+1}`);
        for (let j = col; j < n; j++) {
          m[row][j] -= factor * m[col][j];
        }
      }
    }
  }
  
  steps.push(`Matrix is now in Upper Triangular Form.`);
  steps.push(`Determinant = product of diagonal elements × (-1)^swaps`);
  
  let diagProd = 1;
  const diagStr = [];
  for(let i=0; i<n; i++) {
    diagProd *= m[i][i];
    diagStr.push(cleanFloat(m[i][i]));
  }
  
  const finalDet = diagProd * (swaps % 2 === 0 ? 1 : -1);
  steps.push(`Diagonal: ${diagStr.join(' · ')} = ${cleanFloat(diagProd)}`);
  if (swaps % 2 !== 0) steps.push(`Multiplied by -1 due to ${swaps} row swaps.`);
  steps.push(`Final Determinant: ${cleanFloat(finalDet)}`);

  return { result: cleanFloat(finalDet), steps };
}


export function rowEchelonForm(matrix: Matrix): { result: Matrix, steps: string[] } {
  validateMatrix(matrix, "Matrix");
  const [rows, cols] = dimensions(matrix);
  const m = cloneMatrix(matrix);
  const steps: string[] = ["Starting Gaussian Elimination for Row Echelon Form (REF)."];

  let pivotRow = 0;
  for (let col = 0; col < cols && pivotRow < rows; col++) {
    steps.push(`Processing Column ${col+1}...`);
    
    let maxRow = pivotRow;
    let maxVal = Math.abs(m[pivotRow][col]);
    for (let row = pivotRow + 1; row < rows; row++) {
      if (Math.abs(m[row][col]) > maxVal) {
        maxVal = Math.abs(m[row][col]);
        maxRow = row;
      }
    }

    if (maxVal < EPSILON) {
      steps.push(`Column ${col+1} is zero below pivot. Skipping.`);
      continue;
    }


    if (maxRow !== pivotRow) {
      [m[pivotRow], m[maxRow]] = [m[maxRow], m[pivotRow]];
      steps.push(`Swap R${pivotRow+1} ↔ R${maxRow+1} (Pivot: ${cleanFloat(m[pivotRow][col])})`);
    }


    for (let row = pivotRow + 1; row < rows; row++) {
      const factor = m[row][col] / m[pivotRow][col];
      if (Math.abs(factor) > EPSILON) {
        m[row][col] = 0;
        for (let j = col + 1; j < cols; j++) {
          m[row][j] -= factor * m[pivotRow][j];
        }
        steps.push(`R${row+1} = R${row+1} - (${cleanFloat(factor)}) × R${pivotRow+1}`);
      }
    }

    pivotRow++;
  }

  steps.push("Matrix is now in Row Echelon Form.");
  return { result: cleanMatrix(m), steps };
}


export function reducedRowEchelonForm(matrix: Matrix): { result: Matrix, steps: string[] } {
  validateMatrix(matrix, "Matrix");
  const [rows, cols] = dimensions(matrix);
  const m = cloneMatrix(matrix);
  const steps: string[] = ["Starting Gauss-Jordan Elimination for RREF."];

  let pivotRow = 0;
  for (let col = 0; col < cols && pivotRow < rows; col++) {
    let maxRow = pivotRow;
    let maxVal = Math.abs(m[pivotRow][col]);
    for (let row = pivotRow + 1; row < rows; row++) {
      if (Math.abs(m[row][col]) > maxVal) {
        maxVal = Math.abs(m[row][col]);
        maxRow = row;
      }
    }

    if (maxVal < EPSILON) continue;

    if (maxRow !== pivotRow) {
      [m[pivotRow], m[maxRow]] = [m[maxRow], m[pivotRow]];
      steps.push(`Swap R${pivotRow+1} ↔ R${maxRow+1}`);
    }

    const pivotVal = m[pivotRow][col];
    if (Math.abs(pivotVal - 1) > EPSILON) {
       for (let j = col; j < cols; j++) {
         m[pivotRow][j] /= pivotVal;
       }
       steps.push(`Scale R${pivotRow+1} by 1/${cleanFloat(pivotVal)} to make pivot 1`);
    }


    for (let row = 0; row < rows; row++) {
      if (row === pivotRow) continue;
      const factor = m[row][col];
      if (Math.abs(factor) > EPSILON) {
        for (let j = col; j < cols; j++) {
          m[row][j] -= factor * m[pivotRow][j];
        }
        m[row][col] = 0;
        steps.push(`R${row+1} = R${row+1} - (${cleanFloat(factor)}) × R${pivotRow+1}`);
      }
    }

    pivotRow++;
  }
  
  steps.push("Matrix is now in Reduced Row Echelon Form.");
  return { result: cleanMatrix(m), steps };
}


export function rank(matrix: Matrix): { result: number, steps: string[] } {
  const { result: rref, steps } = reducedRowEchelonForm(matrix);
  let r = 0;
  for (const row of rref) {
    if (row.some(v => Math.abs(v) > EPSILON)) {
      r++;
    }
  }
  steps.push(`Rank = Number of non-zero rows in RREF: ${r}`);
  return { result: r, steps };
}


export function adjoint(matrix: Matrix): { result: Matrix, steps: string[] } {
  validateMatrix(matrix, "Matrix");
  const [rows, cols] = dimensions(matrix);
  if (rows !== cols) {
    throw new Error(`Adjoint requires a square matrix.`);
  }
  
  const steps: string[] = ["Calculate cofactor matrix C, then transpose it (Cᵀ)."];
  const n = rows;
  const cofactorMatrix: Matrix = zeroMatrix(n, n);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const minor: Matrix = [];
      for (let r = 0; r < n; r++) {
        if (r === i) continue;
        const row: number[] = [];
        for (let c = 0; c < n; c++) {
          if (c === j) continue;
          row.push(matrix[r][c]);
        }
        minor.push(row);
      }
      
      const detVal = determinant(minor).result;
      const sign = ((i + j) % 2 === 0) ? 1 : -1;
      cofactorMatrix[i][j] = sign * detVal;
      
      if (n <= 3) { // Only log details for small matrices to avoid spam
         steps.push(`Cofactor C(${i+1},${j+1}) = (-1)^(${i+1}+${j+1}) × det(Minor) = ${sign} × ${cleanFloat(detVal)} = ${cleanFloat(cofactorMatrix[i][j])}`);
      }
    }
  }

  const adj = transpose(cofactorMatrix).result;
  steps.push("Transpose the Cofactor Matrix to get Adjoint.");
  
  return { result: cleanMatrix(adj), steps };
}


export function inverse(matrix: Matrix): { result: Matrix, steps: string[] } {
  validateMatrix(matrix, "Matrix");
  const [rows, cols] = dimensions(matrix);
  if (rows !== cols) throw new Error("Inverse requires square matrix.");
  
  const steps: string[] = ["Using Gauss-Jordan Elimination on Augmented Matrix [A | I]."];
  const n = rows;
  
  const detCheck = determinant(matrix);
  if (Math.abs(detCheck.result) < EPSILON) {
    steps.push("Determinant is 0. Matrix is singular.");
    throw new Error("Matrix is singular (determinant = 0). Inverse does not exist.");
  }


  const augmented: Matrix = [];
  for (let i = 0; i < n; i++) {
    const row = [...matrix[i]];
    for (let j = 0; j < n; j++) {
      row.push(i === j ? 1 : 0);
    }
    augmented.push(row);
  }
  
  steps.push("Formed Augmented Matrix [A | I].");


  for (let col = 0; col < n; col++) {
    let maxRow = col;
    let maxVal = Math.abs(augmented[col][col]);
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(augmented[row][col]) > maxVal) {
        maxVal = Math.abs(augmented[row][col]);
        maxRow = row;
      }
    }

    if (maxVal < EPSILON) throw new Error("Singular during elimination.");

    if (maxRow !== col) {
      [augmented[col], augmented[maxRow]] = [augmented[maxRow], augmented[col]];
      steps.push(`Swap R${col+1} ↔ R${maxRow+1}`);
    }

    const pivotVal = augmented[col][col];
    for (let j = 0; j < 2 * n; j++) {
      augmented[col][j] /= pivotVal;
    }
    steps.push(`Scale R${col+1} by 1/${cleanFloat(pivotVal)} -> Pivot is 1`);

    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = augmented[row][col];
      for (let j = 0; j < 2 * n; j++) {
        augmented[row][j] -= factor * augmented[col][j];
      }
      if (Math.abs(factor) > EPSILON) {
         steps.push(`Eliminate column ${col+1} in R${row+1}`);
      }
    }
  }

  const result: Matrix = [];
  for (let i = 0; i < n; i++) {
    result.push(augmented[i].slice(n));
  }
  
  steps.push("Left side is now Identity. Right side is A⁻¹.");

  return { result: cleanMatrix(result), steps };
}


export function isIdentity(matrix: Matrix): { result: boolean, steps: string[] } {
  const steps = ["Check if diagonal elements are 1 and off-diagonal are 0."];
  const [rows, cols] = dimensions(matrix);
  if (rows !== cols) {
    steps.push("Matrix is not square, so it cannot be Identity.");
    return { result: false, steps };
  }
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const expected = i === j ? 1 : 0;
      if (Math.abs(matrix[i][j] - expected) > EPSILON) {
        steps.push(`Fail at element (${i+1}, ${j+1}): Found ${matrix[i][j]}, expected ${expected}.`);
        return { result: false, steps };
      }
    }
  }
  
  steps.push("All elements match identity matrix pattern.");
  return { result: true, steps };
}


export function add(a: Matrix, b: Matrix): { result: Matrix, steps: string[] } {
  validateMatrix(a, "Matrix A");
  validateMatrix(b, "Matrix B");
  const [ar, ac] = dimensions(a);
  const [br, bc] = dimensions(b);
  if (ar !== br || ac !== bc) throw new Error("Dimensions must match.");

  const steps = ["Perform element-wise addition: C[i][j] = A[i][j] + B[i][j]"];
  const result = zeroMatrix(ar, ac);
  

  let count = 0;
  for (let i = 0; i < ar; i++) {
    for (let j = 0; j < ac; j++) {
      result[i][j] = a[i][j] + b[i][j];
      if (count < 3) {
         steps.push(`(${i+1},${j+1}): ${cleanFloat(a[i][j])} + ${cleanFloat(b[i][j])} = ${cleanFloat(result[i][j])}`);
         count++;
      }
    }
  }
  if (ar * ac > 3) steps.push("...and so on for all elements.");
  
  return { result: cleanMatrix(result), steps };
}

export function subtract(a: Matrix, b: Matrix): { result: Matrix, steps: string[] } {
  validateMatrix(a, "Matrix A");
  validateMatrix(b, "Matrix B");
  const [ar, ac] = dimensions(a);
  const [br, bc] = dimensions(b);
  if (ar !== br || ac !== bc) throw new Error("Dimensions must match.");

  const steps = ["Perform element-wise subtraction: C[i][j] = A[i][j] - B[i][j]"];
  const result = zeroMatrix(ar, ac);
  
  let count = 0;
  for (let i = 0; i < ar; i++) {
    for (let j = 0; j < ac; j++) {
      result[i][j] = a[i][j] - b[i][j];
       if (count < 3) {
         steps.push(`(${i+1},${j+1}): ${cleanFloat(a[i][j])} - ${cleanFloat(b[i][j])} = ${cleanFloat(result[i][j])}`);
         count++;
      }
    }
  }
  if (ar * ac > 3) steps.push("...and so on for all elements.");
  
  return { result: cleanMatrix(result), steps };
}

export function multiply(a: Matrix, b: Matrix): { result: Matrix, steps: string[] } {
  validateMatrix(a, "Matrix A");
  validateMatrix(b, "Matrix B");
  const [ar, ac] = dimensions(a);
  const [br, bc] = dimensions(b);
  if (ac !== br) throw new Error("Inner dimensions must match.");

  const steps = [`Multiplying ${ar}×${ac} by ${br}×${bc}. Result will be ${ar}×${bc}.`];
  steps.push("Dot product of Row i from A and Column j from B.");
  
  const result = zeroMatrix(ar, bc);
  let count = 0;
  
  for (let i = 0; i < ar; i++) {
    for (let j = 0; j < bc; j++) {
      let sum = 0;
      let terms = [];
      for (let k = 0; k < ac; k++) {
        sum += a[i][k] * b[k][j];
        if (count < 2) terms.push(`(${cleanFloat(a[i][k])}×${cleanFloat(b[k][j])})`);
      }
      result[i][j] = sum;
      
      if (count < 2) {
        steps.push(`C(${i+1},${j+1}) = ${terms.join(' + ')} = ${cleanFloat(sum)}`);
        count++;
      }
    }
  }
  if (ar * bc > 2) steps.push("...calculating remaining cells...");
  
  return { result: cleanMatrix(result), steps };
}

export function formatNumber(value: number): string {
  const cleaned = cleanFloat(value);
  if (Number.isInteger(cleaned)) return cleaned.toString();
  return cleaned.toFixed(6).replace(/\.?0+$/, '');
}

export interface ScalarResult {
  type: 'scalar';
  label: string;
  value: string;
}

export interface MatrixResult {
  type: 'matrix';
  label: string;
  matrix: Matrix;
}

export interface BooleanResult {
  type: 'boolean';
  label: string;
  value: boolean;
  message: string;
}

export type OperationResult = (ScalarResult | MatrixResult | BooleanResult) & { steps?: string[] };

export const EXAMPLES = {
  "2×2 Basic": {
    a: [[1, 2], [3, 4]],
    b: [[5, 6], [7, 8]],
  },
  "3×3 Invertible": {
    a: [[2, -1, 0], [-1, 2, -1], [0, -1, 2]],
    b: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  },
  "3×3 Singular": {
    a: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    b: [[1, 1, 1], [2, 2, 2], [3, 3, 3]],
  },
  "2×3 Rectangular": {
    a: [[1, 2, 3], [4, 5, 6]],
    b: [[7, 8], [9, 10], [11, 12]],
  },
  "Identity 3×3": {
    a: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    b: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  },
};

export const SINGLE_OPERATIONS = [
  { id: 'transpose', label: 'Transpose', description: 'Aᵀ — Flip rows and columns' },
  { id: 'determinant', label: 'Determinant', description: 'det(A) — Scalar value (square only)' },
  { id: 'adjoint', label: 'Adjoint', description: 'adj(A) — Classical adjugate matrix' },
  { id: 'inverse', label: 'Inverse', description: 'A⁻¹ — Multiplicative inverse' },
  { id: 'rank', label: 'Rank', description: 'rank(A) — Number of linearly independent rows' },
  { id: 'ref', label: 'Row Echelon Form', description: 'REF — Upper triangular via elimination' },
  { id: 'rref', label: 'Reduced REF', description: 'RREF — Gauss-Jordan elimination' },
  { id: 'identity', label: 'Identity Check', description: 'Is A = Iₙ?' },
] as const;

export const DUAL_OPERATIONS = [
  { id: 'add', label: 'Addition', description: 'A + B — Element-wise sum' },
  { id: 'subtract', label: 'Subtraction', description: 'A − B — Element-wise difference' },
  { id: 'multiply', label: 'Multiplication', description: 'A × B — Matrix product' },
] as const;

export function executeSingleOp(op: string, matrix: Matrix): OperationResult {
  switch (op) {
    case 'transpose': {
      const { result, steps } = transpose(matrix);
      return { type: 'matrix', label: 'Transpose (Aᵀ)', matrix: result, steps };
    }
    case 'determinant': {
      const { result, steps } = determinant(matrix);
      return { type: 'scalar', label: 'Determinant', value: formatNumber(result), steps };
    }
    case 'adjoint': {
      const { result, steps } = adjoint(matrix);
      return { type: 'matrix', label: 'Adjoint (adj A)', matrix: result, steps };
    }
    case 'inverse': {
      const { result, steps } = inverse(matrix);
      return { type: 'matrix', label: 'Inverse (A⁻¹)', matrix: result, steps };
    }
    case 'rank': {
      const { result, steps } = rank(matrix);
      return { type: 'scalar', label: 'Rank', value: result.toString(), steps };
    }
    case 'ref': {
      const { result, steps } = rowEchelonForm(matrix);
      return { type: 'matrix', label: 'Row Echelon Form', matrix: result, steps };
    }
    case 'rref': {
      const { result, steps } = reducedRowEchelonForm(matrix);
      return { type: 'matrix', label: 'Reduced Row Echelon Form', matrix: result, steps };
    }
    case 'identity': {
      const { result, steps } = isIdentity(matrix);
      return {
        type: 'boolean',
        label: 'Identity Check',
        value: result,
        message: result ? 'Yes — Identity Matrix' : 'No — Not Identity Matrix',
        steps
      };
    }
    default:
      throw new Error(`Unknown operation: ${op}`);
  }
}

export function executeDualOp(op: string, a: Matrix, b: Matrix): OperationResult {
  switch (op) {
    case 'add': {
      const { result, steps } = add(a, b);
      return { type: 'matrix', label: 'A + B', matrix: result, steps };
    }
    case 'subtract': {
      const { result, steps } = subtract(a, b);
      return { type: 'matrix', label: 'A − B', matrix: result, steps };
    }
    case 'multiply': {
      const { result, steps } = multiply(a, b);
      return { type: 'matrix', label: 'A × B', matrix: result, steps };
    }
    default:
      throw new Error(`Unknown operation: ${op}`);
  }
}
