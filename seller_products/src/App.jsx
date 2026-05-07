import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import ProductList from './components/ProductList';
import ProductAdd from './components/ProductAdd';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

/**
 * App — Root component.
 * Routing dan auth wrapper terpusat di sini.
 */
function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected — dibungkus AppLayout */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/" element={<ProductList />} />
                        <Route path="/add" element={<ProductAdd />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="/404" element={<NotFoundPage />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
