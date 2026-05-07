import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosInstance';

/**
 * AuthContext — menyediakan state autentikasi global.
 * Menyimpan data user, token, dan fungsi login/logout.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cek token saat app pertama kali dimuat
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/auth/me')
                .then((res) => setUser(res.data.data))
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    /**
     * Login user — kirim credentials ke backend, simpan token.
     * @param {string} username
     * @param {string} password
     */
    const login = async (username, password) => {
        const res = await api.post('/auth/login', { username, password });
        const { token, user: userData } = res.data.data;
        localStorage.setItem('token', token);
        setUser(userData);
        return res.data;
    };

    /**
     * Logout user — hapus token dan reset state.
     */
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook untuk mengakses AuthContext.
 * @returns {{ user: object|null, login: Function, logout: Function, loading: boolean }}
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth harus digunakan di dalam AuthProvider');
    }
    return context;
};
