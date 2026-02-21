# MatrixLab - Advanced Linear Algebra Environment


**MatrixLab** is a premium, portfolio-grade linear algebra laboratory designed to visualize complex matrix operations with precision and style. Unlike standard calculators, MatrixLab features a custom-built mathematical engine (no external math libraries), "AI-style" step-by-step explanations, and a high-fidelity glassmorphism UI.

---

##  Features

###  Advanced Mathematical Engine
Built entirely in **pure TypeScript**, the math engine handles arbitrary `N x M` matrices with floating-point precision handling.

**Single Matrix Operations:**
- **Row Echelon Form (REF) & RREF:** Implemented via Gaussian Elimination with partial pivoting.
- **Inverse Matrix:** Gauss-Jordan elimination method with singularity detection.
- **Determinant:** Recursive expansion (Laplace) or Row Reduction based on size.
- **Rank & Adjoint:** Full rank calculation and cofactor matrix transposition.
- **Transpose & Identity Checks:** Instant structure analysis.

**Matrix Arithmetic:**
- **Multiplication:** Supports `(m×n) • (n×p)` dimensions.
- **Addition / Subtraction:** Element-wise operations with dimension validation.

###  "AI" Step-by-Step Explanations
The system doesn't just give the answer—it teaches the concept.
- **Verbose Logs:** Displays every row swap, scalar multiplication, and row addition performed during Gaussian elimination.
- **Traceability:** Users can follow the algorithm's logic for study and verification.

###  Premium UI/UX
- **Dual Theme Engine:** Toggle between **Cyberpunk Dark** and **Clean Light** modes instantly.
- **Atmospheric Effects:** Custom canvas-based animated **Snowfall** and ambient glow orbs.
- **Glassmorphism:** Frosted glass panels, neon accents, and backdrop blurs.
- **Smart Layouts:**
  - *Single Mode:* Matrix centers perfectly for focus.
  - *Dual Mode:* Side-by-side comparison.
- **Input Intelligence:**
  - Auto-generating grid inputs.
  - Keyboard navigation (Arrow keys, Tab, Enter).
  - Support for `0` values and floating points.

---

## 🛠️ Tech Stack

- **Core:** [React 18](https://reactjs.org/) (Hooks, Context)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict typing for math logic)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Utility-first design system)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Animation:** CSS Keyframes & HTML5 Canvas API

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
# Clone repository
git clone https://github.com/your-username/matrix-lab.git

# Navigate to project
cd matrix-lab

# Install dependencies
npm install
```

## ⚡ Usage

### Development Server
Run the local development server with hot-reload:

```bash
npm run dev
```

### Production Build
Create an optimized production build:

```bash
npm run build
```

The output will be generated in the `dist/` folder.

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── Background.tsx   
│   ├── MatrixInput.tsx   
│   ├── ResultDisplay.tsx 
│   └── Snowfall.tsx     
├── lib/
│   └── matrix.ts        
├── App.tsx              
├── index.css             
└── main.tsx             
```


