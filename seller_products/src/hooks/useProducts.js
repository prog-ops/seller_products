import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';

/**
 * Custom hook untuk mengambil dan mengelola data produk.
 * Memisahkan data-fetching logic dari komponen UI.
 *
 * @returns {{ products: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/products');
            // Support both old format (array) and new format ({ data: [...] })
            const data = res.data.data ? res.data.data.data : res.data;
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err.response?.data?.message || 'Gagal mengambil data produk. Pastikan Backend berjalan!'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, refetch: fetchProducts };
}
