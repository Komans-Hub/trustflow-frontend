# TrustFlow Frontend

A modern React + Vite frontend application for managing payment transactions, user authentication, and trust-based checkout flows. Built with React 19, Tailwind CSS, and React Router for a seamless user experience.

## 🎯 Project Overview

TrustFlow is a frontend application that facilitates secure payment transactions with trust-based verification. It provides users with:

- **Landing Page**: Introduction and overview of TrustFlow
- **Authentication**: User login and signup functionality
- **Dashboard**: User profile and transaction history management
- **Checkout Flow**: Secure payment checkout with verified transactions
- **Transaction Status**: Real-time transaction status tracking

## 🏗️ Project Structure

```
src/
├── api/              # API client and HTTP configurations
│   └── client.js
├── assets/           # Static assets (images, fonts, etc.)
├── components/       # Reusable React components
│   ├── layout/       # Layout components (Navbar, etc.)
│   │   └── Navbar.jsx
│   └── ui/           # UI components
│       ├── StarRating.jsx
│       └── TrustBadge.jsx
├── context/          # React Context for state management
│   └── AuthContext.jsx
├── pages/            # Page components (routes)
│   ├── Auth.jsx
│   ├── Checkout.jsx
│   ├── Dashboard.jsx
│   ├── Landing.jsx
│   └── TransactionStatus.jsx
├── utils/            # Utility functions and helpers
├── App.jsx           # Root application component
├── index.css         # Global styles
└── main.jsx          # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trustflow-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your API endpoints and configuration:
   ```
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## 📦 Available Scripts

- **`npm run dev`** - Start the development server with hot module replacement (HMR)
- **`npm run build`** - Build the application for production
- **`npm run preview`** - Preview the production build locally
- **`npm lint`** - Run Oxlint code quality checks

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) - Modern UI library with concurrent features
- **Build Tool**: [Vite 8](https://vitejs.dev/) - Fast and efficient bundler
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) - Utility-first CSS framework
- **Routing**: [React Router 7](https://reactrouter.com/) - Client-side routing
- **HTTP Client**: [Axios](https://axios-http.com/) - Promise-based HTTP client
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icon library
- **Linting**: [Oxlint](https://oxc.rs/) - Fast and configurable linter

## 🔐 Authentication

The application uses React Context API for authentication state management. The `AuthContext` provides:

- User authentication state
- Login/logout functionality
- Protected routes for authenticated users

Protected routes automatically redirect unauthenticated users to the authentication page.

## 🌐 Routing

Routes are configured in `App.jsx`:

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Landing | Public landing page |
| `/auth` | Auth | Login/signup page |
| `/dashboard` | Dashboard | User dashboard (protected) |
| `/checkout/:token` | Checkout | Payment checkout flow |
| `/status/:id` | TransactionStatus | Transaction status tracking |

**Note**: Checkout and transaction status pages display without the navbar for a clean checkout experience.

## 🎨 Styling & Components

- **Tailwind CSS**: Global and utility-based styling with custom configuration
- **UI Components**: Reusable components in `src/components/ui/`
  - `StarRating.jsx` - Rating component for reviews
  - `TrustBadge.jsx` - Trust verification badge
- **Layout Components**: Shared layout elements in `src/components/layout/`
  - `Navbar.jsx` - Navigation bar with authentication status

## 📡 API Integration

API requests are handled through `src/api/client.js` using Axios. Configure your backend API endpoint in `.env`:

```javascript
// Example API call
import { apiClient } from './api/client';

const response = await apiClient.get('/transactions');
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This generates an optimized production build in the `dist/` directory.

### Deploy to Vercel

The project is configured for Vercel deployment with `vercel.json`:

```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms

The built output in `dist/` can be deployed to any static hosting platform (Netlify, GitHub Pages, AWS S3, etc.).

## 🔍 Code Quality

- **Oxlint**: Run `npm run lint` to check code quality
- **TypeScript Support**: Type definitions available for React and React DOM
- **PostCSS**: Configured with Autoprefixer for cross-browser compatibility

## 📝 Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://localhost:3000  # Backend API URL
# Add other environment variables as needed
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues, feature requests, or questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for secure trust-based transactions**
