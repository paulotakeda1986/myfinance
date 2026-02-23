import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Wallets from './pages/Wallets';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import CreditCards from './pages/CreditCards';
import Invoices from './pages/Invoices';
import Transfers from './pages/Transfers';
import AuthLayout from './components/layout/AuthLayout';
import MainLayout from './components/layout/MainLayout';

const queryClient = new QueryClient();

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout />; 
  // MainLayout calls Outlet, so nested routes render inside it.
}

function PublicRoute() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <AuthLayout />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/carteiras" element={<Wallets />} />
        <Route path="/cartoes" element={<CreditCards />} />
        <Route path="/faturas" element={<Invoices />} />
        <Route path="/lancamentos" element={<Transactions />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/transferencias" element={<Transfers />} />
      </Route>

      {/* Wildcard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
