import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Landing           from './pages/Landing';
import Auth              from './pages/Auth';
import Dashboard         from './pages/Dashboard';
import Checkout          from './pages/Checkout';
import TransactionStatus from './pages/TransactionStatus';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Checkout and status pages: no navbar — clean buyer experience */}
          <Route path="/checkout/:token" element={<Checkout />} />
          <Route path="/status/:id"      element={<TransactionStatus />} />

          {/* Shell with navbar */}
          <Route path="/" element={<><Navbar /><Landing /></>} />
          <Route path="/auth"      element={<><Navbar /><Auth /></>} />
          <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
