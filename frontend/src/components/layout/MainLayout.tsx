import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Wallet, Receipt, ArrowLeftRight, CreditCard, LogOut, Menu, Sun, Moon, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

export default function MainLayout() {
  const { signOut, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Carteiras', href: '/carteiras', icon: Wallet },
    { name: 'Cartões', href: '/cartoes', icon: CreditCard },
    { name: 'Lançamentos', href: '/lancamentos', icon: Receipt },
    { name: 'Categorias', href: '/categorias', icon: ArrowLeftRight },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-card shadow-lg transition-all duration-300 ease-in-out",
        // Desktop: collapsible sidebar
        "hidden md:block md:flex-shrink-0",
        isSidebarOpen ? "md:w-64" : "md:w-0",
        // Mobile: overlay sidebar
        "md:relative fixed inset-y-0 left-0 z-50 w-64",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className={cn(
          "flex flex-col h-full w-64 transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "md:opacity-0 md:pointer-events-none"
        )}>
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <h1 className="text-xl font-bold text-primary">MyFinance</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-muted-foreground hover:text-foreground"
              title="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => {
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false);
                    }
                  }}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-medium">
                {user?.login?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.login}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-muted mb-2 transition-colors"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-5 h-5 mr-3" />
                  Modo Escuro
                </>
              ) : (
                <>
                  <Sun className="w-5 h-5 mr-3" />
                  Modo Claro
                </>
              )}
            </button>
            <button
              onClick={signOut}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-4 bg-card shadow-sm border-b border-border flex-shrink-0">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-muted-foreground hover:text-foreground mr-4"
              title={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-lg font-semibold text-primary">MyFinance</span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground rounded-md transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
