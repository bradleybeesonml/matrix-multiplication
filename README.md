# Matrix Multiplication Calculator & Visualizer

An interactive web application that computes matrix multiplication (C = A × B) with step-by-step dot-product visualization. Perfect for educational purposes, this tool helps users understand how matrix multiplication works by highlighting individual operations and showing the running sum.

🌐 **Live Demo:** [https://matrix-multiplication-66055vpo4-bradley-beesons-projects.vercel.app](https://matrix-multiplication-66055vpo4-bradley-beesons-projects.vercel.app)

![Matrix Calculator Demo](https://via.placeholder.com/800x400/1e293b/ffffff?text=Matrix+Multiplication+Calculator)

## ✨ Features

### 🧮 Core Functionality
- **Matrix Multiplication**: Compute C = A × B with real-time validation
- **Step-by-step Animation**: Visualize dot-product calculations with highlighting
- **Interactive Editing**: Click to edit matrix cells with keyboard navigation
- **Dimension Control**: Resize matrices with automatic validation
- **Preset Examples**: Quick-load common matrix multiplication scenarios
- **Educational Messages**: Clear feedback for incompatible matrix dimensions

### 🎨 Visual Features
- **Cell Highlighting**: Current row/column and active multiplication pairs
- **Smooth Animations**: Framer Motion powered transitions and effects
- **Responsive Design**: Works on desktop and mobile devices
- **Clean UI**: Modern, math-classroom inspired design
- **Side-by-side Layout**: Matrix A, B, and Result C displayed together

### 🎮 Animation Controls
- **Auto-play**: Automatically step through all calculations
- **Manual Stepping**: Step forward/backward through individual operations
- **Speed Control**: Adjust animation speed (0.25x to 3x)
- **Restart Animation**: Reset and replay the entire animation
- **Running Sum Animation**: Shows addition values with green "+X" indicators

### ✨ Advanced Animations
- **Floating Number Animation**: Dot product results "float" into Matrix C
- **Counting Animation**: Running sum counts up with each addition
- **Step-by-step Display**: Current dot product shown prominently at top
- **Visual Feedback**: Clear indication of which cells are being multiplied

### ♿ Accessibility
- **Keyboard Navigation**: Full keyboard support for matrix editing
- **ARIA Labels**: Screen reader friendly
- **Focus Management**: Clear visual focus indicators
- **Educational Tooltips**: Helpful guidance for users

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/matrix-multiplication-calculator.git
   cd matrix-multiplication-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎯 Usage Guide

### Basic Matrix Operations

1. **Set Matrix Dimensions**
   - Use the dimension controls in the left panel
   - Matrix A: m × n, Matrix B: n × p
   - Result C will be m × p

2. **Edit Matrix Values**
   - Click any cell to edit its value
   - Use Tab/Arrow keys to navigate between cells
   - Press Enter to confirm, Escape to cancel

3. **Compute Result**
   - Click "Compute" button or matrices auto-compute when valid
   - Result appears in the center panel

### Animation Features

1. **Start Animation**
   - Click "Play" to auto-animate through all dot-product calculations
   - Use "Step Forward/Backward" for manual control

2. **Customize Animation**
   - Adjust speed with the slider (0.5x to 5x)
   - Toggle step mode between factor-level and cell-level
   - Watch the dot-product stack show each multiplication

3. **Visual Highlights**
   - Current row in Matrix A is highlighted
   - Current column in Matrix B is highlighted
   - Active multiplication pair gets special emphasis
   - Result cell shows settling animation

### Quick Actions

- **Presets**: Load example matrices for common scenarios
- **Matrix Controls**: Each matrix has its own dimension controls
- **Reset Animation**: Restart the entire animation from the beginning

## 🛠️ Technical Details

### Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animation**: Framer Motion for smooth transitions
- **State Management**: Zustand for global state
- **Testing**: Vitest + Testing Library
- **Build Tool**: Vite for fast development and optimized builds

### Key Components

- `MatrixEditor`: Editable matrix component with highlighting
- `MatrixCard`: Wrapper component with dimension controls
- `CurrentStepDisplay`: Shows current dot product calculation at top
- `AnimatedCounter`: Running sum with addition animations
- `FloatingNumber`: Animated numbers floating into result matrix
- `ControlsPopover`: Compact controls and presets
- `useAnimator`: Animation logic and state management

### Matrix Operations
- Real-time validation of matrix dimensions
- Efficient multiplication algorithm
- Step-by-step dot-product generation
- Number formatting with precision control
- Educational error messages for incompatible dimensions

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in UI mode
npm run test:ui

# Run tests with coverage
npm test -- --coverage
```

Test coverage includes:
- Matrix operation utilities
- State management logic
- Component rendering
- User interactions

## 📦 Deployment

### 🌐 Live Production Site
The application is currently deployed on Vercel:
**Production URL:** [https://matrix-multiplication-66055vpo4-bradley-beesons-projects.vercel.app](https://matrix-multiplication-66055vpo4-bradley-beesons-projects.vercel.app)

### Vercel Deployment
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bradleybeesonml/matrix-multiplication)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Manual Deployment
```bash
npm run build
# Upload the 'dist' folder to your web server
```

## 🎥 Demo Recording

To create a demo GIF:

```bash
# Start the dev server
npm run dev

# Use your preferred screen recorder to capture:
# 1. Loading a preset matrix
# 2. Playing the animation with floating numbers
# 3. Showing the running sum animation
# 4. Demonstrating educational messages for incompatible dimensions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use Prettier for code formatting
- Ensure accessibility compliance
- Test on multiple browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Lucide React](https://lucide.dev/) - Icons

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/bradleybeesonml/matrix-multiplication/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/bradleybeesonml/matrix-multiplication/discussions)
- 📧 **Email**: bradleybeesonml@gmail.com

---

**Made with ❤️ for mathematics education by [Bradley Beeson](https://github.com/bradleybeesonml)**
